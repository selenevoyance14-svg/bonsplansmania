interface Env {
  ALERTS: KVNamespace;
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
  SITE_URL: string;
}

type AlertKind = "product" | "brand" | "category";
type Frequency = "instant" | "daily";

interface DealAlert {
  id: string;
  email: string;
  query: string;
  normalizedQuery: string;
  kind: AlertKind;
  frequency: Frequency;
  createdAt: string;
  confirmedAt?: string;
  confirmToken: string;
  unsubscribeToken: string;
  source?: string;
  pendingUrls?: string[];
}

interface Article {
  title: string;
  url: string;
  description: string;
  category: string;
  image: string;
  date: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/alerts") return createAlert(request, env);
    if (request.method === "GET" && url.pathname === "/confirm") return confirmAlert(url, env);
    if (request.method === "GET" && url.pathname === "/unsubscribe") return unsubscribeAlert(url, env);
    if (request.method === "GET" && url.pathname === "/health") return json({ ok: true, service: "bonsplansmania-alerts" });
    return json({ error: "Route introuvable." }, 404);
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await scanArticles(env);
  },
};

async function createAlert(request: Request, env: Env): Promise<Response> {
  const body = await request.json<Record<string, unknown>>().catch(() => null);
  if (!body) return json({ error: "Demande invalide." }, 400);
  if (body.website) return json({ ok: true });

  const email = String(body.email || "").trim().toLowerCase();
  const query = String(body.query || "").trim().replace(/\s+/g, " ");
  const kind = String(body.kind || "product") as AlertKind;
  const frequency = String(body.frequency || "instant") as Frequency;
  const source = String(body.source || "").slice(0, 300);

  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 160) return json({ error: "Adresse e-mail invalide." }, 400);
  if (query.length < 2 || query.length > 80) return json({ error: "La recherche doit contenir entre 2 et 80 caractères." }, 400);
  if (!["product", "brand", "category"].includes(kind)) return json({ error: "Type d’alerte invalide." }, 400);
  if (!["instant", "daily"].includes(frequency)) return json({ error: "Fréquence invalide." }, 400);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const rateKey = `rate:${await shortHash(ip)}`;
  const currentRate = Number(await env.ALERTS.get(rateKey) || "0");
  if (currentRate >= 8) return json({ error: "Trop de demandes. Réessayez dans une heure." }, 429);
  await env.ALERTS.put(rateKey, String(currentRate + 1), { expirationTtl: 3600 });

  const duplicate = await findDuplicate(env, email, normalize(query), kind);
  if (duplicate?.confirmedAt) return json({ ok: true, alreadyExists: true });

  const id = duplicate?.id || crypto.randomUUID();
  const alert: DealAlert = {
    id,
    email,
    query,
    normalizedQuery: normalize(query),
    kind,
    frequency,
    createdAt: duplicate?.createdAt || new Date().toISOString(),
    confirmToken: crypto.randomUUID() + crypto.randomUUID(),
    unsubscribeToken: duplicate?.unsubscribeToken || crypto.randomUUID() + crypto.randomUUID(),
    source,
  };
  await env.ALERTS.put(`alert:${id}`, JSON.stringify(alert));
  await sendConfirmation(alert, env);
  return json({ ok: true });
}

async function confirmAlert(url: URL, env: Env): Promise<Response> {
  const token = url.searchParams.get("token") || "";
  const alert = await findByToken(env, token, "confirmToken");
  if (!alert) return htmlPage("Lien invalide", "Ce lien de confirmation est invalide ou a expiré.", env.SITE_URL, 404);
  alert.confirmedAt = new Date().toISOString();
  await env.ALERTS.put(`alert:${alert.id}`, JSON.stringify(alert));
  return htmlPage("Alerte activée !", `Nous surveillons maintenant « ${escapeHtml(alert.query)} » pour vous.`, `${env.SITE_URL}/recherche?q=${encodeURIComponent(alert.query)}`);
}

async function unsubscribeAlert(url: URL, env: Env): Promise<Response> {
  const token = url.searchParams.get("token") || "";
  const alert = await findByToken(env, token, "unsubscribeToken");
  if (!alert) return htmlPage("Alerte introuvable", "Cette alerte est déjà supprimée ou le lien est invalide.", env.SITE_URL, 404);
  await env.ALERTS.delete(`alert:${alert.id}`);
  return htmlPage("Alerte supprimée", `Vous ne recevrez plus d’alerte pour « ${escapeHtml(alert.query)} ».`, env.SITE_URL);
}

