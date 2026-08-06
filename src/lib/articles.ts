import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { parsePrice } from "@/lib/price";
import { slugifyTag } from "@/lib/tag-pages";

const CONTENT_DIR = path.join(process.cwd(), "content");
const FALLBACK_ARTICLE_IMAGE = "/images/articles/_placeholder-bonsplansmania.png";
const ARCHIVE_ARTICLE_IMAGES = {
  concours: "/images/articles/_archive-concours-termine.png",
  "test-gratuit": "/images/articles/_archive-test-produit-termine.png",
  default: "/images/articles/_archive-offre-expiree.png",
} as const;
const ARTICLE_IMAGES_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "articles"
);
const ARTICLE_IMAGE_FILENAMES = new Set(
  fs.existsSync(ARTICLE_IMAGES_DIR) ? fs.readdirSync(ARTICLE_IMAGES_DIR) : []
);
const AMAZON_PARTNER_TAG = "lebrunnathali-21";

function isAmazonUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return (
      hostname === "amzn.to" ||
      hostname === "amzn.eu" ||
      hostname === "link.amazon" ||
      hostname === "amazon.fr" ||
      hostname.endsWith(".amazon.fr")
    );
  } catch {
    return false;
  }
}

function isAmazonArticle(data: Record<string, unknown>, content: string): boolean {
  const tags = Array.isArray(data.tags) ? data.tags : [];
  return (
    isAmazonUrl(data.affiliateUrl) ||
    tags.some((tag) => typeof tag === "string" && /amazon/i.test(tag)) ||
    (typeof data.title === "string" && /amazon/i.test(data.title)) ||
    /https?:\/\/(?:www\.)?(?:amazon\.fr|amzn\.to|amzn\.eu|link\.amazon)\//i.test(content)
  );
}

/**
 * Les prix, notes et volumes d'avis Amazon ne sont pas publiés sans PA-API.
 * Les liens affiliés et l'analyse éditoriale restent intacts.
 */
