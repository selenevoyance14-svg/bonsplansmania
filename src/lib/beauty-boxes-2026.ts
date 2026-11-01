export type BeautyBox2026 = {
  brand: string;
  name: string;
  price: string;
  value?: string;
  contents: string;
  commitment: string;
  formulas: string[];
  checkedAt: string;
  image: string;
  imageAlt: string;
  articleHref: string;
  merchantHref: string;
};

// Données déjà publiées et vérifiées dans les articles du site.
// Chaque offre conserve sa date de constat pour éviter de présenter un prix comme permanent.
export const BEAUTY_BOXES_2026: BeautyBox2026[] = [
  {
    brand: "Biotyfull Box",
    name: "Halloweek : 4 routines",
    price: "8,90 € + 3,90 € de port au premier envoi",
    value: "Valeur annoncée : 193 € de produits",
    contents: "4 routines, avec notamment Garancia et Weleda",
    commitment: "Abonnement sans engagement · puis 39,90 € par box jusqu’à résiliation",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte", "Bio et naturel"],
    checkedAt: "28 octobre 2026",
    image: "/images/articles/biotyfull-halloweek-4-routines-2026.webp",
    imageAlt: "Les quatre routines de l’offre Halloweek Biotyfull Box",
    articleHref: "/article/biotyfull-box-halloweek-4-routines-8-90-euros-2026",
    merchantHref: "/go/biotyfull-box-halloweek-4-routines-8-90-euros-2026",
  },
  {
    brand: "Blissim",
    name: "Box beauté mensuelle",
    price: "18,90 € par mois",
    value: "Valeur annoncée : jusqu’à 79 €",
    contents: "6 produits en octobre, dont un foulard Promod exclusif",
    commitment: "Sans engagement",
    formulas: ["Abonnement", "Sans engagement"],
    checkedAt: "16 octobre 2026",
    image: "/images/articles/hub-meilleurs-bons-plans-blissim-juillet-2026-coffret-experte-boucles.webp",
    imageAlt: "Sélection de soins et coffrets beauté Blissim",
    articleHref: "/article/hub-meilleurs-bons-plans-blissim-juillet-2026-coffret-experte-boucles",
    merchantHref: "/go/hub-meilleurs-bons-plans-blissim-juillet-2026-coffret-experte-boucles",
  },
  {
    brand: "LOOKFANTASTIC",
    name: "Beauty Box d’octobre",
    price: "20 €/mois ou 17 €/mois sur 12 mois",
    value: "Valeur annoncée : plus de 85 €",
    contents: "6 essentiels beauté, dont Philip Kingsley et Avant Skincare",
    commitment: "Abonnement avec renouvellement automatique",
    formulas: ["Abonnement", "Formule 1 mois", "Formule 12 mois"],
    checkedAt: "16 octobre 2026",
    image: "/images/articles/lookfantastic-beauty-box-septembre-2026.jpg",
    imageAlt: "Beauty Box LOOKFANTASTIC de septembre 2026 et ses six produits",
    articleHref: "/article/lookfantastic-beauty-box-septembre-6-produits-20-euros-2026",
    merchantHref: "/go/lookfantastic-beauty-box-septembre-6-produits-20-euros-2026",
  },
  {
    brand: "Mademoiselle Confettis",
    name: "Box fille 6-12 ans",
    price: "35,90 €/mois sans engagement",
    value: "Valeur annoncée : +60 € par box",
    contents: "Beauté, activité créative, accessoires et gourmandise",
    commitment: "34,40 €/mois sur 6 mois · 33,40 €/mois sur 12 mois",
    formulas: ["Abonnement", "Enfant", "Cadeau"],
    checkedAt: "16 octobre 2026",
    image: "/images/articles/mademoiselle-confettis-abonnement-box-fille-45-pourcent-soldes-juillet-2026.webp",
    imageAlt: "Box mensuelle Mademoiselle Confettis pour fille de 6 à 12 ans",
    articleHref: "/article/mademoiselle-confettis-abonnement-box-fille-45-pourcent-soldes-juillet-2026",
    merchantHref: "/go/mademoiselle-confettis-abonnement-box-fille-45-pourcent-soldes-juillet-2026",
  },
  {
    brand: "Marie Claire",
    name: "Rituel Signature",
    price: "39,90 €",
    value: "Valeur produits annoncée : 473,55 €",
    contents: "9 produits grand format et 1 cabas ba&sh",
    commitment: "Achat ponctuel sans abonnement",
    formulas: ["Édition limitée", "Sans engagement"],
    checkedAt: "16 octobre 2026",
    image: "/images/articles/my-beauty-factory-rituel-signature-marie-claire-2026.jpg",
    imageAlt: "Box Marie Claire Rituel Signature avec neuf produits grand format et un cabas ba&sh",
    articleHref: "/article/my-beauty-factory-box-rituel-signature-marie-claire-3990-2026",
    merchantHref: "/go/my-beauty-factory-box-rituel-signature-marie-claire-3990-2026",
  },
  {
    brand: "Prescription Lab",
    name: "Box beauté mensuelle",
    price: "19,90 € la 1re box, puis 24,90 €/mois",
    value: "Livraison standard comprise",
    contents: "Sélection mensuelle de soins et maquillage",
    commitment: "Sans engagement · renouvellement mensuel automatique",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte"],
    checkedAt: "16 octobre 2026",
    image: "/images/articles/prescription-lab-4-routines-12-euros-octobre-2026.png",
    imageAlt: "Quatre routines Prescription Lab et douze produits pour 12 euros",
    articleHref: "/article/prescription-lab-3-nouvelles-box-16-euros-sans-engagement-juin-2026",
    merchantHref: "/go/prescription-lab-3-nouvelles-box-16-euros-sans-engagement-juin-2026",
  },
  {
    brand: "Belle au Naturel",
    name: "Box beauté bio personnalisée",
    price: "34,90 €/mois sans engagement",
    value: "Valeur annoncée : plus de 90 €",
    contents: "4 à 6 soins bio français en format vente",
    commitment: "29,90 €/mois avec engagement de 6 mois",
    formulas: ["Abonnement", "Sans engagement", "Bio", "Formats vente"],
    checkedAt: "16 octobre 2026",
    image: "/images/articles/belle-au-naturel-box-bio-parrainage-2026.webp",
    imageAlt: "Box Belle au Naturel avec plusieurs soins de beauté bio en format vente",
    articleHref: "/article/belle-au-naturel-box-beaute-bio-parrainage-2026",
    merchantHref: "/go/belle-au-naturel-box-beaute-bio-parrainage-2026",
  },

  {
    brand: "Glowria",
    name: "Box mensuelle 5 produits",
    price: "16,50 € la 1re box, puis 24,90 €/mois",
    value: "Livraison standard offerte",
    contents: "5 produits en format vente",
    commitment: "Sans engagement · formule 12 mois à 19,90 €/mois après la 1re box",
    formulas: ["Abonnement", "Sans engagement", "Formats vente"],
    checkedAt: "16 octobre 2026",
    image: "/images/articles/glowria-5-routines-15-euros-13-produits-septembre-2026.png",
    imageAlt: "Offre Glowria cinq routines et treize produits beauté pour 15 euros",
    articleHref: "/article/glowria-4-nouvelles-routines-13-euros-11-produits-349-euros",
    merchantHref: "/go/glowria-4-nouvelles-routines-13-euros-11-produits-349-euros",
  },
];
