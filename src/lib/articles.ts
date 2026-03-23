import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  image: string;
  imageAlt: string;
  rating?: number;
  price?: string;
  affiliateUrl?: string;
  affiliateLabel?: string;
  readingTime: string;
  published: boolean;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Article {
  meta: ArticleMeta;
  content: string;
}

function findMdxFiles(dir: string): { slug: string; filePath: string }[] {
  if (!fs.existsSync(dir)) return [];
  const results: { slug: string; filePath: string }[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      results.push({ slug: entry.name.replace(/\.mdx$/, ""), filePath: fullPath });
    }
  }
  return results;
}

function getFileMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const { slug, filePath } of findMdxFiles(CONTENT_DIR)) {
    map.set(slug, filePath);
  }
  return map;
}

export function getArticleSlugs(): string[] {
  return Array.from(getFileMap().keys());
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = getFileMap().get(slug);
  if (!filePath || !fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);
  return {
    meta: {
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      updated: data.updated,
      category: data.category || "bon-plan",
      tags: data.tags || [],
      image: data.image || "/images/placeholder.svg",
      imageAlt: data.imageAlt || data.title || "",
      rating: data.rating,
      price: data.price,
      affiliateUrl: data.affiliateUrl,
      affiliateLabel: data.affiliateLabel,
      readingTime: stats.text.replace("min read", "min"),
      published: data.published !== false,
      featured: data.featured || false,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
    },
    content,
  };
}

export function getAllArticles(): Article[] {
  return getArticleSlugs()
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => a !== null && a.meta.published)
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.meta.category === category);
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter((a) => a.meta.featured);
}

export function getRelatedArticles(slug: string, category: string, limit = 3, tags: string[] = []): Article[] {
  const all = getAllArticles().filter((a) => a.meta.slug !== slug);
  const currentArticle = getArticleBySlug(slug);
  const hasAffiliate = !!currentArticle?.meta.affiliateUrl;

  // Scoring amélioré : tags en commun + même catégorie + bonus fraîcheur + diversité
  const now = Date.now();
  const scored = all.map((a) => {
    const tagScore = a.meta.tags.filter((t) => tags.includes(t)).length;
    const catScore = a.meta.category === category ? 2 : 0;
    // Bonus pour les articles récents (max +1 pour articles < 7 jours)
    const ageMs = now - new Date(a.meta.date).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const freshnessScore = ageDays < 7 ? 1 : ageDays < 30 ? 0.5 : 0;
    // Bonus pour les articles plus longs (contenu riche)
    const lengthScore = a.content.length > 2000 ? 0.5 : 0;
    return { article: a, score: tagScore + catScore + freshnessScore + lengthScore };
  });

  // Trier par score puis sélectionner avec diversité de catégorie
  const sorted = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const matched: Article[] = [];
  const usedCategories = new Set<string>();

  // D'abord, essayer de varier les catégories parmi les top scores
  for (const s of sorted) {
    if (matched.length >= limit) break;
    // Accepter max 2 articles de la même catégorie pour garder de la diversité
    const catCount = matched.filter((m) => m.meta.category === s.article.meta.category).length;
    if (catCount < 2) {
      matched.push(s.article);
      usedCategories.add(s.article.meta.category);
    }
  }

  // Si pas assez, compléter avec les meilleurs scores restants
  if (matched.length < limit) {
    const seen = new Set(matched.map((a) => a.meta.slug));
    for (const s of sorted) {
      if (matched.length >= limit) break;
      if (!seen.has(s.article.meta.slug)) {
        matched.push(s.article);
        seen.add(s.article.meta.slug);
      }
    }
  }

  // Fallback : articles récents de catégories différentes
  if (matched.length < limit) {
    const seen = new Set(matched.map((a) => a.meta.slug));
    const fallback = all
      .filter((a) => !seen.has(a.meta.slug))
      .filter((a) => !usedCategories.has(a.meta.category) || matched.length < limit - 1)
      .slice(0, limit - matched.length);
    matched.push(...fallback);
  }

  // Si l'article courant n'est pas affilié, remplacer le dernier article
  // par un article affilié pertinent pour la monétisation
  if (!hasAffiliate && matched.length > 0) {
    const matchedSlugs = new Set(matched.map((a) => a.meta.slug));
    // Chercher un article affilié dans la même catégorie d'abord
    const affiliateArticle = all.find(
      (a) => a.meta.affiliateUrl && !matchedSlugs.has(a.meta.slug) && a.meta.category === category
    ) || all.find(
      (a) => a.meta.affiliateUrl && !matchedSlugs.has(a.meta.slug)
    );
    if (affiliateArticle) {
      matched[matched.length - 1] = affiliateArticle;
    }
  }

  return matched;
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((a) => a.meta.tags.includes(tag));
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const article of getAllArticles()) {
    for (const tag of article.meta.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