function sanitizeAmazonClaims(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value
    .replace(
      /[^.!?\n]*(?:\b[0-5](?:[,.]\d+)?[ \t]*\/[ \t]*5\b|\b\d[\d\u00a0 ]*(?:avis|commentaires)(?:[ \t]+clients?)?\b)[^.!?\n]*[.!?]?/giu,
      ""
    )
    .replace(
      /(?:\*{1,2})?\b[0-5](?:[,.]\d+)?[ \t]*\/[ \t]*5\b(?:\*{1,2})?/giu,
      "note à consulter sur Amazon"
    )
    .replace(
      /(?:\*{1,2})?\b\d[\d\u00a0 ]*(?:avis|commentaires)(?:[ \t]+clients?)?\b(?:\*{1,2})?/giu,
      "avis clients à consulter sur Amazon"
    )
    // Supprime les anciens prix/remises fixes : le prix actuel est affiché
    // séparément par AmazonLiveOffer grâce à l'API officielle Amazon.
    .replace(
      /[ \t]+(?:à|au prix de|pour|dès|à partir de)[ \t]+(?:\*{1,2})?\d[\d\u00a0 ]*(?:[,.]\d{1,2})?[ \t\u00a0]*(?:€|euros?)(?:\*{1,2})?(?:[ \t]+au lieu de[ \t]+(?:\*{1,2})?\d[\d\u00a0 ]*(?:[,.]\d{1,2})?[ \t\u00a0]*(?:€|euros?)(?:\*{1,2})?)?/giu,
      ""
    )
    .replace(
      /(?:\*{1,2})?\b\d[\d\u00a0 ]*(?:[,.]\d{1,2})?[ \t\u00a0]*(?:€|euros?)(?:\*{1,2})?(?:[ \t]+au lieu de[ \t]+(?:\*{1,2})?\d[\d\u00a0 ]*(?:[,.]\d{1,2})?[ \t\u00a0]*(?:€|euros?)(?:\*{1,2})?)?/giu,
      ""
    )
    .replace(/\s*\((?:\*{1,2})?(?:−|-)?\s*\d{1,2}\s*%(?:\*{1,2})?[^)]*\)/giu, "")
    .replace(/(?:\*{1,2})?(?:−|-)\s*\d{1,2}\s*%(?:\*{1,2})?/giu, "")
    .replace(/\b(?:passent|tombent)\s+sur Amazon/giu, "sont disponibles sur Amazon")
    .replace(/\b(?:passe|tombe)\s+sur Amazon/giu, "est disponible sur Amazon")
    .replace(/\bprix actuel à vérifier(?:\s+sur Amazon)?/giu, "offre actuelle sur Amazon")
    .replace(/,?[ \t]+ce qui revient à seulement[ \t]+(?:la paire)?\*{0,2}/giu, "")
    .replace(/^-[ \t]+(?:\*{0,2})?(?:de réduction|la paire)(?:\*{0,2})?[ \t]+—.*$/gimu, "")
    .replace(/^-[ \t]+\*{0,2}Livraison gratuite\*{0,2}[ \t]+sur les commandes Amazon de[ \t]*\+.*$/gimu, "- **Livraison** selon les conditions affichées sur Amazon")
    .replace(/À[ \t]+la paire de [^,.]+,[ \t]+c'est imbattable\./giu, "Avec ce grand format, l'offre est économique et pratique.")
    .replace(/\b(?:la paire|de réduction)\*{1,2}/giu, (match) => match.replace(/\*+/g, ""))
    .replace(/\s*(?:—|,)?\s*(?:soit\s*)?(?:d['’]?économie|d economie)(?:\s+de)?(?=\s*[.,]|$)/giu, "")
    .replace(/,?\s+soit(?=\s*[.,])/giu, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s*\)/g, "")
    .trim();
}

function sanitizeAmazonContent(content: string): string {
  const withoutStoredAmazonImages = content.replace(
    /^!?\[[^\]]*\]\(\/images\/amazon\/[^)]+\)\s*$/gimu,
    ""
  );
  return (sanitizeAmazonClaims(withoutStoredAmazonImages) || "")
    // Un ancien prix entouré de Markdown pouvait laisser un marqueur gras
    // orphelin après sa suppression. Le texte reste volontairement sans gras
    // plutôt que de casser tout le rendu de l'article.
    .replace(/\*{1,3}/g, "")
    .replace(/[ \t]*\(au lieu de[ \t]*,[ \t]*(?:soit[ \t]*)?(?:sur Amazon)?[.,]?[ \t]*\)/giu, "")
    .replace(/^\|[ \t]*Prix Amazon[ \t]*\|[ \t]*\|$/gimu, "| Prix Amazon | Voir le prix actuel sur Amazon |")
    .replace(/(💰[ \t]*Prix[ \t]*:)[ \t]*[.,]/giu, "$1 voir le prix actuel sur Amazon.")
    .replace(/[ \t]+au lieu de(?=[ \t]*[.,;:!?])/giu, "")
    .replace(/,?[ \t]+soit(?=[ \t]*[.,;:!?])/giu, "")
    .replace(/\n{3,}/g, "\n\n");
}

function secureAmazonAffiliateUrl(url: unknown): string | undefined {
  if (typeof url !== "string" || !url.trim()) return undefined;

  const value = url.trim();

  try {
    const parsed = new URL(value);
    if (
      parsed.hostname === "amazon.fr" ||
      parsed.hostname.endsWith(".amazon.fr")
    ) {
      parsed.searchParams.set("tag", AMAZON_PARTNER_TAG);
      return parsed.toString();
    }
  } catch {
    return value;
  }

  return value;
}

