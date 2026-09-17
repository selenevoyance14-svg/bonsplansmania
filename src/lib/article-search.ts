export interface SearchableArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
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

export function searchArticles<T extends SearchableArticle>(articles: T[], query: string): T[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const words = normalizedQuery.split(" ");
  const terms = words.filter((word) => !SEARCH_STOP_WORDS.has(word));
  const searchedTerms = terms.length ? terms : words;

  return articles
    .map((article, index) => {
      const title = normalizeSearchText(article.title);
      const description = normalizeSearchText(article.description);
      const tags = normalizeSearchText(article.tags.join(" "));
      const category = normalizeSearchText(article.category);
      const slug = normalizeSearchText(article.slug);
      const all = `${title} ${description} ${tags} ${category} ${slug}`;

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
