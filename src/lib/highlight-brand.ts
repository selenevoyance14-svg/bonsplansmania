// Marque à l'honneur cette semaine — homepage.
// Nathalie : modifie SEULEMENT cet objet chaque lundi (slug + name + tagline + hubUrl).
// Le composant BrandOfTheWeek récupère automatiquement les 4 derniers deals actifs de la marque.

export type HighlightBrand = {
  /** slug technique utilisé pour matcher les articles (tag ou brand path) */
  slug: string;
  /** nom affiché de la marque */
  name: string;
  /** courte accroche affichée sous le nom (max ~90 chars) */
  tagline: string;
  /** page vers laquelle envoyer les visiteurs qui cliquent "Voir tout" */
  hubUrl: string;
  /** couleur d'accent utilisée pour le fond du bloc (hex clair pastel) */
  bg?: string;
  /** couleur de texte d'accent (hex saturé) */
  color?: string;
  /** emoji d'ambiance (1 seul) */
  emoji?: string;
};

export const BRAND_OF_THE_WEEK: HighlightBrand = {
  slug: "nuxe",
  name: "Nuxe",
  tagline: "Huile Prodigieuse, Rêve de Miel, Merveillance : les cultes Nuxe à -30 % pendant les soldes.",
  hubUrl: "/article/meilleurs-bons-plans-nuxe-2026-selection-huile-prodigieuse-reve-de-miel-merveillance",
  bg: "#FEF3E9",
  color: "#B8580E",
  emoji: "🌰",
};
