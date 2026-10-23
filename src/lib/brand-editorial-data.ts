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

function isInternalCommercialRoute(url: string): boolean {
  return url.startsWith("/go/");
}

function validateBrandEditorialPages(
  pages: Record<string, BrandEditorialPage>
): void {
  for (const [slug, page] of Object.entries(pages)) {
    for (const offer of page.activeOffers) {
      if (offer.commercialUrl && !page.commercialPartnershipActive) {
        throw new Error(
          `[brand-editorial] ${slug}: commercialUrl interdite lorsque commercialPartnershipActive est false.`
        );
      }

      if (offer.commercialUrl && !isInternalCommercialRoute(offer.commercialUrl)) {
        throw new Error(
          `[brand-editorial] ${slug}: commercialUrl doit commencer par /go/.`
        );
      }
    }
  }
}

export function getCurrentBrandOffers(
  page: BrandEditorialPage,
  referenceDate = new Date()
): VerifiedBrandOffer[] {
  const currentDate = referenceDate.toISOString().slice(0, 10);
  return page.activeOffers.filter(
    (offer) => !offer.endDate || offer.endDate >= currentDate
  );
}

/**
 * Contenu éditorial permanent et factuel des pages marques.
 *
 * Règles Carrefour :
 * - aucune offre n'est ajoutée sans source officielle vérifiée ;
 * - les liens commerciaux utilisent une redirection /go/ dédiée ;
 * - la mention commerciale ne s'affiche qu'après activation explicite.
 */
export const BRAND_EDITORIAL_PAGES: Record<string, BrandEditorialPage> = {
  carrefour: {
    introduction:
      "Retrouvez les bons plans Carrefour pour vos courses, la maison et les jouets. Comparez les remises immédiates, les avantages Club et les offres Drive ou livraison en sélectionnant votre magasin. Une somme créditée sur la carte fidélité se distingue d’une réduction déduite immédiatement du panier.",
    verifiedAt: "2026-09-30",
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
      {
        name: "MonAvisLeRendGratuit",
        description:
          "Programme de la Communauté Carrefour permettant aux membres de tester gratuitement des produits, de donner leur avis et de gagner des crédits.",
        officialUrl: "https://communaute.carrefour.fr/app/730/channel/tester-des-produits-2238",
      },
    ],
    activeOffers: [
      {
        title: "20 € offerts dès 80 € avec le code BINGO20",
        conditions:
          "Offre réservée à une première commande Carrefour Drive, Livré Chez Vous ou Livraison Express, utilisable une fois par utilisateur jusqu'au 1er novembre 2026 inclus. Hors remises immédiates, sacs consignés, frais de livraison, Maison & Loisirs et Marketplace. Non cumulable.",
        endDate: "2026-11-01",
        officialUrl: "https://www.carrefour.fr/courses",
        commercialUrl: "/go/carrefour-bingo20",
      },
    ],
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
          "Certains liens sont affiliés : Bons Plans Mania peut percevoir une commission sur les achats éligibles, sans surcoût pour vous. Cette information figure sur la page et les liens concernés sont identifiés comme sponsorisés.",
      },
    ],
    internalLinks: [
      {
        href: "/article/courses-pas-cheres-2026-comparatif-supermarches-astuces",
        label: "Comparer son budget courses entre supermarchés",
      },
      {
        href: "/article/lego-moins-15-euros-carrefour-octobre-2026",
        label: "Découvrir la sélection de LEGO à moins de 15 €",
      },
      {
        href: "/article/test-produit-gratuit-carrefour-mon-avis-le-rend-gratuit",
        label: "Tester des produits gratuitement avec MonAvisLeRendGratuit",
      },
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
    commercialPartnershipActive: true,
  },
};

validateBrandEditorialPages(BRAND_EDITORIAL_PAGES);
