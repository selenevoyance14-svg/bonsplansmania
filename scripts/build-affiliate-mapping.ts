// Génère functions/data/affiliate-mapping.json à partir des frontmatters MDX.
// Le mapping est lu côté serveur par functions/go/[slug].ts pour rediriger sans exposer le lien affilié dans le HTML.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUT_FILE = path.join(process.cwd(), "functions", "data", "affiliate-mapping.json");

type Row = { url: string; label?: string };

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`[affiliate-mapping] content/ absent, skip`);
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const mapping: Record<string, Row> = {};
  let withAffiliate = 0;

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
    withAffiliate++;
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(mapping, null, 0));

  console.log(
    `[affiliate-mapping] ${withAffiliate}/${files.length} articles avec lien affilié écrits dans ${path.relative(process.cwd(), OUT_FILE)}`,
  );
}

main();
