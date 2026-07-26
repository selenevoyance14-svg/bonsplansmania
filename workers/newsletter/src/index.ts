export interface Env {
  SUBSCRIBERS: KVNamespace;
  RESEND_API_KEY: string;
  CRON_SECRET: string;
  SITE_URL: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://bonsplansmania.fr",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Partenaire affiche dans la newsletter (entre Tests gratuits et Bons plans).
// Pour changer / desactiver : modifier cette constante puis redeployer le Worker.
const PARTNER_BANNER: {
  enabled: boolean;
  title: string;
  imageUrl: string;
  link: string;
  alt: string;
  width: number;
  height: number;
} = {
  enabled: true,
  title: "Notre selection partenaire",
  imageUrl: "https://bonsplansmania.fr/images/partners/sarenza-728x90.gif",
  link: "https://action.metaffiliation.com/trk.php?mclic=P512D1157CD2D1B19",
  alt: "Sarenza - Les Jours Sarenza",
  width: 728,
  height: 90,
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

const newsletterWorker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === "/subscribe" && request.method === "POST") {
        return await handleSubscribe(request, env);
      }
      if (path === "/unsubscribe") {
        return await handleUnsubscribe(request, env);
      }
      if (path === "/send" && request.method === "GET") {
        return await handleSend(request, env);
      }
      if (path === "/stats" && request.method === "GET") {
        return await handleStats(request, env);
      }
      if (path === "/guide" && request.method === "POST") {
        return await handleGuide(request, env);
      }
      return jsonResponse({ error: "Not found" }, 404);
    } catch {
      return jsonResponse({ error: "Internal error" }, 500);
    }
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Newsletter principale (mardi/samedi 7h UTC) : envoi des derniers articles
    // Drip guide PDF (chaque jour) : envoi de l'email du jour J+N pour chaque inscrit "guide-pdf"
    const cron = event.cron;
    if (cron === "0 7 * * TUE,SAT") {
      ctx.waitUntil(sendNewsletter(env));
    } else {
      ctx.waitUntil(sendDripSequence(env));
    }
  },
};

export default newsletterWorker;

// --- DRIP SEQUENCE pour les inscrits guide PDF ---
// Lance chaque jour, identifie les inscrits dont c'est le jour J+2/J+5/J+9/J+14/J+21
// et leur envoie l'email correspondant. La progression est trackée via sequenceStep en KV.
const DRIP_SCHEDULE = [
  // step 1 (J+2), step 2 (J+5), step 3 (J+9), step 4 (J+14), step 5 (J+21)
  { step: 1, dayOffset: 2 },
  { step: 2, dayOffset: 5 },
  { step: 3, dayOffset: 9 },
  { step: 4, dayOffset: 14 },
  { step: 5, dayOffset: 21 },
];

async function sendDripSequence(env: Env): Promise<void> {
  const now = Date.now();
  const list = await env.SUBSCRIBERS.list();

  for (const key of list.keys) {
    const raw = await env.SUBSCRIBERS.get(key.name);
    if (!raw) continue;
    let data: Record<string, unknown>;
    try { data = JSON.parse(raw); } catch { continue; }

    if (data.active === false) continue;
    if (data.source !== "guide-pdf") continue;

    const startedAt = typeof data.sequenceStartedAt === "string" ? data.sequenceStartedAt : null;
    const currentStep = typeof data.sequenceStep === "number" ? data.sequenceStep : 0;
    if (!startedAt) continue;

    const ageDays = Math.floor((now - new Date(startedAt).getTime()) / 86400000);

    // Trouve la prochaine étape due
    const next = DRIP_SCHEDULE.find((s) => s.step === currentStep + 1 && ageDays >= s.dayOffset);
    if (!next) continue;

    const html = buildDripEmailHTML(next.step, key.name, env.SITE_URL);
    if (!html) continue; // étape pas encore implémentée

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
          to: [key.name],
          subject: getDripSubject(next.step),
          html,
        }),
      });
      if (res.ok) {
        await env.SUBSCRIBERS.put(key.name, JSON.stringify({ ...data, sequenceStep: next.step }));
      }
    } catch {
      // skip cet inscrit, on retentera demain
    }
  }
}

