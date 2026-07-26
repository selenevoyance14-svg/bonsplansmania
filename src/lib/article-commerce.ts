export const DIRECT_DEAL_CATEGORIES = new Set([
  "bon-plan",
  "bon-plan-beaute",
  "box-beaute",
  "code-promo",
  "calendrier-avent",
  "calendrier",
]);

export function isOfferExpired({
  expired,
  endDate,
}: {
  expired?: boolean;
  endDate?: string;
}): boolean {
  if (expired === true) return true;
  if (!endDate) return false;
  const endTime = new Date(`${endDate}T23:59:59`).getTime();
  return Number.isFinite(endTime) && endTime < Date.now();
}

export function hasDirectMerchantCta({
  category,
  affiliateUrl,
  expired,
  endDate,
}: {
  category: string;
  affiliateUrl?: string;
  expired?: boolean;
  endDate?: string;
}): boolean {
  return (
    DIRECT_DEAL_CATEGORIES.has(category) &&
    !isOfferExpired({ expired, endDate }) &&
    typeof affiliateUrl === "string" &&
    /^https?:\/\//i.test(affiliateUrl)
  );
}
