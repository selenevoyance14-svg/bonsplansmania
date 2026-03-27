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
    });
  }

  // Garder les 20 plus recents
  return sorted.slice(0, 20);
}

const articles = getAllArticles();
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(articles, null, 0));
console.log(`Generated articles.json with ${articles.length} articles`);
