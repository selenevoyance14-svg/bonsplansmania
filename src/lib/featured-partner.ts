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
  id: "clicsitepro",
  brandName: "ClicSitePro",
  merchant: "clicsitepro",
  badge: "PARTENAIRE À LA UNE",
  title: "ClicSitePro",
  description:
    "Un site vitrine professionnel, clair et adapté au téléphone pour présenter votre activité et recevoir davantage de demandes.",
  imageSrc: "/images/featured-partner-clicsitepro.webp",
  imageAlt:
    "Présentation officielle de ClicSitePro, créateur de sites vitrines professionnels",
  promoCode: "",
  promoValidityText: "",
  conditionsText:
    "Site seul à partir de 299 € : prix fixe et sans abonnement obligatoire.",
  startsAt: "2026-08-15T00:00:00+02:00",
  endsAt: "2027-12-31T23:59:59+01:00",
  primaryCtaLabel: "Découvrir ClicSitePro",
  primaryCtaHref: "https://clicsitepro.fr/",
  copyButtonLabel: "",
  theme: {
    background: "#F4F1EA",
    border: "#D7CDBB",
    primary: "#8B263F",
    text: "#1D1A17",
    secondaryText: "#5E574E",
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
