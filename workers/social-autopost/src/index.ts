interface Env {
  SOCIAL_STATE: KVNamespace;
  SITE_URL: string;
  FACEBOOK_PAGE_ID: string;
  INSTAGRAM_ACCOUNT_ID: string;
  GRAPH_API_VERSION: string;
  DRY_RUN: string;
  FACEBOOK_PAGE_TOKEN: string;
  INSTAGRAM_ACCESS_TOKEN?: string;
  ADMIN_SECRET: string;
}

type Platform = "facebook" | "instagram";

type Candidate = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  url: string;
  affiliate: boolean;
  endDate: string | null;
};

type CandidateFeed = { articles: Candidate[] };

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function cleanText(value: string, max: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, max).trim();
}

function caption(article: Candidate, platform: Platform) {
  const disclosure = article.affiliate ? "\n\n#publicité #lienaffilié" : "";
  const description = cleanText(article.description, platform === "instagram" ? 420 : 300);
  return `${cleanText(article.title, 180)}\n\n${description}\n\n${article.url}${disclosure}\n\n#bonsplans #promo`;
}

async function getCandidates(env: Env): Promise<Candidate[]> {
  const response = await fetch(`${env.SITE_URL}/api/social-candidates`, {
    headers: { "User-Agent": "BonsPlansMania-Social-Autopost/1.0" },
  });
  if (!response.ok) throw new Error(`Candidate feed: HTTP ${response.status}`);
  const feed = await response.json<CandidateFeed>();
  const now = Date.now();
  return feed.articles.filter((article) => {
    const date = new Date(article.date).getTime();
    if (!Number.isFinite(date) || now - date > 10 * 86_400_000) return false;
    if (article.endDate && new Date(`${article.endDate}T23:59:59Z`).getTime() < now) return false;
    return article.image.startsWith("https://") && article.url.startsWith(env.SITE_URL);
  });
}

async function selectCandidate(env: Env, platform: Platform) {
  const candidates = await getCandidates(env);
  for (const article of candidates) {
    if (!(await env.SOCIAL_STATE.get(`posted:${platform}:${article.slug}`))) return article;
  }
  return null;
}

async function graphPost(env: Env, path: string, body: Record<string, string>, token: string) {
  const response = await fetch(`https://graph.facebook.com/${env.GRAPH_API_VERSION}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...body, access_token: token }),
  });
  const result = await response.json<Record<string, unknown>>();
  if (!response.ok) throw new Error(`Meta API ${response.status}: ${JSON.stringify(result)}`);
  return result;
}

async function publishFacebook(env: Env, article: Candidate) {
  return graphPost(env, `${env.FACEBOOK_PAGE_ID}/photos`, {
    url: article.image,
    caption: caption(article, "facebook"),
    published: "true",
  }, env.FACEBOOK_PAGE_TOKEN);
}

async function publishInstagram(env: Env, article: Candidate) {
  const accessToken = env.INSTAGRAM_ACCESS_TOKEN || env.FACEBOOK_PAGE_TOKEN;
  const container = await graphPost(env, `${env.INSTAGRAM_ACCOUNT_ID}/media`, {
    image_url: article.image,
    caption: caption(article, "instagram"),
  }, accessToken);
  const creationId = String(container.id || "");
  if (!creationId) throw new Error("Instagram n'a pas retourné d'identifiant de création");
  return graphPost(env, `${env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
    creation_id: creationId,
  }, accessToken);
}

async function run(env: Env, platform: Platform, forceDryRun = false) {
  const article = await selectCandidate(env, platform);
  if (!article) return { ok: true, platform, skipped: "no-new-candidate" };

  if (env.DRY_RUN === "true" || forceDryRun) {
    return { ok: true, dryRun: true, platform, candidate: article };
  }

  const result = platform === "facebook"
    ? await publishFacebook(env, article)
    : await publishInstagram(env, article);
  await env.SOCIAL_STATE.put(`posted:${platform}:${article.slug}`, JSON.stringify({
    postedAt: new Date().toISOString(),
    result,
  }));
  return { ok: true, platform, slug: article.slug };
}

async function runScheduled(env: Env, platform: Platform) {
  try {
    const result = await run(env, platform);
    await env.SOCIAL_STATE.put(`status:${platform}`, JSON.stringify({
      checkedAt: new Date().toISOString(),
      result,
    }));
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await env.SOCIAL_STATE.put(`status:${platform}`, JSON.stringify({
      checkedAt: new Date().toISOString(),
      error: message.slice(0, 1500),
    }));
    throw error;
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return json({ ok: true, dryRun: env.DRY_RUN === "true" });
    if (url.pathname === "/preview") {
      if (request.headers.get("Authorization") !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: "Unauthorized" }, 401);
      const platform = url.searchParams.get("platform") === "instagram" ? "instagram" : "facebook";
      return json(await run(env, platform, true));
    }
    if (url.pathname === "/run" && request.method === "POST") {
      if (request.headers.get("Authorization") !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: "Unauthorized" }, 401);
      const platform = url.searchParams.get("platform") === "instagram" ? "instagram" : "facebook";
      return json(await run(env, platform));
    }
    return json({ error: "Not found" }, 404);
  },

  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runScheduled(env, "facebook"));
    if (event.cron === "0 7,12,17 * * *" && new Date(event.scheduledTime).getUTCHours() === 7) {
      ctx.waitUntil(runScheduled(env, "instagram"));
    }
  },
} satisfies ExportedHandler<Env>;