function extractAmazonAsin(data: Record<string, unknown>, content: string): string | undefined {
  const explicit = typeof data.amazonAsin === "string" ? data.amazonAsin.trim().toUpperCase() : "";
  if (/^[A-Z0-9]{10}$/.test(explicit)) return explicit;

  const candidates = [data.affiliateUrl, content]
    .filter((value): value is string => typeof value === "string")
    .join("\n");
  const match = candidates.match(/amazon\.fr\/[^\s)"']*\/dp\/([A-Z0-9]{10})/i)
    || candidates.match(/amazon\.fr\/dp\/([A-Z0-9]{10})/i);
  return match?.[1]?.toUpperCase();
}

function resolveArticleImage(image: unknown): string {
  const value =
    typeof image === "string" && image.trim()
      ? image.trim()
      : FALLBACK_ARTICLE_IMAGE;

  if (!value.startsWith("/images/articles/")) return value;

  const filename = value.slice("/images/articles/".length);
  return ARTICLE_IMAGE_FILENAMES.has(filename)
    ? value
    : FALLBACK_ARTICLE_IMAGE;
}

/**
 * Les archives utilisent un visuel explicite sans écraser l'image d'origine
 * enregistrée dans le frontmatter. Un retrait accidentel du statut `expired`
 * restaure donc automatiquement le véritable visuel de l'article.
 */
export function getArchiveArticleImage(category: string): string {
  if (category === "concours") return ARCHIVE_ARTICLE_IMAGES.concours;
  if (category === "test-gratuit") {
    return ARCHIVE_ARTICLE_IMAGES["test-gratuit"];
  }
  return ARCHIVE_ARTICLE_IMAGES.default;
}

function getArchiveArticleImageAlt(category: string): string {
  if (category === "concours") return "Concours terminé";
  if (category === "test-gratuit") return "Test produit terminé";
  return "Offre expirée";
}

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
  amazonAsin?: string;
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
  const amazonArticle = isAmazonArticle(data, content);
  const safeContent = amazonArticle ? sanitizeAmazonContent(content) : content;
  const stats = readingTime(safeContent);
  const category = data.category || "bon-plan";
  const expired = data.expired === true;
  const endDate = data.endDate;
  const isExpired = isEffectivelyExpired({ expired, endDate });
  return {
    meta: {
      slug,
      title: (amazonArticle ? sanitizeAmazonClaims(data.title) : data.title) || "",
      description: (amazonArticle ? sanitizeAmazonClaims(data.description) : data.description) || "",
      date: data.date || new Date().toISOString(),
      updated: data.updated,
      category,
      tags: data.tags || [],
      image: isExpired
        ? getArchiveArticleImage(category)
        : amazonArticle && typeof data.image === "string" && data.image.startsWith("/images/amazon/")
          ? FALLBACK_ARTICLE_IMAGE
          : resolveArticleImage(data.image),
      imageAlt: isExpired
        ? getArchiveArticleImageAlt(category)
        : (amazonArticle ? sanitizeAmazonClaims(data.imageAlt || data.title) : data.imageAlt || data.title) || "",
      rating: amazonArticle ? undefined : data.rating,
      price: amazonArticle ? undefined : data.price,
      affiliateUrl: secureAmazonAffiliateUrl(data.affiliateUrl),
      affiliateLabel: data.affiliateLabel,
      amazonAsin: amazonArticle ? extractAmazonAsin(data, content) : undefined,
      readingTime: stats.text.replace("min read", "min"),
      published: data.published !== false,
      featured: data.featured || false,
      seoTitle: amazonArticle ? sanitizeAmazonClaims(data.seoTitle) : data.seoTitle,
      seoDescription: amazonArticle ? sanitizeAmazonClaims(data.seoDescription) : data.seoDescription,
      expired,
      evergreen: data.evergreen || false,
      endDate,
      dealOfDay: data.dealOfDay || false,
      noindex: data.noindex || false,
    },
    content: safeContent,
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
    .sort((a, b) => {
      const aExp = isEffectivelyExpired(a.meta);
      const bExp = isEffectivelyExpired(b.meta);
      if (aExp !== bExp) return aExp ? 1 : -1;
      return getEffectiveSortDate(b.meta) - getEffectiveSortDate(a.meta);
    });
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
    const { nowAmount, wasAmount, discountPct } = parsePrice(a.meta.price);
    if (
      nowAmount === undefined ||
      wasAmount === undefined ||
      wasAmount <= nowAmount
    ) continue;
    const pct =
      discountPct ?? ((wasAmount - nowAmount) / wasAmount) * 100;
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
 * Retourne les articles dont un tag correspond exactement au slug demandé
 * après normalisation. Contrairement à une recherche textuelle, cette fonction
 * ne rapproche jamais une marque d'un article qui la cite seulement dans son
 * titre, son contenu ou son URL.
 *
 * Exemple : les tags "Carrefour" et "carrefour" alimentent tous les deux
 * /marque/carrefour, sans inclure Greenweez ni "carrefour market" par erreur.
 */
export function getArticlesByTagSlug(tagSlug: string): Article[] {
  return getAllArticles().filter((article) =>
    article.meta.tags.some((tag) => slugifyTag(tag) === tagSlug)
  );
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
 * Retourne des offres multi-affiliation hors Amazon
 * (Awin, Affilae, Effiliation, Tradedoubler, TimeOne, etc.).
 * Utilisé pour le cross-sell premium en tête des articles freebies (concours, test-gratuit)
 * qui ne génèrent pas de revenu direct.
 *
 * Priorité : proximité thématique avec l'article courant, offre active, prix renseigné,
 * mise en avant éditoriale et fraîcheur. Le but est d'éviter une sélection commerciale
 * aléatoire qui ferait baisser le taux de clic.
 */
export function getTopPremiumDeals(currentSlug: string, limit = 4): Article[] {
  const PREMIUM_DOMAINS = [
    "awin1.com",
    "tidd.ly",
    "lb.affilae.com",
    "c3po.link",
    "tracking.publicidees.com",
    "track.effiliation.com",
    "clk.tradedoubler.com",
    "action.metaffiliation.com",
    "a.time1.me",
    "fnty.co",
    "lk.gt",
    "fr.igraal.com",
    "ebuyclub.com",
    "poulpeo.com",
    "ystyle.co",
    "ryt.leanature.com",
    "nwq.atida.fr",
  ];

  const isPremium = (url?: string) => {
    if (!url) return false;
    return PREMIUM_DOMAINS.some((d) => url.includes(d));
  };

  const currentArticle = getArticleBySlug(currentSlug);
  const genericTag = /^(202[0-9]|bon plan|bons plans|concours|test gratuit|test-gratuit|promo|promotion|amazon|argent|juillet-2026|juin-2026|mai-2026)$/i;
  const currentTags = new Set(
    (currentArticle?.meta.tags ?? [])
      .map((tag) => tag.trim().toLocaleLowerCase("fr"))
      .filter((tag) => tag && !genericTag.test(tag)),
  );

  const candidates = getAllArticles()
    .filter((a) => a.meta.slug !== currentSlug)
    .filter((a) => !isEffectivelyExpired(a.meta))
    .filter((a) => isPremium(a.meta.affiliateUrl))
    .filter((a) => a.meta.image && a.meta.image !== "/images/placeholder.svg");

  const now = Date.now();
  const sharedTagCount = (article: Article) =>
    article.meta.tags.reduce((count, tag) => {
      const normalized = tag.trim().toLocaleLowerCase("fr");
      return count + (currentTags.has(normalized) ? 1 : 0);
    }, 0);

  const score = (article: Article) => {
    const sharedTags = sharedTagCount(article);
    const ageDays = Math.max(
      0,
      (now - new Date(`${article.meta.date}T12:00:00`).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const freshness = ageDays <= 7 ? 3 : ageDays <= 30 ? 2 : ageDays <= 90 ? 1 : 0;

    return (
      sharedTags * 5 +
      (article.meta.price ? 2 : 0) +
      (article.meta.featured ? 1 : 0) +
      freshness
    );
  };

  candidates.sort((a, b) => {
    const scoreDifference = score(b) - score(a);
    if (scoreDifference !== 0) return scoreDifference;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  const relevantCandidates = candidates.filter(
    (article) => sharedTagCount(article) > 0,
  );
  const selectedCandidates =
    relevantCandidates.length > 0
      ? relevantCandidates
      : candidates.slice(0, Math.min(2, limit));

  // Diversifier par catégorie : max 2 articles de la même catégorie dans le top
  const result: Article[] = [];
  const catCount = new Map<string, number>();
  for (const a of selectedCandidates) {
    if (result.length >= limit) break;
    const c = catCount.get(a.meta.category) || 0;
    if (c >= 2) continue;
    result.push(a);
    catCount.set(a.meta.category, c + 1);
  }

  // Fallback si pas assez d'articles diversifiés
  if (result.length < limit) {
    const seen = new Set(result.map((a) => a.meta.slug));
    for (const a of selectedCandidates) {
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
