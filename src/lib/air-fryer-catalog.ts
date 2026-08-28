import { getAllArticles } from "@/lib/articles";
import { AIR_FRYER_GUIDE_2026, type AirFryerGuideProduct } from "@/lib/air-fryer-guide-2026";

const BRANDS: Array<[string, string[]]> = [
  ["Bosch", ["bosch"]],
  ["Cecotec", ["cecotec"]],
  ["COSORI", ["cosori"]],
  ["Moulinex", ["moulinex"]],
  ["Ninja", ["ninja"]],
  ["Philips", ["philips"]],
  ["Russell Hobbs", ["russell-hobbs", "russell hobbs", "satisfry"]],
  ["Severin", ["severin"]],
  ["Tefal", ["tefal"]],
];

const AIR_FRYER_TERMS = ["air-fryer", "air fryer", "airfryer", "friteuse-sans-huile", "friteuse sans huile"];
const EXCLUDED_TERMS = [
  "accessoire", "moule", "papier-air-fryer", "papier air fryer", "concours",
  "jeu-concours", "jeu concours", "comparatif", "meilleur airfryer", "sélection",
  "ventes flash", "spring deals", "friteuse classique",
];

function findBrand(searchable: string): string | undefined {
  return BRANDS.find(([, aliases]) => aliases.some((alias) => searchable.includes(alias)))?.[0];
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(`${value}T12:00:00`));
}

function getCapacity(searchable: string): string {
  const match = searchable.match(/(\d{1,2}(?:[,.]\d)?)\s?l(?:itres?)?\b/i);
  if (match) return `${match[1].replace(".", ",")} L`;
  if (/multicuiseur/.test(searchable)) return "Multicuiseur";
  return "Capacité à vérifier";
}

function getTypes(searchable: string): string[] {
  const types: string[] = [];
  if (/double|dual|2\s?(?:cuves?|tiroirs?)|twin|flexdrawer|flex drawer/.test(searchable)) types.push("Double zone");
  else types.push("Mono-cuve");
  if (/\b(?:9|10|11|12)(?:[,.]\d)?\s?l|xxl|grande capacité|grande capacite/.test(searchable)) types.push("Grande capacité");
  if (/compact|portable|crispi/.test(searchable)) types.push("Compact");
  if (/multicuiseur|combi|speedi|cookeo/.test(searchable)) types.push("Multicuiseur");
  return [...new Set(types)];
}

function getHousehold(capacity: string, types: string[]): string {
  const numeric = Number.parseFloat(capacity.replace(",", "."));
  if (types.includes("Multicuiseur")) return "Famille";
  if (Number.isFinite(numeric) && numeric >= 9) return "Grande famille";
  if (Number.isFinite(numeric) && numeric < 5) return "1 à 3 personnes";
  return "Famille";
}

function getPrograms(searchable: string): string {
  const match = searchable.match(/(\d{1,2})\s?(?:programmes?|modes?|fonctions?|en-1)/i);
  return match ? `${match[1]} programmes ou fonctions` : "Fonctions à consulter";
}

function cleanName(title: string): string {
  return title
    .replace(/^bon plan\s+/i, "")
    .replace(/\s*:\s*(?:offre|prix|promo)[\s\S]*$/i, "")
    .replace(/\s+[àa]\s+\d[\s\S]*$/i, "")
    .trim();
}

export function getAirFryerCatalog(): AirFryerGuideProduct[] {
  const curated = new Map(AIR_FRYER_GUIDE_2026.map((item) => [item.articleHref, item]));
  const discovered = getAllArticles().flatMap((article): AirFryerGuideProduct[] => {
    const { meta } = article;
    if (meta.category !== "bon-plan" || !meta.affiliateUrl) return [];
    const identity = `${meta.slug} ${meta.title}`.toLowerCase();
    const searchable = `${identity} ${meta.description} ${meta.tags.join(" ")}`.toLowerCase();
    if (!AIR_FRYER_TERMS.some((term) => identity.includes(term))) return [];
    if (EXCLUDED_TERMS.some((term) => identity.includes(term))) return [];
    const brand = findBrand(searchable);
    if (!brand) return [];
    const articleHref = `/article/${meta.slug}`;
    const selected = curated.get(articleHref);
    if (selected) return [selected];
    const capacity = getCapacity(searchable);
    const types = getTypes(searchable);
    return [{
      brand,
      name: cleanName(meta.title),
      price: meta.price || "Voir le prix actuel",
      checkedAt: formatDate(meta.updated || meta.date),
      capacity,
      types,
      household: getHousehold(capacity, types),
      programs: getPrograms(searchable),
      image: meta.image,
      imageAlt: meta.imageAlt,
      articleHref,
      merchantHref: meta.affiliateUrl,
    }];
  });

  const byHref = new Map<string, AirFryerGuideProduct>();
  for (const item of [...AIR_FRYER_GUIDE_2026, ...discovered]) byHref.set(item.articleHref, item);
  return [...byHref.values()].sort((a, b) => a.brand.localeCompare(b.brand, "fr", { sensitivity: "base" }) || a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
}