function getDripSubject(step: number): string {
  // TODO Yann : remplace ces sujets par les tiens dans ta voix.
  switch (step) {
    case 1: return "[TODO] Sujet email J+2 — astuce concrète";
    case 2: return "[TODO] Sujet email J+5 — sites tests gratuits cachés";
    case 3: return "[TODO] Sujet email J+9 — combien tu peux gagner";
    case 4: return "[TODO] Sujet email J+14 — top box beauté";
    case 5: return "[TODO] Sujet email J+21 — bienvenue newsletter";
    default: return "Bons Plans Mania";
  }
}

function buildDripEmailHTML(step: number, email: string, siteUrl: string): string | null {
  // TODO Yann : remplace les contenus ci-dessous par tes vrais emails dans ta voix.
  // Garde la structure HTML (header rouge BPM + footer désinscription).
  // Chaque email doit pousser 1 lien affilié maximum (sinon ça fait spam).
  const unsubUrl = `https://bonsplansmania-newsletter.selenevoyance14.workers.dev/unsubscribe?email=${encodeURIComponent(email)}`;

  const contentByStep: Record<number, { intro: string; body: string; ctaLabel: string; ctaUrl: string } | null> = {
    1: null, // J+2 — TODO
    2: null, // J+5 — TODO
    3: null, // J+9 — TODO
    4: null, // J+14 — TODO
    5: null, // J+21 — TODO
  };

  const c = contentByStep[step];
  if (!c) return null; // tant que Yann n'a pas écrit l'email, on ne l'envoie pas

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:12px;overflow:hidden;max-width:600px;">
<tr><td style="background:linear-gradient(135deg,#E63946,#C1121F);padding:24px;color:white;text-align:center;">
<h1 style="margin:0;font-size:22px;">Bons Plans Mania</h1>
</td></tr>
<tr><td style="padding:32px 24px;">
<p style="font-size:16px;line-height:1.6;color:#1f2937;">${c.intro}</p>
<div style="font-size:15px;line-height:1.7;color:#374151;">${c.body}</div>
<p style="text-align:center;margin:32px 0;">
<a href="${c.ctaUrl}" style="display:inline-block;background:#E63946;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;">${c.ctaLabel}</a>
</p>
<p style="font-size:14px;color:#6b7280;">À très vite,<br/>Yann — <a href="${siteUrl}" style="color:#E63946;">bonsplansmania.fr</a></p>
</td></tr>
<tr><td style="padding:16px 24px;background:#f9fafb;text-align:center;font-size:12px;color:#6b7280;">
<a href="${unsubUrl}" style="color:#6b7280;">Se désinscrire</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// --- SUBSCRIBE ---
async function handleSubscribe(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{ email?: string }>();
  const email = body.email?.trim().toLowerCase();

  if (!email || !email.includes("@") || !email.includes(".")) {
    return jsonResponse({ error: "Email invalide" }, 400);
  }

  const existing = await env.SUBSCRIBERS.get(email);
  if (existing) {
    return jsonResponse({ message: "Deja inscrit", already: true });
  }

  await env.SUBSCRIBERS.put(email, JSON.stringify({
    subscribedAt: new Date().toISOString(),
    active: true,
  }));

  return jsonResponse({ message: "Inscription reussie", success: true });
}

// --- GUIDE PDF (lead magnet) ---
// Capture l'email, inscrit dans KV avec source "guide-pdf",
// envoie le PDF immédiatement, prépare la séquence drip.
async function handleGuide(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{ email?: string }>();
  const email = body.email?.trim().toLowerCase();

  if (!email || !email.includes("@") || !email.includes(".")) {
    return jsonResponse({ error: "Email invalide" }, 400);
  }

  const downloadUrl = `${env.SITE_URL}/downloads/guide-100-sites-test-produits-gratuits.pdf`;
  const now = new Date().toISOString();

  // Inscrit (ou met à jour) avec source guide-pdf
  const existing = await env.SUBSCRIBERS.get(email);
  let parsed: { subscribedAt?: string; active?: boolean; source?: string; sequenceStartedAt?: string } = {};
  if (existing) {
    try { parsed = JSON.parse(existing); } catch {}
  }
  await env.SUBSCRIBERS.put(email, JSON.stringify({
    subscribedAt: parsed.subscribedAt || now,
    active: true,
    source: parsed.source || "guide-pdf",
    sequenceStartedAt: parsed.sequenceStartedAt || now,
    sequenceStep: 0, // J+0 envoyé maintenant
  }));

  // Envoi immédiat de l'email avec le PDF
  const html = buildGuideEmailHTML(downloadUrl, email);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
        to: [email],
        subject: "Ton guide : 100 sites pour tester des produits gratuits",
        html,
      }),
    });
  } catch {
    // Email échoué : on continue quand même, l'utilisateur a le lien dans le UI
  }

  return jsonResponse({
    success: true,
    message: "Ton guide est prêt !",
    downloadUrl,
  });
}

