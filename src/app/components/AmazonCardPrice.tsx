"use client";

import { useEffect, useState } from "react";

type AmazonResponse = { price?: string };

export default function AmazonCardPrice({
  asin,
  fallback = "Voir le bon plan",
}: {
  asin?: string;
  fallback?: string;
}) {
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    setPrice(undefined);
    if (!asin) return;
    const controller = new AbortController();
    fetch(`/api/amazon/${encodeURIComponent(asin)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() as Promise<AmazonResponse> : null))
      .then((offer) => setPrice(offer?.price))
      .catch(() => undefined);
    return () => controller.abort();
  }, [asin]);

  return <>{price || fallback}</>;
}
