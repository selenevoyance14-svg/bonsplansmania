import type { MetadataRoute } from "next";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";

const BASE = "https://bonsplansmania.fr";

// Slugify identique à src/app/marque/[slug]/page.tsx (pour rester aligné sur les routes générées)
function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const MIN_ARTICLES_FOR_MARQUE_PAGE = 3;

const CURATED_BRAND_SLUGS = new Set<string>([
  "nyx", "maybelline", "loreal", "garnier", "cerave", "la-roche-posay",
  "neutrogena", "kerastase", "moroccanoil", "nuxe", "weleda", "bioderma",
  "rimmel", "catrice", "nivea", "glowria", "prescription-lab", "biotyfull",
  "blissim", "igraal", "ebuyclub", "poulpeo", "sephora", "yves-rocher", "amazon",
]);

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "",                          priority: 1.0, changeFrequency: "daily" },
  { path: "/blog",                     priority: 0.9, changeFrequency: "daily" },
  { path: "/bons-plans-en-cours",      priority: 0.9, changeFrequency: "daily" },
  { path: "/ete-2026",                 priority: 0.9, changeFrequency: "daily" },
  { path: "/fete-des-peres-2026",      priority: 0.3, changeFrequency: "yearly" },
  { path: "/noel-2026",                priority: 0.8, changeFrequency: "weekly" },
  { path: "/codes-promo-permanents",   priority: 0.8, changeFrequency: "weekly" },
  { path: "/code-promo",               priority: 0.8, changeFrequency: "weekly" },
  { path: "/bons-plans-beaute",        priority: 0.9, changeFrequency: "weekly" },
  { path: "/bons-plans-bebe",          priority: 0.8, changeFrequency: "weekly" },
  { path: "/bons-plans-ninja",         priority: 0.8, changeFrequency: "weekly" },
  { path: "/bons-plans-tech",          priority: 0.9, changeFrequency: "weekly" },
  { path: "/bons-plans-maison",        priority: 0.9, changeFrequency: "weekly" },
  { path: "/bons-plans-jardin",        priority: 0.8, changeFrequency: "weekly" },
  { path: "/bons-plans-mode",          priority: 0.9, changeFrequency: "weekly" },
  { path: "/bons-plans-jouets",        priority: 0.9, changeFrequency: "weekly" },
  { path: "/bons-plans-rentree",       priority: 0.9, changeFrequency: "weekly" },
  { path: "/avis-prix-beaute",         priority: 0.8, changeFrequency: "weekly" },
  { path: "/marques",                  priority: 0.7, changeFrequency: "weekly" },
  { path: "/recherche",                priority: 0.5, changeFrequency: "monthly" },
  { path: "/partenariats",             priority: 0.4, changeFrequency: "monthly" },
  { path: "/guide-gratuit",            priority: 0.4, changeFrequency: "monthly" },
  { path: "/mentions-legales",         priority: 0.2, changeFrequency: "yearly" },
  { path: "/confidentialite",          priority: 0.2, changeFrequency: "yearly" },
  { path: "/politique-de-confidentialite", priority: 0.2, changeFrequency: "yearly" },
];

const CATEGORY_SLUGS = [
  "bon-plan",
  "test-gratuit",
  "test-avis",
  "test-produit",
  "comparatif",
  "beaute",
  "concours",
  "box-beaute",
  "selection",
  "calendrier-avent",
  "code-promo",
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const articles = getAllArticles();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE}/categorie/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Exclure les articles expirés du sitemap pour économiser le crawl budget Google.
  // Les articles restent accessibles aux visiteurs (pas dépubliés), mais ne sont plus
  // recommandés à Google pour re-crawl régulier.
  const articleEntries: MetadataRoute.Sitemap = articles
    .filter((a) => !isEffectivelyExpired(a.meta) && !a.meta.noindex)
    .map((a) => ({
      url: `${BASE}/article/${a.meta.slug}`,
      lastModified: new Date(a.meta.updated || a.meta.date),
      changeFrequency: "weekly",
      priority: a.meta.featured ? 0.8 : 0.6,
    }));

  // Pages marques : générer les mêmes que dans /marque/[slug] generateStaticParams
  // (marques avec ≥ 3 articles OU dans la liste curated).
  // Avant : 0 page /marque dans le sitemap → mauvaise découvrabilité Google.
  const tagCounts = new Map<string, number>();
  for (const article of articles) {
    const seen = new Set<string>();
    for (const tag of article.meta.tags || []) {
      const slug = slugifyTag(tag);
      if (slug && !seen.has(slug)) {
        seen.add(slug);
        tagCounts.set(slug, (tagCounts.get(slug) || 0) + 1);
      }
    }
  }
  const marqueEntries: MetadataRoute.Sitemap = Array.from(tagCounts.entries())
    .filter(([slug, count]) => CURATED_BRAND_SLUGS.has(slug) || count >= MIN_ARTICLES_FOR_MARQUE_PAGE)
    .map(([slug]) => ({
      url: `${BASE}/marque/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  return [...staticEntries, ...categoryEntries, ...articleEntries, ...marqueEntries];
}
