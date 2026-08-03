export const MIN_ARTICLES_FOR_STATIC_TAG_PAGE = 3;

export const CURATED_TAG_SLUGS = new Set([
  "nyx",
  "maybelline",
  "loreal",
  "garnier",
  "cerave",
  "la-roche-posay",
  "neutrogena",
  "kerastase",
  "moroccanoil",
  "nuxe",
  "weleda",
  "bioderma",
  "rimmel",
  "catrice",
  "nivea",
  "glowria",
  "prescription-lab",
  "biotyfull",
  "blissim",
  "igraal",
  "ebuyclub",
  "poulpeo",
  "sephora",
  "yves-rocher",
  "amazon",
]);

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Les pages /marque/ ne doivent contenir QUE des marques. Sans ce filtre, des tags
// génériques ou datés ("2026", "bon plan", "juillet 2026", "promo") génèrent des pages
// de plusieurs centaines d'articles qui cannibalisent /categorie/* et diluent le crawl.
// Mesuré au 03/08/2026 : 48 pages de ce type, 4 clics et 53 impressions cumulés.

// Mots génériques : ce sont des catégories ou des arguments de vente, pas des marques.
const GENERIC_TAG_SLUGS = new Set([
  "bon-plan", "bons-plans", "promo", "promos", "promotion", "promotions",
  "code-promo", "codes-promo", "reduction", "reductions", "remise", "remises",
  "soldes", "offre", "offres", "deal", "deals", "vente-privee", "ventes-privees",
  "pas-cher", "moins-cher", "gratuit", "cadeau", "cadeaux", "concours",
  "beaute", "maison", "maison-connectee", "maison-entretien", "mode", "jardin",
  "cuisine", "high-tech", "tech", "bebe", "enfant", "homme", "femme",
  "maillot", "mains-libres", "test", "tests", "avis", "comparatif",
]);

// Mois : un tag "avril" ou "juin 2026" est une date, jamais une marque.
// "mars" est volontairement absent — c'est aussi une vraie marque.
const MONTH_SLUGS = new Set([
  "janvier", "fevrier", "avril", "mai", "juin", "juillet",
  "aout", "septembre", "octobre", "novembre", "decembre",
]);

export function isNonBrandTagSlug(slug: string): boolean {
  if (GENERIC_TAG_SLUGS.has(slug) || MONTH_SLUGS.has(slug)) return true;
  // Contient une année : "2026", "juillet-2026", "soldes-ete-2026", "fin-31-juillet-2026"
  if (/(?:^|-)(?:19|20)\d{2}(?:$|-)/.test(slug)) return true;
  // Caractéristique technique : "9000-btu", "2200w", "1000-euros"
  if (/^\d/.test(slug)) return true;
  return false;
}

export function shouldGenerateTagPage(slug: string, count: number): boolean {
  if (isNonBrandTagSlug(slug)) return false;
  return CURATED_TAG_SLUGS.has(slug) || count >= MIN_ARTICLES_FOR_STATIC_TAG_PAGE;
}

export function getStaticTagSlugs(
  articleTagGroups: Iterable<Iterable<string>>
): Set<string> {
  const counts = new Map<string, number>();

  for (const tags of articleTagGroups) {
    const seen = new Set<string>();
    for (const tag of tags) {
      const slug = slugifyTag(tag);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
  }

  return new Set(
    [...counts.entries()]
      .filter(([slug, count]) => shouldGenerateTagPage(slug, count))
      .map(([slug]) => slug)
  );
}
