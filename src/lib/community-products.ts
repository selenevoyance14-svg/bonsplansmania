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
  /** Date d'ajout de la fiche au site (ISO), sert au tri récent / ancien */
  addedAt: string;
}

export const COMMUNITY_PRODUCTS: CommunityProduct[] = [
  {
    slug: "burberry-goddess-eau-de-parfum",
    addedAt: "2026-08-01T17:45:00",
    brand: "Burberry",
    name: "Goddess Eau de Parfum",
    image: "/images/products/burberry-goddess-eau-de-parfum.png",
    imageAlt: "Flacon doré Burberry Goddess Eau de Parfum",
    teaser:
      "Une vanille en trois textures — infusée, crémeuse et brûlée — relevée par la lavande et le cacao.",
  },
  {
    slug: "mugler-alien-eau-de-parfum",
    addedAt: "2026-08-01T17:20:00",
    brand: "Mugler",
    name: "Alien Eau de Parfum",
    image: "/images/products/mugler-alien-eau-de-parfum.png",
    imageAlt: "Flacon violet et or Mugler Alien Eau de Parfum",
    teaser:
      "Jasmin sambac, bois de cachemire et ambre blanc : l’un des sillages les plus tenaces du rayon.",
  },
  {
    slug: "rabanne-lady-million-eau-de-parfum",
    addedAt: "2026-08-01T17:14:00",
    brand: "Rabanne",
    name: "Lady Million Eau de Parfum",
    image: "/images/products/rabanne-lady-million-eau-de-parfum.png",
    imageAlt: "Flacon diamant doré Rabanne Lady Million Eau de Parfum",
    teaser:
      "Un floral chypré solaire : néroli et framboise, fleur d’oranger et jasmin, patchouli et miel en fond.",
  },
  {
    slug: "valentino-born-in-roma-donna-eau-de-parfum",
    addedAt: "2026-08-01T17:08:00",
    brand: "Valentino",
    name: "Donna Born in Roma Eau de Parfum",
    image: "/images/products/valentino-born-in-roma-donna-eau-de-parfum.png",
    imageAlt: "Flacon clouté Valentino Donna Born in Roma Eau de Parfum",
    teaser:
      "Jasmin sambac et bourgeon de cassis en tête, vanille bourbon et bois de cèdre en fond.",
  },
  {
    slug: "prada-paradoxe-eau-de-parfum",
    addedAt: "2026-08-01T16:58:00",
    brand: "Prada",
    name: "Paradoxe Eau de Parfum",
    image: "/images/products/prada-paradoxe-eau-de-parfum.png",
    imageAlt: "Flacon triangle Prada Paradoxe Eau de Parfum",
    teaser:
      "Un floral ambré autour du néroli et du jasmin, dans le flacon triangle rechargeable de la maison.",
  },
  {
    slug: "jean-paul-gaultier-la-belle-eau-de-parfum",
    addedAt: "2026-08-01T16:54:00",
    brand: "Jean Paul Gaultier",
    name: "La Belle Eau de Parfum",
    image: "/images/products/jean-paul-gaultier-la-belle-eau-de-parfum.png",
    imageAlt: "Flacon buste Jean Paul Gaultier La Belle Eau de Parfum",
    teaser:
      "Trois notes, pas une de plus : poire juteuse, vanille et bois de santal, pour un sillage sucré et lumineux.",
  },
  {
    slug: "carolina-herrera-good-girl-eau-de-parfum",
    addedAt: "2026-08-01T16:48:00",
    brand: "Carolina Herrera",
    name: "Good Girl Eau de Parfum",
    image: "/images/products/carolina-herrera-good-girl-eau-de-parfum.png",
    imageAlt: "Flacon escarpin Carolina Herrera Good Girl Eau de Parfum",
    teaser:
      "Jasmin sambac et tubéreuse en pleine lumière, cacao et fève tonka dans l’ombre. Un parfum du soir très tenace.",
  },
  {
    slug: "dior-miss-dior-eau-de-parfum",
    addedAt: "2026-08-01T16:42:00",
    brand: "Dior",
    name: "Miss Dior Eau de Parfum",
    image: "/images/products/dior-miss-dior-eau-de-parfum.png",
    imageAlt:
      "Flacon Dior Miss Dior Eau de Parfum et son nœud couture argenté",
    teaser:
      "Un bouquet de roses de Grasse porté par la pivoine et l’iris, adouci par le bois de santal et le musc blanc.",
  },
  {
    slug: "chanel-coco-mademoiselle-eau-de-parfum",
    addedAt: "2026-08-01T16:30:00",
    brand: "Chanel",
    name: "Coco Mademoiselle Eau de Parfum",
    image: "/images/products/chanel-coco-mademoiselle-eau-de-parfum.png",
    imageAlt: "Flacon Chanel Coco Mademoiselle Eau de Parfum vaporisateur",
    teaser:
      "L’oriental frais de Chanel : orange et bergamote, un cœur de rose et de jasmin, un fond de patchouli et de vétiver.",
  },
  {
    slug: "sol-de-janeiro-cheirosa-62-perfume-mist-90ml",
    addedAt: "2026-08-01T16:05:00",
    brand: "Sol de Janeiro",
    name: "Cheirosa 62 Brume Parfumée 90 ml",
    image: "/images/products/sol-de-janeiro-cheirosa-62-perfume-mist-90ml.png",
    imageAlt: "Flacon Sol de Janeiro Cheirosa 62 Brume Parfumée 90 ml",
    teaser:
      "L’odeur qui a rendu la marque brésilienne célèbre : pistache et caramel salé sur un fond de vanille et d’héliotrope.",
  },
  {
    slug: "kayali-yum-boujee-marshmallow-81",
    addedAt: "2026-08-01T15:40:00",
    brand: "Kayali",
    name: "Yum Boujee Marshmallow 81 Eau de Parfum Intense",
    image: "/images/products/kayali-yum-boujee-marshmallow-81.png",
    imageAlt:
      "Flacon Kayali Yum Boujee Marshmallow 81 Eau de Parfum Intense 10 ml",
    teaser:
      "Le gourmand assumé de Mona Kattan : guimauve rose et vanille fouettée sur un départ fruité de pomme et de citron.",
  },
  {
    slug: "la-vie-est-belle-eau-de-parfum-lancome",
    addedAt: "2026-07-30T18:51:00",
    brand: "Lancôme",
    name: "La Vie Est Belle Eau de Parfum",
    image: "/images/products/la-vie-est-belle-eau-de-parfum-lancome.png",
    imageAlt: "Flacon La Vie Est Belle Eau de Parfum 50 ml de Lancôme",
    teaser:
      "Un iris gourmand devenu iconique, adouci par la poire et réchauffé par la vanille, le praliné et le patchouli.",
  },
  {
    slug: "opium-eau-de-parfum-yves-saint-laurent",
    addedAt: "2026-07-30T15:11:00",
    brand: "Yves Saint Laurent",
    name: "Opium Eau de Parfum",
    image: "/images/products/opium-eau-de-parfum-yves-saint-laurent.png",
    imageAlt: "Flacon Opium Eau de Parfum 50 ml d’Yves Saint Laurent",
    teaser:
      "Un oriental au caractère chaleureux et épicé, l’un des sillages les plus reconnaissables de la parfumerie.",
  },
  {
    slug: "libre-eau-de-parfum-yves-saint-laurent",
    addedAt: "2026-07-30T18:51:00",
    brand: "Yves Saint Laurent",
    name: "Libre Eau de Parfum",
    image: "/images/products/ysl-libre-eau-de-parfum-50ml-officiel.png",
    imageAlt: "Flacon Libre Eau de Parfum 50 ml d’Yves Saint Laurent",
    teaser:
      "Une lavande florale moderne où la fraîcheur aromatique rencontre la sensualité de la fleur d’oranger.",
  },
];
