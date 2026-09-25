import type { MetadataRoute } from "next";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
// Une seule source de vérité pour les pages /marque/ : le sitemap dupliquait la règle
// et pouvait donc soumettre à Google des URL que le build ne génère pas (ou l'inverse).
import { getStaticTagSlugs } from "@/lib/tag-pages";
import {
  BRAND_DEFINITIONS,
  getNormalizedBrandTags,
  normalizeBrandTag,
} from "@/lib/brand-directory";
import { CODE_PROMO_BRANDS } from "@/lib/code-promo-data";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";

const BASE = "https://bonsplansmania.fr";

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  // Un sitemap ne doit lister que des pages qu'on demande à Google d'indexer.
  // /blog (doublon de tout le site) et /fete-des-peres (périmée depuis le
  // 21 juin) sont passées en `noindex` : les laisser ici revenait à les
  // soumettre tout en demandant de ne pas les afficher. Elles restent en ligne
  // et navigables. Les deux hubs saisonniers, eux, restent indexés une fois
  // leur filtre corrigé.
  { path: "",                          priority: 1.0, changeFrequency: "daily" },
  { path: "/bons-plans-en-cours",      priority: 0.9, changeFrequency: "daily" },
  { path: "/tenir-son-budget",         priority: 0.9, changeFrequency: "monthly" },
  { path: "/ete",                      priority: 0.9, changeFrequency: "daily" },
  { path: "/noel",                     priority: 0.8, changeFrequency: "weekly" },
  { path: "/calendriers-de-l-avent-concours-2026", priority: 0.9, changeFrequency: "daily" },
  { path: "/calendriers-de-l-avent-2026", priority: 0.9, changeFrequency: "daily" },
  { path: "/idees-cadeaux-noel-2026",    priority: 0.9, changeFrequency: "daily" },
  { path: "/meilleures-box-beaute",      priority: 0.9, changeFrequency: "daily" },
  { path: "/guide-solaires-2026",         priority: 0.9, changeFrequency: "daily" },
  { path: "/guide-air-fryer-2026",        priority: 0.9, changeFrequency: "daily" },
  { path: "/tests-produits-gratuits-2026", priority: 0.9, changeFrequency: "daily" },
  { path: "/marques-partenaires",        priority: 0.8, changeFrequency: "weekly" },
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
  { path: "/qui-suis-je",             priority: 0.4, changeFrequency: "monthly" },
  { path: "/archives/bons-plans",      priority: 0.5, changeFrequency: "weekly" },
  { path: "/archives/concours",        priority: 0.5, changeFrequency: "weekly" },
  { path: "/archives/tests-produits",  priority: 0.5, changeFrequency: "weekly" },
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
  "selection",
  "concours",
  "box-beaute",
  "calendrier",
  "calendrier-avent",
  "code-promo",
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE}/categorie/${slug}`,
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

  // Reprendre exactement les slugs réellement générés par /marque/[slug].
  // Cela inclut les partenaires qui ont des articles, même lorsqu'ils restent
  // sous le seuil général des pages de tags.
  const marqueSlugs = getStaticTagSlugs(
    articles.map((article) => article.meta.tags || []),
  );
  for (const brand of BRAND_DEFINITIONS) {
    const normalizedTags = getNormalizedBrandTags(brand);
    if (
      articles.some((article) =>
        article.meta.tags.some((tag) =>
          normalizedTags.has(normalizeBrandTag(tag)),
        ),
      )
    ) {
      marqueSlugs.add(brand.slug);
    }
  }
  const marqueEntries: MetadataRoute.Sitemap = [...marqueSlugs].map((slug) => ({
      url: `${BASE}/marque/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  const codePromoEntries: MetadataRoute.Sitemap = CODE_PROMO_BRANDS.map((brand) => ({
    url: `${BASE}/code-promo/${brand.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = COMMUNITY_PRODUCTS.map((product) => ({
    url: `${BASE}/produit/${product.slug}`,
    lastModified: new Date(product.addedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dernier garde-fou : une URL ne doit apparaître qu'une fois, même si une
  // future page est ajoutée par erreur dans plusieurs groupes ci-dessus.
  const entries = [
    ...staticEntries,
    ...categoryEntries,
    ...articleEntries,
    ...marqueEntries,
    ...codePromoEntries,
    ...productEntries,
  ];
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