function buildGuideEmailHTML(downloadUrl: string, email: string): string {
  const unsubUrl = `https://bonsplansmania-newsletter.selenevoyance14.workers.dev/unsubscribe?email=${encodeURIComponent(email)}`;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:12px;overflow:hidden;max-width:600px;">
<tr><td style="background:linear-gradient(135deg,#E63946,#C1121F);padding:32px 24px;color:white;text-align:center;">
<h1 style="margin:0;font-size:24px;">Ton guide est arrivé !</h1>
<p style="margin:8px 0 0;opacity:0.9;font-size:15px;">100+ sites pour tester des produits gratuits</p>
</td></tr>
<tr><td style="padding:32px 24px;">
<p style="font-size:16px;line-height:1.6;color:#1f2937;">Bonjour,</p>
<p style="font-size:16px;line-height:1.6;color:#1f2937;">Voici ton guide complet pour recevoir des produits beauté, bébé et lifestyle gratuitement chez toi. Clique sur le bouton pour le télécharger :</p>
<p style="text-align:center;margin:32px 0;">
<a href="${downloadUrl}" style="display:inline-block;background:#E63946;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">Télécharger le guide (PDF)</a>
</p>
<p style="font-size:15px;line-height:1.6;color:#374151;">Dans les prochains jours, je vais te partager nos meilleurs bons plans et astuces pour maximiser tes chances d'être sélectionnée pour les tests gratuits.</p>
<p style="font-size:15px;line-height:1.6;color:#374151;">À très vite,<br/>Yann — Bons Plans Mania</p>
</td></tr>
<tr><td style="padding:16px 24px;background:#f9fafb;text-align:center;font-size:12px;color:#6b7280;">
<a href="${unsubUrl}" style="color:#6b7280;">Se désinscrire</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// --- UNSUBSCRIBE ---
async function handleUnsubscribe(request: Request, env: Env): Promise<Response> {
  let email: string | null = null;

  if (request.method === "GET") {
    const url = new URL(request.url);
    email = url.searchParams.get("email")?.trim().toLowerCase() || null;
  } else if (request.method === "POST") {
    const body = await request.json<{ email?: string }>();
    email = body.email?.trim().toLowerCase() || null;
  }

  if (!email) {
    return jsonResponse({ error: "Email manquant" }, 400);
  }

  await env.SUBSCRIBERS.delete(email);

  // Page HTML de confirmation
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Desabonnement</title></head>
    <body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">
    <h1>Desabonnement confirme</h1>
    <p>Vous ne recevrez plus la newsletter Bons Plans Mania.</p>
    <p><a href="https://bonsplansmania.fr">Retour au site</a></p>
    </body></html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8", ...CORS_HEADERS },
  });
}

