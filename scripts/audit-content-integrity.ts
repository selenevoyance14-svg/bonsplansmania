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
  category: string;
  date: string;
  updated: string;
  endDate: string;
  price: string;
  affiliateUrl: string;
  affiliateLabel: string;
  content: string;
  published: boolean;
  expired: boolean;
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const REPORT_DIR = path.join(ROOT, "reports", "content");
const ARTICLE_TEMPLATE = path.join(ROOT, "src", "app", "article", "[slug]", "page.tsx");
const PREMIUM_BRIDGE_COMPONENT = path.join(
  ROOT,
  "src",
  "app",
  "components",
  "TopBonsPlansPremium.tsx",
);

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
      category: String(data.category || ""),
      date: String(data.date || ""),
      updated: String(data.updated || ""),
      endDate: String(data.endDate || ""),
      price: String(data.price || ""),
      affiliateUrl: String(data.affiliateUrl || ""),
      affiliateLabel: String(data.affiliateLabel || ""),
      content,
      published: data.published !== false,
      expired: data.expired === true,
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

function ageInDays(article: Article): number | undefined {
  const value = article.updated || article.date;
  if (!value) return undefined;
  const timestamp = new Date(`${value}T12:00:00Z`).getTime();
  if (!Number.isFinite(timestamp)) return undefined;
  return Math.floor((Date.now() - timestamp) / 86_400_000);
}

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const PROMOTIONAL_TEXT =
  /\b(?:promo|promotion|bon plan|vente flash|soldes|remise|coupon|code promo|prix actuel|offre limitée|stock limité)\b/i;
