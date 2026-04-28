import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Audit (read-only) des seoTitle > 60 caractères.
// On NE MODIFIE PAS les articles : tronquer automatiquement = risque de couper en plein mot,
// perdre le sens, dégrader le SEO. À toi de réécrire les titres trop longs.
// Ce script liste les pires cas par ordre de gravité.

const CONTENT_DIR = path.join(process.cwd(), "content");
const MAX_LEN = 60;

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
interface Issue { file: string; len: number; seoTitle: string; suggestion: string; }
const issues: Issue[] = [];

for (const file of files) {
  const full = path.join(CONTENT_DIR, file);
  const { data } = matter(fs.readFileSync(full, "utf8"));
  if (data.published === false) continue;
  const seoTitle: string = data.seoTitle || "";
  if (!seoTitle) continue;
  const len = [...seoTitle].length; // longueur en code points (gère les accents)
  if (len <= MAX_LEN) continue;

  // Suggestion automatique : couper au dernier espace avant 57 chars + "..."
  let suggestion = "";
  if (len > MAX_LEN) {
    const target = 57;
    const truncated = seoTitle.slice(0, target);
    const lastSpace = truncated.lastIndexOf(" ");
    suggestion = (lastSpace > 30 ? truncated.slice(0, lastSpace) : truncated) + "...";
  }
  issues.push({ file, len, seoTitle, suggestion });
}

issues.sort((a, b) => b.len - a.len);

console.log(`Total articles publiés avec seoTitle : ${files.length}`);
console.log(`seoTitle > ${MAX_LEN} chars : ${issues.length}\n`);

const top = issues.slice(0, 50);
for (const i of top) {
  console.log(`${i.len} chars | ${i.file}`);
  console.log(`  ACTUEL    : ${i.seoTitle}`);
  console.log(`  SUGGESTION: ${i.suggestion}\n`);
}

if (issues.length > top.length) {
  console.log(`... et ${issues.length - top.length} autres.`);
}

// Stats par tranche
const ranges = { "61-70": 0, "71-80": 0, "81-100": 0, ">100": 0 };
for (const i of issues) {
  if (i.len <= 70) ranges["61-70"]++;
  else if (i.len <= 80) ranges["71-80"]++;
  else if (i.len <= 100) ranges["81-100"]++;
  else ranges[">100"]++;
}
console.log(`\n=== Répartition ===`);
for (const [r, n] of Object.entries(ranges)) console.log(`  ${r} chars : ${n}`);
