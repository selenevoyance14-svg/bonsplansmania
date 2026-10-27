"use client";

import { useAmazonOffer } from "@/lib/amazon-offer-client";
import { updateAmazonTitle } from "@/lib/amazon-title";
import { extractPriceAmount } from "@/lib/price";

export default function AmazonOfferText({ asin, title, price, oldPrice, mode = "title" }: {
  asin?: string; title?: string; price?: string; oldPrice?: string; mode?: "title" | "price";
}) {
  const live = useAmazonOffer(asin);
  const current = live?.price || price;
  if (mode === "title") return <>{updateAmazonTitle(title || "", live?.price)}</>;
  const before = live?.price ? live.oldPrice : oldPrice;
  const amount = extractPriceAmount(current);
  const previous = extractPriceAmount(before || undefined);
  return <><span>{current || "Prix sur Amazon"}</span>{amount !== undefined && previous !== undefined && previous > amount && <> <del>{before}</del></>}</>;
}
