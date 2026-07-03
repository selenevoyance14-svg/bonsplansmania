import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Cache mémoire pour éviter de relire 1105 fichiers à chaque appel
let _fileMapCache: Map<string, string> | null = null;
let _allArticlesCache: Article[] | null = null;

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
  expired?: boolean;
  /** Bon plan permanent (cashback, parrainage, plateforme durable). Désactive le bandeau "post >3 semaines". */
  evergreen?: boolean;
  /** Date de fin de l'offre/concours au format YYYY-MM-DD. Si dépassée, l'article est considéré comme expiré. */
  endDate?: string;
  dealOfDay?: boolean;
  noindex?: boolean;
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
  if (_fileMapCache) return _fileMapCache;
  const map = new Map<string, string>();
  for (const { slug, filePath } of findMdxFiles(CONTENT_DIR)) {
    map.set(slug, filePath);
  }
  _fileMapCache = map;
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
      expired: data.expired || false,
      endDate: data.endDate,
      dealOfDay: data.dealOfDay || false,
    },
    content,
  };
}

/**
 * Détermine si un article doit être considéré comme expiré :
 *   - flag manuel `expired: true` OU
 *   - date `endDate` dépassée (fin de journée incluse)
 */
export function isEffectivelyExpired(meta: Pick<ArticleMeta, "expired" | "endDate">): boolean {
  if (meta.expired) return true;
  if (meta.endDate) {
    const end = new Date(meta.endDate + "T23:59:59");
    if (end.getTime() < Date.now()) return true;
  }
  return false;
}

/**
 * Indique si un article se termine prochainement (par défaut dans les 7 prochains jours).
 * Renvoie false si l'article n'a pas de endDate ou s'il est déjà expiré.
 */
export function expiresSoon(meta: Pick<ArticleMeta, "expired" | "endDate">, daysThreshold = 7): boolean {
  if (!meta.endDate) return false;
  if (isEffectivelyExpired(meta)) return false;
  const end = new Date(meta.endDate + "T23:59:59").getTime();
  const diffDays = (end - Date.now()) / (1000 * 60 * 60 * 24);
  return diffDays <= daysThreshold;
}

/**
 * Date utilisée pour le tri : max(date, updated).
 * Permet de faire remonter un vieux concours toujours actif en mettant son `updated` à jour.
 */
function getEffectiveSortDate(meta: Pick<ArticleMeta, "date" | "updated">): number {
  const dateTime = new Date(meta.date).getTime();
  if (meta.updated) {
    const updatedTime = new Date(meta.updated).getTime();
    if (Number.isFinite(updatedTime) && updatedTime > dateTime) return updatedTime;
  }
  return dateTime;
}

export function getAllArticles(): Article[] {
  if (_allArticlesCache) return _allArticlesCache;
  _allArticlesCache = getArticleSlugs()
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => a !== null && a.meta.published)
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
  return _allArticlesCache;
}

export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles().filter((a) => a.meta.category === category);
  return [...articles].sort((a, b) => {
    const aExp = isEffectivelyExpired(a.meta);
    const bExp = isEffectivelyExpired(b.meta);
    if (aExp !== bExp) return aExp ? 1 : -1;
    return getEffectiveSortDate(b.meta) - getEffectiveSortDate(a.meta);
  });
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter((a) => a.meta.featured);
}

/**
 * Returns the "Deal of the Day" article.
 * Priority:
 *   1. Manual override: any non-expired article with `dealOfDay: true`
 *   2. Auto fallback: best % discount among non-expired articles published in the last 7 days
 * Returns null if nothing qualifies.
 */