const PRICE_TEXT = /\b\d[\d\s]*(?:[.,]\d{1,2})?\s*€|\b-\s*\d{1,3}\s*%/;
const SENSITIVE_CLAIMS: Array<{ key: string; pattern: RegExp; label: string }> = [
  {
    key: "first_hand_test",
    pattern: /\b(?:on a|nous avons)\s+(?:reçu|testé|essayé|utilisé)\b|\baprès\s+\d+\s+(?:jours|semaines|mois)\s+d['’]utilisation\b/i,
    label: "Expérience personnelle ou test physique à justifier",
  },
  {
    key: "absolute_safety",
    pattern: /\b(?:impossible de se brûler|100\s*%\s*(?:sûr|safe)|(?:zéro|aucun)\s+risque\s+(?:de\s+(?:brûlure|surchauffe|blessure|étouffement)|pour\s+(?:les\s+)?(?:yeux|peau|bébé|enfants?)))\b/i,
    label: "Promesse absolue de sécurité physique",
  },
  {
    key: "guaranteed_result",
    pattern: /\b(?:résultats? garantis?|efficacité garantie|à coup sûr|élimine définitivement|détruit le follicule)\b/i,
    label: "Résultat garanti ou allégation médicale forte",
  },
  {
    key: "unqualified_superlative",
    pattern: /\b(?:prix imbattable|meilleur prix jamais vu|numéro 1 mondial|n°\s*1 mondial|le plus bas du marché)\b/i,
    label: "Superlatif commercial à sourcer ou dater",
  },
];

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
const staleCommercialPages = articles
  .filter((article) => ["bon-plan", "code-promo"].includes(article.category))
  .map((article) => {
    const ageDays = ageInDays(article);
    const combined = `${article.title}\n${article.description}\n${article.price}\n${article.content}`;
    const looksTimeSensitive = PROMOTIONAL_TEXT.test(combined) || PRICE_TEXT.test(combined);
    if (
      article.expired ||
      article.endDate ||
      !looksTimeSensitive ||
      ageDays === undefined ||
      ageDays <= 30
    ) {
      return null;
    }
    return {
      file: article.file,
      slug: article.slug,
      title: article.title,
      category: article.category,
      ageDays,
      price: article.price,
      affiliateUrl: article.affiliateUrl,
      reason: "Promotion ou prix ancien sans endDate ni expired",
    };
  })
  .filter((row): row is NonNullable<typeof row> => row !== null)
  .sort((a, b) => b.ageDays - a.ageDays);
const overdueFreeTrafficPages = articles
  .filter((article) => ["concours", "test-gratuit"].includes(article.category))
  .filter((article) => {
    const ageDays = ageInDays(article);
    return !article.expired && !article.endDate && ageDays !== undefined && ageDays > 120;
  })
  .map((article) => ({
    file: article.file,
    slug: article.slug,
    title: article.title,
    category: article.category,
    ageDays: ageInDays(article),
    affiliateUrl: article.affiliateUrl,
    reason: "Concours ou test ancien sans date de fin",
  }));
const sensitiveClaims = articles.flatMap((article) => {
  const combined = `${article.title}\n${article.description}\n${article.content}`;
  return SENSITIVE_CLAIMS.flatMap((claim) =>
    claim.pattern.test(combined)
      ? [{
          file: article.file,
          slug: article.slug,
          title: article.title,
          category: article.category,
          claim: claim.key,
          reason: claim.label,
        }]
      : [],
  );
});
const articleBySlug = new Map(articles.map((article) => [article.slug, article]));
const articleTemplateSource = fs.existsSync(ARTICLE_TEMPLATE)
  ? fs.readFileSync(ARTICLE_TEMPLATE, "utf8")
  : "";
const premiumBridgeSource = fs.existsSync(PREMIUM_BRIDGE_COMPONENT)
  ? fs.readFileSync(PREMIUM_BRIDGE_COMPONENT, "utf8")
  : "";
const hasAutomaticFreeTrafficBridge =
  articleTemplateSource.includes("isFreebieCategory && <TopBonsPlansPremium") &&
  premiumBridgeSource.includes('data-monetization-bridge="contextual-premium-deals"') &&
  premiumBridgeSource.includes("getTopPremiumDeals");
const hasAutomaticStaleProtection =
  articleTemplateSource.includes("const STALE_DAYS = 21") &&
  articleTemplateSource.includes("productAvailability = (isExpired || isStale)") &&
  articleTemplateSource.includes("Ce post a plus de 3 semaines") &&
  articleTemplateSource.includes("Ce concours a plus de 3 semaines") &&
  articleTemplateSource.includes("Ce test gratuit a plus de 3 semaines");

const freeTrafficBridgeRows = articles
  .filter((article) => ["concours", "test-gratuit"].includes(article.category))
  .filter((article) => !article.expired)
  .map((article) => {
    const internalSlugs = [...article.content.matchAll(/\]\(\/article\/([^)#?]+)[^)]*\)/g)]
      .map((match) => decodeURIComponent(match[1]));
    const commercialTargets = internalSlugs
      .map((slug) => articleBySlug.get(slug))
      .filter((target): target is Article => Boolean(
        target &&
        target.affiliateUrl &&
        !["concours", "test-gratuit"].includes(target.category),
      ));
    return {
      file: article.file,
      slug: article.slug,
      title: article.title,
      category: article.category,
      ageDays: ageInDays(article),
      internalArticleLinks: internalSlugs.length,
      hasInlineCommercialBridge: commercialTargets.length > 0,
      hasAutomaticCommercialBridge: hasAutomaticFreeTrafficBridge,
      reason: commercialTargets.length > 0
        ? "Passerelle commerciale intégrée dans le contenu"
        : hasAutomaticFreeTrafficBridge
          ? "Passerelle commerciale contextuelle injectée par le modèle d’article"
          : "Aucune passerelle commerciale détectée",
    };
  });
const unmonetizedFreeTrafficPages = freeTrafficBridgeRows.filter(
  (row) => !row.hasInlineCommercialBridge && !row.hasAutomaticCommercialBridge,
);
const automaticallyMonetizedFreeTrafficPages = freeTrafficBridgeRows.filter(
  (row) => !row.hasInlineCommercialBridge && row.hasAutomaticCommercialBridge,
);
const unprotectedStaleCommercialPages = hasAutomaticStaleProtection
  ? []
  : staleCommercialPages;
const automaticallyProtectedStaleCommercialPages = hasAutomaticStaleProtection
  ? staleCommercialPages
  : [];
const unprotectedOverdueFreeTrafficPages = hasAutomaticStaleProtection
  ? []
  : overdueFreeTrafficPages;
const automaticallyProtectedOverdueFreeTrafficPages = hasAutomaticStaleProtection
  ? overdueFreeTrafficPages
  : [];

const controlRows = articles
  .map((article) => {
    const staleCommercial = staleCommercialPages.some((row) => row.slug === article.slug);
    const overdueFreeTraffic = overdueFreeTrafficPages.some((row) => row.slug === article.slug);
    const claimCount = sensitiveClaims.filter((row) => row.slug === article.slug).length;
    const unmonetizedFreeTraffic = unmonetizedFreeTrafficPages.some((row) => row.slug === article.slug);
    const ageDays = ageInDays(article);
    const priorityScore =
      (staleCommercial ? 5 : 0) +
      (overdueFreeTraffic ? 5 : 0) +
      (unmonetizedFreeTraffic ? 3 : 0) +
      Math.min(claimCount, 3) * 2 +
      (article.affiliateUrl ? 1 : 0);
    return {
      priorityScore,
      slug: article.slug,
      title: article.title,
      category: article.category,
      date: article.date,
      updated: article.updated,
      ageDays: ageDays ?? "",
      endDate: article.endDate,
      expired: article.expired,
      hasAffiliate: Boolean(article.affiliateUrl),
      hasPrice: Boolean(article.price),
      staleCommercial,
      overdueFreeTraffic,
      unmonetizedFreeTraffic,
      sensitiveClaimCount: claimCount,
      file: article.file,
    };
  })
  .sort((a, b) => b.priorityScore - a.priorityScore || Number(b.ageDays || 0) - Number(a.ageDays || 0));

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
    staleCommercialPages,
    overdueFreeTrafficPages,
    unprotectedStaleCommercialPages,
    automaticallyProtectedStaleCommercialPages,
    unprotectedOverdueFreeTrafficPages,
    automaticallyProtectedOverdueFreeTrafficPages,
    sensitiveClaims,
    unmonetizedFreeTrafficPages,
    automaticallyMonetizedFreeTrafficPages,
  },
};

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(REPORT_DIR, "integrity-audit.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
const controlColumns = [
  "priorityScore",
  "slug",
  "title",
  "category",
  "date",
  "updated",
  "ageDays",
  "endDate",
  "expired",
  "hasAffiliate",
  "hasPrice",
  "staleCommercial",
  "overdueFreeTraffic",
  "unmonetizedFreeTraffic",
  "sensitiveClaimCount",
  "file",
] as const;
fs.writeFileSync(
  path.join(REPORT_DIR, "content-control.csv"),
  [
    controlColumns.join(","),
    ...controlRows.map((row) => controlColumns.map((column) => csvCell(row[column])).join(",")),
  ].join("\n") + "\n",
);

console.log("Audit intégrité éditoriale — Bons Plans Mania");
console.log(`  ${articles.length} articles publiés`);
console.log(`  ${exactTitles.length} groupes de titres identiques`);
console.log(`  ${exactSeoTitles.length} groupes de titres SEO identiques`);
console.log(`  ${exactDescriptions.length} groupes de descriptions identiques`);
console.log(`  ${bodyDuplicates.length} groupes de corps d’article quasi identiques`);
console.log(`  ${destinationDuplicates.length} destinations utilisées plusieurs fois`);
console.log(`  ${discountErrors.length} remises arithmétiquement incohérentes`);
console.log(`  ${unprotectedStaleCommercialPages.length} pages commerciales anciennes sans protection`);
console.log(`  ${automaticallyProtectedStaleCommercialPages.length} pages commerciales anciennes protégées par avertissement + données OutOfStock`);
console.log(`  ${unprotectedOverdueFreeTrafficPages.length} concours/tests anciens sans protection`);
console.log(`  ${automaticallyProtectedOverdueFreeTrafficPages.length} concours/tests anciens protégés par avertissement automatique`);
console.log(`  ${sensitiveClaims.length} affirmations sensibles à contrôler`);
console.log(`  ${unmonetizedFreeTrafficPages.length} concours/tests sans passerelle commerciale`);
console.log(`  ${automaticallyMonetizedFreeTrafficPages.length} concours/tests couverts par la passerelle contextuelle automatique`);
console.log("  reports/content/integrity-audit.json");
console.log("  reports/content/content-control.csv");
