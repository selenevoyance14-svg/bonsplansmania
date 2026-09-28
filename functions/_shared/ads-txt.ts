const MONEYTIZER_ADS_URL =
  "https://ads.themoneytizer.com/ads_txt.php?site_id=143369&id=133102";

const OWN_ADS_LINES = [
  "google.com, pub-5064203547863113, DIRECT, f08c47fec0942fa0",
];

const RESPONSE_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
};

type AdsTxtContext = {
  request: Request;
  waitUntil(promise: Promise<unknown>): void;
};

function normalizeLine(line: string): string {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return trimmed;
  if (!trimmed.includes(",")) return trimmed;
  return trimmed.split(",").map((part) => part.trim()).join(", ");
}

function mergeAdsTxt(moneytizerText: string): string {
  const lines = [...moneytizerText.split(/\r?\n/), ...OWN_ADS_LINES]
    .map(normalizeLine)
    .filter(Boolean);

  return `${Array.from(new Set(lines)).join("\n")}\n`;
}

function fallbackResponse(): Response {
  return new Response(`${OWN_ADS_LINES.join("\n")}\n`, {
    headers: {
      ...RESPONSE_HEADERS,
      "Cache-Control": "no-store, max-age=0",
      "X-Ads-Txt-Source": "adsense-fallback",
    },
  });
}

export async function serveAdsTxt(context: AdsTxtContext): Promise<Response> {
  const cacheUrl = new URL("/__moneytizer_ads_txt_cache", context.request.url);
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);

  if (cached) {
    return new Response(cached.body, {
      status: cached.status,
      headers: cached.headers,
    });
  }

  try {
    const upstream = await fetch(MONEYTIZER_ADS_URL, {
      headers: { Accept: "text/plain" },
    });
    const moneytizerText = await upstream.text();

    if (!upstream.ok || !moneytizerText.includes("themoneytizer.com,133102,DIRECT")) {
      return fallbackResponse();
    }

    const response = new Response(mergeAdsTxt(moneytizerText), {
      headers: {
        ...RESPONSE_HEADERS,
        "X-Ads-Txt-Source": "themoneytizer-auto",
      },
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch {
    return fallbackResponse();
  }
}
