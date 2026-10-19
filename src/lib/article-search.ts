import { extractPriceAmount, parsePrice } from "@/lib/price";

export interface SearchableArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price?: string;
  expired?: boolean;
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const SEARCH_STOP_WORDS = new Set(["a", "au", "aux", "de", "des", "du", "en", "et", "la", "le", "les", "l", "d", "pour", "sur", "un", "une"]);
const BUDGET_WORDS = new Set(["euro", "euros", "entre", "moins", "plus", "jusqua", "maximum", "minimum"]);
const GIFT_SHOPPING_CATEGORIES = new Set([
  "bon-plan",
  "bon-plan-beaute",
  "box-beaute",
  "calendrier",
  "calendrier-avent",
]);

type SearchBudget = {
  min?: number;
  max?: number;
  minInclusive: boolean;
  maxInclusive: boolean;
};

function parseSearchBudget(normalizedQuery: string): SearchBudget | null {
  if (!/\beuros?\b/.test(normalizedQuery)) return null;

  const amounts = Array.from(normalizedQuery.matchAll(/\b\d+(?:[.,]\d+)?\b/g))
    .map((match) => Number.parseFloat(match[0].replace(",", ".")))
    .filter(Number.isFinite);
  if (amounts.length === 0) return null;

  if (/\bmoins\b/.test(normalizedQuery)) {
    return { max: amounts[0], minInclusive: true, maxInclusive: false };
  }
  if (/\bplus\b/.test(normalizedQuery)) {
    return { min: amounts[0], minInclusive: false, maxInclusive: true };
  }
  if (amounts.length >= 2) {
    return {
      min: Math.min(amounts[0], amounts[1]),
      max: Math.max(amounts[0], amounts[1]),
      minInclusive: true,
      maxInclusive: true,
    };
  }
  return null;
}

function matchesBudget(article: SearchableArticle, budget: SearchBudget): boolean {
  const amount = parsePrice(article.price).nowAmount
    ?? extractPriceAmount(`${article.title} ${article.description}`);
  if (amount === undefined) return false;
  if (budget.min !== undefined) {
    if (budget.minInclusive ? amount < budget.min : amount <= budget.min) return false;
  }
  if (budget.max !== undefined) {
    if (budget.maxInclusive ? amount > budget.max : amount >= budget.max) return false;
  }
  return true;
}

export function searchArticles<T extends SearchableArticle>(articles: T[], query: string): T[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const budget = parseSearchBudget(normalizedQuery);
  const isGiftBudgetSearch = !!budget && /\bcadeaux?\b/.test(normalizedQuery);
  const words = normalizedQuery.split(" ");
  const terms = words.filter((word) =>
    !SEARCH_STOP_WORDS.has(word)
    && (!budget || (!BUDGET_WORDS.has(word) && !/^\d+(?:[.,]\d+)?$/.test(word)))
  );
  const searchedTerms = terms.length ? terms : words;

  return articles
    .map((article, index) => {
      const title = normalizeSearchText(article.title);
      const description = normalizeSearchText(article.description);
      const tags = normalizeSearchText(article.tags.join(" "));
      const category = normalizeSearchText(article.category);
      const slug = normalizeSearchText(article.slug);
      const all = `${title} ${description} ${tags} ${category} ${slug}`;

      // Une recherche « cadeau + budget » doit proposer des articles que le
      // lecteur peut réellement acheter dans cette tranche de prix. On écarte
      // donc les concours, tests, guides, comparatifs et codes promo génériques.
      if (isGiftBudgetSearch && (article.expired || !GIFT_SHOPPING_CATEGORIES.has(article.category))) {
        return null;
      }
      if (budget && !matchesBudget(article, budget)) return null;

      // Chaque mot peut se trouver dans un champ différent et une recherche au
      // pluriel retrouve aussi la forme singulière (ex. « glaçons »).
      const matches = searchedTerms.every((term) =>
        all.includes(term) || (term.length > 3 && term.endsWith("s") && all.includes(term.slice(0, -1)))
      );
      if (!matches) return null;

      let score = 0;
      if (title === normalizedQuery) score += 100;
      else if (title.includes(normalizedQuery)) score += 60;
      if (tags.includes(normalizedQuery)) score += 20;
      for (const term of searchedTerms) {
        if (title.includes(term)) score += 12;
        if (tags.includes(term)) score += 6;
        if (description.includes(term)) score += 3;
        if (slug.includes(term)) score += 2;
      }
      return { article, score, index };
    })
    .filter((result): result is { article: T; score: number; index: number } => result !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ article }) => article);
}
