import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type ArticleAudit = {
  file: string;
  slug: string;
  category: string;
  date: string;
  endDate?: string;
  affiliateUrl?: string;
  price?: string;
  expired: boolean;
  evergreen: boolean;
  noindex: boolean;
  title: string;
  description: string;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");
const NOW = new Date();
const TODAY = NOW.toISOString().slice(0, 10);
const FREEBIE_CATEGORIES = new Set(["concours", "test-gratuit"]);
const EXPIRABLE_CATEGORIES = new Set([
  "bon-plan",
  "bon-plan-beaute",
  "box-beaute",
  "code-promo",
  "concours",
  "test-gratuit",
  "calendrier",
  "calendrier-avent",
]);
const TEST_CLAIM =
  /\b(on a test[ée]s?|nous avons test[ée]|notre test|apr[eè]s test|test[ée] par (?:nos soins|la r[ée]daction))\b/i;

function walkMdx(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMdx(fullPath));
    else if (entry.name.endsWith(".mdx")) files.push(fullPath);
  }
  return files;
}

function normalizeHost(url?: string): string {
  if (!url) return "sans-lien";
  if (url.startsWith("/")) return "interne";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "lien-invalide";
  }
}

function networkFor(url?: string): string {
  const host = normalizeHost(url);
  if (host === "sans-lien" || host === "lien-invalide" || host === "interne") return host;
  if (host === "amazon.fr" || host.endsWith(".amazon.fr") || host === "amzn.to") return "Amazon";
  if (host === "awin1.com" || host.endsWith(".awin1.com") || host === "tidd.ly") return "Awin";
  if (host === "lb.affilae.com" || host === "c3po.link") return "Affilae";
  if (host === "track.effiliation.com") return "Effiliation";
  if (host === "clk.tradedoubler.com") return "Tradedoubler";
  if (host === "tracking.publicidees.com" || host === "a.time1.me") return "TimeOne / Public Idées";
  if (host === "action.metaffiliation.com") return "Metaffiliation";
  if (host === "ystyle.co" || host === "yesstyle.com") return "YesStyle";
  if (host === "fr.igraal.com") return "iGraal";
  if (host === "ebuyclub.com") return "eBuyClub";
  if (host === "poulpeo.com") return "Poulpeo";
  if (host === "fnty.co" || host === "lk.gt") return "Lien partenaire court";
  return `Direct / ${host}`;
}

function hasCommercialLink(content: string): boolean {
  return /https?:\/\/(?:www\.)?(?:amazon\.fr|amzn\.to|awin1\.com|tidd\.ly|lb\.affilae\.com|c3po\.link|track\.effiliation\.com|clk\.tradedoubler\.com|tracking\.publicidees\.com|a\.time1\.me|action\.metaffiliation\.com|ystyle\.co|yesstyle\.com|fnty\.co|lk\.gt)\b/i.test(
    content,
  );
}

function ageDays(date: string): number {
  const time = new Date(`${date}T12:00:00`).getTime();
  if (!Number.isFinite(time)) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((NOW.getTime() - time) / 86_400_000));
}

function readArticles(): ArticleAudit[] {
  return walkMdx(CONTENT_DIR).map((file) => {
    const source = fs.readFileSync(file, "utf8");
    const { data, content } = matter(source);
    return {
      file: path.relative(process.cwd(), file),
      slug: path.basename(file, ".mdx"),
      category: String(data.category || "sans-categorie"),
      date: String(data.date || ""),
      endDate: typeof data.endDate === "string" ? data.endDate : undefined,
      affiliateUrl: typeof data.affiliateUrl === "string" ? data.affiliateUrl : undefined,
      price: typeof data.price === "string" ? data.price : undefined,
      expired: data.expired === true || (typeof data.endDate === "string" && data.endDate < TODAY),
      evergreen: data.evergreen === true,
      noindex: data.noindex === true,
      title: String(data.title || ""),
      description: String(data.description || ""),
      content,
    };
  });
}

const articles = readArticles();
const published = articles.filter((article) => !article.noindex);
const categoryCounts = new Map<string, number>();
const networkCounts = new Map<string, number>();

for (const article of published) {
  categoryCounts.set(article.category, (categoryCounts.get(article.category) || 0) + 1);
  const network = networkFor(article.affiliateUrl);
  networkCounts.set(network, (networkCounts.get(network) || 0) + 1);
}

const missingEndDate = published.filter(
  (article) =>
    EXPIRABLE_CATEGORIES.has(article.category) &&
    !article.expired &&
    !article.evergreen &&
    !article.endDate &&
    ageDays(article.date) > 21,
);
const oldFreebiesWithoutEndDate = missingEndDate.filter((article) =>
  FREEBIE_CATEGORIES.has(article.category),
);
const pricedWithoutDestination = published.filter(
  (article) =>
    article.price &&
    !article.affiliateUrl &&
    !hasCommercialLink(article.content) &&
    !article.expired,
);
const invalidAffiliateLinks = published.filter(
  (article) => article.affiliateUrl && normalizeHost(article.affiliateUrl) === "lien-invalide",
);
const testClaims = published.filter((article) =>
  TEST_CLAIM.test(`${article.title}\n${article.description}\n${article.content}`),
);
const activeAffiliateArticles = published.filter(
  (article) => article.affiliateUrl && !article.expired,
);

const report = {
  generatedAt: NOW.toISOString(),
  totals: {
    articles: articles.length,
    indexable: published.length,
    activeAffiliateArticles: activeAffiliateArticles.length,
    expired: published.filter((article) => article.expired).length,
    evergreen: published.filter((article) => article.evergreen).length,
  },
  categories: Object.fromEntries(
    [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]),
  ),
  affiliateNetworks: Object.fromEntries(
    [...networkCounts.entries()].sort((a, b) => b[1] - a[1]),
  ),
  alerts: {
    oldExpirableWithoutEndDate: missingEndDate.map(({ file, category, date }) => ({
      file,
      category,
      date,
    })),
    oldFreebiesWithoutEndDate: oldFreebiesWithoutEndDate.map(
      ({ file, category, date }) => ({ file, category, date }),
    ),
    pricedWithoutDestination: pricedWithoutDestination.map(({ file, price }) => ({
      file,
      price,
    })),
    invalidAffiliateLinks: invalidAffiliateLinks.map(({ file, affiliateUrl }) => ({
      file,
      affiliateUrl,
    })),
    unverifiableTestClaims: testClaims.map(({ file, category }) => ({
      file,
      category,
    })),
  },
};

if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  console.log("Audit revenus — Bons Plans Mania");
  console.log(`Articles : ${report.totals.articles}`);
  console.log(`Articles affiliés actifs : ${report.totals.activeAffiliateArticles}`);
  console.log(`Articles expirés : ${report.totals.expired}`);
  console.log("\nRéseaux / destinations :");
  for (const [network, count] of Object.entries(report.affiliateNetworks)) {
    console.log(`  ${String(count).padStart(4)}  ${network}`);
  }
  console.log("\nAlertes :");
  console.log(`  ${missingEndDate.length} contenus expirables anciens sans endDate`);
  console.log(`  ${oldFreebiesWithoutEndDate.length} concours/tests anciens sans endDate`);
  console.log(`  ${pricedWithoutDestination.length} contenus avec prix mais sans destination`);
  console.log(`  ${invalidAffiliateLinks.length} liens affiliés invalides`);
  console.log(`  ${testClaims.length} formulations de test à justifier`);
  console.log("\nUtilisez --json pour obtenir la liste détaillée des fichiers.");
}
