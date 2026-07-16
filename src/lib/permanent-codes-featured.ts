// Codes promo permanents mis en avant sur la homepage.
// Nathalie : édite ce tableau pour changer les 6 codes vedettes affichés en homepage.
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
    color: "#FB923C",
  },
  {
    brand: "Adopt'",
    category: "Parfumerie",
    offer: "-20 % sur la 1ʳᵉ commande via newsletter (parfums français dès 10 €).",
    slug: "adopt",
    color: "#FACC15",
  },
  {
    brand: "Greenweez",
    category: "Bio & naturel",
    offer: "-15 € dès 79 € via newsletter (bio, cosmétiques naturels, épicerie).",
    slug: "greenweez",
    color: "#4ADE80",
  },
  {
    brand: "Sarenza",
    category: "Chaussures",
    offer: "-20 € dès 100 € d'achat pour toute 1ʳᵉ commande + livraison offerte 100 j.",
    slug: "sarenza",
    color: "#F472B6",
  },
  {
    brand: "Dr Pierre Ricaud",
    category: "Cosmétique",
    offer: "10 € offerts dès 60 € d'achat + livraison gratuite dès 39 €.",
    slug: "dr-pierre-ricaud",
    color: "#EC4899",
  },
  {
    brand: "MiiN Cosmetics",
    category: "K-Beauty",
    offer: "-10 % sur toute la boutique via inscription newsletter (K-Beauty premium).",
    slug: "miin-cosmetics",
    color: "#A78BFA",
  },
  {
    brand: "Poulpeo",
    category: "Cashback",
    offer: "10 € offerts à l'inscription + cashback boostés sur 3 000 marchands (Sephora, Cdiscount, Fnac).",
    slug: "poulpeo",
    color: "#38BDF8",
  },
  {
    brand: "Clarins",
    category: "Cosmétique",
    offer: "Livraison offerte dès 50 € + échantillons gratuits à chaque commande via le site officiel.",
    slug: "clarins",
    color: "#F87171",
  },
];
