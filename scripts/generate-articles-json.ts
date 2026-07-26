import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_PATH = path.join(process.cwd(), "public", "articles.json");

interface ArticleInfo {
  title: string;
  url: string;
  description: string;
  category: string;
  image: string;
  date: string;
}

function getAllArticles(): ArticleInfo[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const articles: ArticleInfo[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(content);

    if (data.published === false) continue;

    const slug = file.replace(/\.mdx$/, "");
    articles.push({
      title: data.title || "",
      url: `https://bonsplansmania.fr/article/${slug}`,
      description: data.description || "",
      category: data.category || "bon-plan",
      image: data.image || "/images/placeholder.svg",
      date: data.date || "2020-01-01",
    });
  }

  // Trier par date decroissante (le nom du fichier contient souvent la date)
  // On se base sur le frontmatter date
  const filesWithDates = files.map((file) => {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(content);
    return { file, date: data.date || "2020-01-01" };
  });

  filesWithDates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sorted: ArticleInfo[] = [];
  for (const { file } of filesWithDates) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(content);
    if (data.published === false) continue;
    const slug = file.replace(/\.mdx$/, "");
    sorted.push({
      title: data.title || "",
      url: `https://bonsplansmania.fr/article/${slug}`,
      description: data.description || "",
      category: data.category || "bon-plan",
      image: data.image || "/images/placeholder.svg",
      date: data.date || "2020-01-01",
    });
  }

  // Garder les 50 plus recents
  return sorted.slice(0, 50);
}

const articles = getAllArticles();
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(articles, null, 0));
console.log(`Generated articles.json with ${articles.length} articles`);

// --- Audit cohérence prix imageAlt ↔ frontmatter (avertissements non bloquants) ---
// Le schema Product JSON-LD et le H1 sont générés à partir de frontmatter.price.
// Si imageAlt (visible aux crawlers Google Images + accessibility scanners) contient un prix
// qui n'est nulle part dans le frontmatter (price + title + description), c'est une contradiction
// probable (cas Blissim Double-Box : imageAlt "37,80 euros" alors que frontmatter dit "27,00 €").
// On tolère : tout prix cité dans price/title/description = source-de-vérité étendue.
// Non bloquant : le build reste live.
function auditImageAltPriceConsistency(): void {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const warnings: string[] = [];
  const priceTokens = (s: string): Set<string> => {
    // Extrait tous les nombres (avec ou sans décimales, avec ou sans € accolé) — sert de whitelist
    const set = new Set<string>();
    const re = /(\d{1,5})(?:[.,](\d{1,2}))?/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s)) !== null) {
      set.add(m[1]); // int seul
      if (m[2]) set.add(`${m[1]},${m[2]}`); // avec décimales
    }
    return set;
  };

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(raw);
    if (data.published === false) continue;
    if (!data.price || typeof data.price !== "string") continue;
    if (!data.imageAlt || typeof data.imageAlt !== "string") continue;

    // Whitelist = tous les nombres présents dans price + title + description + seoTitle + seoDescription
    const sources = [data.price, data.title, data.description, data.seoTitle, data.seoDescription]
      .filter((v): v is string => typeof v === "string")
      .join(" ");
    const whitelist = priceTokens(sources);

    // Cherche les prix "N €" / "N,XX €" / "N euros" dans imageAlt
    const priceRegex = /(\d{1,5})(?:[.,](\d{1,2}))?\s*(?:€|euros?\b)/gi;
    const found = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = priceRegex.exec(data.imageAlt)) !== null) {
      const intStr = m[1];
      const fullStr = m[2] ? `${m[1]},${m[2]}` : m[1];
      // Accepter si le nombre exact OU sa forme entière est dans la whitelist
      if (whitelist.has(fullStr) || whitelist.has(intStr)) continue;
      found.add(m[2] ? `${m[1]},${m[2]}` : m[1]);
    }

    if (found.size > 0) {
      warnings.push(`  ⚠️  ${file}\n     imageAlt prix orphelin(s): ${[...found].join(", ")} €  (absent de price/title/description)`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  Audit imageAlt : ${warnings.length} article(s) avec prix orphelin dans imageAlt :`);
    warnings.slice(0, 15).forEach((w) => console.log(w));
    if (warnings.length > 15) console.log(`  ... et ${warnings.length - 15} autre(s)`);
    console.log(`\n   Un prix cité dans imageAlt SANS être dans price/title/description = contradiction`);
    console.log(`   visible aux crawlers Google Images. Corriger l'imageAlt pour aligner sur le prix effectif.\n`);
  }
}
auditImageAltPriceConsistency();

// --- Génération RSS ---
const RSS_PATH = path.join(process.cwd(), "public", "rss.xml");
const SITE_URL = "https://bonsplansmania.fr";

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generateRss(items: ArticleInfo[]): string {
  const rssItems = items.map((a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${a.url}</link>
      <guid>${a.url}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <description>${escapeXml(a.description)}</description>
      <category>${escapeXml(a.category)}</category>
      <enclosure url="${SITE_URL}${a.image}" type="image/svg+xml" length="0"/>
    </item>`).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bons Plans Mania</title>
    <link>${SITE_URL}</link>
    <description>Les meilleurs bons plans, concours, tests gratuits et codes promo</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;
}

fs.writeFileSync(RSS_PATH, generateRss(articles));
console.log(`Generated rss.xml with ${articles.length} items`);
