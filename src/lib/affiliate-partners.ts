import { CODE_PROMO_BRANDS } from "@/lib/code-promo-data";

export const AFFILIATE_PARTNER_GROUPS = {
  "Beauté & bien-être": ["lookfantastic", "yesstyle", "stylevana", "miin-cosmetics", "clarins", "dr-pierre-ricaud", "weleda", "loccitane", "atida", "beauty-success", "parfums-moins-chers", "news-parfums", "thalgo", "uriage", "pin-up-secret", "adopt", "biolane", "ioma", "seasonly", "le-rouge-francais", "magnifaik", "atelier-du-sourcil", "pranarom", "lea-nature", "belle-au-naturel"],
  "Box beauté": ["biotyfull-box", "glowria", "prescription-lab", "blissim"],
  "Mode & chaussures": ["caroll", "morgan", "desigual", "gemo", "chaussea", "sarenza", "spartoo", "shoes-fr", "degriffstock", "sans-complexe", "lollipops", "damart", "afibel", "blanche-porte", "private-sport-shop", "made-in-sport", "bebeboutik"],
  "Maison, courses & high-tech": ["carrefour", "e-leclerc", "cdiscount", "darty", "manomano", "electro-depot", "aliexpress", "rakuten", "greenweez", "hellofresh"],
  "Bébé, famille & loisirs": ["la-boite-rose", "beaba", "babybio", "milan-jeunesse", "bayard-jeunesse", "c-mon-etiquette", "micromania", "rougier-ple", "creabul"],
  "Cadeaux & alimentation": ["histoire-dor", "one-watch-company", "monsieur-tshirt", "mieux-que-des-fleurs", "famille-mary", "la-boite-du-fromager", "la-box-fromage", "la-gourmet-box", "le-petit-ballon", "une-petite-mousse"],
  Voyages: ["havas-voyages", "voyages-auchan", "mileade", "lagrange-vacances"],
} as const;

export type AffiliatePartnerCategory = keyof typeof AFFILIATE_PARTNER_GROUPS;

const brandMap = new Map(CODE_PROMO_BRANDS.map((brand) => [brand.slug, brand]));

export const AFFILIATE_PARTNERS = Object.entries(AFFILIATE_PARTNER_GROUPS)
  .flatMap(([category, slugs]) => slugs.map((slug) => {
    const brand = brandMap.get(slug);
    return brand ? { ...brand, category: category as AffiliatePartnerCategory } : null;
  }))
  .filter((brand): brand is NonNullable<typeof brand> => brand !== null)
  .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));

