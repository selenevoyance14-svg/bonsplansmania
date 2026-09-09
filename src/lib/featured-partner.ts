export type FeaturedPartnerTheme = {
  background: string;
  border: string;
  primary: string;
  text: string;
  secondaryText: string;
};

export type FeaturedPartnerConfig = {
  active: boolean;
  id: string;
  brandName: string;
  merchant: string;
  badge: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  promoCode: string;
  promoValidityText: string;
  conditionsText: string;
  startsAt: string;
  endsAt: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  copyButtonLabel: string;
  theme: FeaturedPartnerTheme;
};

export const FEATURED_PARTNER: FeaturedPartnerConfig = {
  active: true,
  id: "prozis",
  brandName: "Prozis",
  merchant: "prozis",
  badge: "PARTENAIRE À LA UNE",
  title: "Prozis : 2 achetés + 1 gratuit avec BONSMANIA",
  description:
    "Achetez 2 produits éligibles et recevez 1 pack gratuit, ou profitez du 2+1 sur une sélection de vêtements avec notre code BONSMANIA.",
  imageSrc: "/images/featured-partner-prozis-2-plus-1-v2.webp",
  imageAlt:
    "Prozis deux produits achetés et un pack gratuit avec le code BONSMANIA",
  promoCode: "BONSMANIA",
  promoValidityText: "Offre consultée le 8 septembre 2026",
  conditionsText:
    "Valable sur les sélections indiquées par Prozis, dans la limite des stocks. Vérifiez l’ajout du cadeau dans le panier.",
  startsAt: "2026-09-08T00:00:00+02:00",
  endsAt: "2026-12-31T23:59:59+01:00",
  primaryCtaLabel: "Voir l’offre Prozis",
  primaryCtaHref: "https://prozis.com/1YlNV",
  copyButtonLabel: "Copier BONSMANIA",
  theme: {
    background: "#FFFBEA",
    border: "#F2CC45",
    primary: "#111827",
    text: "#111827",
    secondaryText: "#475569",
  },
};

export function isFeaturedPartnerActive(
  partner: FeaturedPartnerConfig,
  referenceDate: Date,
): boolean {
  if (!partner.active) return false;

  const referenceTime = referenceDate.getTime();
  const startTime = Date.parse(partner.startsAt);
  const endTime = Date.parse(partner.endsAt);

  if (
    !Number.isFinite(referenceTime) ||
    !Number.isFinite(startTime) ||
    !Number.isFinite(endTime)
  ) {
    return false;
  }

  return referenceTime >= startTime && referenceTime <= endTime;
}
