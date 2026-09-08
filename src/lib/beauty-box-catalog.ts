import { getAllArticles } from "@/lib/articles";
import { BEAUTY_BOXES_2026, type BeautyBox2026 } from "@/lib/beauty-boxes-2026";

const BRANDS: Array<[string, string[]]> = [
  ["Belle au Naturel", ["belle-au-naturel", "belle au naturel"]],
  ["Biotyfull Box", ["biotyfull-box", "biotyfull box", "biotyfull"]],
  ["Blissim", ["blissim"]], ["Glowria", ["glowria"]],
  ["L'Arôma Box", ["laromabox", "l'arôma box", "aroma box"]],
  ["LOOKFANTASTIC", ["lookfantastic"]],
  ["Mademoiselle Confettis", ["mademoiselle-confettis", "mademoiselle confettis"]],
  ["Marie Claire", ["my-beauty-factory", "my beauty factory", "marie claire"]],
  ["Prescription Lab", ["prescription-lab", "prescription lab"]],
];

const EDITORIAL_TERMS = [
  "comparatif", "meilleures box", "bonnes raisons", "parrainage",
  "récap", "recap", "comparateur", "codes promo",
];

const OUT_OF_SCOPE_TERMS = ["bébé", "bebe", "magicmaman", "loisirs créatifs"];

function findBrand(searchable: string): string | undefined {
  return BRANDS.find(([, aliases]) => aliases.some((alias) => searchable.includes(alias)))?.[0];
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(`${value}T12:00:00`));
}

function getFormulas(searchable: string): string[] {
  const formulas: string[] = [];
  if (/sans engagement/.test(searchable)) formulas.push("Sans engagement");
  if (/abonnement|par mois|\/mois/.test(searchable)) formulas.push("Abonnement");
  if (/bio|naturel/.test(searchable)) formulas.push("Bio et naturel");
  if (/édition limitée|edition limitee|coffret/.test(searchable)) formulas.push("Édition limitée");
  return formulas.length ? formulas : ["Achat ponctuel"];
}

function getCommitment(searchable: string): string {
  if (/sans engagement/.test(searchable)) return "Sans engagement";
  if (/engagement/.test(searchable)) return "Engagement à vérifier";
  if (/abonnement|par mois|\/mois/.test(searchable)) return "Abonnement — conditions à vérifier";
  return "Achat ponctuel";
}

export function getBeautyBoxCatalog(): BeautyBox2026[] {
  const curated = new Map(BEAUTY_BOXES_2026.map((item) => [item.articleHref, item]));
  const discovered = getAllArticles().flatMap((article): BeautyBox2026[] => {
    const { meta } = article;
    if (meta.category !== "box-beaute" || !meta.affiliateUrl) return [];
    const searchable = `${meta.title} ${meta.description} ${meta.tags.join(" ")}`.toLowerCase();
    if (EDITORIAL_TERMS.some((term) => searchable.includes(term))) return [];
    if (OUT_OF_SCOPE_TERMS.some((term) => searchable.includes(term))) return [];
    const brand = findBrand(searchable);
    if (!brand) return [];
    const articleHref = `/article/${meta.slug}`;
    const selected = curated.get(articleHref);
    if (selected) return [selected];
    return [{
      brand,
      name: meta.title.replace(/^bon plan\s+/i, "").trim(),
      price: meta.price || "Voir le prix actuel",
      contents: meta.description,
      commitment: getCommitment(searchable),
      formulas: getFormulas(searchable),
      checkedAt: formatDate(meta.updated || meta.date),
      image: meta.image,
      imageAlt: meta.imageAlt,
      articleHref,
      merchantHref: meta.affiliateUrl,
    }];
  });

  const byHref = new Map<string, BeautyBox2026>();
  for (const item of [...BEAUTY_BOXES_2026, ...discovered]) byHref.set(item.articleHref, item);
  return [...byHref.values()].sort((a, b) => a.brand.localeCompare(b.brand, "fr", { sensitivity: "base" }) || a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
}
