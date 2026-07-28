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
  id: "cosmechic",
  brandName: "Cosmechic",
  merchant: "cosmechic",
  badge: "PARTENAIRE À LA UNE",
  title: "Cosmechic à la une",
  description:
    "Découvrez Cosmechic et profitez de −10 % avec le code promo BPM10, valable jusqu’au 20 octobre 2026.",
  imageSrc: "/images/featured-partner-cosmechic-v2.png",
  imageAlt:
    "Sélection de maquillage avec poudre, rouge à lèvres, vernis, pinceau et crayon",
  promoCode: "BPM10",
  promoValidityText: "Valable jusqu’au 20 octobre 2026",
  conditionsText: "Conditions applicables sur le site Cosmechic.",
  startsAt: "2026-07-28T00:00:00+02:00",
  endsAt: "2026-10-20T23:59:59+02:00",
  primaryCtaLabel: "Découvrir Cosmechic",
  primaryCtaHref: "/go/cosmechic-accueil",
  copyButtonLabel: "Copier BPM10",
  theme: {
    background: "#FFF6F9",
    border: "#F3A6C1",
    primary: "#BE185D",
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
