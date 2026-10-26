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
  id: "carrefour-courses20-novembre-2026",
  brandName: "Carrefour",
  merchant: "carrefour",
  badge: "Partenaire à la une",
  title: "Carrefour : 20 € de remise dès 80 € de courses",
  description:
    "À partir du 2 novembre : profitez de 20 € de remise immédiate sur votre première commande Drive, Livré Chez Vous ou Livraison Express.",
  imageSrc: "/images/articles/livraison-courses-carrefour-domicile-2026.png",
  imageAlt: "Illustration d’un camion de livraison transportant un sac de courses",
  promoCode: "COURSES20",
  promoValidityText: "Code valable du 2 au 29 novembre 2026 — nouveaux clients",
  conditionsText:
    "Offre à venir, valable du 02/11 au 29/11/2026 pour une première commande dès 80 € en Drive, Carrefour Livré Chez Vous (CLCV) ou Livraison Express (LEX), sur Carrefour.fr et l’application Carrefour. Conditions détaillées à vérifier au panier.",
  startsAt: "2026-10-26T00:00:00+01:00",
  endsAt: "2026-11-29T23:59:59+01:00",
  primaryCtaLabel: "Découvrir les courses Carrefour",
  primaryCtaHref: "/go/carrefour-courses20-novembre-2026",
  copyButtonLabel: "Copier COURSES20",
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
