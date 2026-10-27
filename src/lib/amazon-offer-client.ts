"use client";

import { useEffect, useState } from "react";

export type LiveAmazonOffer = { price?: string | null; oldPrice?: string | null; inStock?: boolean };
const requests = new Map<string, { expires: number; promise: Promise<LiveAmazonOffer | null> }>();

export function loadAmazonOffer(asin: string): Promise<LiveAmazonOffer | null> {
  const key = asin.toUpperCase();
  const cached = requests.get(key);
  if (cached && cached.expires > Date.now()) return cached.promise;
  const promise = fetch(`/api/amazon/${encodeURIComponent(key)}`)
    .then(response => response.ok ? response.json() as Promise<LiveAmazonOffer> : null)
    .catch(() => null);
  requests.set(key, { expires: Date.now() + 5 * 60_000, promise });
  return promise;
}

export function useAmazonOffer(asin?: string) {
  const [result, setResult] = useState<{ asin: string; offer: LiveAmazonOffer | null }>();
  useEffect(() => {
    if (!asin) return;
    let active = true;
    const refresh = () => { loadAmazonOffer(asin).then(offer => { if (active) setResult({ asin, offer }); }); };
    refresh();
    const timer = setInterval(refresh, 5 * 60_000);
    return () => { active = false; clearInterval(timer); };
  }, [asin]);
  return result && result.asin === asin ? result.offer : null;
}
