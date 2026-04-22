// Shared seasonal hub configuration.
// Each hub targets a specific seasonal event with keyword matching and SEO copy.

import { getAllArticles } from "@/lib/articles";

export interface SeasonalHub {
  slug: string; // URL segment (e.g. "fete-des-meres-2026")
  eventLabel: string; // "Fête des Mères"
  heroEmoji: string; // "🌸"
  heroColor: string; // primary color (hex) for accents
  eventDate: string; // ISO date of the event (display only)
  title: string; // SEO title
  description: string; // SEO description
  seoTitle: string; // meta title
  seoDescription: string; // meta description
  intro: string; // intro paragraph
  keywords: string[]; // keywords to match in article tags/title/description
  highlightStart: string; // ISO date — start of "season" highlight in Header
  highlightEnd: string; // ISO date — end of highlight
  tips: string[]; // bullet points of tips
  targetAudience: string; // "for whom"
}

export const SEASONAL_HUBS: SeasonalHub[] = [
  {
    slug: "fete-des-meres-2026",
    eventLabel: "Fête des Mères",
    heroEmoji: "🌸",
    heroColor: "#e11d48",
    eventDate: "2026-06-07",
    title: "Fête des Mères 2026 : les meilleurs cadeaux et bons plans",
    description: "Sélection complète de cadeaux pour la Fête des Mères 2026 (dimanche 7 juin) : coffrets beauté, bijoux, bougies, box, codes promo et idées made in France.",
    seoTitle: "Fête des Mères 2026 : Idées Cadeaux, Coffrets & Bons Plans — Bons Plans Mania",
    seoDescription: "Sélection complète de cadeaux pour la Fête des Mères 2026 (dimanche 7 juin) : coffrets beauté, bijoux, bougies, box, codes promo. Mis à jour quotidiennement.",
    intro: "La Fête des Mères 2026 aura lieu le dimanche 7 juin. Voici notre sélection d'idées cadeaux testées, de coffrets beauté, de box, de bijoux et de bons plans pour gâter ta maman sans te ruiner.",
    keywords: ["fête-des-mères", "fete-des-meres", "fete des meres", "fête des mères", "maman", "cadeau maman", "fête maman"],
    highlightStart: "2026-04-20",
    highlightEnd: "2026-06-10",
    tips: [
      "Commande 2 à 3 semaines avant le 7 juin pour éviter le rush",
      "Privilégie les produits personnalisés, made in France ou éco-conçus",
      "Budget moyen en France : 35-50€",
      "Code 5SITE5 = -5% chez Mieux Que Des Fleurs",
    ],
    targetAudience: "les enfants, adolescents et adultes qui veulent gâter leur maman",
  },
  {
    slug: "fete-des-peres-2026",
    eventLabel: "Fête des Pères",
    heroEmoji: "👨",
    heroColor: "#0284c7",
    eventDate: "2026-06-21",
    title: "Fête des Pères 2026 : les meilleurs cadeaux et bons plans",
    description: "Idées cadeaux Fête des Pères 2026 (dimanche 21 juin) : tech, sport, mode, bricolage, bien-être. Sélection testée avec prix accessibles et made in France.",
    seoTitle: "Fête des Pères 2026 : Idées Cadeaux, Bons Plans — Bons Plans Mania",
    seoDescription: "Cadeaux Fête des Pères 2026 (21 juin) : tech, sport, bricolage, soin homme, mode. Sélection testée tous budgets, mis à jour quotidiennement.",
    intro: "La Fête des Pères 2026 tombe le dimanche 21 juin — deux semaines après la Fête des Mères. Nos idées cadeaux pour surprendre ton papa : tech, sport, bien-être, bricolage, mode et made in France.",
    keywords: ["fête-des-pères", "fete-des-peres", "fete des peres", "fête des pères", "papa", "cadeau papa", "fête papa", "homme"],
    highlightStart: "2026-06-08",
    highlightEnd: "2026-06-25",
    tips: [
      "Commande avant le 14 juin pour être sûr d'être livré à temps",
      "Papa pragmatique : privilégie l'utile (montre, outils, soin visage)",
      "Papa sportif : équipement Decathlon, Under Armour, Asics",
      "Budget moyen : 40-60€",
    ],
    targetAudience: "les enfants, conjointes et familles qui veulent célébrer leur papa",
  },
  {
    slug: "calendrier-avent-2026",
    eventLabel: "Calendrier de l'Avent",
    heroEmoji: "🎄",
    heroColor: "#059669",
    eventDate: "2026-12-01",
    title: "Calendriers de l'Avent 2026 : comparatif, avis et bons plans",
    description: "Comparatif 2026 des meilleurs calendriers de l'Avent : beauté (Sephora, Dior, Rituals, Lookfantastic), thé, chocolat, enfants. Prix, contenu, avis, codes promo.",
    seoTitle: "Calendriers de l'Avent 2026 : Comparatif et Bons Plans — Bons Plans Mania",
    seoDescription: "Les meilleurs calendriers de l'Avent 2026 : Sephora, Dior, Rituals, Lookfantastic, ESPA. Comparatif complet, prix, contenu et codes promo.",
    intro: "Chaque fin d'année, les marques lancent leurs calendriers de l'Avent. Notre comparatif 2026 t'aide à choisir le meilleur selon ton budget et tes goûts : beauté, thé, chocolat, bien-être ou pour les enfants.",
    keywords: ["calendrier-avent", "calendrier de l'avent", "avent", "calendrier-beaute", "24 surprises"],
    highlightStart: "2026-09-15",
    highlightEnd: "2026-12-25",
    tips: [
      "Les meilleurs calendriers sont en rupture de stock dès octobre — réserve tôt",
      "Calendrier beauté Sephora : LA référence (valeur 3x supérieure au prix)",
      "Budget moyen : 40-100€ selon la gamme",
      "Cumule avec iGraal pour récupérer jusqu'à 10% de cashback",
    ],
    targetAudience: "les amateurs de surprises quotidiennes pendant décembre, tous les âges",
  },
  {
    slug: "black-friday-2026",
    eventLabel: "Black Friday",
    heroEmoji: "🛍️",
    heroColor: "#1f2937",
    eventDate: "2026-11-27",
    title: "Black Friday 2026 : les meilleurs bons plans et promos",
    description: "Black Friday 2026 (27 novembre) : nos bons plans Amazon, Sephora, Darty, Fnac. Promos beauté, high-tech, mode jusqu'à -80%. Sélection mise à jour en temps réel.",
    seoTitle: "Black Friday 2026 : Bons Plans et Promos -80% — Bons Plans Mania",
    seoDescription: "Black Friday 2026 (27 novembre) : promos Amazon, Sephora, Darty, Fnac. Beauté, high-tech, mode jusqu'à -80%. Mis à jour en temps réel.",
    intro: "Le Black Friday 2026 tombe le vendredi 27 novembre. Jour le plus intense de l'année pour les promos, on te sélectionne les vraies bonnes affaires — sans les fausses remises maquillées. Amazon, Sephora, Darty, Fnac et plus.",
    keywords: ["black-friday", "black friday", "cyber monday", "promo novembre", "bonnes affaires noel"],
    highlightStart: "2026-11-10",
    highlightEnd: "2026-12-02",
    tips: [
      "Le vrai Black Friday commence dès le lundi 24 novembre avec des ventes flash",
      "Installe Keepa pour vérifier l'historique des prix Amazon",
      "Active le cashback iGraal (booster fréquents à cette période)",
      "Cyber Monday le 30 novembre pour les bons plans high-tech",
    ],
    targetAudience: "tous ceux qui veulent faire leurs achats de Noël au meilleur prix",
  },
  {
    slug: "noel-2026",
    eventLabel: "Noël",
    heroEmoji: "🎁",
    heroColor: "#dc2626",
    eventDate: "2026-12-25",
    title: "Noël 2026 : les meilleures idées cadeaux et bons plans",
    description: "Noël 2026 (vendredi 25 décembre) : nos idées cadeaux pour toute la famille, bons plans, coffrets beauté, jouets enfants, tech, gastronomie. Sélection testée.",
    seoTitle: "Idées Cadeaux Noël 2026 : Sélection et Bons Plans — Bons Plans Mania",
    seoDescription: "Idées cadeaux Noël 2026 : pour enfants, femmes, hommes, ados. Coffrets beauté, jouets, tech, gastronomie. Sélection testée avec bons plans.",
    intro: "Noël 2026 tombe le vendredi 25 décembre. Nos idées cadeaux pour toute la famille : coffrets beauté, jouets, tech, gastronomie, made in France. Organise tes achats avant les ruptures de stock.",
    keywords: ["noel", "noël", "cadeau noel", "cadeau noël", "idee cadeau noel", "santa"],
    highlightStart: "2026-11-28",
    highlightEnd: "2026-12-26",
    tips: [
      "Commande avant le 15 décembre pour garantir la livraison",
      "Les coffrets beauté partent vite à partir de novembre",
      "Pour les enfants : jouets éducatifs + 1 doudou coup de cœur",
      "Amazon Prime = livraison gratuite jusqu'au dernier moment",
    ],
    targetAudience: "toute la famille et les amis à gâter à Noël",
  },
  {
    slug: "saint-valentin-2026",
    eventLabel: "Saint-Valentin",
    heroEmoji: "💕",
    heroColor: "#ec4899",
    eventDate: "2026-02-14",
    title: "Saint-Valentin 2026 : idées cadeaux romantiques et bons plans",
    description: "Saint-Valentin 2026 (samedi 14 février) : idées cadeaux romantiques pour lui et elle, bijoux, coffrets, parfums, expériences. Sélection testée tous budgets.",
    seoTitle: "Saint-Valentin 2026 : Idées Cadeaux et Bons Plans — Bons Plans Mania",
    seoDescription: "Idées cadeaux Saint-Valentin 2026 pour lui et elle : bijoux, parfums, coffrets, week-end romantique. Sélection testée avec bons plans.",
    intro: "La Saint-Valentin 2026 est le samedi 14 février. Nos idées cadeaux pour surprendre ton/ta partenaire : bijoux, parfums, coffrets romantiques, expériences, lingerie… Pour tous les budgets.",
    keywords: ["saint-valentin", "saint valentin", "valentine", "cadeau couple", "romantique", "amoureux"],
    highlightStart: "2026-01-20",
    highlightEnd: "2026-02-16",
    tips: [
      "Commande avant le 8 février pour la livraison standard",
      "Bijou + carte manuscrite = combo gagnant",
      "Week-end romantique : Airbnb + restaurant (réserve 2 semaines avant)",
      "Expériences (Wonderbox, Smartbox) plébiscitées",
    ],
    targetAudience: "les couples qui veulent célébrer leur amour",
  },
  {
    slug: "halloween-2026",
    eventLabel: "Halloween",
    heroEmoji: "🎃",
    heroColor: "#ea580c",
    eventDate: "2026-10-31",
    title: "Halloween 2026 : déguisements, déco et bons plans",
    description: "Halloween 2026 (samedi 31 octobre) : déguisements enfants et adultes, décoration, maquillage, bonbons. Sélection Amazon et Fnac aux meilleurs prix.",
    seoTitle: "Halloween 2026 : Déguisements, Déco et Bons Plans — Bons Plans Mania",
    seoDescription: "Halloween 2026 (31 octobre) : déguisements enfants et adultes, déco, maquillage, bonbons. Meilleurs prix Amazon, Fnac.",
    intro: "Halloween 2026 tombe le samedi 31 octobre — jour parfait pour faire la fête. Nos bons plans déguisements pour enfants et adultes, décoration, maquillage monstre et bonbons en gros format.",
    keywords: ["halloween", "déguisement", "deco-halloween", "citrouille", "costume enfant", "monstre"],
    highlightStart: "2026-10-01",
    highlightEnd: "2026-11-02",
    tips: [
      "Commande déguisements avant le 20 octobre (ruptures fréquentes)",
      "Amazon + Temu : meilleurs prix pour les accessoires",
      "Bonbons en gros : privilégie Action, Lidl ou Carrefour",
      "Maquillage monstre hypoallergénique pour enfants",
    ],
    targetAudience: "les familles, les jeunes et tous les fans d'Halloween",
  },
  {
    slug: "soldes-ete-2026",
    eventLabel: "Soldes d'Été",
    heroEmoji: "☀️",
    heroColor: "#eab308",
    eventDate: "2026-06-24",
    title: "Soldes d'Été 2026 : les meilleures affaires mode, beauté, maison",
    description: "Soldes d'été 2026 (du 24 juin au 21 juillet) : nos meilleures affaires mode, beauté, maison. Sélection des grosses réductions chez Zalando, Sephora, Nocibé.",
    seoTitle: "Soldes d'Été 2026 : Bons Plans Mode, Beauté, Maison — Bons Plans Mania",
    seoDescription: "Soldes d'été 2026 (24 juin au 21 juillet) : mode, beauté, maison. Zalando, Sephora, Nocibé, Amazon. Promos jusqu'à -70%.",
    intro: "Les soldes d'été 2026 commencent le mercredi 24 juin et durent 4 semaines (jusqu'au 21 juillet). Nos meilleures affaires mode, beauté, maison chez les grandes enseignes : jusqu'à -70% de remise.",
    keywords: ["soldes", "soldes-ete", "soldes été", "promo ete", "soldes mode"],
    highlightStart: "2026-06-15",
    highlightEnd: "2026-07-25",
    tips: [
      "Les meilleures affaires sont le premier jour (24 juin)",
      "Cumule les soldes avec iGraal pour -2 à -5% supplémentaires",
      "Zalando : 3 démarques successives avec -10% à chaque passage",
      "Garde tes maillots de bain préférés pour la 2e démarque (-50%)",
    ],
    targetAudience: "les amateurs de bonnes affaires qui préparent leur été",
  },
  {
    slug: "rentree-scolaire-2026",
    eventLabel: "Rentrée Scolaire",
    heroEmoji: "🎒",
    heroColor: "#7c3aed",
    eventDate: "2026-09-02",
    title: "Rentrée Scolaire 2026 : fournitures, cartables et bons plans",
    description: "Rentrée scolaire 2026 : nos bons plans fournitures, cartables, vêtements enfants. Listes, comparatifs et codes promo Carrefour, Leclerc, Auchan, Amazon.",
    seoTitle: "Rentrée Scolaire 2026 : Fournitures, Cartables et Bons Plans — Bons Plans Mania",
    seoDescription: "Rentrée scolaire 2026 : bons plans fournitures, cartables, vêtements enfants. Comparatifs Carrefour, Leclerc, Auchan, Amazon.",
    intro: "La rentrée scolaire 2026 approche. Nos bons plans fournitures, cartables, vêtements, équipement pour enfants et étudiants. Comparatifs des grandes enseignes et astuces pour économiser jusqu'à 40% sur la liste de rentrée.",
    keywords: ["rentree-scolaire", "rentrée scolaire", "fournitures-scolaires", "cartable", "ecole", "étudiant", "lycée"],
    highlightStart: "2026-08-01",
    highlightEnd: "2026-09-15",
    tips: [
      "Commande la liste de fournitures dès début août (avant les ruptures)",
      "Allocation de rentrée scolaire (ARS) : jusqu'à 465€ par enfant (conditions CAF)",
      "Scoolbox, Scoleo : livraison directe au domicile de la liste complète",
      "Second-hand : Vinted et Emmaüs pour les vêtements",
    ],
    targetAudience: "les parents d'enfants scolarisés, étudiants et lycéens",
  },
];

export function findArticlesForHub(hub: SeasonalHub) {
  const all = getAllArticles();
  const keywords = hub.keywords.map((k) => k.toLowerCase());
  return all.filter((a) => {
    const tags = (a.meta.tags || []).map((t) => t.toLowerCase());
    const title = (a.meta.title || "").toLowerCase();
    const desc = (a.meta.description || "").toLowerCase();
    return keywords.some(
      (k) => tags.some((t) => t.includes(k)) || title.includes(k) || desc.includes(k),
    );
  });
}

// Return the hub currently in highlight window (for Header rotation).
// Falls back to Fête des Mères (next upcoming) if none in window.
export function getCurrentSeasonalHub(): SeasonalHub | null {
  const now = new Date();
  const active = SEASONAL_HUBS.find((hub) => {
    const start = new Date(hub.highlightStart);
    const end = new Date(hub.highlightEnd);
    return now >= start && now <= end;
  });
  return active || null;
}
