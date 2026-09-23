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
    name: "6 routines et 16 produits",
    price: "13 € + 6,90 € de livraison",
    value: "Valeur annoncée : 347 €",
    contents: "6 routines · 16 produits et accessoires",
    commitment: "Abonnement sans engagement, puis 39,90 €/mois sauf résiliation",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte", "Bio et naturel"],
    checkedAt: "14 septembre 2026",
    image: "/images/articles/biotyfull-box-6-routines-13-euros-offre-officielle.png",
    imageAlt: "Les six routines Biotyfull Box et leurs seize produits proposés pour 13 euros",
    articleHref: "/article/biotyfull-box-6-routines-13-euros-sans-engagement-juin-2026",
    merchantHref: "https://lk.gt/aQEPL",
  },
  {
    brand: "Blissim",
    name: "Box beauté mensuelle",
    price: "18,90 € par mois",
    contents: "Miniatures et produits en format vente selon le mois",
    commitment: "Sans engagement",
    formulas: ["Abonnement", "Sans engagement"],
    checkedAt: "14 juillet 2026",
    image: "/images/articles/hub-meilleurs-bons-plans-blissim-juillet-2026-coffret-experte-boucles.webp",
    imageAlt: "Sélection de soins et coffrets beauté Blissim",
    articleHref: "/article/hub-meilleurs-bons-plans-blissim-juillet-2026-coffret-experte-boucles",
    merchantHref: "https://www.awin1.com/cread.php?awinmid=15574&awinaffid=990397&ued=https%3A%2F%2Fblissim.fr%2F",
  },
  {
    brand: "Glowria",
    name: "5 routines et 13 produits",
    price: "15 € + 4,90 € de livraison",
    value: "Valeur annoncée : 211 €",
    contents: "5 routines · 13 produits dans un même colis",
    commitment: "Abonnement sans engagement, puis 24,90 €/box sauf résiliation",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte"],
    checkedAt: "14 septembre 2026",
    image: "/images/articles/glowria-5-routines-15-euros-13-produits-septembre-2026.png",
    imageAlt: "Offre Glowria cinq routines et treize produits beauté pour 15 euros",
    articleHref: "/article/glowria-4-nouvelles-routines-13-euros-11-produits-349-euros",
    merchantHref: "https://glowria.com/landing/5pour15e?ae=487",
  },
  {
    brand: "L'Arôma Box",
    name: "Box aromathérapie et bien-être",
    price: "19,90 € + dès 2,90 € de livraison avec HAPPY",
    contents: "Huiles essentielles, produits naturels et guide d’utilisation",
    commitment: "Puis dès 27,59 €/box, résiliable en 1 clic",
    formulas: ["Abonnement", "Bien-être"],
    checkedAt: "26 août 2026",
    image: "/images/articles/laroma-box-contenu-eucalyptus-2026.webp",
    imageAlt: "L'Arôma Box avec huiles essentielles et produits naturels",
    articleHref: "/article/laroma-box-aromatherapie-bien-etre-abonnement-2026",
    merchantHref: "https://www.laromabox.fr/?ref=lqrriten",
  },
  {
    brand: "LOOKFANTASTIC",
    name: "Beauty Box de septembre",
    price: "20 €",
    value: "Valeur annoncée : plus de 60 €",
    contents: "6 produits Wella, Anastasia Beverly Hills, This Works et autres",
    commitment: "Abonnement reconduit automatiquement",
    formulas: ["Abonnement"],
    checkedAt: "23 septembre 2026",
    image: "/images/articles/lookfantastic-beauty-box-septembre-2026.jpg",
    imageAlt: "Beauty Box LOOKFANTASTIC de septembre 2026 et ses six produits",
    articleHref: "/article/lookfantastic-beauty-box-septembre-6-produits-20-euros-2026",
    merchantHref: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fp%2Fbeauty-box%2Fla-beauty-box-de-septembre-d-une-valeur-de-plus-de-60%2F12636601%2F",
  },
  {
    brand: "Mademoiselle Confettis",
    name: "Box fille 6-12 ans",
    price: "Dès 33,40 € par mois",
    value: "Valeur annoncée : +60 € par box",
    contents: "Beauté, activité créative, accessoires et gourmandise",
    commitment: "Sans engagement, 6 mois ou 1 an",
    formulas: ["Abonnement", "Enfant", "Cadeau"],
    checkedAt: "25 août 2026",
    image: "/images/articles/mademoiselle-confettis-abonnement-box-fille-45-pourcent-soldes-juillet-2026.webp",
    imageAlt: "Box mensuelle Mademoiselle Confettis pour fille de 6 à 12 ans",
    articleHref: "/article/mademoiselle-confettis-abonnement-box-fille-45-pourcent-soldes-juillet-2026",
    merchantHref: "https://mademoiselleconfettis.com/pages/abonnements?ae=106",
  },
  {
    brand: "Marie Claire",
    name: "Box Sanoflore",
    price: "19 €",
    value: "Valeur produits annoncée : 82,78 €",
    contents: "5 soins visage Sanoflore en format vente",
    commitment: "Achat ponctuel sans abonnement",
    formulas: ["Édition limitée", "Sans engagement"],
    checkedAt: "8 septembre 2026",
    image: "/images/articles/bon-plan-box-marie-claire-sanoflore-22-euros-juin-2026.webp",
    imageAlt: "Box Marie Claire et Sanoflore avec cinq soins visage en format vente pour 19 euros",
    articleHref: "/article/bon-plan-box-marie-claire-sanoflore-22-euros-juin-2026",
    merchantHref: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249991&url=https%3A%2F%2Fmybeautyfactory.fr%2Fbox%2F1382-box-marie-claire-sanoflore-150626.html",
  },
  {
    brand: "Prescription Lab",
    name: "French Days : 3 box et 15 produits",
    price: "16 € + 4,90 € de livraison",
    value: "Valeur annoncée : 335 €",
    contents: "3 box · 15 produits dans un même colis",
    commitment: "Abonnement sans engagement, puis 24,90 €/box sauf résiliation",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte"],
    checkedAt: "13 septembre 2026",
    image: "/images/articles/prescription-lab-french-days-3-box-16-euros-2026.webp",
    imageAlt: "French Days Prescription Lab avec trois box et quinze produits pour 16 euros",
    articleHref: "/article/prescription-lab-french-days-3-box-15-produits-16-euros-2026",
    merchantHref: "https://www.prescriptionlab.com/landing/frenchdays?ml=mail&utm_source=Mailing_pub&utm_medium=speciale&utm_campaign=M_allcampaigns&ae=10&aev=https%3A%2F%2Fwww.prescriptionlab.com%2Flanding%2F5pour15%3Fml%3Dmail%26utm_source%3DMailing_pub%26utm_medium%3Dspeciale%26utm_campaign%3DM_allcampaigns",
  },
];
