export type SolarGuideProduct = {
  brand: string;
  name: string;
  spf: string;
  price: string;
  checkedAt: string;
  referencePrice?: string;
  savings?: string;
  conditions?: string;
  usages: string[];
  skinTypes: string[];
  format: string;
  image: string;
  imageAlt: string;
  articleHref: string;
  merchantHref: string;
};

// Prix revus le 26 novembre 2026 ; références Amazon issues de l’API du site.
export const SOLAR_GUIDE_2026: SolarGuideProduct[] = [
  {
    brand: "Beauty of Joseon",
    name: "Relief Sun Rice & Probiotics",
    spf: "SPF 50+ PA++++",
    price: "Prix à vérifier",
    checkedAt: "26 novembre 2026",
    conditions: "La page consultée est configurée pour une livraison en Espagne : tarif France non confirmé.",
    usages: ["Visage", "K-Beauty"],
    skinTypes: ["Peau normale à sèche", "Peau sensible"],
    format: "Crème visage",
    image: "/images/articles/beauty-of-joseon-relief-sun-creme-solaire-yesstyle-2026.png",
    imageAlt: "Crème solaire Beauty of Joseon Relief Sun SPF 50+",
    articleHref: "/article/beauty-of-joseon-relief-sun-creme-solaire-yesstyle-2026",
    merchantHref: "/go/beauty-of-joseon-relief-sun-creme-solaire-yesstyle-2026",
  },
  {
    brand: "Bioregena",
    name: "Crème solaire bébé bio",
    spf: "SPF 50+",
    price: "Prix à vérifier",
    checkedAt: "26 novembre 2026",
    conditions: "Le prix actuel et le stock n’ont pas pu être confirmés sur la fiche marchande.",
    usages: ["Bébé et enfant", "Visage et corps"],
    skinTypes: ["Peau sensible", "Peau de bébé"],
    format: "40 ml · dès 6 mois",
    image: "/images/articles/bon-plan-lea-nature-bioregena-creme-solaire-bebe-spf50-40ml-10-euros-juillet-2026.png",
    imageAlt: "Crème solaire bébé Bioregena bio SPF 50",
    articleHref: "/article/bon-plan-lea-nature-bioregena-creme-solaire-bebe-spf50-40ml-10-euros-juillet-2026",
    merchantHref: "/go/bon-plan-lea-nature-bioregena-creme-solaire-bebe-spf50-40ml-10-euros-juillet-2026",
  },
  {
    brand: "CeraVe",
    name: "Lait solaire invisible hydratant",
    spf: "SPF 50+",
    price: "10,50 €",
    checkedAt: "26 novembre 2026",
    conditions: "Prix API Amazon, en stock au relevé. Vendeur et frais de livraison à vérifier. Référence de prix : nature non précisée par l’API.",
    usages: ["Visage et corps"],
    skinTypes: ["Peau sensible", "Peau normale à sèche"],
    format: "Lait visage et corps",
    image: "/images/articles/bon-plan-amazon-cerave-lait-solaire-invisible-spf50-2026.webp",
    imageAlt: "Lait solaire invisible hydratant CeraVe SPF 50+",
    articleHref: "/article/bon-plan-amazon-cerave-lait-solaire-invisible-spf50-2026",
    merchantHref: "/go/bon-plan-amazon-cerave-lait-solaire-invisible-spf50-2026",
  },
  {
    brand: "Clinique",
    name: "Émulsion Hydratante Tellement Différente",
    spf: "SPF 50",
    price: "18,55 €",
    checkedAt: "26 novembre 2026",
    referencePrice: "19,53 €",
    savings: "0,98 € d’économie",
    conditions: "Prix API Amazon, en stock au relevé. Vendeur et frais de livraison à vérifier. Référence de prix : nature non précisée par l’API.",
    usages: ["Visage"],
    skinTypes: ["Peau normale à sèche"],
    format: "75 ml",
    image: "/images/articles/amazon-clinique-emulsion-hydratante-spf50-2026.png",
    imageAlt: "Émulsion hydratante Clinique SPF 50 de 75 ml",
    articleHref: "/article/bon-plan-amazon-clinique-emulsion-hydratante-spf50-2026",
    merchantHref: "/go/bon-plan-amazon-clinique-emulsion-hydratante-spf50-2026",
  },
  {
    brand: "Corine de Farme",
    name: "Crème solaire au monoï",
    spf: "SPF 50",
    price: "5,54 €",
    checkedAt: "26 novembre 2026",
    referencePrice: "6,60 €",
    savings: "1,06 € d’économie",
    conditions: "Prix API Amazon, en stock au relevé. Vendeur et frais de livraison à vérifier. Référence de prix : nature non précisée par l’API.",
    usages: ["Visage et corps"],
    skinTypes: ["Toute la famille"],
    format: "50 ml",
    image: "/images/articles/bp-corine-de-farme-creme-solaire-visage-corps-spf50-monoi.png",
    imageAlt: "Crème solaire Corine de Farme visage et corps SPF 50 au monoï",
    articleHref: "/article/bon-plan-amazon-corine-de-farme-creme-solaire-visage-corps-spf50-monoi-2026",
    merchantHref: "/go/bon-plan-amazon-corine-de-farme-creme-solaire-visage-corps-spf50-monoi-2026",
  },
  {
    brand: "ISDIN",
    name: "FotoUltra Active Unify",
    spf: "SPF 50+",
    price: "21,90 €",
    checkedAt: "26 novembre 2026",
    conditions: "Prix API Amazon, en stock au relevé. Vendeur et frais de livraison à vérifier. Référence de prix : nature non précisée par l’API.",
    usages: ["Visage"],
    skinTypes: ["Taches pigmentaires", "Peau normale à sèche"],
    format: "50 ml",
    image: "/images/articles/bon-plan-amazon-isdin-fotoultra-active-unify-spf50-2026.webp",
    imageAlt: "Protection solaire visage ISDIN FotoUltra Active Unify SPF 50+",
    articleHref: "/article/bon-plan-amazon-isdin-fotoultra-active-unify-spf50-2026",
    merchantHref: "/go/bon-plan-amazon-isdin-fotoultra-active-unify-spf50-2026",
  },
  {
    brand: "ISDIN",
    name: "Fusion Fluid matifiant",
    spf: "SPF 50+",
    price: "31,55 €",
    checkedAt: "26 novembre 2026",
    conditions: "Prix API Amazon, en stock au relevé. Vendeur et frais de livraison à vérifier. Référence de prix : nature non précisée par l’API.",
    usages: ["Visage"],
    skinTypes: ["Peau mixte à grasse"],
    format: "50 ml",
    image: "/images/articles/bon-plan-amazon-isdin-fusion-fluid-spf50-2026.webp",
    imageAlt: "Protection solaire visage ISDIN Fusion Fluid SPF 50+",
    articleHref: "/article/bon-plan-amazon-isdin-fusion-fluid-spf50-2026",
    merchantHref: "/go/bon-plan-amazon-isdin-fusion-fluid-spf50-2026",
  },
  {
    brand: "Nivea",
    name: "Sun Protect & Hydrate Kids spray coloré",
    spf: "SPF 50+",
    price: "8,50 €",
    checkedAt: "26 novembre 2026",
    referencePrice: "9,28 €",
    savings: "0,78 € d’économie",
    conditions: "Prix API Amazon, en stock au relevé. Vendeur et frais de livraison à vérifier. Référence de prix : nature non précisée par l’API.",
    usages: ["Bébé et enfant", "Visage et corps"],
    skinTypes: ["Peau sensible", "Toute la famille"],
    format: "Spray 200 ml",
    image: "/images/articles/bon-plan-amazon-nivea-sun-kids-spf50-spray-704-euros-aout-2026.png",
    imageAlt: "Spray solaire Nivea Sun Kids SPF 50+ pour enfant",
    articleHref: "/article/bon-plan-amazon-nivea-sun-kids-spf50-spray-704-euros-aout-2026",
    merchantHref: "/go/bon-plan-amazon-nivea-sun-kids-spf50-spray-704-euros-aout-2026",
  },
];