async function scanArticles(env: Env): Promise<{ seeded?: number; newArticles?: number; emails?: number }> {
  const response = await fetch(`${env.SITE_URL}/articles.json`, { headers: { "User-Agent": "BonsPlansMania-Alerts/1.0" } });
  if (!response.ok) throw new Error(`Catalogue indisponible (${response.status})`);
  const articles = await response.json<Article[]>();
  const parisDate = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const eligibleArticles = articles.filter((article) => !article.date || article.date <= parisDate);
  const currentUrls = eligibleArticles.map((article) => article.url);
  const seen = await env.ALERTS.get<string[]>("state:seen-urls", "json");
  if (!seen) {
    await env.ALERTS.put("state:seen-urls", JSON.stringify(currentUrls));
    return { seeded: currentUrls.length };
  }

  const seenSet = new Set(seen);
  const newArticles = eligibleArticles.filter((article) => !seenSet.has(article.url));

  const alerts = await listAlerts(env);
  let emails = 0;
  const parisHour = Number(new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", hour12: false }).format(new Date()));

  for (const alert of alerts.filter((item) => item.confirmedAt)) {
    const matches = newArticles.filter((article) => articleMatches(article, alert));
    if (!matches.length) continue;
    if (alert.frequency === "instant") {
      await sendDeals(alert, matches, env);
      emails += 1;
    } else {
      alert.pendingUrls = [...new Set([...(alert.pendingUrls || []), ...matches.map((article) => article.url)])];
      await env.ALERTS.put(`alert:${alert.id}`, JSON.stringify(alert));
    }
  }

  if (parisHour === 8) {
    for (const alert of alerts.filter((item) => item.confirmedAt && item.frequency === "daily" && item.pendingUrls?.length)) {
      const matches = eligibleArticles.filter((article) => alert.pendingUrls?.includes(article.url));
      if (matches.length) {
        await sendDeals(alert, matches, env);
        emails += 1;
      }
      alert.pendingUrls = [];
      await env.ALERTS.put(`alert:${alert.id}`, JSON.stringify(alert));
    }
  }

  await env.ALERTS.put("state:seen-urls", JSON.stringify(currentUrls));
  return { newArticles: newArticles.length, emails };
}

function articleMatches(article: Article, alert: DealAlert): boolean {
  const haystack = normalize(`${article.title} ${article.description} ${article.category}`);
  const tokens = alert.normalizedQuery.split(" ").filter((token) => token.length > 1);
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
}

async function sendConfirmation(alert: DealAlert, env: Env) {
  const workerBase = "https://bonsplansmania-alerts.selenevoyance14.workers.dev";
  const confirmUrl = `${workerBase}/confirm?token=${encodeURIComponent(alert.confirmToken)}`;
  const unsubscribeUrl = `${workerBase}/unsubscribe?token=${encodeURIComponent(alert.unsubscribeToken)}`;
  await sendEmail(env, {
    to: alert.email,
    subject: `Confirmez votre alerte « ${alert.query} »`,
    html: emailShell(`
      <p style="margin:0 0 10px;color:#96344e;font-weight:700">ALERTE ${kindLabel(alert.kind).toUpperCase()}</p>
      <h1 style="margin:0 0 18px;font:700 30px Georgia,serif;color:#291d20">Confirmez votre alerte</h1>
      <p style="color:#5f5551;line-height:1.7">Vous souhaitez être prévenu(e) des nouveaux bons plans correspondant à <strong>« ${escapeHtml(alert.query)} »</strong>.</p>
      <p style="margin:28px 0"><a href="${confirmUrl}" style="display:inline-block;padding:14px 22px;border-radius:8px;background:#96344e;color:#fff;text-decoration:none;font-weight:700">Activer mon alerte</a></p>
      <p style="font-size:12px;color:#827772">Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail ou <a href="${unsubscribeUrl}">supprimez-la</a>.</p>`),
  });
}

async function sendDeals(alert: DealAlert, articles: Article[], env: Env) {
  const workerBase = "https://bonsplansmania-alerts.selenevoyance14.workers.dev";
  const cards = articles.slice(0, 8).map((article) => `<div style="padding:18px 0;border-bottom:1px solid #eadfd9"><p style="margin:0 0 6px;color:#96344e;font-size:12px;font-weight:700;text-transform:uppercase">${escapeHtml(article.category)}</p><h2 style="margin:0 0 8px;font:700 21px Georgia,serif"><a href="${article.url}?utm_source=alerte&utm_medium=email&utm_campaign=${encodeURIComponent(alert.kind)}" style="color:#291d20;text-decoration:none">${escapeHtml(article.title)}</a></h2><p style="margin:0 0 12px;color:#665b56;line-height:1.55">${escapeHtml(article.description)}</p><a href="${article.url}?utm_source=alerte&utm_medium=email&utm_campaign=${encodeURIComponent(alert.kind)}" style="color:#96344e;font-weight:700">Voir le bon plan →</a></div>`).join("");
  await sendEmail(env, {
    to: alert.email,
    subject: articles.length === 1 ? `Nouveau bon plan pour « ${alert.query} »` : `${articles.length} nouveaux bons plans pour « ${alert.query} »`,
    html: emailShell(`<p style="margin:0 0 10px;color:#96344e;font-weight:700">VOTRE ALERTE « ${escapeHtml(alert.query).toUpperCase()} »</p><h1 style="margin:0 0 16px;font:700 30px Georgia,serif;color:#291d20">${articles.length === 1 ? "Une nouvelle offre vient de paraître" : `${articles.length} nouvelles offres viennent de paraître`}</h1>${cards}<p style="margin-top:24px;font-size:12px;color:#827772">Cette alerte est indépendante de la newsletter. <a href="${workerBase}/unsubscribe?token=${encodeURIComponent(alert.unsubscribeToken)}">Supprimer cette alerte</a>.</p>`),
  });
}

async function sendEmail(env: Env, message: { to: string; subject: string; html: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`, ...message }),
  });
  if (!response.ok) throw new Error(`Échec Resend (${response.status})`);
}

async function listAlerts(env: Env): Promise<DealAlert[]> {
  const alerts: DealAlert[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.ALERTS.list({ prefix: "alert:", cursor });
    const values = await Promise.all(page.keys.map((key) => env.ALERTS.get<DealAlert>(key.name, "json")));
    alerts.push(...values.filter((value): value is DealAlert => Boolean(value)));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return alerts;
}

async function findDuplicate(env: Env, email: string, query: string, kind: AlertKind) {
  return (await listAlerts(env)).find((alert) => alert.email === email && alert.normalizedQuery === query && alert.kind === kind);
}

async function findByToken(env: Env, token: string, field: "confirmToken" | "unsubscribeToken") {
  if (token.length < 40) return undefined;
  return (await listAlerts(env)).find((alert) => alert[field] === token);
}

function kindLabel(kind: AlertKind) { return kind === "brand" ? "marque" : kind === "category" ? "catégorie" : "produit"; }
function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
async function shortHash(value: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return [...new Uint8Array(digest)].slice(0, 8).map((byte) => byte.toString(16).padStart(2, "0")).join(""); }
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character] || character)); }
function emailShell(content: string) { return `<div style="margin:0;padding:28px 12px;background:#f8f4f1;font-family:Arial,sans-serif"><div style="max-width:620px;margin:auto;padding:32px;background:#fff;border-radius:14px"><p style="margin:0 0 26px;font:700 23px Georgia,serif;color:#291d20">Bons Plans <span style="color:#96344e">Mania</span></p>${content}</div></div>`; }
function htmlPage(title: string, message: string, href: string, status = 200) { return new Response(`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title} | Bons Plans Mania</title><body style="margin:0;background:#faf6f3;font-family:Arial,sans-serif;color:#291d20"><main style="max-width:620px;margin:10vh auto;padding:35px;background:#fff;border:1px solid #eadfd9;border-radius:16px;text-align:center"><p style="font:700 23px Georgia,serif">Bons Plans <span style="color:#96344e">Mania</span></p><h1 style="font:700 32px Georgia,serif">${title}</h1><p style="color:#665b56;line-height:1.65">${message}</p><a href="${href}" style="display:inline-block;margin-top:14px;padding:13px 20px;border-radius:8px;background:#96344e;color:#fff;text-decoration:none;font-weight:700">Retour sur Bons Plans Mania</a></main></body></html>`, { status, headers: { "Content-Type": "text/html; charset=utf-8" } }); }
function json(body: unknown, status = 200) { return Response.json(body, { status, headers: corsHeaders }); }
