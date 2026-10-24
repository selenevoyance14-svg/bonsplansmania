"use client";

import { useEffect, useState } from "react";
import { extractPriceAmount, parsePrice } from "@/lib/price";
import { formatCardTitle } from "@/lib/display-title";
import styles from "./refonte.module.css";

type Offer = { price?: string; oldPrice?: string };
const requests = new Map<string, Promise<Offer | null>>();
function loadOffer(asin: string) {
  let request = requests.get(asin);
  if (!request) {
    request = fetch(`/api/amazon/${encodeURIComponent(asin)}`)
      .then(r => r.ok ? r.json() as Promise<Offer> : null).catch(() => null);
    requests.set(asin, request);
  }
  return request;
}

export default function HomeOfferPrice({ asin, price, originalPrice, title, mode }: {
  asin?: string; price?: string; originalPrice?: string; title?: string; mode: "title" | "price";
}) {
  const [live, setLive] = useState<Offer | null>(null);
  useEffect(() => {
    let active = true;
    setLive(null);
    if (asin) loadOffer(asin).then(value => { if (active) setLive(value); });
    return () => { active = false; };
  }, [asin]);
  const now = parsePrice(live?.price || price).now;
  const before = live?.price ? live.oldPrice : originalPrice || parsePrice(price).was;
  const amount = extractPriceAmount(now);
  const oldAmount = extractPriceAmount(before);
  const validBefore = amount !== undefined && oldAmount !== undefined && oldAmount > amount;
  if (mode === "title") {
    const base = formatCardTitle(title || "").replace(/\s+au lieu de\s+\d[\d\s\u00a0\u202f]*(?:[.,]\d{1,2})?\s*(?:€|euros?)(?:\s*\([^)]*\))?/i, "");
    if (!now) return <>{base}</>;
    const titlePrice = amount === undefined ? now : `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(amount)} €`;
    // Keep the current amount in the title, including titles shortened by the card formatter.
    const display = /€|\beuros?\b/i.test(base)
      ? base.replace(/\d[\d\s\u00a0\u202f]*(?:[.,]\d{1,2})?\s*(?:€|euros?)/i, titlePrice)
      : `${base.replace(/…$/, "")} ${/^dès\b/i.test(now) ? "dès" : "à"} ${titlePrice}`;
    return <>{display}{validBefore ? ` au lieu de ${before}` : ""}</>;
  }
  return <>
    <strong>{now || price || "Voir le bon plan"}</strong>
    {validBefore && <span className={styles.priceComparison}><del>{before}</del><span>−{Math.round((oldAmount - amount) / oldAmount * 100)}%</span></span>}
  </>;
}
