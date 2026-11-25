import { isAuthenticated, json, type AdminEnv } from "./_auth";
import { fetchAffilae, AffilaeError, type AffilaeEnv } from "../../lib/affilae";

export async function handleAffilae(request: Request, env: AdminEnv & AffilaeEnv, fetcher: typeof fetch = fetch): Promise<Response> {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!await isAuthenticated(request, env)) return json({ error: "Authentification requise." }, 401, headers);
  const params = new URL(request.url).searchParams;
  try {
    const data = await fetchAffilae(params.get("resource") || "profiles", params, env, fetcher);
    return json(params.get("check") === "1" ? { connected: true } : data, 200, headers);
  } catch (error) {
    // A dependency failure is not an origin gateway error. Cloudflare may replace
    // 502 responses with an HTML error page, hiding our actionable JSON message.
    const status = error instanceof AffilaeError ? (error.status === 502 ? 424 : error.status) : 500;
    return json({ error: error instanceof AffilaeError ? error.message : "Erreur de connexion Affilae.", ...(error instanceof AffilaeError && error.upstreamStatus ? { upstreamStatus: error.upstreamStatus } : {}) }, status, headers);
  }
}
export const onRequestGet = ({ request, env }: { request: Request; env: AdminEnv & AffilaeEnv }) => handleAffilae(request, env);
