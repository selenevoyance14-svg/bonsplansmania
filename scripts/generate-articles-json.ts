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
