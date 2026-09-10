import { isAuthenticated, json, sameOrigin, type AdminEnv } from "./_auth";

type DealAction = "update" | "raise" | "archive";
type DealChange = { slug?: string; action?: DealAction; price?: string };
type ActionBody = DealChange & { changes?: DealChange[] };
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readFrontmatterValue(source: string, key: string): string | undefined {
  const match = source.match(new RegExp(`^${escapeRegExp(key)}:\\s*(?:"([^"]*)"|'([^']*)'|(.+?))\\s*$`, "m"));
  return match ? match[1] ?? match[2] ?? match[3] : undefined;
}

function primaryEuroPrice(value?: string): string | undefined {
  return value?.match(/\d{1,4}(?:[ .]\d{3})*(?:[,.]\d{1,2})?\s*€/u)?.[0];
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
    const previousPrimaryPrice = primaryEuroPrice(previousPrice) || primaryEuroPrice(readFrontmatterValue(next, "title"));
    const requestedPrimaryPrice = primaryEuroPrice(price);
    if (previousPrimaryPrice && requestedPrimaryPrice && previousPrimaryPrice !== requestedPrimaryPrice) {
      next = next.replace(new RegExp(escapeRegExp(previousPrimaryPrice), "g"), requestedPrimaryPrice);
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

async function readArticle(slug: string, token: string): Promise<{ source: string; path: string }> {
  const path = `content/${slug}.mdx`;
  const response = await githubRequest(`/contents/${encodeURIComponent(path)}?ref=${BRANCH}`, token);
  const file = await response.json<GitHubFile>();
  if (!response.ok || !file.content) {
    throw new Error(response.status === 404 ? `Article introuvable : ${slug}` : `Lecture impossible : ${slug}`);
  }
  return { source: decodeBase64(file.content), path };
}

async function commitChanges(changes: Array<{ path: string; content: string }>, token: string): Promise<string | undefined> {
  const refResponse = await githubRequest(`/git/ref/heads/${BRANCH}`, token);
  const ref = await refResponse.json<{ object?: { sha?: string } }>();
  const parentSha = ref.object?.sha;
  if (!refResponse.ok || !parentSha) throw new Error("Impossible de lire la branche principale.");

  const commitResponse = await githubRequest(`/git/commits/${parentSha}`, token);
  const parentCommit = await commitResponse.json<{ tree?: { sha?: string } }>();
  const baseTree = parentCommit.tree?.sha;
  if (!commitResponse.ok || !baseTree) throw new Error("Impossible de préparer la publication.");

  const tree = await Promise.all(changes.map(async (change) => {
    const blobResponse = await githubRequest("/git/blobs", token, {
      method: "POST",
      body: JSON.stringify({ content: change.content, encoding: "utf-8" }),
    });
    const blob = await blobResponse.json<{ sha?: string }>();
    if (!blobResponse.ok || !blob.sha) throw new Error(`Impossible de préparer ${change.path}.`);
    return { path: change.path, mode: "100644", type: "blob", sha: blob.sha };
  }));

  const treeResponse = await githubRequest("/git/trees", token, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree }),
  });
  const newTree = await treeResponse.json<{ sha?: string }>();
  if (!treeResponse.ok || !newTree.sha) throw new Error("Impossible de créer le lot de modifications.");

  const newCommitResponse = await githubRequest("/git/commits", token, {
    method: "POST",
    body: JSON.stringify({
      message: `Publie ${changes.length} modification${changes.length > 1 ? "s" : ""} depuis l’administration`,
      tree: newTree.sha,
      parents: [parentSha],
      committer: { name: "Bons Plans Mania", email: "contact@bonsplansmania.fr" },
    }),
  });
  const newCommit = await newCommitResponse.json<{ sha?: string }>();
  if (!newCommitResponse.ok || !newCommit.sha) throw new Error("Impossible de créer le commit de publication.");

  const updateRefResponse = await githubRequest(`/git/refs/heads/${BRANCH}`, token, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha, force: false }),
  });
  if (!updateRefResponse.ok) throw new Error("Le site vient d’être modifié ailleurs. Recharge la page et republie le lot.");
  return newCommit.sha.slice(0, 7);
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
  const requestedChanges = body.changes?.length ? body.changes : [body];
  if (requestedChanges.length > 100) return json({ error: "Le lot est limité à 100 modifications." }, 400);
  const normalized = requestedChanges.map((change) => ({
    slug: change.slug?.trim() || "",
    action: change.action,
    price: change.price?.trim() || "",
  }));
  if (normalized.some((change) => !/^[a-z0-9-]{3,180}$/.test(change.slug) || !change.action || !["update", "raise", "archive"].includes(change.action))) {
    return json({ error: "Une action ou un article du lot est invalide." }, 400);
  }
  if (normalized.some((change) => change.price.length > 80)) return json({ error: "Un prix saisi est trop long." }, 400);

  try {
    const files = await Promise.all(normalized.map(async (change) => {
      const article = await readArticle(change.slug, env.GITHUB_TOKEN);
      return { path: article.path, content: updateArticle(article.source, change.action!, change.price) };
    }));
    const commit = await commitChanges(files, env.GITHUB_TOKEN);
    return json({
      ok: true,
      count: files.length,
      commit,
      message: `${files.length} modification${files.length > 1 ? "s" : ""} publiée${files.length > 1 ? "s" : ""} en un seul envoi. La mise en ligne est lancée.`,
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "La publication GitHub a échoué." }, 502);
  }
};
