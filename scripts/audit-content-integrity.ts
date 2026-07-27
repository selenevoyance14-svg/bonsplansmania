import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type Article = {
  file: string;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  price: string;
  affiliateUrl: string;
  content: string;
  published: boolean;
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const REPORT_DIR = path.join(ROOT, "reports", "content");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(file);
    return entry.name.endsWith(".mdx") ? [file] : [];
  });
}

function readArticles(): Article[] {
  return walk(CONTENT_DIR).map((file) => {
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    return {
      file: path.relative(ROOT, file),
      slug: path.basename(file, ".mdx"),
      title: String(data.title || ""),
      seoTitle: String(data.seoTitle || ""),
      description: String(data.description || ""),
      price: String(data.price || ""),
      affiliateUrl: String(data.affiliateUrl || ""),
      content,
      published: data.published !== false,
    };
  });
}

function normalizedText(value: string): string {
  return value
    .toLocaleLowerCase("fr")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/https?:\/\/[^\s)"'>]+/g, "<url>")
    .replace(/\/images\/[^\s)"'>]+/g, "<image>")
    .replace(/\s+/g, " ")
    .trim();
}

function groupDuplicates(
  articles: Article[],
  valueFor: (article: Article) => string,
  minimumLength = 1,
) {
  const groups = new Map<string, Article[]>();
  for (const article of articles) {
    const value = valueFor(article).trim();
    if (value.length < minimumLength) continue;
    const group = groups.get(value) || [];
    group.push(article);
    groups.set(value, group);
  }
  return [...groups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([value, group]) => ({
      value,
      files: group.map((article) => article.file),
    }));
}

function parseFrenchNumber(value: string): number | undefined {
  const parsed = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function discountError(article: Article) {
  const currentMatch = article.price.match(/(\d[\d\s]*(?:[.,]\d{1,2})?)\s*€/);
  const oldMatch = article.price.match(
    /(?:au lieu de|ancien prix|prix conseillé|conseillé)\s*:?\s*(\d[\d\s]*(?:[.,]\d{1,2})?)\s*€/i,
  );
  const percentMatch = article.price.match(/-\s*(\d{1,3})\s*%/);
  if (!currentMatch || !oldMatch || !percentMatch) return null;
  const current = parseFrenchNumber(currentMatch[1]);
  const old = parseFrenchNumber(oldMatch[1]);
  const announced = Number(percentMatch[1]);
  if (current === undefined || old === undefined || old <= 0 || current > old) return null;
  const calculated = Math.round(((old - current) / old) * 100);
  if (Math.abs(calculated - announced) <= 1) return null;
  return {
    file: article.file,
    price: article.price,
    announced,
    calculated,
  };
}

function amazonAsin(url: string): string | undefined {
  return url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i)?.[1]?.toUpperCase();
}

const articles = readArticles().filter((article) => article.published);
const exactTitles = groupDuplicates(articles, (article) => normalizedText(article.title), 12);
const exactSeoTitles = groupDuplicates(articles, (article) => normalizedText(article.seoTitle), 12);
const exactDescriptions = groupDuplicates(articles, (article) => normalizedText(article.description), 30);
const bodyDuplicates = groupDuplicates(
  articles,
  (article) =>
    crypto.createHash("sha256").update(normalizedText(article.content)).digest("hex"),
  32,
);
const destinationDuplicates = groupDuplicates(
  articles,
  (article) => {
    const asin = amazonAsin(article.affiliateUrl);
    if (asin) return `amazon:${asin}`;
    return article.affiliateUrl.startsWith("http") ? article.affiliateUrl : "";
  },
  10,
);
const discountErrors = articles
  .map(discountError)
  .filter((error): error is NonNullable<typeof error> => error !== null);

const report = {
  generatedAt: new Date().toISOString(),
  totals: { articles: articles.length },
  alerts: {
    exactTitles,
    exactSeoTitles,
    exactDescriptions,
    normalizedBodyDuplicates: bodyDuplicates,
    identicalDestinations: destinationDuplicates,
    discountErrors,
  },
};

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(REPORT_DIR, "integrity-audit.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log("Audit intégrité éditoriale — Bons Plans Mania");
console.log(`  ${articles.length} articles publiés`);
console.log(`  ${exactTitles.length} groupes de titres identiques`);
console.log(`  ${exactSeoTitles.length} groupes de titres SEO identiques`);
console.log(`  ${exactDescriptions.length} groupes de descriptions identiques`);
console.log(`  ${bodyDuplicates.length} groupes de corps d’article quasi identiques`);
console.log(`  ${destinationDuplicates.length} destinations utilisées plusieurs fois`);
console.log(`  ${discountErrors.length} remises arithmétiquement incohérentes`);
console.log("  reports/content/integrity-audit.json");
