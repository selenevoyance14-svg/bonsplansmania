// Marque du moment — homepage.
// Modifie cet objet pour changer le nom, l'accroche et le lien affilié du bandeau.

export type HighlightBrand = {
  /** slug technique utilisé pour matcher les articles (tag ou brand path) */
  slug: string;
  /** nom affiché de la marque */
  name: string;
  /** courte accroche affichée sous le nom (max ~90 chars) */
  tagline: string;
  /** lien affilié vers lequel envoyer les visiteurs */
  hubUrl: string;
  /** couleur d'accent utilisée pour le fond du bloc (hex clair pastel) */
  bg?: string;
  /** couleur de texte d'accent (hex saturé) */
  color?: string;
  /** emoji d'ambiance (1 seul) */
  emoji?: string;
};

export const BRAND_OF_THE_WEEK: HighlightBrand = {
  slug: "beauty-of-joseon",
  name: "Beauty of Joseon",
  tagline: "Jusqu'à -30 % sur Beauty of Joseon + le Relief Sun Rice + Probiotics SPF50 10 ml offert dès 35 € d'achat.",
  hubUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fc%2Fbrands%2Fbeauty-of-joseon%2Foffers%2F",
  bg: "#F7F1E7",
  color: "#8C2F39",
  emoji: "🇰🇷",
};
