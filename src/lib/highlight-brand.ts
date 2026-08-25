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
  /** libellé personnalisé du bouton */
  ctaLabel?: string;
};

export const BRAND_OF_THE_WEEK: HighlightBrand = {
  slug: "biodance",
  name: "Biodance",
  tagline: "Les masques hydrogel au collagène et les soins hydratants coréens qui font le succès de Biodance.",
  hubUrl: "https://www.awin1.com/cread.php?awinmid=15447&awinaffid=990397&ued=https%3A%2F%2Fwww.yesstyle.com%2Ffr%2Flist.html%3Fq%3DBiodance%26bpt%3D48",
  bg: "#FFF1F5",
  color: "#BE185D",
  emoji: "🩷",
  ctaLabel: "Découvrir chez YesStyle",
};
