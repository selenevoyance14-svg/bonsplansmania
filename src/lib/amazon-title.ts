/** Coupon prices are editorial calculations, not the standard Amazon buy-box price. */
export function canUseLiveAmazonTitle(category: string, text: string): boolean {
  return ["bon-plan", "bon-plan-beaute", "calendrier-avent", "calendrier"].includes(category)
    && !/à\s+partir\s+de|coupon|code\s+promo|avec\s+(?:le\s+)?code|abonnement|prévoyez|économisez/i.test(text);
}

export function updateAmazonTitle(title: string, price?: string | null): string {
  if (!price || !/\d/.test(price) || !/€/.test(price)) return title;
  const money = /\d[\d\s\u00a0\u202f]*(?:[.,]\d{1,2})?\s*(?:€|euros?)/i;
  // Never replace an arbitrary price in an editorial comparison or a multi-product selection.
  const current = title.replace(/\s+au lieu (?:de|du prix conseillé de)\s+\d[\d\s\u00a0\u202f]*(?:[.,]\d{1,2})?\s*(?:€|euros?)/gi, "")
    .replace(/\s*\(?[−-]?\d+\s*%\s*(?:de\s+(?:réduction|remise))?\)?/gi, "")
    .replace(/\s*:\s*$/, "").trim();
  if ((current.match(new RegExp(money.source, "gi")) || []).length > 1) return title;
  return money.test(current) ? current.replace(money, price.replace(/\u00a0|\u202f/g, " ")) : `${current.replace(/…$/, "")} à ${price}`;
}
