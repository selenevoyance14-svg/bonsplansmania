import { isAuthenticated, json, type AdminEnv } from "./_auth";

export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => {
  return json({ authenticated: await isAuthenticated(request, env) });
};
