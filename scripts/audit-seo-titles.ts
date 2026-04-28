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
interface Issue { file: string; len: number; seoTitle: string; }
const issues: Issue[] = [];

for (const file of files) {
  const full = path.join(CONTENT_DIR, file);
  const { data } = matter(fs.readFileSync(full, "utf8"));
  if (data.published === false) continue;
  if (data.expired === true) continue; // pas la peine d'auditer les concours terminés
  const seoTitle: string = data.seoTitle || "";
  if (!seoTitle) continue;
  const len = [...seoTitle].length;
  if (len <= MAX_LEN) continue;
  issues.push({ file, len, seoTitle });
}

issues.sort((a, b) => b.len - a.len);

console.log(`seoTitle > ${MAX_LEN} chars (articles publiés non expirés) : ${issues.length}\n`);

for (const i of issues.slice(0, 80)) {
  console.log(`${i.len} | ${i.file}`);
  console.log(`     ${i.seoTitle}\n`);
}

const ranges = { "61-65": 0, "66-70": 0, "71-80": 0, ">80": 0 };
for (const i of issues) {
  if (i.len <= 65) ranges["61-65"]++;
  else if (i.len <= 70) ranges["66-70"]++;
  else if (i.len <= 80) ranges["71-80"]++;
  else ranges[">80"]++;
}
console.log(`=== Répartition ===`);
for (const [r, n] of Object.entries(ranges)) console.log(`  ${r} : ${n}`);
console.log(`\nNote : Google affiche jusqu'à ~65 chars dans la SERP. Prioriser les > 70 chars.`);
