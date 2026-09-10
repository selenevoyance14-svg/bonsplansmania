import { getAllArticles } from "@/lib/articles";
import { ADVENT_CALENDARS_2026, type AdventCalendar2026 } from "@/lib/advent-calendars-2026";

const EXCLUDED_TERMS = ["comparatif", "jeu concours", "concours", "bière", "biere"];
const BRAND_ALIASES: Array<[string, string[]]> = [
  ["Adopt Parfums", ["adopt"]], ["Blissim", ["blissim"]], ["Cottage", ["cottage"]],
  ["Essence", ["essence"]], ["Labello", ["labello"]], ["L'Occitane", ["l'occitane", "loccitane"]],
  ["L'Oréal Paris", ["l'oréal", "l'oreal"]], ["LOOKFANTASTIC", ["lookfantastic"]],
  ["Marie Claire", ["marie claire", "my beauty factory"]], ["Maybelline New York", ["maybelline"]],
  ["MiiN Cosmetics", ["miin"]], ["Payot", ["payot"]], ["Revolution Beauty", ["revolution"]],
];

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(`${value}T12:00:00`));
}
function classify(searchable: string) {
  const universes: string[] = [];
  if (/parfum|brume/.test(searchable)) universes.push("Parfums");
  if (/maquillage|vernis|rouge à lèvres|rouge a levres/.test(searchable)) universes.push("Maquillage");
  if (/soin|beauté|beaute|cosmétique|cosmetique|k-beauty/.test(searchable)) universes.push("Beauté et soins");
  if (/bougie|senteur/.test(searchable)) universes.push("Bougies et senteurs");
  if (/bain|enfant|princesse|disney/.test(searchable)) universes.push("Enfant");
  const audiences = /homme|for him|shades of him/.test(searchable) ? ["Homme"] : /enfant|princesse|disney/.test(searchable) ? ["Enfant"] : ["Femme et mixte"];
  return { universes: universes.length ? [...new Set(universes)] : ["Beauté et soins"], audiences };
}
function brandFor(searchable: string, title: string): string {
  return BRAND_ALIASES.find(([, aliases]) => aliases.some((alias) => searchable.includes(alias)))?.[0] || title.split(":")[0].replace(/^Calendrier de l[’']Avent\s+/i, "").trim();
}
function availabilityFor(searchable: string): string {
  if (/précommande|precommande/.test(searchable)) return "Précommande";
  if (/à venir|a venir|annonc/.test(searchable)) return "À venir";
  return "Disponible";
}

export function getAdventCalendarCatalog(): AdventCalendar2026[] {
  const curatedHrefs = new Set(ADVENT_CALENDARS_2026.map((item) => item.articleHref));
  const discovered = getAllArticles().flatMap(({ meta }): AdventCalendar2026[] => {
    if (meta.category !== "calendrier-avent" || meta.expired || !meta.affiliateUrl) return [];
    const searchable = `${meta.slug} ${meta.title} ${meta.description} ${meta.tags.join(" ")}`.toLocaleLowerCase("fr");
    if (EXCLUDED_TERMS.some((term) => searchable.includes(term)) || /calendrier (?:de l[’']|d[’']?)(?:après|apres|été|ete)/.test(searchable)) return [];
    const articleHref = `/article/${meta.slug}`;
    if (curatedHrefs.has(articleHref)) return [];
    const classification = classify(searchable);
    return [{ brand: brandFor(searchable, meta.title), name: meta.title.replace(/^bon plan\s+/i, "").trim(), price: meta.price || "Voir le prix actuel", contents: meta.description, status: availabilityFor(searchable), checkedAt: formatDate(meta.updated || meta.date), image: meta.image, imageAlt: meta.imageAlt, articleHref, merchantHref: meta.affiliateUrl, ...classification }];
  });
  const catalog = new Map<string, AdventCalendar2026>();
  for (const item of ADVENT_CALENDARS_2026) {
    const searchable = `${item.brand} ${item.name} ${item.contents}`.toLocaleLowerCase("fr");
    catalog.set(`${item.articleHref}::${item.name}`, { ...item, ...classify(searchable) });
  }
  for (const item of discovered) catalog.set(`${item.articleHref}::${item.name}`, item);
  return [...catalog.values()].sort((a, b) => a.brand.localeCompare(b.brand, "fr", { sensitivity: "base" }) || a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
}
