import { isAuthenticated, json, sameOrigin, type AdminEnv } from "./_auth";

type Env = AdminEnv & {
  AMAZON_CREATOR_CREDENTIAL_ID: string;
  AMAZON_CREATOR_CREDENTIAL_SECRET: string;
  AMAZON_CREATOR_CREDENTIAL_VERSION?: string;
  AMAZON_PARTNER_TAG?: string;
};

type RequestedDeal = { slug?: string; asin?: string };
type AmazonListing = {
  isBuyBoxWinner?: boolean;
  availability?: { message?: string; type?: string };
  price?: {
    money?: { amount?: number; currency?: string; displayAmount?: string };
    savingBasis?: { money?: { amount?: number; displayAmount?: string } };
    savings?: { percentage?: number };
  };
};

let accessToken: { value: string; expiresAt: number } | null = null;

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
  if (!payload.access_token) throw new Error("Jeton Amazon absent");
  accessToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(300, payload.expires_in || 3600) * 1000,
  };
  return accessToken.value;
}

function inStock(listing: AmazonListing | undefined): boolean {
  if (listing?.availability?.type === "IN_STOCK") return true;
  const message = listing?.availability?.message || "";
  if (/indisponible|rupture|pas en stock/i.test(message)) return false;
  return Boolean(listing?.price?.money?.amount);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!sameOrigin(request)) return json({ error: "Requête refusée." }, 403);
  if (!await isAuthenticated(request, env)) return json({ error: "Connexion administrateur requise." }, 401);
  if (!env.AMAZON_CREATOR_CREDENTIAL_ID || !env.AMAZON_CREATOR_CREDENTIAL_SECRET) {
    return json({ error: "L’API Amazon n’est pas configurée." }, 503);
  }

  const body = await request.json<{ deals?: RequestedDeal[] }>().catch(() => null);
  const deals = Array.isArray(body?.deals)
    ? body.deals.flatMap((deal) => {
      const slug = String(deal.slug || "").trim();
      const asin = String(deal.asin || "").trim().toUpperCase();
      return /^[a-z0-9-]{3,180}$/.test(slug) && /^[A-Z0-9]{10}$/.test(asin) ? [{ slug, asin }] : [];
    }).slice(0, 50)
    : [];
  if (!deals.length) return json({ error: "Aucun produit Amazon valide à analyser." }, 400);

  try {
    const token = await getAccessToken(env);
    const chunks = Array.from({ length: Math.ceil(deals.length / 10) }, (_, index) => deals.slice(index * 10, index * 10 + 10));
    const pages = [];
    for (const chunk of chunks) {
      const response = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-marketplace": "www.amazon.fr",
        },
        body: JSON.stringify({
          itemIds: chunk.map((deal) => deal.asin),
          itemIdType: "ASIN",
          marketplace: "www.amazon.fr",
          partnerTag: env.AMAZON_PARTNER_TAG || "lebrunnathali-21",
          resources: ["itemInfo.title", "offersV2.listings.price", "offersV2.listings.availability"],
        }),
      });
      if (!response.ok) throw new Error(`Creators API ${response.status}`);
      pages.push(await response.json<{
        itemsResult?: { items?: Array<{
          asin?: string;
          itemInfo?: { title?: { displayValue?: string } };
          offersV2?: { listings?: AmazonListing[] };
        }> };
      }>());
    }

    const checkedAt = new Date().toISOString();
    const slugsByAsin = new Map(deals.map((deal) => [deal.asin, deal.slug]));
    const items = pages.flatMap((page) => page.itemsResult?.items || []).flatMap((item) => {
      const asin = item.asin?.toUpperCase();
      if (!asin || !slugsByAsin.has(asin)) return [];
      const listings = item.offersV2?.listings || [];
      const listing = listings.find((entry) => entry.isBuyBoxWinner) || listings[0];
      return [{
        slug: slugsByAsin.get(asin),
        asin,
        title: item.itemInfo?.title?.displayValue || null,
        price: listing?.price?.money?.displayAmount || null,
        priceAmount: listing?.price?.money?.amount ?? null,
        referencePrice: listing?.price?.savingBasis?.money?.displayAmount || null,
        referencePriceAmount: listing?.price?.savingBasis?.money?.amount ?? null,
        savingsPercent: listing?.price?.savings?.percentage ?? null,
        availability: listing?.availability?.message || null,
        inStock: inStock(listing),
        checkedAt,
      }];
    });
    return json({ items, checkedAt, requested: deals.length, received: items.length });
  } catch (error) {
    console.error(JSON.stringify({ event: "admin-amazon-scan-error", message: error instanceof Error ? error.message : "unknown" }));
    return json({ error: "L’analyse Amazon est momentanément indisponible." }, 502);
  }
};
