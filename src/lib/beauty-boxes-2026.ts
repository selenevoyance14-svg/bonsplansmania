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
    brand: "Belle au Naturel",
    name: "Box beauté bio",
    price: "19,90 € avec SUMMER26",
    value: "Valeur annoncée : 81 €",
    contents: "5 soins bio en format vente",
    commitment: "Sans engagement",
    formulas: ["Abonnement", "Sans engagement", "Bio"],
    checkedAt: "1er août 2026",
    image: "/images/articles/belle-au-naturel-box-beaute-bio-juillet-2026-royer-bomoi-cultiv-coslys-acorelle.webp",
    imageAlt: "Box beauté bio Belle au Naturel avec cinq soins en format vente",
    articleHref: "/article/belle-au-naturel-box-beaute-bio-juillet-2026-royer-bomoi-cultiv-coslys-acorelle",
    merchantHref: "https://wkl.belleaunaturel.fr/click-9693-2623?clickid=&subid=belle-au-naturel-box-beaute-bio-juillet-2026",
  },
  {
    brand: "Biotyfull Box",
    name: "5 nouvelles routines",
    price: "15 € + 3,90 € de livraison",
    value: "Valeur annoncée : 278 €",
    contents: "5 routines · 18 produits",
    commitment: "Sans engagement, puis 39,90 €/mois sauf résiliation",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte", "Bio et naturel"],
    checkedAt: "26 août 2026",
    image: "https://page.biotyfullbox.fr/uploads/edito/2026-08-26-vignette-6a8dacf8ed6ba.png",
    imageAlt: "Biotyfull Box cinq nouvelles routines et dix-huit produits pour 15 euros",
    articleHref: "/article/biotyfull-box-abonnement-offre-decouverte-2026",
    merchantHref: "https://xno.biotyfullbox.fr/?P51362157CD2D1D1&redir=https%3A%2F%2Fpage.biotyfullbox.fr%2F8pour16%3Fml%3Dmail%26utm_source%3DMailing_pub%26utm_medium%3Dspeciale%26utm_campaign%3DM_allcampaigns",
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
    name: "6 routines et 15 produits",
    price: "13 € + 2,90 € de livraison",
    value: "Valeur annoncée : 310 €",
    contents: "6 routines · 15 produits dans un même colis",
    commitment: "Sans engagement, abonnement reconduit sauf résiliation",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte"],
    checkedAt: "21 août 2026",
    image: "/images/articles/glowria-offre-6-routines-13-euros-aout-2026.png",
    imageAlt: "Offre Glowria six routines beauté et quinze produits pour 13 euros",
    articleHref: "/article/glowria-6-routines-13-euros-tote-bag-ete-2026",
    merchantHref: "https://glowria.com/landing/13euros?ae=487",
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
    name: "The Box Beauté d’août",
    price: "20 €",
    value: "Valeur détaillée : 85 €",
    contents: "6 produits + 1 échantillon parfum",
    commitment: "Abonnement reconduit automatiquement",
    formulas: ["Abonnement"],
    checkedAt: "2 août 2026",
    image: "/images/articles/lookfantastic-the-box-beaute-aout-2026-spectrum-rituals-rodial-ultrasun.webp",
    imageAlt: "Box beauté LOOKFANTASTIC d'août et ses produits",
    articleHref: "/article/lookfantastic-the-box-beaute-aout-2026-spectrum-rituals-rodial-ultrasun",
    merchantHref: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fp%2Fbeauty-box%2Fla-box-beaute-d-aout-d-une-valeur-de-plus-de-80%2F12636601%2F",
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
    name: "Rituel Signature",
    price: "39,90 €",
    value: "Valeur produits annoncée : 473,55 €",
    contents: "9 produits grand format + 1 cabas ba&sh",
    commitment: "Achat ponctuel sans abonnement",
    formulas: ["Édition limitée", "Sans engagement"],
    checkedAt: "25 août 2026",
    image: "/images/articles/my-beauty-factory-rituel-signature-marie-claire-2026.jpg",
    imageAlt: "Box Marie Claire Rituel Signature avec neuf produits grand format et un cabas ba&sh",
    articleHref: "/article/my-beauty-factory-box-rituel-signature-marie-claire-3990-2026",
    merchantHref: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249991&url=https%3A%2F%2Fmybeautyfactory.fr%2Fbox%2F1467-rituel-signature-100926.html",
  },
  {
    brand: "Prescription Lab",
    name: "2 box et 10 produits",
    price: "13 € + 3,90 € de livraison",
    value: "Valeur annoncée : 286 €",
    contents: "2 box · 10 produits dans un même colis",
    commitment: "Sans engagement, abonnement reconduit sauf résiliation",
    formulas: ["Abonnement", "Sans engagement", "Offre découverte"],
    checkedAt: "21 août 2026",
    image: "/images/articles/prescription-lab-offre-2-box-13-euros-aout-2026.png",
    imageAlt: "Offre Prescription Lab deux box beauté et dix produits",
    articleHref: "/article/prescription-lab-4-box-beaute-14-euros-14-produits-aout-2026",
    merchantHref: "https://www.prescriptionlab.com/landing/2pour13?ae=10&aev=https%3A%2F%2Fwww.prescriptionlab.com%2Flanding%2F5pour15%3Fml%3Dmail%26utm_source%3DMailing_pub%26utm_medium%3Dspeciale%26utm_campaign%3DM_allcampaigns",
  },
];
