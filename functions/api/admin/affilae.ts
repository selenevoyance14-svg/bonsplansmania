import { isAuthenticated, json, type AdminEnv } from "./_auth";
import { fetchAffilae, AffilaeError, type AffilaeEnv } from "../../lib/affilae";

export async function handleAffilae(request: Request, env: AdminEnv & AffilaeEnv): Promise<Response> {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!await isAuthenticated(request, env)) return json({ error: "Authentification requise." }, 401, headers);
  const params = new URL(request.url).searchParams;
  try {
    return json(await fetchAffilae(params.get("resource") || "profiles", params, env), 200, headers);
  } catch (error) {
    return json({ error: error instanceof AffilaeError ? error.message : "Erreur de connexion Affilae." }, error instanceof AffilaeError ? error.status : 500, headers);
  }
}
export const onRequestGet = ({ request, env }: { request: Request; env: AdminEnv & AffilaeEnv }) => handleAffilae(request, env);
