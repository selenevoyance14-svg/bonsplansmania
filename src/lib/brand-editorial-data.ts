export type VerifiedBrandService = {
  name: string;
  description: string;
  officialUrl: string;
};

export type VerifiedBrandOffer = {
  title: string;
  conditions: string;
  endDate?: string;
  officialUrl: string;
  commercialUrl?: string;
};

export type BrandEditorialPage = {
  introduction: string;
  verifiedAt: string;
  officialSourceUrl: string;
  services: VerifiedBrandService[];
  activeOffers: VerifiedBrandOffer[];
  faq: Array<{ question: string; answer: string }>;
  internalLinks: Array<{ href: string; label: string }>;
  commercialPartnershipActive: boolean;
};

/**
 * Contenu éditorial permanent et factuel des pages marques.
 *
 * Règles Carrefour x Kwanko :
 * - aucune offre n'est ajoutée sans source officielle vérifiée ;
 * - commercialUrl reste absent tant qu'un lien Kwanko valide n'est pas fourni ;
 * - la mention commerciale ne s'affiche qu'après activation explicite.
 */
export const BRAND_EDITORIAL_PAGES: Record<string, BrandEditorialPage> = {
  carrefour: {
    introduction:
      "Cette page rassemble les articles Bons Plans Mania liés à Carrefour ainsi que les principaux services vérifiés sur les pages officielles de l’enseigne. Les prix, promotions et disponibilités peuvent varier selon le magasin et la zone de livraison.",
    verifiedAt: "2026-07-27",
    officialSourceUrl: "https://www.carrefour.fr/services",
    services: [
      {
        name: "Carrefour Drive",
        description:
          "Commande de courses en ligne avec retrait dans un point Drive. Carrefour indique que le retrait en magasin est gratuit.",
        officialUrl: "https://www.carrefour.fr/services/drive",
      },
      {
        name: "Drive Piéton",
        description:
          "Commande en ligne avec retrait dans un point de proximité participant.",
        officialUrl: "https://www.carrefour.fr/services/courses-en-ligne",
      },
      {
        name: "Livraison à domicile",
        description:
          "Livraison de courses proposée selon l’adresse et les créneaux disponibles.",
        officialUrl: "https://www.carrefour.fr/services/courses-en-ligne",
      },
      {
        name: "Club Carrefour",
        description:
          "Programme de fidélité donnant accès à des avantages sur certains produits dans les magasins et services participants.",
        officialUrl: "https://www.carrefour.fr/conditions-generales-carte-carrefour",
      },
    ],
    // À renseigner seulement après vérification d'une offre officielle encore active.
    activeOffers: [],
    faq: [
      {
        question: "Les prix Carrefour sont-ils identiques partout ?",
        answer:
          "Non. Les prix, promotions, catalogues et disponibilités peuvent dépendre du magasin, du format de l’enseigne et de la zone de livraison.",
      },
      {
        question: "Le retrait Carrefour Drive est-il payant ?",
        answer:
          "La page officielle Carrefour Drive indique que les frais de préparation et le retrait en magasin sont offerts. Les conditions affichées au moment de la commande restent prioritaires.",
      },
      {
        question: "Les avantages du Club Carrefour fonctionnent-ils en ligne ?",
        answer:
          "Les conditions du programme indiquent que certains avantages sont utilisables sur les sites participants, notamment Carrefour.fr, le Drive et certains services de livraison.",
      },
      {
        question: "Les liens Carrefour de cette page sont-ils commerciaux ?",
        answer:
          "Les liens vers les sources officielles ne sont pas affiliés. Si une collaboration commerciale est activée, elle sera signalée visiblement et les liens concernés seront identifiés comme sponsorisés.",
      },
    ],
    internalLinks: [
      {
        href: "/article/guide-comparatif-drives-carrefour-leclerc-auchan-intermarche-2026",
        label: "Comparer Carrefour Drive aux autres enseignes",
      },
      {
        href: "/categorie/bon-plan",
        label: "Voir tous les bons plans",
      },
      {
        href: "/categorie/concours",
        label: "Voir les concours en cours",
      },
    ],
    commercialPartnershipActive: false,
  },
};
