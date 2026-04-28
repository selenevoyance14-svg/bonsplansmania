import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Pour chaque article avec `expired: true`, force `published: false`
// (sans toucher au reste du frontmatter). On garde le fichier MDX et `expired: true`
// pour pouvoir relancer si besoin. Substitution chirurgicale ligne par ligne.

const CONTENT_DIR = path.join(process.cwd(), "content");
const APPLY = process.argv.includes("--apply");

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
const targets: string[] = [];

for (const file of files) {
  const full = path.join(CONTENT_DIR, file);
  const { data } = matter(fs.readFileSync(full, "utf8"));
  if (data.expired === true && data.published !== false) {
    targets.push(file);
  }
}

console.log(`Mode : ${APPLY ? "APPLY" : "DRY-RUN"}`);
console.log(`Articles expired+published : ${targets.length}`);
for (const f of targets) console.log(`  ${f}`);

if (!APPLY) {
  console.log("\n=> Pour appliquer : npx tsx scripts/cleanup-expired.ts --apply");
  process.exit(0);
}

const PUBLISHED_LINE = /^published:\s*(true|false)\s*$/m;

let modified = 0;
for (const file of targets) {
  const full = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(full, "utf8");
  let updated: string;
  if (PUBLISHED_LINE.test(raw)) {
    updated = raw.replace(PUBLISHED_LINE, "published: false");
  } else {
    // Insérer juste avant le `---` de fin du frontmatter
    const fmEnd = raw.indexOf("\n---", 4);
    if (fmEnd === -1) continue;
    updated = raw.slice(0, fmEnd) + "\npublished: false" + raw.slice(fmEnd);
  }
  if (updated !== raw) {
    fs.writeFileSync(full, updated, "utf8");
    modified++;
  }
}
console.log(`\n${modified} fichiers passés en published: false (toujours présents en MDX, expired: true conservé).`);
