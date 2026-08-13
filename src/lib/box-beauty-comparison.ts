export type AffiliatePosition = "hero" | "tableau" | "section" | "verdict";

export type BoxBeautyComparisonItem = {
  name: string;
  merchant: string;
  price: string;
  engagement: string;
  formats: string;
  idealFor: string;
  offerName: string;
  affiliateUrl: string;
  advantages: string[];
  disadvantages: string[];
  profile: string;
  verdict: string;
};

// Données reprises du comparatif et de liens affiliés déjà présents dans le projet.
// Aucun prix ni avantage n'est récupéré dynamiquement.
export const BOX_BEAUTY_COMPARISON: BoxBeautyComparisonItem[] = [
  {
    name: "Biotyfull Box",
    merchant: "Biotyfull Box",
    price: "19,90 €",
    engagement: "Avec ou sans engagement",
    formats: "Formats vente",
    idealFor: "Bio et Made in France",
    offerName: "Offre actuelle Biotyfull Box",
    affiliateUrl: "https://xno.biotyfullbox.fr/?P51362157CD2D1D1&redir=https%3A%2F%2Fwww.biotyfullbox.fr%2F",
    advantages: ["Produits naturels ou bio", "Formats vente", "Marques françaises"],
    disadvantages: ["Certaines formules impliquent un engagement"],
    profile: "Pour celles qui privilégient les grands formats et une sélection française.",
    verdict: "Le choix le plus cohérent pour le bio et les produits en format vente.",
  },
  {
    name: "Blissim",
    merchant: "Blissim",
    price: "18,90 €",
    engagement: "Sans engagement",
    formats: "Miniatures + full-size",
    idealFor: "Petit budget et débutantes",
    offerName: "Offre actuelle Blissim",
    affiliateUrl: "https://tidd.ly/3TxbBY7",
    advantages: ["Prix accessible", "Marques connues et découvertes", "Formule flexible"],
    disadvantages: ["Davantage de miniatures que les box full-size"],
    profile: "Pour découvrir le principe des box beauté avec un budget contenu.",
    verdict: "La porte d'entrée la plus simple pour tester une box généraliste.",
  },
  {
    name: "Glowria",
    merchant: "Glowria",
    price: "Dès 16,50 €",
    engagement: "Avec ou sans engagement",
    formats: "Formats vente majoritaires",
    idealFor: "Skincare et marques tendance",
    offerName: "Offre actuelle Glowria",
    affiliateUrl: "https://glowria.com/?ae=487",
    advantages: ["Sélection orientée soin", "Marques indépendantes", "Formats vente majoritaires"],
    disadvantages: ["Budget mensuel plus élevé"],
    profile: "Pour celles qui aiment les routines de soin et les marques moins classiques.",
    verdict: "La plus adaptée à la découverte skincare premium.",
  },
  {
    name: "Lookfantastic",
    merchant: "Lookfantastic",
    price: "Environ 19 €",
    engagement: "Sans engagement",
    formats: "Mix selon l'édition",
    idealFor: "Marques internationales",
    offerName: "Offre actuelle Lookfantastic",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2F",
    advantages: ["Marques internationales", "Sélections variées", "Découvertes difficiles à trouver en France"],
    disadvantages: ["Contenu et formats variables selon l'édition"],
    profile: "Pour sortir des marques françaises habituelles.",
    verdict: "Le meilleur choix pour explorer les marques internationales.",
  },
  {
    name: "L'Arôma Box",
    merchant: "L'Arôma Box",
    price: "19,90 €",
    engagement: "Avec engagement",
    formats: "Huiles en format vente",
    idealFor: "Aromathérapie et bien-être",
    offerName: "Offre actuelle L'Arôma Box",
    affiliateUrl: "https://www.laromabox.fr/?ref=lqrriten",
    advantages: ["Positionnement aromathérapie", "Guide d'utilisation", "Produits bien-être"],
    disadvantages: ["Univers plus spécialisé", "Engagement indiqué dans le comparatif"],
    profile: "Pour les amatrices d'huiles essentielles et de routines bien-être.",
    verdict: "La box la plus spécialisée en aromathérapie.",
  },
  {
    name: "Prescription Lab",
    merchant: "Prescription Lab",
    price: "23,90 €",
    engagement: "Sans engagement",
    formats: "Selon l'édition",
    idealFor: "Curation premium",
    offerName: "Offre actuelle Prescription Lab",
    affiliateUrl: "https://c3po.link/QuYcAWjfpD",
    advantages: ["Curation soignée", "Marques tendance", "Présentation premium"],
    disadvantages: ["Prix supérieur aux box d'entrée de gamme"],
    profile: "Pour celles qui accordent de l'importance à la curation et à la présentation.",
    verdict: "Une option premium équilibrée pour se faire plaisir.",
  },
  {
    name: "My Beauty Factory",
    merchant: "My Beauty Factory",
    price: "39,90 €",
    engagement: "Achat ponctuel",
    formats: "8 produits + 1 accessoire",
    idealFor: "Box magazines sans abonnement",
    offerName: "Box Beauté Solaire Marie Claire",
    affiliateUrl: "https://fnty.co/c/r-kwGfHbPg",
    advantages: ["Achat ponctuel", "Édition limitée", "Sélection estivale vérifiée le 31 juillet 2026"],
    disadvantages: ["Disponibilité variable selon les éditions"],
    profile: "Pour acheter une box occasionnellement sans gérer d'abonnement.",
    verdict: "Le choix le plus flexible pour une box ponctuelle sans abonnement.",
  },
  {
    name: "Belle au Naturel",
    merchant: "Belle au Naturel",
    price: "19,90 à 29,90 €",
    engagement: "Sans engagement",
    formats: "Formats vente",
    idealFor: "Bio et marques françaises",
    offerName: "Offre actuelle Belle au Naturel",
    affiliateUrl: "https://wkl.belleaunaturel.fr/click-9693-2623?clickid=&subid=belle-au-naturel-box-beaute-bio-juillet-2026",
    advantages: ["Soins bio", "Formats vente", "Marques françaises indépendantes"],
    disadvantages: ["Sélection plus ciblée que les box généralistes"],
    profile: "Pour celles qui veulent une routine bio française sans miniatures.",
    verdict: "La meilleure alternative naturelle sans engagement.",
  },
];
