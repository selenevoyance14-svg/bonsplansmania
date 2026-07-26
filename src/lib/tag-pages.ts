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

export function shouldGenerateTagPage(slug: string, count: number): boolean {
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
