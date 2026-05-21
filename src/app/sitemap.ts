import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const BASE = "https://bonsplansmania.fr";

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "",                          priority: 1.0, changeFrequency: "daily" },
  { path: "/blog",                     priority: 0.9, changeFrequency: "daily" },
  { path: "/bons-plans-en-cours",      priority: 0.9, changeFrequency: "daily" },
  { path: "/codes-promo-permanents",   priority: 0.8, changeFrequency: "weekly" },
  { path: "/code-promo",               priority: 0.8, changeFrequency: "weekly" },
  { path: "/bons-plans-bebe",          priority: 0.8, changeFrequency: "weekly" },
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
  "concours",
  "box-beaute",
  "beaute",
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
    .filter((a) => !a.meta.expired)
    .map((a) => ({
      url: `${BASE}/article/${a.meta.slug}`,
      lastModified: new Date(a.meta.updated || a.meta.date),
      changeFrequency: "weekly",
      priority: a.meta.featured ? 0.8 : 0.6,
    }));

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}
