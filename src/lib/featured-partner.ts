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
  id: "beauty-success",
  brandName: "Beauty Success",
  merchant: "beauty-success",
  badge: "PARTENAIRE À LA UNE",
  title: "Beauty Success",
  description:
    "Profitez de −25 % sur votre parfum préféré avec le code BSPARF25, valable jusqu’au 30 août 2026.",
  imageSrc: "/images/featured-partner-beauty-success.png",
  imageAlt:
    "Sélection élégante de parfum, maquillage et soin aux couleurs corail et bordeaux",
  promoCode: "BSPARF25",
  promoValidityText: "Valable jusqu’au 30 août 2026",
  conditionsText:
    "Valable une fois par personne, hors marques point rouge, petits prix et produits déjà remisés. Offre non cumulable.",
  startsAt: "2026-07-28T00:00:00+02:00",
  endsAt: "2026-08-30T23:59:59+02:00",
  primaryCtaLabel: "Découvrir Beauty Success",
  primaryCtaHref: "/go/beauty-success-accueil",
  copyButtonLabel: "Copier BSPARF25",
  theme: {
    background: "#FFF8F6",
    border: "#F1A89B",
    primary: "#A52A46",
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
