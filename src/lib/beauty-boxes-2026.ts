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
    commitment: "Engagement 12 mois : 448,80 € au total, livraison comprise. Prochain prélèvement annoncé le 24 novembre.",
    formulas: ["Abonnement", "Engagement 12 mois", "Offre découverte", "Bio et naturel"],
    checkedAt: "23 novembre 2026",
    image: "/images/articles/biotyfull-bulles-douceur-novembre-2026-contenu.jpg",
    imageAlt: "Biotyfull Box — Bulles de Douceur",
    articleHref: "/article/biotyfull-box-bulles-de-douceur-novembre-2026",
    merchantHref: "/go/biotyfull-box-bulles-de-douceur-novembre-2026",
  },
  {
    brand: "Blissim",
    name: "La box solidaire Camping Care",
    price: "9 € la première box avec BLACK9, puis 18,90 €/mois",
    value: "Valeur annoncée : Jusqu’à 75 €",
    contents: "5 produits en formats miniatures ou vente ; un soin selon le profil beauté.",
    commitment: "BLACK9 sans engagement ; ou BLACKYEARLY : 14,90 €/mois pendant 12 mois, puis 18,90 €/mois. Codes non cumulables, jusqu’au 30 novembre.",
    formulas: ["Abonnement","Sans engagement","Engagement 12 mois","Personnalisée"],
    checkedAt: "23 novembre 2026",
    image: "/images/articles/blissim-novembre-2026-hero.jpg",
    imageAlt: "Blissim — La box solidaire Camping Care",
    articleHref: "/article/blissim-black-friday-box-black9-blackyearly-novembre-2026",
    merchantHref: "/go/blissim-black-friday-box-black9-blackyearly-novembre-2026",
  },
  {
    brand: "LOOKFANTASTIC",
    name: "Beauty Box de novembre",
    price: "20 € en formule 1 mois · 20 €/mois en formule 1 mois ; 17 €/box en formule 12 mois",
    value: "Valeur annoncée : Plus de 65 €",
    contents: "6 produits : 4 formats standard et 2 formats voyage annoncés.",
    commitment: "Renouvellement automatique",
    formulas: ["Abonnement", "Formule 1 mois", "Formule 12 mois"],
    checkedAt: "23 novembre 2026",
    image: "/images/articles/lookfantastic-box-novembre-2026-contenu.jpg",
    imageAlt: "LOOKFANTASTIC — Beauty Box de novembre",
    articleHref: "/article/lookfantastic-beauty-box-novembre-6-produits-20-euros-2026",
    merchantHref: "/go/lookfantastic-beauty-box-novembre-6-produits-20-euros-2026",
  },
  {
    brand: "Mademoiselle Confettis",
    name: "Box fille 6-12 ans",
    price: "26,90 € la première box sans engagement, puis 35,90 €/mois",
    value: "6 produits : soins, accessoires, activité créative et gourmandise",
    contents: "Beauté, activité créative, accessoires et gourmandise",
    commitment: "6 mois : 25,90 € puis 34,40 €/mois ; 12 mois : 24,90 € puis 33,40 €/mois. Livraison offerte en France.",
    formulas: ["Abonnement", "Enfant", "Cadeau"],
    checkedAt: "23 novembre 2026",
    image: "/images/articles/mademoiselle-confettis-abonnement-box-fille-45-pourcent-soldes-juillet-2026.webp",
    imageAlt: "Box mensuelle Mademoiselle Confettis pour fille de 6 à 12 ans",
    articleHref: "/article/mademoiselle-confettis-abonnement-box-fille-45-pourcent-soldes-juillet-2026",
    merchantHref: "/go/mademoiselle-confettis-abonnement-box-fille-45-pourcent-soldes-juillet-2026",
  },
  {
    brand: "Marie Claire",
    name: "Parenthèse Bien-Être",
    price: "44,90 €",
    value: "Valeur produits annoncée : 467,60 € (pas un ancien prix du coffret)",
    contents: "11 lots beauté et wellness ; certaines références en panachage.",
    commitment: "Achat ponctuel sans abonnement ; livraison à vérifier au panier",
    formulas: ["Édition limitée", "Sans engagement"],
    checkedAt: "23 novembre 2026",
    image: "/images/articles/my-beauty-factory-box-parenthese-bien-etre-octobre-2026.jpg",
    imageAlt: "Box Marie Claire Parenthèse Bien-Être et ses produits",
    articleHref: "/article/box-marie-claire-parenthese-bien-etre-4490-octobre-2026",
    merchantHref: "/go/box-marie-claire-parenthese-bien-etre-4490-octobre-2026",
  },
  {
    brand: "Prescription Lab",
    name: "Sucreries d’hiver",
    price: "37 € calendrier + box, livraison comprise, puis 24,90 €/mois",
    value: "Valeur annoncée : 161 €",
    contents: "5 produits Sucreries d’hiver et calendrier de 24 surprises dans l’offre Black Week.",
    commitment: "Sans engagement. Résilier jusqu’au 24 novembre inclus pour éviter la box de Noël.",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte"],
    checkedAt: "23 novembre 2026",
    image: "/images/articles/prescription-lab-sucreries-hiver-2026-hero.jpg",
    imageAlt: "Prescription Lab — Sucreries d’hiver",
    articleHref: "/article/prescription-lab-black-week-calendrier-box-35-euros-novembre-2026",
    merchantHref: "/go/prescription-lab-black-week-calendrier-box-35-euros-novembre-2026",
  },
  {
    brand: "Belle au Naturel",
    name: "Box beauté bio personnalisée",
    price: "34,90 €/mois sans engagement",
    value: "Valeur produits annoncée : plus de 80 €",
    contents: "4 à 6 soins bio français en format vente",
    commitment: "29,90 €/mois avec engagement 6 mois ; relais offert en France, domicile +3 €/box. Préavis de résiliation : 10 jours.",
    formulas: ["Abonnement", "Sans engagement", "Bio", "Formats vente"],
    checkedAt: "23 novembre 2026",
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
    checkedAt: "23 novembre 2026",
    image: "/images/articles/glowria-skin-cycling-novembre-2026-hero.jpg",
    imageAlt: "Glowria — Skin Cycling – 100 % Visage",
    articleHref: "/article/glowria-box-skin-cycling-novembre-2026",
    merchantHref: "/go/glowria-box-skin-cycling-novembre-2026",
  },
];
