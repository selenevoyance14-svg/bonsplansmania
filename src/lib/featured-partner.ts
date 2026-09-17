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
  title: "Prozis : -25 % sur deux duos whey + créatine",
  description:
    "Avec BONSMANIA, profitez de -25 % sur les duos Clear Whey + Collagen ou Supreme Whey avec créatine MicronPure. Vérifiez la remise dans le panier.",
  imageSrc: "/images/articles/prozis-duo-clear-whey-collagene-creatine-25-pourcent-septembre-2026.webp",
  imageAlt:
    "Prozis Clear Whey plus Collagen et créatine MicronPure avec 25 pour cent de réduction grâce au code BONSMANIA",
  promoCode: "BONSMANIA",
  promoValidityText: "Offre repérée le 17 septembre 2026",
  conditionsText:
    "Valable sur les deux duos indiqués par Prozis. Prix, variantes et disponibilité à vérifier dans le panier ; cumul non confirmé.",
  startsAt: "2026-09-17T00:00:00+02:00",
  endsAt: "2026-09-24T23:59:59+02:00",
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
