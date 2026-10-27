"use client";

import { useAmazonOffer } from "@/lib/amazon-offer-client";
import { updateAmazonTitle } from "@/lib/amazon-title";
import { extractPriceAmount, formatPriceLabel, parsePrice } from "@/lib/price";
import { formatCardTitle } from "@/lib/display-title";
import styles from "./refonte.module.css";

export default function HomeOfferPrice({ asin, price, originalPrice, title, mode, hideReferencePriceInTitle }: {
  asin?: string; price?: string; originalPrice?: string; title?: string; mode: "title" | "price"; hideReferencePriceInTitle?: boolean;
}) {
  const live = useAmazonOffer(asin);
  const now = parsePrice(live?.price || price).now;
  const before = formatPriceLabel(live?.price ? live.oldPrice || undefined : originalPrice || parsePrice(price).was);
  const amount = extractPriceAmount(now);
  const oldAmount = extractPriceAmount(before);
  const validBefore = amount !== undefined && oldAmount !== undefined && oldAmount > amount;
  if (mode === "title") {
    // Percentage offers and labels are not monetary prices to append to a title.
    if (amount === undefined) return <>{formatCardTitle(title || "")}</>;
    const base = updateAmazonTitle(formatCardTitle(title || ""), live?.price).replace(/\s+au lieu de\s+\d[\d\s\u00a0\u202f]*(?:[.,]\d{1,2})?\s*(?:€|euros?)(?:\s*\([^)]*\))?/i, "");
    if (!now) return <>{base}</>;
    const titlePrice = amount === undefined ? now : `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount)} €`;
    // Keep the current amount in the title, including titles shortened by the card formatter.
    const display = /€|\beuros?\b/i.test(base)
      ? base.replace(/\d[\d\s\u00a0\u202f]*(?:[.,]\d{1,2})?\s*(?:€|euros?)/i, titlePrice)
      : `${base.replace(/…$/, "")} ${/^dès\b/i.test(now) ? "dès" : "à"} ${titlePrice}`;
    return <>{display}{validBefore && !hideReferencePriceInTitle ? ` au lieu de ${before}` : ""}</>;
  }
  return <>
    <strong>{now || price || "Voir le bon plan"}</strong>
    {validBefore && <span className={styles.priceComparison}><del>{before}</del><span>−{Math.round((oldAmount - amount) / oldAmount * 100)}%</span></span>}
  </>;
}
