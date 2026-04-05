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

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export default {
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
      return jsonResponse({ error: "Not found" }, 404);
    } catch (err) {
      return jsonResponse({ error: "Internal error" }, 500);
    }
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(sendNewsletter(env));
  },
};

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

function buildNewsletterHTML(categorized: CategorizedArticles, siteUrl: string): string {
  const concoursSection = buildSection("Concours en cours", "🎁", "#DCFCE7", "#166534", categorized.concours, siteUrl);
  const testSection = buildSection("Tests produits gratuits", "🧴", "#F3E8FF", "#7C3AED", categorized.testGratuit, siteUrl);
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
