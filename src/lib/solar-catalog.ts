import { getAllArticles } from "@/lib/articles";
import { SOLAR_GUIDE_2026, type SolarGuideProduct } from "@/lib/solar-guide-2026";

const BRANDS: Array<[string, string[]]> = [
  ["Beauty of Joseon", ["beauty-of-joseon", "beauty of joseon", "boj "]],
  ["La Roche-Posay", ["la-roche-posay", "la roche-posay", "la roche posay"]],
  ["Corine de Farme", ["corine-de-farme", "corine de farme"]],
  ["Dr Pierre Ricaud", ["dr-pierre-ricaud", "dr pierre ricaud"]],
  ["Garnier", ["garnier", "ambre-solaire", "ambre solaire"]],
  ["Bioregena", ["bioregena"]], ["CeraVe", ["cerave"]],
  ["Clinique", ["clinique"]], ["ISDIN", ["isdin"]], ["Nivea", ["nivea"]],
  ["Vichy", ["vichy"]], ["Acorelle", ["acorelle"]], ["Anua", ["anua"]],
  ["Biotherm", ["biotherm"]], ["Avène", ["avene", "avène"]],
  ["COSRX", ["cosrx"]], ["Bioré", ["biore", "bioré"]],
  ["Cocosolis", ["cocosolis"]], ["Dr.Althea", ["dr-althea", "dr.althea"]],
  ["Gisèle Denis", ["gisele-denis", "gisèle denis"]], ["Helan", ["helan"]],
  ["Lierac", ["lierac"]], ["Nuxe", ["nuxe"]], ["Payot", ["payot"]],
  ["Rougj", ["rougj"]], ["Topicrem", ["topicrem"]],
];

const SOLAR_TERMS = [
  "creme-solaire", "crème-solaire", "creme solaire", "crème solaire",
  "protection-solaire", "protection solaire", "spray-solaire", "spray solaire",
  "fluide-solaire", "fluide solaire", "brume-solaire", "brume solaire",
  "stick-solaire", "stick solaire", "coffret-solaire", "trousse-solaire",
  "sunscreen", "sun-stick", "sun stick", "spf50", "spf-50", "spf 50",
  "spf30", "spf-30", "spf 30",
];

const NON_COSMETIC_TERMS = [
  "camera", "caméra", "parasol", "panneau-solaire", "robot-piscine",
  "tente-plage", "maillot-bain", "lampe-solaire", "chargeur-solaire",
];

function findBrand(searchable: string): string | undefined {
  return BRANDS.find(([, aliases]) => aliases.some((alias) => searchable.includes(alias)))?.[0];
}

function getSpf(searchable: string): string {
  const match = searchable.match(/spf[\s-]?(\d{1,2})(\+)?/i);
  return match ? `SPF ${match[1]}${match[2] || ""}` : "Protection solaire";
}

function getFormat(title: string): string {
  const match = title.match(/\b(\d{1,3})\s?(ml|g)\b/i);
  if (match) return `${match[1]} ${match[2].toLowerCase()}`;
  if (/stick/i.test(title)) return "Stick";
  if (/spray|brume/i.test(title)) return "Spray";
  return "Voir la fiche";
}

function getUsages(searchable: string): string[] {
  const usages: string[] = [];
  if (/bebe|bébé|enfant|kids/.test(searchable)) usages.push("Bébé et enfant");
  if (/visage/.test(searchable)) usages.push("Visage");
  if (/corps/.test(searchable)) usages.push("Corps");
  if (!usages.length) usages.push("Visage");
  return usages;
}

function getSkinTypes(searchable: string): string[] {
  const types: string[] = [];
  if (/sensible/.test(searchable)) types.push("Peau sensible");
  if (/mixte|grasse|matifiant|oil-control/.test(searchable)) types.push("Peau mixte à grasse");
  if (/seche|sèche|hydratant/.test(searchable)) types.push("Peau normale à sèche");
  if (/anti-age|anti-rides|mature/.test(searchable)) types.push("Peau mature");
  if (/anti-taches|pigment/.test(searchable)) types.push("Taches pigmentaires");
  return types.length ? types : ["Tous types de peau"];
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(`${value}T12:00:00`));
}

export function getSolarCatalog(): SolarGuideProduct[] {
  const curated = new Map(SOLAR_GUIDE_2026.map((item) => [item.articleHref, item]));
  const discovered = getAllArticles().flatMap((article): SolarGuideProduct[] => {
    const { meta } = article;
    if (meta.category !== "bon-plan" || !meta.affiliateUrl) return [];
    if (/^(soldes|offres|promotions|sélection)\b/i.test(meta.title)) return [];
    const searchable = `${meta.title} ${meta.description} ${meta.tags.join(" ")}`.toLowerCase();
    if (!SOLAR_TERMS.some((term) => searchable.includes(term))) return [];
    if (NON_COSMETIC_TERMS.some((term) => searchable.includes(term))) return [];
    const brand = findBrand(searchable);
    if (!brand) return [];
    const articleHref = `/article/${meta.slug}`;
    const selected = curated.get(articleHref);
    if (selected) return [selected];
    return [{
      brand,
      name: meta.title.replace(/^bon plan\s+/i, "").replace(/\s+[àa]\s+\d[\s\S]*$/i, "").trim(),
      spf: getSpf(searchable),
      price: meta.price || "Voir le prix actuel",
      checkedAt: formatDate(meta.updated || meta.date),
      usages: getUsages(searchable),
      skinTypes: getSkinTypes(searchable),
      format: getFormat(meta.title),
      image: meta.image,
      imageAlt: meta.imageAlt,
      articleHref,
      merchantHref: meta.affiliateUrl,
    }];
  });

  const byHref = new Map<string, SolarGuideProduct>();
  for (const item of [...SOLAR_GUIDE_2026, ...discovered]) byHref.set(item.articleHref, item);
  return [...byHref.values()].sort((a, b) => a.brand.localeCompare(b.brand, "fr", { sensitivity: "base" }) || a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
}
