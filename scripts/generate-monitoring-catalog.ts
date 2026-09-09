import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");
const outputPath = path.join(process.cwd(), "public", "monitoring-catalog.json");
const categories = new Set(["bon-plan", "bon-plan-beaute", "box-beaute", "code-promo"]);

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : entry.name.endsWith(".mdx") ? [full] : [];
  });
}

const rows = files(contentDir).flatMap((file) => {
  const { data } = matter(fs.readFileSync(file, "utf8"));
  if (!data.published || data.expired || !categories.has(String(data.category)) || !data.affiliateUrl) return [];
  return [{ slug: String(data.slug || path.basename(file, ".mdx")), url: String(data.affiliateUrl), merchant: String((data.tags || [])[0] || "Autre") }];
});

fs.writeFileSync(outputPath, JSON.stringify(rows));
console.log(`[monitoring] ${rows.length} liens écrits dans public/monitoring-catalog.json`);
