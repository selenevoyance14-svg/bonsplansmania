const ADSENSE_LINE = "google.com, pub-5064203547863113, DIRECT, f08c47fec0942fa0";

const RESPONSE_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
  "X-Ads-Txt-Source": "adsense",
};

type AdsTxtContext = {
  request: Request;
  waitUntil(promise: Promise<unknown>): void;
};

export async function serveAdsTxt(_context: AdsTxtContext): Promise<Response> {
  return new Response(`${ADSENSE_LINE}\n`, { headers: RESPONSE_HEADERS });
}