// --- SEND NEWSLETTER (manual trigger) ---
async function handleSend(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (secret !== env.CRON_SECRET) {
    return jsonResponse({ error: "Non autorise" }, 403);
  }

  const dryRun = url.searchParams.get("send") !== "true";
  const result = await sendNewsletter(env, dryRun);
  return jsonResponse(result);
}

// --- STATS ---
async function handleStats(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.searchParams.get("secret") !== env.CRON_SECRET) {
    return jsonResponse({ error: "Non autorise" }, 403);
  }

  const list = await env.SUBSCRIBERS.list();
  return jsonResponse({ subscribers: list.keys.length });
}

// --- CORE: SEND NEWSLETTER ---
async function sendNewsletter(env: Env, dryRun = false): Promise<object> {
  // 1. Recuperer les derniers articles par categorie
  const categorized = await fetchLatestArticles(env.SITE_URL);
  const allArticles = [...categorized.concours, ...categorized.testGratuit, ...categorized.bonsPlans];

  if (allArticles.length === 0) {
    return { status: "skip", reason: "Aucun article recent" };
  }

  // 2. Construire le HTML de la newsletter
  const html = buildNewsletterHTML(categorized, env.SITE_URL);

  // 3. Sujet : mettre en avant concours/tests
  let subject = "";
  if (categorized.concours.length > 0) {
    subject = `${categorized.concours.length} concours a ne pas rater`;
    if (categorized.testGratuit.length > 0) {
      subject += ` + ${categorized.testGratuit.length} tests gratuits`;
    }
  } else if (categorized.testGratuit.length > 0) {
    subject = `${categorized.testGratuit.length} tests produits gratuits cette semaine`;
  } else {
    subject = `${allArticles[0].title} + ${allArticles.length - 1} autres bons plans`;
  }

  // 4. Recuperer tous les abonnes
  const subscriberList = await env.SUBSCRIBERS.list();
  const emails: string[] = [];

  for (const key of subscriberList.keys) {
    const data = await env.SUBSCRIBERS.get(key.name);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.active !== false) {
        emails.push(key.name);
      }
    }
  }

  if (dryRun) {
    return {
      status: "dry_run",
      subscribers: emails.length,
      concours: categorized.concours.length,
      testGratuit: categorized.testGratuit.length,
      bonsPlans: categorized.bonsPlans.length,
      subject,
      preview: html.substring(0, 500) + "...",
    };
  }

  // 5. Envoyer par lots de 50 (limite Resend)
  let sent = 0;
  let errors = 0;
  const BATCH_SIZE = 50;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    for (const email of batch) {
      try {
        const workerUrl = new URL("https://bonsplansmania-newsletter.selenevoyance14.workers.dev");
        const unsubUrl = `${workerUrl.origin}/unsubscribe?email=${encodeURIComponent(email)}`;

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
            to: [email],
            subject,
            html: html.replace("{{UNSUB_URL}}", unsubUrl),
          }),
        });

        if (res.ok) {
          sent++;
        } else {
          errors++;
        }
      } catch {
        errors++;
      }
    }
  }

  return { status: "sent", sent, errors, total: emails.length, articles: allArticles.length };
}

// --- FETCH LATEST ARTICLES ---
interface ArticleInfo {
  title: string;
  url: string;
  description: string;
  category: string;
  image: string;
}

interface CategorizedArticles {
  concours: ArticleInfo[];
  testGratuit: ArticleInfo[];
  bonsPlans: ArticleInfo[];
}

async function fetchLatestArticles(siteUrl: string): Promise<CategorizedArticles> {
  try {
    const res = await fetch(`${siteUrl}/articles.json`, { cf: { cacheTtl: 300 } });
    if (res.ok) {
      const data = await res.json<ArticleInfo[]>();
      return {
        concours: data.filter((a) => a.category === "concours").slice(0, 3),
        testGratuit: data.filter((a) => a.category === "test-gratuit" || a.category === "test").slice(0, 3),
        bonsPlans: data.filter((a) => a.category !== "concours" && a.category !== "test-gratuit" && a.category !== "test").slice(0, 4),
      };
    }
  } catch {
    // Fallback : pas de feed disponible
  }

  return { concours: [], testGratuit: [], bonsPlans: [] };
}

