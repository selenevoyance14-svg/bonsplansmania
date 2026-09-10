import { clearSessionCookie, json, sameOrigin, type AdminEnv } from "./_auth";

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request }) => {
  if (!sameOrigin(request)) return json({ error: "Requête refusée." }, 403);
  return json({ authenticated: false }, 200, { "Set-Cookie": clearSessionCookie() });
};
