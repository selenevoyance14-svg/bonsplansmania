import { isAuthenticated, json, sameOrigin, type AdminEnv } from "./_auth";

type DealAction = "update" | "raise" | "archive";
type ActionBody = { slug?: string; action?: DealAction; price?: string };
type GitHubFile = { sha?: string; content?: string; encoding?: string; message?: string };

const OWNER = "selenevoyance14-svg";
const REPOSITORY = "bonsplansmania";
const BRANCH = "main";
const API_VERSION = "2022-11-28";

function todayInFrance(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function decodeBase64(value: string): string {
  const binary = atob(value.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }
  return btoa(binary);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readFrontmatterValue(source: string, key: string): string | undefined {
  const match = source.match(new RegExp(`^${escapeRegExp(key)}:\\s*(?:"([^"]*)"|'([^']*)'|(.+?))\\s*$`, "m"));
  return match ? match[1] ?? match[2] ?? match[3] : undefined;
}

function setFrontmatterValue(source: string, key: string, value: string | boolean): string {
  const separator = source.indexOf("\n---", 3);
  if (!source.startsWith("---\n") || separator < 0) throw new Error("Frontmatter introuvable");
  const rendered = typeof value === "boolean" ? String(value) : `"${value.replace(/"/g, "\\\"")}"`;
  const expression = new RegExp(`^${escapeRegExp(key)}:.*$`, "m");
  if (expression.test(source.slice(0, separator))) return source.replace(expression, `${key}: ${rendered}`);
  return `${source.slice(0, separator)}\n${key}: ${rendered}${source.slice(separator)}`;
}

function updateArticle(source: string, action: DealAction, requestedPrice?: string): string {
  let next = source;
  const price = requestedPrice?.trim();
  if (action !== "archive" && price) {
    const previousPrice = readFrontmatterValue(next, "price");
    if (previousPrice && previousPrice !== price) {
      next = next.replace(new RegExp(escapeRegExp(previousPrice), "g"), price);
    }
    next = setFrontmatterValue(next, "price", price);
  }
  if (action === "archive") {
    next = setFrontmatterValue(next, "expired", true);
    next = setFrontmatterValue(next, "featured", false);
  } else if (action === "raise") {
    next = setFrontmatterValue(next, "updated", todayInFrance());
    next = setFrontmatterValue(next, "expired", false);
  }
  return next;
}

async function githubRequest(path: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(`https://api.github.com/repos/${OWNER}/${REPOSITORY}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": API_VERSION,
      "User-Agent": "BonsPlansMania-Admin",
      ...init?.headers,
    },
  });
}

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!sameOrigin(request)) return json({ error: "Requête refusée." }, 403);
  if (!await isAuthenticated(request, env)) return json({ error: "Connexion administrateur requise." }, 401);
  if (!env.GITHUB_TOKEN) return json({ error: "La publication GitHub n’est pas configurée." }, 503);

  let body: ActionBody;
  try {
    body = await request.json<ActionBody>();
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }
  const slug = body.slug?.trim() || "";
  const action = body.action;
  const price = body.price?.trim() || "";
  if (!/^[a-z0-9-]{3,180}$/.test(slug) || !action || !["update", "raise", "archive"].includes(action)) {
    return json({ error: "Action ou article invalide." }, 400);
  }
  if (price.length > 80) return json({ error: "Le prix saisi est trop long." }, 400);

  const filePath = `content/${slug}.mdx`;
  const getResponse = await githubRequest(`/contents/${encodeURIComponent(filePath)}?ref=${BRANCH}`, env.GITHUB_TOKEN);
  const file = await getResponse.json<GitHubFile>();
  if (!getResponse.ok || !file.sha || !file.content) {
    return json({ error: getResponse.status === 404 ? "Article introuvable dans le dépôt." : "Impossible de lire l’article sur GitHub." }, getResponse.status === 404 ? 404 : 502);
  }

  let updatedContent: string;
  try {
    updatedContent = updateArticle(decodeBase64(file.content), action, price);
  } catch {
    return json({ error: "Le format de cet article ne peut pas être modifié automatiquement." }, 422);
  }

  const verb = action === "archive" ? "Archive" : action === "raise" ? "Met à jour et remonte" : "Met à jour";
  const putResponse = await githubRequest(`/contents/${encodeURIComponent(filePath)}`, env.GITHUB_TOKEN, {
    method: "PUT",
    body: JSON.stringify({
      message: `${verb} ${slug} depuis l’administration`,
      content: encodeBase64(updatedContent),
      sha: file.sha,
      branch: BRANCH,
      committer: { name: "Bons Plans Mania", email: "contact@bonsplansmania.fr" },
    }),
  });
  const result = await putResponse.json<{ commit?: { sha?: string }; message?: string }>();
  if (!putResponse.ok) {
    return json({ error: putResponse.status === 409 ? "L’article vient d’être modifié. Recharge la page et réessaie." : "La publication GitHub a échoué." }, putResponse.status === 409 ? 409 : 502);
  }

  return json({
    ok: true,
    action,
    slug,
    commit: result.commit?.sha?.slice(0, 7),
    message: action === "archive"
      ? "Offre archivée. La mise en ligne est lancée."
      : action === "raise"
        ? "Offre mise à jour et remontée. La mise en ligne est lancée."
        : "Offre mise à jour. La mise en ligne est lancée.",
  });
};
