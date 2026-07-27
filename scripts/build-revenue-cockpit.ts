import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type ClickRow = {
  date: string;
  page_path: string;
  affiliate_slug: string;
  source_slug: string;
  click_location: string;
  affiliate_network: string;
  destination_hostname: string;
  clicks: string;
};

type CommissionRow = {
  date: string;
  network: string;
  orders: string;
  sales_eur: string;
  commission_eur: string;
};

type ArticleRow = {
  slug: string;
  title: string;
  category: string;
  date: string;
  network: string;
  merchant: string;
  price: string;
  active: boolean;
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const DATA_DIR = path.join(ROOT, "data", "revenue");
const REPORT_DIR = path.join(ROOT, "reports", "revenue");
const TODAY = new Date().toISOString().slice(0, 10);

function walkMdx(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMdx(file);
    return entry.name.endsWith(".mdx") ? [file] : [];
  });
}

function parseCsv<T extends Record<string, string>>(file: string): T[] {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",");
  return lines.slice(1).filter(Boolean).map((line) => {
    const values: string[] = [];
    let value = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (quoted && line[i + 1] === '"') {
          value += '"';
          i += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === "," && !quoted) {
        values.push(value);
        value = "";
      } else {
        value += char;
      }
    }
    values.push(value);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])) as T;
  });
}

function destination(url?: string): { network: string; merchant: string } {
  if (!url) return { network: "Sans affiliation", merchant: "" };
  if (url.startsWith("/")) return { network: "Interne", merchant: "bonsplansmania.fr" };
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "amazon.fr" || host.endsWith(".amazon.fr") || host === "amzn.to") {
      return { network: "Amazon", merchant: "Amazon" };
    }
    if (host === "awin1.com" || host.endsWith(".awin1.com") || host === "tidd.ly") {
      return { network: "Awin", merchant: host };
    }
    if (host === "lb.affilae.com" || host === "c3po.link") {
      return { network: "Affilae", merchant: host };
    }
    if (host === "track.effiliation.com") return { network: "Effiliation", merchant: host };
    if (host === "clk.tradedoubler.com") return { network: "Tradedoubler", merchant: host };
    if (host === "tracking.publicidees.com" || host === "a.time1.me") {
      return { network: "TimeOne / Public Idées", merchant: host };
    }
    if (host === "ystyle.co" || host === "yesstyle.com") {
      return { network: "YesStyle", merchant: "YesStyle" };
    }
    return { network: "Direct / autre", merchant: host };
  } catch {
    return { network: "Lien invalide", merchant: "" };
  }
}

function readArticles(): ArticleRow[] {
  return walkMdx(CONTENT_DIR).map((file) => {
    const { data } = matter(fs.readFileSync(file, "utf8"));
    const slug = path.basename(file, ".mdx");
    const { network, merchant } = destination(data.affiliateUrl);
    const expiredByDate = typeof data.endDate === "string" && data.endDate < TODAY;
    return {
      slug,
      title: String(data.title || ""),
      category: String(data.category || ""),
      date: String(data.updated || data.date || ""),
      network,
      merchant,
      price: String(data.price || ""),
      active: data.published !== false && data.expired !== true && !expiredByDate,
    };
  });
}

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const articles = readArticles();
const clicks = parseCsv<ClickRow>(path.join(DATA_DIR, "ga4-affiliate-clicks.csv"));
const commissions = parseCsv<CommissionRow>(path.join(DATA_DIR, "affiliate-commissions.csv"));
const clickTotals = new Map<string, { total: number; card: number; inline: number; header: number }>();

for (const click of clicks) {
  const slug = (click.source_slug || click.affiliate_slug).trim();
  if (!slug) continue;
  const count = Number(click.clicks) || 0;
  const current = clickTotals.get(slug) || { total: 0, card: 0, inline: 0, header: 0 };
  current.total += count;
  if (click.click_location === "article_card") current.card += count;
  if (click.click_location === "article_inline") current.inline += count;
  if (click.click_location === "article_header") current.header += count;
  clickTotals.set(slug, current);
}

const rows = articles
  .filter((article) => article.active && article.network !== "Sans affiliation")
  .map((article) => {
    const click = clickTotals.get(article.slug) || { total: 0, card: 0, inline: 0, header: 0 };
    const optimizationPriority =
      click.total >= 20 ? "Analyser la conversion" :
      article.price && click.total === 0 ? "Améliorer la visibilité" :
      "Collecter des données";
    return { ...article, ...click, optimizationPriority };
  })
  .sort((a, b) => b.total - a.total || Number(Boolean(b.price)) - Number(Boolean(a.price)));

const networkRevenue = commissions.reduce<Record<string, { orders: number; sales: number; commission: number }>>(
  (totals, row) => {
    const network = row.network || "Non renseigné";
    totals[network] ||= { orders: 0, sales: 0, commission: 0 };
    totals[network].orders += Number(row.orders) || 0;
    totals[network].sales += Number(row.sales_eur) || 0;
    totals[network].commission += Number(row.commission_eur) || 0;
    return totals;
  },
  {},
);

fs.mkdirSync(REPORT_DIR, { recursive: true });
const columns = [
  "slug", "title", "category", "date", "network", "merchant", "price",
  "total", "card", "inline", "header", "optimizationPriority",
];
const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvCell(row[column as keyof typeof row])).join(",")),
].join("\n");
fs.writeFileSync(path.join(REPORT_DIR, "articles.csv"), `${csv}\n`);
fs.writeFileSync(
  path.join(REPORT_DIR, "cockpit.json"),
  `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    dataQuality: {
      ga4Rows: clicks.length,
      commissionRows: commissions.length,
      articleLevelRevenueAttribution: false,
      note: "Les clics sont attribués aux articles. Les commissions restent consolidées par réseau.",
    },
    totals: {
      activeAffiliateArticles: rows.length,
      affiliateClicks: rows.reduce((sum, row) => sum + row.total, 0),
      orders: Object.values(networkRevenue).reduce((sum, row) => sum + row.orders, 0),
      salesEur: Object.values(networkRevenue).reduce((sum, row) => sum + row.sales, 0),
      commissionEur: Object.values(networkRevenue).reduce((sum, row) => sum + row.commission, 0),
    },
    networkRevenue,
    articles: rows,
  }, null, 2)}\n`,
);

console.log("Cockpit revenus généré");
console.log(`  ${rows.length} articles affiliés actifs`);
console.log(`  ${clicks.length} lignes de clics GA4 importées`);
console.log(`  ${commissions.length} lignes de commissions importées`);
console.log(`  reports/revenue/articles.csv`);
console.log(`  reports/revenue/cockpit.json`);
