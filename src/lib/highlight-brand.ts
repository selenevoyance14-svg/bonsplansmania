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
  slug: "sol-de-janeiro",
  name: "Sol de Janeiro",
  tagline: "Bum Bum Cream, Cheirosa 62, brumes cultes : jusqu'à -40 % + trousse cadeau offerte chez LookFantastic.",
  hubUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fc%2Foffers%2Feu%2Fpc-savings%2Fv1%2F",
  bg: "#FEF0F5",
  color: "#D6336C",
  emoji: "🇧🇷",
};
