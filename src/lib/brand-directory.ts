import { CODE_PROMO_BRANDS } from "@/lib/code-promo-data";

export interface BrandDefinition {
  slug: string;
  name: string;
  matchTags: string[];
}

const LEGACY_BRAND_NAMES: Record<string, string> = {
  nyx: "NYX Professional Makeup",
  maybelline: "Maybelline",
  loreal: "L'Oréal",
  garnier: "Garnier",
  cerave: "CeraVe",
  "la-roche-posay": "La Roche-Posay",
  neutrogena: "Neutrogena",
  kerastase: "Kérastase",
  moroccanoil: "Moroccanoil",
  nuxe: "Nuxe",
  weleda: "Weleda",
  bioderma: "Bioderma",
  vichy: "Vichy",
  rimmel: "Rimmel",
  catrice: "Catrice",
  essence: "Essence",
  nivea: "Nivea",
  pantene: "Pantene",
  ogx: "OGX",
  glowria: "Glowria",
  "prescription-lab": "Prescription Lab",
  biotyfull: "Biotyfull Box",
  blissim: "Blissim",
  "my-little-box": "My Little Box",
  lookfantastic: "Lookfantastic",
  igraal: "iGraal",
  ebuyclub: "eBuyClub",
  poulpeo: "Poulpeo",
  swagbucks: "Swagbucks",
  amazon: "Amazon",
  sephora: "Sephora",
  "yves-rocher": "Yves Rocher",
  nailmatic: "Nailmatic",
  garancia: "Garancia",
  sabon: "Sabon",
};

export function normalizeBrandTag(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildBrandDefinitions(): BrandDefinition[] {
  const definitions = new Map<string, BrandDefinition>();

  for (const brand of CODE_PROMO_BRANDS) {
    definitions.set(normalizeBrandTag(brand.name), {
      slug: brand.slug,
      name: brand.name,
      matchTags: brand.matchTags,
    });
  }

  for (const [slug, name] of Object.entries(LEGACY_BRAND_NAMES)) {
    const key = normalizeBrandTag(name);
    if (!definitions.has(key)) {
      definitions.set(key, { slug, name, matchTags: [slug] });
    }
  }

  return [...definitions.values()];
}

export const BRAND_DEFINITIONS = buildBrandDefinitions();

export const BRAND_DEFINITION_BY_SLUG = new Map(
  BRAND_DEFINITIONS.map((brand) => [brand.slug, brand]),
);

const DIRECT_BRAND_ALIASES: Record<string, string[]> = {
  "e-leclerc": ["leclerc"],
  "nescafe-dolce-gusto": ["dolce-gusto"],
};

function compactBrandTag(value: string): string {
  return value.replace(/-/g, "");
}

export function getNormalizedBrandTags(brand: BrandDefinition): Set<string> {
  const canonicalTags = [brand.slug, brand.name].map(normalizeBrandTag);
  const directVariants = brand.matchTags
    .map(normalizeBrandTag)
    .filter((tag) =>
      canonicalTags.some(
        (canonical) =>
          tag === canonical ||
          compactBrandTag(tag) === compactBrandTag(canonical) ||
          tag.startsWith(`${canonical}-`),
      ),
    );

  return new Set([
    ...canonicalTags,
    ...directVariants,
    ...(DIRECT_BRAND_ALIASES[brand.slug] || []).map(normalizeBrandTag),
  ]);
}
