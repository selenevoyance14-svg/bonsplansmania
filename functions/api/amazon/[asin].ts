type Env = {
  AMAZON_CREATOR_CREDENTIAL_ID: string;
  AMAZON_CREATOR_CREDENTIAL_SECRET: string;
  AMAZON_CREATOR_CREDENTIAL_VERSION?: string;
  AMAZON_PARTNER_TAG?: string;
};

type Money = { amount?: number; currency?: string; displayAmount?: string };
type Listing = {
  isBuyBoxWinner?: boolean;
  availability?: { message?: string; type?: string };
  price?: {
    money?: Money;
    savingBasis?: { money?: Money };
    savings?: { money?: Money; percentage?: number };
  };
};

let accessToken: { value: string; expiresAt: number } | null = null;

function json(body: unknown, status = 200, cacheControl = "no-store"): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
      "X-Robots-Tag": "noindex, nofollow",
    },
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

  const payload = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!payload.access_token) throw new Error("Amazon OAuth token absent");
  accessToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(300, payload.expires_in || 3600) * 1000,
  };
  return accessToken.value;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env, request }) => {
  const asin = String(params.asin || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(asin)) return json({ error: "ASIN invalide" }, 400);
  if (!env.AMAZON_CREATOR_CREDENTIAL_ID || !env.AMAZON_CREATOR_CREDENTIAL_SECRET) {
    return json({ error: "Service temporairement indisponible" }, 503);
  }

  const cacheKey = new Request(new URL(request.url).toString(), { method: "GET" });
  const cached = await caches.default.match(cacheKey);
  if (cached) return cached;

  try {
    const token = await getAccessToken(env);
    const response = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-marketplace": "www.amazon.fr",
      },
      body: JSON.stringify({
        itemIds: [asin],
        itemIdType: "ASIN",
        marketplace: "www.amazon.fr",
        partnerTag: env.AMAZON_PARTNER_TAG || "lebrunnathali-21",
        resources: [
          "images.primary.large",
          "itemInfo.title",
          "offersV2.listings.price",
          "offersV2.listings.availability",
        ],
      }),
    });
    if (!response.ok) throw new Error(`Creators API ${response.status}`);

    const payload = (await response.json()) as {
      itemsResult?: {
        items?: Array<{
          asin?: string;
          detailPageURL?: string;
          images?: { primary?: { large?: { url?: string } } };
          itemInfo?: { title?: { displayValue?: string } };
          offersV2?: { listings?: Listing[] };
        }>;
      };
    };
    const item = payload.itemsResult?.items?.[0];
    if (!item) return json({ error: "Produit indisponible" }, 404);

    const listings = item.offersV2?.listings || [];
    const listing = listings.find((entry) => entry.isBuyBoxWinner) || listings[0];
    const money = listing?.price?.money;
    const publicResponse = json(
      {
        asin: item.asin || asin,
        title: item.itemInfo?.title?.displayValue || null,
        url: item.detailPageURL || null,
        image: item.images?.primary?.large?.url || null,
        price: money?.displayAmount || null,
        priceAmount: money?.amount ?? null,
        currency: money?.currency || "EUR",
        oldPrice: listing?.price?.savingBasis?.money?.displayAmount || null,
        savings: listing?.price?.savings?.money?.displayAmount || null,
        savingsPercent: listing?.price?.savings?.percentage ?? null,
        availability: listing?.availability?.message || null,
        inStock: listing?.availability?.type === "IN_STOCK",
        checkedAt: new Date().toISOString(),
      },
      200,
      "public, max-age=3600, s-maxage=21600, stale-while-revalidate=300",
    );
    await caches.default.put(cacheKey, publicResponse.clone());
    return publicResponse;
  } catch (error) {
    console.error("[amazon-live-offer]", error instanceof Error ? error.message : error);
    return json({ error: "Prix Amazon momentanément indisponible" }, 502);
  }
};
