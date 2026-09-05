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
  title: "Prozis Protein Snack x 12",
  description:
    "Le lot de 12 barres Protein Snack est affiché à 9,09 € au lieu de 12,99 €, soit 30 % de réduction.",
  imageSrc: "/images/featured-partner-prozis.webp",
  imageAlt:
    "Lot de 12 barres protéinées Prozis Protein Snack saveur biscuits et crème",
  promoCode: "IMBACK",
  promoValidityText: "Prix constaté le 5 septembre 2026",
  conditionsText:
    "Prix et disponibilité susceptibles d’évoluer. Livraison gratuite dès 29,99 € d’achat selon les conditions Prozis.",
  startsAt: "2026-09-05T00:00:00+02:00",
  endsAt: "2026-12-31T23:59:59+01:00",
  primaryCtaLabel: "Voir l’offre Prozis",
  primaryCtaHref: "https://prozis.com/1YlNV",
  copyButtonLabel: "Copier IMBACK",
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
