type Env = {
  AMAZON_CREATOR_CREDENTIAL_ID: string;
  AMAZON_CREATOR_CREDENTIAL_SECRET: string;
  AMAZON_CREATOR_CREDENTIAL_VERSION?: string;
  AMAZON_PARTNER_TAG?: string;
  AMAZON_MONITORING_TOKEN: string;
};

let accessToken: { value: string; expiresAt: number } | null = null;

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

function tokenEndpoint(version = "3.2"): string {
  if (version === "3.1") return "https://api.amazon.com/auth/o2/token";
  if (version === "3.3") return "https://api.amazon.co.jp/auth/o2/token";
  return "https://api.amazon.co.uk/auth/o2/token";
}

async function getAccessToken(env: Env): Promise<string> {
  if (accessToken && accessToken.expiresAt > Date.now() + 60_000) return accessToken.value;
  const response = await fetch(tokenEndpoint(env.AMAZON_CREATOR_CREDENTIAL_VERSION), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: env.AMAZON_CREATOR_CREDENTIAL_ID,
      client_secret: env.AMAZON_CREATOR_CREDENTIAL_SECRET,
      scope: "creatorsapi::default",
    }),
  });
  if (!response.ok) throw new Error(`Amazon OAuth ${response.status}`);
  const payload = await response.json<{ access_token?: string; expires_in?: number }>();
  if (!payload.access_token) throw new Error("Amazon OAuth token absent");
  accessToken = { value: payload.access_token, expiresAt: Date.now() + Math.max(300, payload.expires_in || 3600) * 1000 };
  return accessToken.value;
}

async function sameSecret(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const a = new Uint8Array(left);
  const b = new Uint8Array(right);
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const authorization = request.headers.get("Authorization") || "";
  const provided = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!env.AMAZON_MONITORING_TOKEN || !provided || !(await sameSecret(provided, env.AMAZON_MONITORING_TOKEN))) {
    return json({ error: "Non autorisé" }, 401);
  }
  const body = await request.json<{ asins?: unknown }>().catch(() => null);
  const asins = Array.isArray(body?.asins)
    ? [...new Set(body.asins.map(String).map((value) => value.trim().toUpperCase()).filter((value) => /^[A-Z0-9]{10}$/.test(value)))].slice(0, 10)
    : [];
  if (!asins.length) return json({ error: "ASIN requis" }, 400);

  try {
    const token = await getAccessToken(env);
    const response = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-marketplace": "www.amazon.fr" },
      body: JSON.stringify({
        itemIds: asins,
        itemIdType: "ASIN",
        marketplace: "www.amazon.fr",
        partnerTag: env.AMAZON_PARTNER_TAG || "lebrunnathali-21",
        resources: ["itemInfo.title", "offersV2.listings.price", "offersV2.listings.availability"],
      }),
    });
    if (!response.ok) throw new Error(`Creators API ${response.status}`);
    const payload = await response.json<{
      itemsResult?: { items?: Array<{
        asin?: string;
        itemInfo?: { title?: { displayValue?: string } };
        offersV2?: { listings?: Array<{
          isBuyBoxWinner?: boolean;
          availability?: { message?: string; type?: string };
          price?: { money?: { amount?: number; currency?: string; displayAmount?: string }; savingBasis?: { money?: { displayAmount?: string } }; savings?: { percentage?: number } };
        }> };
      }> };
    }>();
    const checkedAt = new Date().toISOString();
    const items = (payload.itemsResult?.items || []).map((item) => {
      const listings = item.offersV2?.listings || [];
      const listing = listings.find((entry) => entry.isBuyBoxWinner) || listings[0];
      return {
        asin: item.asin,
        title: item.itemInfo?.title?.displayValue || null,
        price: listing?.price?.money?.displayAmount || null,
        priceAmount: listing?.price?.money?.amount ?? null,
        currency: listing?.price?.money?.currency || "EUR",
        amazonReferencePrice: listing?.price?.savingBasis?.money?.displayAmount || null,
        amazonSavingsPercent: listing?.price?.savings?.percentage ?? null,
        availability: listing?.availability?.message || null,
        inStock: listing?.availability?.type === "IN_STOCK",
        checkedAt,
      };
    });
    return json({ items, checkedAt });
  } catch (error) {
    console.error(JSON.stringify({ event: "amazon-batch-error", message: error instanceof Error ? error.message : "unknown" }));
    return json({ error: "Prix Amazon momentanément indisponibles" }, 502);
  }
};
