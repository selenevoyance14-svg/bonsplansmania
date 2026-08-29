import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Retire uniquement le statut `featured` d'une catégorie donnée.
// Dry-run par défaut : ajouter --apply pour modifier les fichiers.
const category = process.argv.find((arg) => arg.startsWith("--category="))?.split("=")[1];
const apply = process.argv.includes("--apply");

if (!category) {
  console.error("Usage: npx tsx scripts/remove-featured-from-category.ts --category=concours [--apply]");
  process.exit(1);
}

const contentDir = path.join(process.cwd(), "content");
const featuredLine = /^featured:\s*true\s*$/m;
const matches: string[] = [];

for (const file of fs.readdirSync(contentDir).filter((name) => name.endsWith(".mdx"))) {
  const fullPath = path.join(contentDir, file);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(raw);

  if (data.category !== category || data.featured !== true) continue;
  matches.push(file);

  if (apply) {
    fs.writeFileSync(fullPath, raw.replace(featuredLine, "featured: false"), "utf8");
  }
}

console.log(`${apply ? "Modifiés" : "À modifier"} : ${matches.length} article(s) de la catégorie ${category}.`);
