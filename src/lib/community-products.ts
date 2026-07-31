/**
 * Registre des fiches produits communautaires (/produit/[slug]).
 *
 * Source de vérité unique : la page rubrique /avis-prix-beaute lit cette liste.
 * Les fiches elles-mêmes restent des pages dédiées sous src/app/produit/,
 * chacune portant ses propres offres marchands.
 *
 * Pour ajouter une fiche : créer la page sous src/app/produit/<slug>/ puis
 * ajouter l'entrée correspondante ici.
 */

export interface CommunityProduct {
  slug: string;
  brand: string;
  name: string;
  image: string;
  imageAlt: string;
  /** Description courte affichée sur la page rubrique */
  teaser: string;
  /** Prix le plus bas relevé parmi les marchands de la fiche */
  fromPrice: string;
  /** Nombre de marchands comparés sur la fiche */
  merchantCount: number;
}

export const COMMUNITY_PRODUCTS: CommunityProduct[] = [
  {
    slug: "la-vie-est-belle-eau-de-parfum-lancome",
    brand: "Lancôme",
    name: "La Vie Est Belle Eau de Parfum",
    image:
      "https://www.beautysuccess.fr/media/catalog/product/cache/4fea07e277c82ab4be7d759dcf561c32/c/0/c002321-lancome-la-vie-est-belle-visuel_1.webp",
    imageAlt: "Flacon La Vie Est Belle Eau de Parfum 50 ml de Lancôme",
    teaser:
      "Un iris gourmand devenu iconique, adouci par la poire et réchauffé par la vanille, le praliné et le patchouli.",
    fromPrice: "57,61 €",
    merchantCount: 3,
  },
  {
    slug: "opium-eau-de-parfum-yves-saint-laurent",
    brand: "Yves Saint Laurent",
    name: "Opium Eau de Parfum",
    image:
      "https://www.beautysuccess.fr/media/catalog/product/cache/1da98f12ce9c143a9bd146af7dfed3c9/8/1/8141393225-yves-saint-laurent-opium-vaporisateur-50ml-visuel_1.webp",
    imageAlt: "Flacon Opium Eau de Parfum 50 ml d’Yves Saint Laurent",
    teaser:
      "Un oriental au caractère chaleureux et épicé, l’un des sillages les plus reconnaissables de la parfumerie.",
    fromPrice: "64,94 €",
    merchantCount: 3,
  },
  {
    slug: "libre-eau-de-parfum-yves-saint-laurent",
    brand: "Yves Saint Laurent",
    name: "Libre Eau de Parfum",
    image: "/images/products/ysl-libre-eau-de-parfum-50ml-officiel.png",
    imageAlt: "Flacon Libre Eau de Parfum 50 ml d’Yves Saint Laurent",
    teaser:
      "Une lavande florale moderne où la fraîcheur aromatique rencontre la sensualité de la fleur d’oranger.",
    fromPrice: "69,91 €",
    merchantCount: 3,
  },
];
