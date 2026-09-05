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
  /** texte du bouton principal */
  ctaLabel: string;
  /** couleur d'accent utilisée pour le fond du bloc (hex clair pastel) */
  bg?: string;
  /** couleur de texte d'accent (hex saturé) */
  color?: string;
  /** emoji d'ambiance (1 seul) */
  emoji?: string;
  /** visuel affiché dans le bloc de la page d'accueil */
  imageSrc: string;
  /** texte alternatif descriptif du visuel */
  imageAlt: string;
};

export const BRAND_OF_THE_WEEK: HighlightBrand = {
  slug: "color-wow",
  name: "Color Wow",
  tagline: "Jusqu'à -30 % sur les soins capillaires Color Wow : Dream Coat, Dream Filter, Insta-Wow et formats voyage.",
  hubUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fc%2Fbrands%2Fcolor-wow%2Fflash%2F",
  ctaLabel: "Découvrir chez LOOKFANTASTIC",
  bg: "#FFF1F6",
  color: "#C2185B",
  emoji: "✨",
  imageSrc: "/images/articles/bon-plan-lookfantastic-color-wow-jusqu-30-pourcent-septembre-2026.jpg",
  imageAlt: "Spray Color Wow Dream Coat en promotion chez Lookfantastic",
};
