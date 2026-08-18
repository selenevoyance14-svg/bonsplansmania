export type SolarGuideProduct = {
  brand: string;
  name: string;
  spf: string;
  price: string;
  checkedAt: string;
  usages: string[];
  skinTypes: string[];
  format: string;
  image: string;
  imageAlt: string;
  articleHref: string;
  merchantHref: string;
};

// Prix, images et liens repris de fiches déjà vérifiées sur Bons Plans Mania.
export const SOLAR_GUIDE_2026: SolarGuideProduct[] = [
  {
    brand: "Beauty of Joseon",
    name: "Relief Sun Rice & Probiotics",
    spf: "SPF 50+ PA++++",
    price: "14,40 €",
    checkedAt: "19 juillet 2026",
    usages: ["Visage", "K-Beauty"],
    skinTypes: ["Peau normale à sèche", "Peau sensible"],
    format: "Crème visage",
    image: "/images/articles/beauty-of-joseon-relief-sun-creme-solaire-yesstyle-2026.png",
    imageAlt: "Crème solaire Beauty of Joseon Relief Sun SPF 50+",
    articleHref: "/article/beauty-of-joseon-relief-sun-creme-solaire-yesstyle-2026",
    merchantHref: "https://www.awin1.com/cread.php?awinmid=15447&awinaffid=990397&ued=https%3A%2F%2Fwww.yesstyle.com%2Ffr%2Fbeauty-of-joseon-relief%2Finfo.html%2Fpid.1137908658",
  },
  {
    brand: "Bioregena",
    name: "Crème solaire bébé bio",
    spf: "SPF 50",
    price: "10,20 €",
    checkedAt: "21 juillet 2026",
    usages: ["Bébé et enfant", "Visage et corps"],
    skinTypes: ["Peau sensible", "Peau de bébé"],
    format: "40 ml",
    image: "/images/articles/bon-plan-lea-nature-bioregena-creme-solaire-bebe-spf50-40ml-10-euros-juillet-2026.png",
    imageAlt: "Crème solaire bébé Bioregena bio SPF 50",
    articleHref: "/article/bon-plan-lea-nature-bioregena-creme-solaire-bebe-spf50-40ml-10-euros-juillet-2026",
    merchantHref: "https://ryt.leanature.com/?P5127D757CD2D2131&redir=https%3A%2F%2Fwww.leanature.com%2Ffr_fr%2Fcreme-solaire-bebe-40ml-spf50.html",
  },
  {
    brand: "CeraVe",
    name: "Lait solaire invisible hydratant",
    spf: "SPF 50+",
    price: "9,44 €",
    checkedAt: "15 août 2026",
    usages: ["Visage et corps"],
    skinTypes: ["Peau sensible", "Peau normale à sèche"],
    format: "Lait visage et corps",
    image: "/images/articles/bon-plan-amazon-cerave-lait-solaire-invisible-spf50-2026.webp",
    imageAlt: "Lait solaire invisible hydratant CeraVe SPF 50+",
    articleHref: "/article/bon-plan-amazon-cerave-lait-solaire-invisible-spf50-2026",
    merchantHref: "https://www.amazon.fr/CeraVe-Invisible-Hydratant-Protection-Hypoallerg%C3%A9nique/dp/B0G1N8TBST?th=1&linkCode=ll2&tag=lebrunnathali-21&linkId=7fd8529a7f46fd0cc2b576a1abadf0d3&ref_=as_li_ss_tl",
  },
  {
    brand: "Clinique",
    name: "Émulsion Hydratante Tellement Différente",
    spf: "SPF 50",
    price: "27,50 €",
    checkedAt: "17 août 2026",
    usages: ["Visage"],
    skinTypes: ["Peau normale à sèche"],
    format: "75 ml",
    image: "/images/articles/amazon-clinique-emulsion-hydratante-spf50-2026.png",
    imageAlt: "Émulsion hydratante Clinique SPF 50 de 75 ml",
    articleHref: "/article/bon-plan-amazon-clinique-emulsion-hydratante-spf50-2026",
    merchantHref: "https://www.amazon.fr/dp/B0F9H7LP8D?th=1&linkCode=ll2&tag=lebrunnathali-21&linkId=dff0de4f51cc29cdfbdaba29589c103c&ref_=as_li_ss_tl",
  },
  {
    brand: "Corine de Farme",
    name: "Crème solaire au monoï",
    spf: "SPF 50",
    price: "4,62 €",
    checkedAt: "24 juillet 2026",
    usages: ["Visage et corps"],
    skinTypes: ["Toute la famille"],
    format: "Crème visage et corps",
    image: "/images/articles/bp-corine-de-farme-creme-solaire-visage-corps-spf50-monoi.png",
    imageAlt: "Crème solaire Corine de Farme visage et corps SPF 50 au monoï",
    articleHref: "/article/bon-plan-amazon-corine-de-farme-creme-solaire-visage-corps-spf50-monoi-2026",
    merchantHref: "https://www.amazon.fr/dp/B0CZXWPXZC?tag=lebrunnathali-21",
  },
  {
    brand: "ISDIN",
    name: "FotoUltra Active Unify teintée",
    spf: "SPF 50+",
    price: "19,12 €",
    checkedAt: "15 août 2026",
    usages: ["Visage"],
    skinTypes: ["Taches pigmentaires", "Peau normale à sèche"],
    format: "50 ml",
    image: "/images/articles/bon-plan-amazon-isdin-fotoultra-active-unify-spf50-2026.webp",
    imageAlt: "Crème solaire visage teintée ISDIN FotoUltra Active Unify SPF 50+",
    articleHref: "/article/bon-plan-amazon-isdin-fotoultra-active-unify-spf50-2026",
    merchantHref: "https://www.amazon.fr/ISDIN-FotoUltra-%C3%89claircit-r%C3%A9duire-pigmentaires/dp/B00KYOVRLS?th=1&linkCode=ll2&tag=lebrunnathali-21&linkId=52d485f769e7802a3c320dcc3db8ad45&ref_=as_li_ss_tl",
  },
  {
    brand: "ISDIN",
    name: "Fusion Fluid matifiant",
    spf: "SPF 50+",
    price: "24,81 €",
    checkedAt: "15 août 2026",
    usages: ["Visage"],
    skinTypes: ["Peau mixte à grasse"],
    format: "50 ml",
    image: "/images/articles/bon-plan-amazon-isdin-fusion-fluid-spf50-2026.webp",
    imageAlt: "Protection solaire visage ISDIN Fusion Fluid SPF 50+",
    articleHref: "/article/bon-plan-amazon-isdin-fusion-fluid-spf50-2026",
    merchantHref: "https://www.amazon.fr/FUSION-ISDIN-FLUIDE-SPF50-50/dp/B00J5G2Q1Q?linkCode=ll2&tag=lebrunnathali-21&linkId=37caacb10ccb0b695a22b686c07e5116&ref_=as_li_ss_tl",
  },
  {
    brand: "Nivea",
    name: "Sun Protect & Hydrate Kids spray",
    spf: "SPF 50+",
    price: "7,04 €",
    checkedAt: "3 août 2026",
    usages: ["Bébé et enfant", "Visage et corps"],
    skinTypes: ["Peau sensible", "Toute la famille"],
    format: "Spray 200 ml",
    image: "/images/articles/bon-plan-amazon-nivea-sun-kids-spf50-spray-704-euros-aout-2026.png",
    imageAlt: "Spray solaire Nivea Sun Kids SPF 50+ pour enfant",
    articleHref: "/article/bon-plan-amazon-nivea-sun-kids-spf50-spray-704-euros-aout-2026",
    merchantHref: "https://www.amazon.fr/dp/B07BR6WLK1?tag=lebrunnathali-21",
  },
];