// --- BUILD NEWSLETTER HTML ---
function buildArticleCards(articles: ArticleInfo[], siteUrl: string): string {
  return articles
    .map(
      (a) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
        <a href="${a.url}" style="text-decoration:none;color:#1f2937;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="100" style="padding-right:16px;">
                <img src="${siteUrl}${a.image}" alt="${a.title}" width="100" height="70" style="border-radius:8px;object-fit:cover;display:block;" />
              </td>
              <td>
                <p style="margin:0;font-size:15px;font-weight:700;color:#1f2937;line-height:1.3;">${a.title}</p>
              </td>
            </tr>
          </table>
        </a>
      </td>
    </tr>`
    )
    .join("");
}

function buildSection(title: string, emoji: string, bgColor: string, textColor: string, articles: ArticleInfo[], siteUrl: string): string {
  if (articles.length === 0) return "";
  return `
        <tr>
          <td style="padding:24px 24px 0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding:10px 16px;background:${bgColor};border-radius:10px;">
                  <h2 style="margin:0;font-size:17px;color:${textColor};">${emoji} ${title}</h2>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px;">
              ${buildArticleCards(articles, siteUrl)}
            </table>
          </td>
        </tr>`;
}

function buildPartnerSection(): string {
  if (!PARTNER_BANNER.enabled) return "";
  return `
        <tr>
          <td style="padding:24px 24px 0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding:10px 16px;background:#FEF3C7;border-radius:10px;">
                  <h2 style="margin:0;font-size:17px;color:#92400E;">${PARTNER_BANNER.title}</h2>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:12px;">
              <tr>
                <td align="center" style="padding:4px 0;">
                  <a href="${PARTNER_BANNER.link}" target="_blank" rel="noopener" style="text-decoration:none;">
                    <img src="${PARTNER_BANNER.imageUrl}" alt="${PARTNER_BANNER.alt}" width="${PARTNER_BANNER.width}" height="${PARTNER_BANNER.height}" style="max-width:100%;width:100%;height:auto;border:0;display:block;border-radius:8px;" />
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

function buildNewsletterHTML(categorized: CategorizedArticles, siteUrl: string): string {
  const concoursSection = buildSection("Concours en cours", "🎁", "#DCFCE7", "#166534", categorized.concours, siteUrl);
  const testSection = buildSection("Tests produits gratuits", "🧴", "#F3E8FF", "#7C3AED", categorized.testGratuit, siteUrl);
  const partnerSection = buildPartnerSection();
  const bonsPlansSection = buildSection("Bons plans du moment", "🔥", "#FEE2E2", "#DC2626", categorized.bonsPlans, siteUrl);

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f9fafb;">
    <tr><td align="center" style="padding:20px;">
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#DC2626,#F97316);padding:32px 24px;text-align:center;">
            <h1 style="margin:0;color:white;font-size:24px;">Bons Plans Mania</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Concours, tests gratuits et bons plans de la semaine</p>
          </td>
        </tr>

        ${concoursSection}
        ${testSection}
        ${partnerSection}
        ${bonsPlansSection}

        <!-- CTA -->
        <tr>
          <td style="padding:24px;text-align:center;">
            <a href="${siteUrl}/blog" style="display:inline-block;padding:14px 32px;background:#DC2626;color:white;text-decoration:none;border-radius:999px;font-weight:700;font-size:15px;">
              Voir tous les bons plans
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px;background:#f3f4f6;text-align:center;font-size:12px;color:#6b7280;">
            <p style="margin:0;">Vous recevez cet email car vous etes inscrit a la newsletter Bons Plans Mania.</p>
            <p style="margin:8px 0 0;">
              <a href="{{UNSUB_URL}}" style="color:#6b7280;text-decoration:underline;">Se desabonner</a>
              &nbsp;|&nbsp;
              <a href="${siteUrl}" style="color:#6b7280;text-decoration:underline;">Visiter le site</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
