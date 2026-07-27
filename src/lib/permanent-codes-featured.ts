// Codes promo permanents mis en avant sur la homepage.
// Édite ce tableau pour choisir les offres vedettes. Les 4 premières sont affichées en homepage.
// La page complète /codes-promo-permanents garde sa liste totale (38 codes).

export type FeaturedPermanentCode = {
  brand: string;
  category: string;
  offer: string;
  /** slug utilisé pour /go/permanent-<slug> — mapping résolu côté Cloudflare Function */
  slug: string;
  /** couleur d'accent (hex saturé) — sert de badge lettre + bouton */
  color: string;
};

export const FEATURED_PERMANENT_CODES: FeaturedPermanentCode[] = [
  {
    brand: "iGraal",
    category: "Cashback",
    offer: "10 € offerts à l'inscription + jusqu'à 12 % de cashback sur 5 000 marchands.",
    slug: "igraal",
    color: "#0F766E",
  },
  {
    brand: "Adopt'",
    category: "Bienvenue",
    offer: "-20 % sur la 1ʳᵉ commande via newsletter (parfums français dès 10 €).",
    slug: "adopt",
    color: "#7C3AED",
  },
  {
    brand: "Greenweez",
    category: "Bienvenue",
    offer: "-15 € dès 79 € via newsletter (bio, cosmétiques naturels, épicerie).",
    slug: "greenweez",
    color: "#0F766E",
  },
  {
    brand: "Sarenza",
    category: "Bienvenue",
    offer: "-20 € dès 100 € d'achat pour toute 1ʳᵉ commande + livraison offerte 100 j.",
    slug: "sarenza",
    color: "#C2410C",
  },
  {
    brand: "Dr Pierre Ricaud",
    category: "Code",
    offer: "10 € offerts dès 60 € d'achat + livraison gratuite dès 39 €.",
    slug: "dr-pierre-ricaud",
    color: "#7C3AED",
  },
  {
    brand: "MiiN Cosmetics",
    category: "Newsletter",
    offer: "-10 % sur toute la boutique via inscription newsletter (K-Beauty premium).",
    slug: "miin-cosmetics",
    color: "#0F766E",
  },
  {
    brand: "Poulpeo",
    category: "Cashback",
    offer: "10 € offerts à l'inscription + cashback boostés sur 3 000 marchands (Sephora, Cdiscount, Fnac).",
    slug: "poulpeo",
    color: "#C2410C",
  },
  {
    brand: "Clarins",
    category: "Livraison",
    offer: "Livraison offerte dès 50 € + échantillons gratuits à chaque commande via le site officiel.",
    slug: "clarins",
    color: "#7C3AED",
  },
];
