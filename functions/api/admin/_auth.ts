export type AdminEnv = {
  ADMIN_PASSWORD: string;
  ADMIN_SESSION_SECRET: string;
  GITHUB_TOKEN: string;
};

const COOKIE_NAME = "bpm_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

async function safeEqual(left: string, right: string): Promise<boolean> {
  const leftDigest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(left));
  const rightDigest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(right));
  const a = new Uint8Array(leftDigest);
  const b = new Uint8Array(rightDigest);
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

function cookieValue(request: Request): string | undefined {
  const cookieHeader = request.headers.get("Cookie") || "";
  return cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
}

export async function verifyPassword(password: string, env: AdminEnv): Promise<boolean> {
  if (!env.ADMIN_PASSWORD || !password) return false;
  return safeEqual(password, env.ADMIN_PASSWORD);
}

export async function createSessionCookie(env: AdminEnv): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const signature = await hmac(String(expires), env.ADMIN_SESSION_SECRET);
  return `${COOKIE_NAME}=${expires}.${signature}; Path=/; Max-Age=${SESSION_DURATION_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export async function isAuthenticated(request: Request, env: AdminEnv): Promise<boolean> {
  if (!env.ADMIN_SESSION_SECRET) return false;
  const value = cookieValue(request);
  if (!value) return false;
  const [expiresValue, signature] = value.split(".");
  const expires = Number(expiresValue);
  if (!Number.isFinite(expires) || expires <= Math.floor(Date.now() / 1000) || !signature) return false;
  const expected = await hmac(expiresValue, env.ADMIN_SESSION_SECRET);
  return safeEqual(signature, expected);
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export function json(payload: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(payload, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}
