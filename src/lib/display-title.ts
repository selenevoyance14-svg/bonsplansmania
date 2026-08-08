const MAX_CARD_TITLE_LENGTH = 72;

/** Allège les titres catalogue sur les cartes sans modifier le titre SEO. */
export function formatCardTitle(title: string): string {
  if (!/^bon plan\s+/i.test(title.trim())) return title;

  let display = title
    .trim()
    .replace(/^bon plan\s+/i, "")
    .replace(/\s+sur Amazon\b/gi, "")
    .replace(/^(\p{L}[\p{L}\d&.'’-]*)\s+\1\b/iu, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (display.length <= MAX_CARD_TITLE_LENGTH) return display;
  const shortened = display.slice(0, MAX_CARD_TITLE_LENGTH + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  display = shortened.slice(0, lastSpace > 48 ? lastSpace : MAX_CARD_TITLE_LENGTH).trim();
  return `${display}…`;
}
