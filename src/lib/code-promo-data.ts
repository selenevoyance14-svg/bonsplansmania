// Marques pour les pages /code-promo/[marque].
// La page agrège uniquement les articles MDX existants liés à la marque
// (filtre par matchTags). Aucun contenu inventé : tout vient de tes vrais articles.

export interface CodePromoBrand {
  slug: string;
  name: string;
  affiliateUrl: string;
  affiliateLabel: string;
  matchTags: string[]; // tags à matcher dans le frontmatter MDX
  color: string;
}

export const CODE_PROMO_BRANDS: CodePromoBrand[] = [
  {
    slug: "yesstyle",
    name: "YesStyle",
    affiliateUrl: "https://ystyle.co/kqCm2",
    affiliateLabel: "Voir les offres YesStyle",
    matchTags: ["yesstyle"],
    color: "#FF6B9D",
  },
  {
    slug: "lookfantastic",
    name: "Lookfantastic",
    affiliateUrl: "https://tidd.ly/3AIsNEn",
    affiliateLabel: "Voir les offres Lookfantastic",
    matchTags: ["lookfantastic"],
    color: "#000000",
  },
  {
    slug: "blissim",
    name: "Blissim",
    affiliateUrl: "https://tidd.ly/3TxbBY7",
    affiliateLabel: "Voir les offres Blissim",
    matchTags: ["blissim"],
    color: "#FF6B9D",
  },
  {
    slug: "biotyfull-box",
    name: "Biotyfull Box",
    affiliateUrl: "https://xno.biotyfullbox.fr/?P51362157CD2D1D1&redir=https%3A%2F%2Fwww.biotyfullbox.fr%2F",
    affiliateLabel: "Voir les offres Biotyfull Box",
    matchTags: ["biotyfull", "biotyfull-box"],
    color: "#7FB069",
  },
  {
    slug: "dr-pierre-ricaud",
    name: "Dr Pierre Ricaud",
    affiliateUrl: "https://tidd.ly/3UFSiN5",
    affiliateLabel: "Voir les offres Dr Pierre Ricaud",
    matchTags: ["dr-pierre-ricaud", "pierre ricaud", "pierre-ricaud"],
    color: "#5D4D8C",
  },
  {
    slug: "blanche-porte",
    name: "Blancheporte",
    affiliateUrl: "https://fnty.co/c/r-DQZuaCMy",
    affiliateLabel: "Voir les offres Blancheporte",
    matchTags: ["blanche-porte", "blancheporte"],
    color: "#1E3A8A",
  },
  {
    slug: "lea-nature",
    name: "Léa Nature",
    affiliateUrl: "https://lk.gt/azPuG",
    affiliateLabel: "Voir les offres Léa Nature",
    matchTags: ["lea-nature", "léa nature", "lea nature"],
    color: "#558B2F",
  },
  {
    slug: "stylevana",
    name: "Stylevana",
    affiliateUrl: "https://tidd.ly/4bqrGYB",
    affiliateLabel: "Voir les offres Stylevana",
    matchTags: ["stylevana"],
    color: "#FF6B9D",
  },
  {
    slug: "beauty-success",
    name: "Beauty Success",
    affiliateUrl: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2F",
    affiliateLabel: "Voir les offres Beauty Success",
    matchTags: ["beauty-success", "beauty success"],
    color: "#FF1493",
  },
  {
    slug: "private-sport-shop",
    name: "Private Sport Shop",
    affiliateUrl: "https://tracking.publicidees.com/clic.php?promoid=60430&progid=2334&partid=61992",
    affiliateLabel: "Voir les ventes Private Sport Shop",
    matchTags: ["private-sport-shop", "private sport shop", "privatesportshop"],
    color: "#0F766E",
  },
];

export function getBrandBySlug(slug: string): CodePromoBrand | undefined {
  return CODE_PROMO_BRANDS.find((b) => b.slug === slug);
}
