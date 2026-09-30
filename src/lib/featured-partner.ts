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
  id: "carrefour-bingo20",
  brandName: "Carrefour",
  merchant: "carrefour",
  badge: "PARTENAIRE À LA UNE",
  title: "Carrefour : 20 € offerts dès 80 € de courses",
  description:
    "Pour une première commande Carrefour Drive, Livré Chez Vous ou Livraison Express, profitez de 20 € de remise immédiate dès 80 € d'achat avec le code BINGO20.",
  imageSrc: "/images/partenaires/carrefour-bingo20.svg",
  imageAlt:
    "Carrefour offre 20 euros dès 80 euros sur une première commande avec le code BINGO20",
  promoCode: "BINGO20",
  promoValidityText: "Valable jusqu’au 1er novembre 2026 inclus",
  conditionsText:
    "Offre valable une seule fois par utilisateur, dès 80 € hors remises immédiates, sacs consignés et frais de livraison. Hors Maison & Loisirs et Marketplace. Non cumulable.",
  startsAt: "2026-09-30T00:00:00+02:00",
  endsAt: "2026-11-01T23:59:59+01:00",
  primaryCtaLabel: "Faire mes courses chez Carrefour",
  primaryCtaHref: "/go/carrefour-bingo20",
  copyButtonLabel: "Copier BINGO20",
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
