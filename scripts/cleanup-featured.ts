import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Élagage des articles featured : on ne garde featured: true que pour
// les articles affiliés, récents (<30j), non expirés, et au max 12 articles.
// Lance avec --apply pour modifier les fichiers, sinon dry-run.

const CONTENT_DIR = path.join(process.cwd(), "content");
const TODAY = new Date();
const MAX_AGE_DAYS = 30;
const MAX_FEATURED = 12;
const APPLY = process.argv.includes("--apply");

interface Info { file: string; date: string; category: string; aff: boolean; expired: boolean; featured: boolean; }

const MAX_PER_CATEGORY = 3;
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
const all: Info[] = [];

for (const file of files) {
  const full = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(full, "utf8");
  const { data } = matter(raw);
  all.push({
    file,
    date: data.date || "2020-01-01",
    category: data.category || "bon-plan",
    aff: !!data.affiliateUrl,
    expired: data.expired === true,
    featured: data.featured === true,
  });
}

const currentlyFeatured = all.filter((a) => a.featured);
const eligible = all.filter((a) => {
  const ageDays = (TODAY.getTime() - new Date(a.date).getTime()) / 86400000;
  return a.aff && ageDays <= MAX_AGE_DAYS && !a.expired;
});
eligible.sort((a, b) => b.date.localeCompare(a.date));

// Sélection avec diversité de catégorie
const keep: Info[] = [];
const catCount = new Map<string, number>();
for (const item of eligible) {
  if (keep.length >= MAX_FEATURED) break;
  const c = catCount.get(item.category) || 0;
  if (c >= MAX_PER_CATEGORY) continue;
  keep.push(item);
  catCount.set(item.category, c + 1);
}
const keepSet = new Set(keep.map((c) => c.file));

const toUnfeature = currentlyFeatured.filter((a) => !keepSet.has(a.file));
const toFeature = keep.filter((a) => !a.featured);

console.log(`Mode : ${APPLY ? "APPLY (modifie les fichiers)" : "DRY-RUN (lecture seule)"}`);
console.log(`Total articles : ${all.length}`);
console.log(`Featured actuellement : ${currentlyFeatured.length}`);
console.log(`Featured après nettoyage : ${keep.length} (max ${MAX_FEATURED})`);
console.log(`À retirer featured : ${toUnfeature.length}`);
console.log(`À ajouter featured : ${toFeature.length}\n`);

console.log(`=== Les ${keep.length} qui resteront featured (max ${MAX_PER_CATEGORY}/catégorie) ===`);
for (const c of keep) console.log(`  ${c.date}  [${c.category}]  ${c.file}`);

if (!APPLY) {
  console.log("\n=> Pour appliquer : npx tsx scripts/cleanup-featured.ts --apply");
  process.exit(0);
}

// Substitution chirurgicale : on ne touche QUE la ligne `featured:` du frontmatter.
// matter.stringify reformaterait tout le YAML (quotes, tags, multi-line) → diff énorme inutile.
let modified = 0;
const FEATURED_LINE = /^featured:\s*(true|false)\s*$/m;

function setFeaturedLine(raw: string, target: boolean): string {
  const targetLine = `featured: ${target}`;
  if (FEATURED_LINE.test(raw)) {
    return raw.replace(FEATURED_LINE, targetLine);
  }
  // Si la clé n'existe pas, on l'ajoute juste avant le `---` de fin du frontmatter
  const fmEnd = raw.indexOf("\n---", 4);
  if (fmEnd === -1) return raw;
  return raw.slice(0, fmEnd) + `\n${targetLine}` + raw.slice(fmEnd);
}

for (const item of [...toUnfeature, ...toFeature]) {
  const full = path.join(CONTENT_DIR, item.file);
  const raw = fs.readFileSync(full, "utf8");
  const target = keepSet.has(item.file);
  const updated = setFeaturedLine(raw, target);
  if (updated === raw) continue;
  fs.writeFileSync(full, updated, "utf8");
  modified++;
}
console.log(`\n${modified} fichiers modifiés.`);
