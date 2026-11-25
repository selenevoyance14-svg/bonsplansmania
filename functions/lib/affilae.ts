/** Read-only publisher API. Never import this module into browser components. */
export type AffilaeEnv = { AFFILAE_API_TOKEN?: string; AFFILAE_PROFILE_ID?: string };
export class AffilaeError extends Error {
  constructor(message: string, public status: number, public upstreamStatus?: number) { super(message); }
}
const endpoints = {
  profiles: "/publisher/publishers.me",
  feeds: "/publisher/feeds.list",
  partnerships: "/publisher/partnerships.list",
  conversions: "/publisher/conversions.list",
  vouchers: "/publisher/vouchers.list",
  kpis: "/publisher/partnerships.kpis",
} as const;
export type AffilaeResource = keyof typeof endpoints;
const metrics = new Set(["clicks", "impressions", "conversionsTotal", "commissionsTotal", "revenue", "EPC"]);

export function affilaeQuery(resource: string, input: URLSearchParams, env: AffilaeEnv): URL {
  if (!Object.hasOwn(endpoints, resource)) throw new AffilaeError("Ressource inconnue.", 400);
  const url = new URL(endpoints[resource as AffilaeResource], "https://rest.affilae.com");
  const profile = input.get("profile") || env.AFFILAE_PROFILE_ID;
  if (profile && !/^[a-f0-9]{24}$/i.test(profile)) throw new AffilaeError("Identifiant de profil invalide.", 400);
  if (["feeds", "conversions"].includes(resource) && !profile) throw new AffilaeError("Sélectionnez un profil Affilae.", 400);
  if (profile && resource !== "profiles") url.searchParams.set(resource === "kpis" ? "affiliateProfiles" : "affiliateProfile", profile);
  if (resource === "kpis" || resource === "conversions") {
    for (const key of ["from", "to"]) {
      const value = input.get(key);
      if (!value && resource === "kpis") throw new AffilaeError("Dates from et to requises.", 400);
      if (value) {
        if (!/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) throw new AffilaeError("Date ISO invalide.", 400);
        url.searchParams.set(key, new Date(value).toISOString());
      }
    }
    if (input.get("from") && input.get("to") && Date.parse(input.get("from")!) > Date.parse(input.get("to")!)) throw new AffilaeError("Période invalide.", 400);
  }
  if (resource === "kpis") {
    const metric = input.get("metric") || "commissionsTotal";
    if (!metrics.has(metric)) throw new AffilaeError("Indicateur invalide.", 400);
    url.searchParams.set("metric", metric);
  }
  if (["conversions", "vouchers"].includes(resource)) {
    for (const [key, fallback, max] of [["limit", 100, 500], ["offset", 0, 1000000]] as const) {
      const value = input.has(key) ? Number(input.get(key)) : fallback;
      if (!Number.isInteger(value) || value < (key === "limit" ? 1 : 0) || value > max) throw new AffilaeError("Pagination invalide.", 400);
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

export async function fetchAffilae(resource: string, input: URLSearchParams, env: AffilaeEnv, fetcher: typeof fetch = fetch): Promise<unknown> {
  const url = affilaeQuery(resource, input, env);
  if (!env.AFFILAE_API_TOKEN?.trim()) throw new AffilaeError("Clé AFFILAE_API_TOKEN non configurée.", 503);
  let response: Response;
  try {
    // Workers does not implement redirect: "error". Manual mode prevents
    // forwarding the bearer token; reject redirects below without following.
    response = await fetcher(url, { headers: { Authorization: `Bearer ${env.AFFILAE_API_TOKEN.trim()}`, Accept: "application/json" }, signal: AbortSignal.timeout(15000), redirect: "manual" });
  } catch { throw new AffilaeError("Affilae est momentanément inaccessible.", 502); }
  if (response.status >= 300 && response.status < 400) throw new AffilaeError("Affilae a renvoyé une redirection inattendue. La clé n’a pas été transmise à cette destination.", 502, response.status);
  if (!response.ok) {
    throw new AffilaeError(response.status === 429 ? "Limite Affilae atteinte, réessayez plus tard." : response.status === 401 || response.status === 403 ? "Clé ou accès Affilae refusé." : "Erreur du service Affilae.", response.status === 429 ? 429 : 502, response.status);
  }
  try { return await response.json(); }
  catch { throw new AffilaeError("Réponse Affilae illisible.", 502); }
}
