import assert from "node:assert/strict";
import { affilaeQuery, fetchAffilae } from "../functions/lib/affilae";
import { handleAffilae } from "../functions/api/admin/affilae";
import { createSessionCookie } from "../functions/api/admin/_auth";

async function main() {
  const env = { AFFILAE_API_TOKEN: "private-test-token", AFFILAE_PROFILE_ID: "0123456789abcdef01234567", ADMIN_PASSWORD: "test", ADMIN_SESSION_SECRET: "test-secret", GITHUB_TOKEN: "" };
  const params = new URLSearchParams();
  assert.throws(() => affilaeQuery("https://evil.example", params, env));
  assert.throws(() => affilaeQuery("feeds", params, {}));
  assert.throws(() => affilaeQuery("kpis", new URLSearchParams("from=no&to=no"), env));
  assert.throws(() => affilaeQuery("conversions", new URLSearchParams("limit=-1"), env));
  await assert.rejects(fetchAffilae("profiles", params, {}), /non configurée/);
  let calls = 0;
  const mock: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(new URL(String(url)).origin, "https://rest.affilae.com");
    assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer private-test-token");
    assert.equal(init?.redirect, "error");
    return Response.json([{ id: "feed", urlTracked: "https://example.com/feed" }]);
  };
  assert.deepEqual(await fetchAffilae("feeds", params, env, mock), [{ id: "feed", urlTracked: "https://example.com/feed" }]);
  assert.equal(calls, 1);
  await assert.rejects(fetchAffilae("profiles", params, env, async () => new Response("sensitive upstream content", { status: 403 })), error => error instanceof Error && !error.message.includes("sensitive") && error.message.includes("refusé"));
  await assert.rejects(fetchAffilae("profiles", params, env, async () => new Response("", { status: 429 })), /Limite/);
  await assert.rejects(fetchAffilae("profiles", params, env, async () => { throw new Error("secret"); }), /inaccessible/);
  const unauthorized = await handleAffilae(new Request("https://example.com/api/admin/affilae"), env);
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorized.headers.get("cache-control"), "private, no-store");
  const cookie = (await createSessionCookie(env)).split(";")[0];
  const authenticated = await handleAffilae(new Request("https://example.com/api/admin/affilae?resource=profiles", { headers: { Cookie: cookie } }), { ...env, AFFILAE_API_TOKEN: undefined });
  assert.equal(authenticated.status, 503);
  assert.equal(authenticated.headers.get("x-robots-tag"), "noindex, nofollow");
  console.log("Affilae : validations, authentification, confidentialité et erreurs OK.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
