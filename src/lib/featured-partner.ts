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
  id: "carrefour-jouets-noel-20-pourcent-2026",
  brandName: "Carrefour",
  merchant: "carrefour",
  badge: "PARTENAIRE À LA UNE",
  title: "Carrefour : jusqu’à 20 % d’économies sur les jouets de Noël",
  description:
    "Préparez Noël avec jusqu’à 20 % d’économies Club Carrefour sur une sélection de jouets participants.",
  imageSrc: "/images/partenariats/exemple-carrefour-jouets-noel-2026.webp",
  imageAlt:
    "Carrefour propose jusqu’à 20 % d’économies Club Carrefour sur une sélection de jouets de Noël",
  promoCode: "CLUB CARREFOUR",
  promoValidityText: "Offre valable sur une sélection de jouets de Noël participants",
  conditionsText:
    "Avantage réservé aux détenteurs de la Carte Club Carrefour sur les références participantes, selon les conditions affichées par Carrefour et dans la limite des stocks disponibles.",
  startsAt: "2026-10-16T00:00:00+02:00",
  endsAt: "2026-12-24T23:59:59+01:00",
  primaryCtaLabel: "Voir les jouets de Noël",
  primaryCtaHref: "/go/carrefour-jouets-noel-20-pourcent-2026",
  copyButtonLabel: "Voir l’offre Club Carrefour",
  theme: {
    background: "#FFF4F4",
    border: "#E30613",
    primary: "#0050AA",
    text: "#14213D",
    secondaryText: "#4B5563",
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
