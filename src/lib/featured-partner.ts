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
  title: "Prozis : jusqu'à -40 % sur la créatine et le collagène",
  description:
    "Avec le code IMBACK, profitez de jusqu'à 40 % de réduction sur les catégories Créatine et Collagène. Le montant varie selon les produits éligibles.",
  imageSrc: "/images/articles/prozis-creatine-collagene-40-pourcent-imback-septembre-2026.png",
  imageAlt:
    "Offre Prozis jusqu'à 40 pour cent sur les catégories créatine et collagène avec le code IMBACK",
  promoCode: "IMBACK",
  promoValidityText: "Offre vérifiée le 21 septembre 2026",
  conditionsText:
    "Remise variable sur les références éligibles des catégories Créatine et Collagène. Durée non précisée par Prozis ; disponibilité et réduction finale à vérifier dans le panier.",
  startsAt: "2026-09-21T00:00:00+02:00",
  endsAt: "2026-09-24T23:59:59+02:00",
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
