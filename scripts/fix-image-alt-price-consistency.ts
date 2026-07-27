import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const changed: string[] = [];

function priceTokens(value: string): Set<string> {
  const tokens = new Set<string>();
  const pattern = /(\d{1,5})(?:[.,](\d{1,2}))?/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    tokens.add(match[1]);
    if (match[2]) tokens.add(`${match[1]},${match[2]}`);
  }
  return tokens;
}

for (const name of fs.readdirSync(CONTENT_DIR)) {
  if (!name.endsWith(".mdx")) continue;
  const file = path.join(CONTENT_DIR, name);
  const source = fs.readFileSync(file, "utf8");
  const { data } = matter(source);
  if (
    data.published === false ||
    typeof data.price !== "string" ||
    typeof data.imageAlt !== "string" ||
    typeof data.title !== "string"
  ) continue;

  const allowed = priceTokens(
    [data.price, data.title, data.description, data.seoTitle, data.seoDescription]
      .filter((value): value is string => typeof value === "string")
      .join(" "),
  );
  const pricePattern = /(\d{1,5})(?:[.,](\d{1,2}))?\s*(?:€|euros?\b)/gi;
  let hasOrphanPrice = false;
  let match: RegExpExecArray | null;
  while ((match = pricePattern.exec(data.imageAlt)) !== null) {
    const full = match[2] ? `${match[1]},${match[2]}` : match[1];
    if (!allowed.has(full) && !allowed.has(match[1])) {
      hasOrphanPrice = true;
      break;
    }
  }
  if (!hasOrphanPrice) continue;

  const replacement = `imageAlt: ${JSON.stringify(data.title)}`;
  const updated = source.replace(/^imageAlt:\s*.*$/m, replacement);
  if (updated === source) continue;
  fs.writeFileSync(file, updated);
  changed.push(`content/${name}`);
}

console.log(`${changed.length} imageAlt aligné(s) sur le titre actuel`);
for (const file of changed) console.log(file);
