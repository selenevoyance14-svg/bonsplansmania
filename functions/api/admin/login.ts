import { createSessionCookie, json, sameOrigin, verifyPassword, type AdminEnv } from "./_auth";

type LoginBody = { password?: string };

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!sameOrigin(request)) return json({ error: "Requête refusée." }, 403);
  let body: LoginBody;
  try {
    body = await request.json<LoginBody>();
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }
  if (!await verifyPassword(body.password || "", env)) {
    return json({ error: "Mot de passe incorrect." }, 401);
  }
  return json({ authenticated: true }, 200, { "Set-Cookie": await createSessionCookie(env) });
};
