// Génère functions/data/affiliate-mapping.json à partir des frontmatters MDX + codes promo permanents.
// Le mapping est lu côté serveur par functions/go/[slug].ts pour rediriger sans exposer le lien affilié dans le HTML.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CODES_PAGE = path.join(process.cwd(), "src", "app", "codes-promo-permanents", "page.tsx");
const OUT_FILE = path.join(process.cwd(), "functions", "data", "affiliate-mapping.json");

type Row = { url: string; label?: string };

function collectMdx(mapping: Record<string, Row>): number {
  if (!fs.existsSync(CONTENT_DIR)) return 0;
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  let count = 0;
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data } = matter(raw);
    const url = typeof data.affiliateUrl === "string" ? data.affiliateUrl.trim() : "";
    if (!url || !/^https?:\/\//i.test(url)) continue;
    mapping[slug] = {
      url,
      ...(typeof data.affiliateLabel === "string" ? { label: data.affiliateLabel } : {}),
    };
    count++;
  }
  return count;
}

// Parse la page codes-promo-permanents pour extraire brand + affiliateUrl.
// Le brand → slug côté featured est fait en kebab-case pour matcher le teaser homepage.
function collectPermanentCodes(mapping: Record<string, Row>): number {
  if (!fs.existsSync(CODES_PAGE)) return 0;
  const src = fs.readFileSync(CODES_PAGE, "utf8");
  // Match chaque bloc { ... } contenant brand: "..." et affiliateUrl: "..."
  const blockRegex = /brand:\s*"([^"]+)"[\s\S]*?affiliateUrl:\s*"([^"]+)"/g;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = blockRegex.exec(src)) !== null) {
    const brand = m[1];
    const url = m[2];
    if (!/^https?:\/\//i.test(url)) continue;
    const slug = brand
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!slug) continue;
    mapping[`permanent-${slug}`] = { url };
    count++;
  }
  return count;
}

function main() {
  const mapping: Record<string, Row> = {};
  const mdxCount = collectMdx(mapping);
  const codeCount = collectPermanentCodes(mapping);

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(mapping, null, 0));

  console.log(
    `[affiliate-mapping] ${mdxCount} MDX + ${codeCount} codes permanents = ${mdxCount + codeCount} entrées écrites dans ${path.relative(process.cwd(), OUT_FILE)}`,
  );
}

main();
