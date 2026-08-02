/**
 * Correspondance par mot-clé pour les pages saisonnières (/ete, /noel,
 * /fete-des-peres).
 *
 * Ces pages cherchaient leurs mots-clés avec `haystack.includes(kw)`, donc en
 * sous-chaîne. Un mot-clé court capturait alors n'importe quel mot le
 * contenant, et la page se remplissait de hors-sujet (constaté le 02/08/2026) :
 *
 *   "ete"    → bre**tete**lles, **Tête** à coiffer, **Pete**r Thomas Roth, ach**ete**r
 *   "avent"  → **avent**ure
 *   "papa"   → **papa**ye
 *   "montre" → dé**montre**, **montre**r
 *
 * 469 des 1 158 articles de la page été, soit 40 %, n'avaient rien d'estival :
 * un frigo portable, une lunch box, des lames de rasoir, un porte-bébé.
 *
 * On compare désormais des mots entiers, avec deux tolérances : les accents
 * (« noël » = « noel ») et le pluriel simple (« solaire » trouve « solaires »).
 */

/** Minuscules, sans accents, ponctuation et tirets réduits à des espaces. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const patternCache = new Map<string, RegExp>();

function keywordPattern(keyword: string): RegExp | null {
  const cached = patternCache.get(keyword);
  if (cached) return cached;

  const normalized = normalize(keyword);
  if (!normalized) return null;

  // Bornes explicites plutôt que \b : \b considère le tiret comme une frontière,
  // ce qui laisserait « ete » correspondre à l'intérieur de « bebe-ete » une fois
  // le texte normalisé. Ici la normalisation a déjà transformé les tirets en
  // espaces, et on exige que rien d'alphanumérique ne colle au mot-clé.
  const pattern = new RegExp(
    `(?<![a-z0-9])${escapeRegExp(normalized)}s?(?![a-z0-9])`,
  );
  patternCache.set(keyword, pattern);
  return pattern;
}

/**
 * Vrai si l'un des mots-clés apparaît comme mot entier dans le texte.
 * Un mot-clé composé (« fete-des-peres », « spf-50 ») est cherché comme
 * expression, les tirets étant traités comme des espaces.
 */
export function matchesSeasonalKeywords(
  haystack: string,
  keywords: readonly string[],
): boolean {
  const normalized = normalize(haystack);
  if (!normalized) return false;
  return keywords.some((keyword) => keywordPattern(keyword)?.test(normalized) ?? false);
}

/** Assemble le texte d'un article dans lequel chercher : titre, description, tags. */
export function seasonalHaystack(meta: {
  title?: string;
  description?: string;
  tags?: string[];
}): string {
  return [meta.title ?? "", meta.description ?? "", ...(meta.tags ?? [])].join(" ");
}
