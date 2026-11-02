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
    name: "Bulles de Douceur",
    price: "9,90 € le 1er envoi · Puis 39,90 €/mois pendant 11 mois",
    value: "Valeur annoncée : 121 € pour la box du mois",
    contents: "6 produits dans la box du mois. Offre découverte de 8 box, 49 produits au total.",
    commitment: "Engagement 12 mois",
    formulas: ["Abonnement", "Engagement 12 mois", "Offre découverte", "Bio et naturel"],
    checkedAt: "2 novembre 2026",
    image: "/images/articles/biotyfull-bulles-douceur-novembre-2026-contenu.jpg",
    imageAlt: "Biotyfull Box — Bulles de Douceur",
    articleHref: "/article/biotyfull-box-bulles-de-douceur-novembre-2026",
    merchantHref: "/go/biotyfull-box-bulles-de-douceur-novembre-2026",
  },
  {
    brand: "Blissim",
    name: "La box solidaire Camping Care",
    price: "18,90 €/mois · Vérifier les conditions de la formule et du cadeau choisis",
    value: "Valeur annoncée : Jusqu’à 75 €",
    contents: "5 produits en formats miniatures ou vente ; un soin selon le profil beauté.",
    commitment: "Engagement variable selon l’offre",
    formulas: ["Abonnement", "Personnalisée", "Offre avec cadeau"],
    checkedAt: "2 novembre 2026",
    image: "/images/articles/blissim-novembre-2026-hero.jpg",
    imageAlt: "Blissim — La box solidaire Camping Care",
    articleHref: "/article/blissim-box-automne-promod-18-90-euros-2026",
    merchantHref: "/go/blissim-box-automne-promod-18-90-euros-2026",
  },
  {
    brand: "LOOKFANTASTIC",
    name: "Beauty Box de novembre",
    price: "20 € en formule 1 mois · 20 €/mois en formule 1 mois ; 17 €/box en formule 12 mois",
    value: "Valeur annoncée : Plus de 65 €",
    contents: "6 produits : 4 formats standard et 2 formats voyage annoncés.",
    commitment: "Renouvellement automatique",
    formulas: ["Abonnement", "Formule 1 mois", "Formule 12 mois"],
    checkedAt: "2 novembre 2026",
    image: "/images/articles/lookfantastic-box-novembre-2026-contenu.jpg",
    imageAlt: "LOOKFANTASTIC — Beauty Box de novembre",
    articleHref: "/article/lookfantastic-beauty-box-novembre-6-produits-20-euros-2026",
    merchantHref: "/go/lookfantastic-beauty-box-novembre-6-produits-20-euros-2026",
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
    name: "Sucreries d’hiver",
    price: "19,90 € la 1re box · Puis 24,90 €/mois",
    value: "Valeur annoncée : 161 €",
    contents: "5 produits : cheveux, lèvres, eye-liner et bougie parfumée.",
    commitment: "Sans engagement, renouvellement automatique",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte"],
    checkedAt: "2 novembre 2026",
    image: "/images/articles/prescription-lab-sucreries-hiver-2026-hero.jpg",
    imageAlt: "Prescription Lab — Sucreries d’hiver",
    articleHref: "/article/prescription-lab-sucreries-hiver-novembre-2026",
    merchantHref: "/go/prescription-lab-sucreries-hiver-novembre-2026",
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
    name: "Skin Cycling – 100 % Visage",
    price: "16,50 € la 1re box · Puis 24,90 €/mois sans engagement, ou 19,90 €/mois avec engagement",
    value: "Valeur annoncée : 190 €",
    contents: "5 références : 4 soins visage et une brosse nettoyante.",
    commitment: "Au choix : sans engagement ou 12 mois",
    formulas: ["Abonnement", "Sans engagement", "Formats vente"],
    checkedAt: "2 novembre 2026",
    image: "/images/articles/glowria-skin-cycling-novembre-2026-hero.jpg",
    imageAlt: "Glowria — Skin Cycling – 100 % Visage",
    articleHref: "/article/glowria-box-skin-cycling-novembre-2026",
    merchantHref: "/go/glowria-box-skin-cycling-novembre-2026",
  },
];