export function getDealOfDay(): Article | null {
  const all = getAllArticles().filter((a) => !isEffectivelyExpired(a.meta));

  const manual = all.find((a) => a.meta.dealOfDay);
  if (manual) return manual;

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let best: { article: Article; pct: number } | null = null;
  for (const a of all) {
    const t = new Date(a.meta.date + "T12:00:00").getTime();
    if (t < sevenDaysAgo) continue;
    if (!a.meta.price) continue;
    const m = a.meta.price.match(/^(.+?)\s*au lieu de\s*(.+?)$/i);
    if (!m) continue;
    const now = parseFloat(m[1].replace(/[^\d,.]/g, "").replace(",", "."));
    const was = parseFloat(m[2].replace(/[^\d,.]/g, "").replace(",", "."));
    if (!Number.isFinite(now) || !Number.isFinite(was) || was <= now) continue;
    const pct = ((was - now) / was) * 100;
    if (!best || pct > best.pct) best = { article: a, pct };
  }
  return best?.article ?? null;
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

/**
 * Retourne les articles précédent et suivant (chronologiquement) dans la même catégorie.
 * Utilisé en bas d'article pour offrir une navigation séquentielle aux visiteurs et à Google
 * (renforce le maillage interne entre articles de la même catégorie).
 */
export function getPrevNextArticle(slug: string, category: string): { prev: Article | null; next: Article | null } {
  const sameCategory = getArticlesByCategory(category);
  const idx = sameCategory.findIndex((a) => a.meta.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  // Articles triés par date desc (getAllArticles) → next = plus récent (idx-1), prev = plus ancien (idx+1)
  return {
    next: idx > 0 ? sameCategory[idx - 1] : null,
    prev: idx < sameCategory.length - 1 ? sameCategory[idx + 1] : null,
  };
}

/**
 * Retourne les meilleurs "bons plans premium" : articles affiliés à FORTE commission
 * (Awin, Igraal, Rakuten, Effiliation, etc.) en EXCLUANT Amazon (commission 3% seulement).
 * Utilisé pour le cross-sell premium en tête des articles freebies (concours, test-gratuit)
 * qui ne génèrent pas de revenu direct.
 *
 * Tri : récents en premier, non expirés, avec image, prix de préférence.
 */
export function getTopPremiumDeals(currentSlug: string, limit = 4): Article[] {
  const PREMIUM_DOMAINS = [
    "tidd.ly",          // Awin (Cdiscount, Showroom, Atelier Sourcil, Zooplus, Dr Pierre Ricaud...)
    "lk.gt",            // Igraal / Skimlinks (Biotyfull...)
    "c3po.link",        // Affilae / autres
    "fnty.co",          // Rakuten (Fnac, Darty, News Parfums)
    "tracking.publicidees.com",
    "track.effiliation.com",
    "a.time1.me",
    "fr.igraal.com",
    "ystyle.co",        // YesStyle (5-10% commission, mid-tier)
  ];

  const isPremium = (url?: string) => {
    if (!url) return false;
    return PREMIUM_DOMAINS.some((d) => url.includes(d));
  };

  const candidates = getAllArticles()
    .filter((a) => a.meta.slug !== currentSlug)
    .filter((a) => !isEffectivelyExpired(a.meta))
    .filter((a) => isPremium(a.meta.affiliateUrl))
    .filter((a) => a.meta.image && a.meta.image !== "/images/placeholder.svg");

  // Tri : articles AVEC prix d'abord, puis par date décroissante
  candidates.sort((a, b) => {
    const aHasPrice = a.meta.price ? 1 : 0;
    const bHasPrice = b.meta.price ? 1 : 0;
    if (aHasPrice !== bHasPrice) return bHasPrice - aHasPrice;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  // Diversifier par catégorie : max 2 articles de la même catégorie dans le top
  const result: Article[] = [];
  const catCount = new Map<string, number>();
  for (const a of candidates) {
    if (result.length >= limit) break;
    const c = catCount.get(a.meta.category) || 0;
    if (c >= 2) continue;
    result.push(a);
    catCount.set(a.meta.category, c + 1);
  }

  // Fallback si pas assez d'articles diversifiés
  if (result.length < limit) {
    const seen = new Set(result.map((a) => a.meta.slug));
    for (const a of candidates) {
      if (result.length >= limit) break;
      if (!seen.has(a.meta.slug)) result.push(a);
    }
  }

  return result;
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
