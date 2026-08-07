export const DIRECT_DEAL_CATEGORIES = new Set([
  "bon-plan",
  "bon-plan-beaute",
  "box-beaute",
  "code-promo",
  "calendrier-avent",
  "calendrier",
]);

const AMAZON_PRICE_HIDDEN_SLUGS = new Set([
  "aowoka-seche-cheveux-professionnel-ionique-160000-rpm-59-99-euros-amazon-moins-54-pourcent",
  "bon-plan-amazon-bioderma-crealine-huile-micellaire-2026",
  "bon-plan-amazon-medicube-age-r-booster-pro-2026",
  "bon-plan-vivirofex-masque-collagene-hydrogel-hydratation-promo-amazon-2026",
  "bon-plan-masque-led-7-couleurs-nourished-210-euros-amazon-2026",
  "bons-plans-amazon-bebe-mai-2026-hub-puericulture",
  "guide-malin-bebe-equiper-sans-se-ruiner-2026",
]);

/** Les sélections multi-produits et quelques exceptions éditoriales ne doivent pas afficher un prix Amazon unique. */
export function shouldHideAmazonPrice(slug: string): boolean {
  return slug.startsWith("meilleurs-bons-plans-") || AMAZON_PRICE_HIDDEN_SLUGS.has(slug);
}

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
