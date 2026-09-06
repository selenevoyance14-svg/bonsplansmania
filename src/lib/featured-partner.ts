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
  title: "Prozis : jusqu’à 50 % de réduction",
  description:
    "Profitez des offres Prozis sur une sélection de nutrition sportive, bien-être, vêtements et accessoires, avec des réductions pouvant atteindre 50 %.",
  imageSrc: "/images/featured-partner-prozis-50-v2.webp",
  imageAlt:
    "Prozis jusqu’à 50 % de réduction sur la nutrition sportive et les accessoires",
  promoCode: "IMBACK",
  promoValidityText: "Offres consultées le 6 septembre 2026",
  conditionsText:
    "Réductions variables selon les produits et les périodes. Prix et disponibilité susceptibles d’évoluer sur Prozis.",
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
