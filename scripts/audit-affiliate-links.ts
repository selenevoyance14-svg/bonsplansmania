import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type Rule = {
  label: string;
  primaryPattern: RegExp;
  merchantHosts: RegExp;
  isTracked: (url: string) => boolean;
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const strict = process.argv.includes("--strict");

const rules: Rule[] = [
  {
    label: "Amazon",
    primaryPattern: /^(?:bon-plan-)?amazon-|^bons-plans-amazon-|^selection-bons-plans-amazon-/i,
    merchantHosts: /(^|\.)amazon\.fr$|^amzn\.to$|^link\.amazon$/i,
    isTracked: (url) =>
      /(?:[?&]tag=lebrunnathali-21(?:&|$))|^https?:\/\/(?:amzn\.to|link\.amazon)\//i.test(url),
  },
  {
    label: "Atida",
    primaryPattern: /^(?:bon-plan-)?atida-|^code-promo-atida-/i,
    merchantHosts: /(^|\.)atida\.fr$/i,
    isTracked: (url) => /^https?:\/\/nwq\.atida\.fr\//i.test(url),
  },
  {
    label: "Caroll",
    primaryPattern: /^(?:bon-plan-)?caroll-|^code-promo-caroll-/i,
    merchantHosts: /(^|\.)caroll\.com$/i,
    isTracked: (url) => /^https?:\/\/action\.metaffiliation\.com\/trk\.php\?[^\s]*mclic=P512E6157CD2D1F1/i.test(url),
  },
  {
    label: "Greenweez",
    primaryPattern: /^(?:bon-plan-)?greenweez-|^code-promo-greenweez-/i,
    merchantHosts: /(^|\.)greenweez\.com$/i,
    isTracked: (url) => /(?:[?&]ae=344(?:&|$))|affilae/i.test(url),
  },
  {
    label: "Shoes.fr",
    primaryPattern: /^shoes-fr-/i,
    merchantHosts: /(^|\.)shoes\.fr$/i,
    isTracked: (url) => /^https?:\/\/vkz\.shoes\.fr\/\?P51317957CD2D171/i.test(url),
  },
  {
    label: "Chaussea",
    primaryPattern: /^chaussea-/i,
    merchantHosts: /(^|\.)chaussea\.com$/i,
    isTracked: (url) => /^https?:\/\/jwv\.chaussea\.com\/\?P51387157CD2D1B1/i.test(url),
  },
  {
    label: "YesStyle",
    primaryPattern: /^(?:yesstyle-|code-promo-yesstyle-|soldes-yesstyle-|(?:bon-plan|avis|test)-.*yesstyle)/i,
    merchantHosts: /(^|\.)yesstyle\.com$/i,
    isTracked: (url) =>
      /^https?:\/\/(?:www\.)?awin1\.com\/cread\.php\?[^\s]*awinaffid=990397/i.test(url) ||
      /^https?:\/\/(?:ystyle\.co|tidd\.ly)\//i.test(url) ||
      /(?:[?&]rco=NATHALIE83(?:&|$))/i.test(url),
  },
];

type Finding = { brand: string; file: string; message: string; url?: string };
const findings: Finding[] = [];
const checked = new Map<string, number>();

function cleanUrl(raw: string): string {
  return raw.replace(/[*)>\]}'",.;:]+$/g, "");
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

for (const name of fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx"))) {
  const fullPath = path.join(CONTENT_DIR, name);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  if (data.published !== true || data.expired === true) continue;

  const affiliateUrl = typeof data.affiliateUrl === "string" ? data.affiliateUrl.trim() : "";
  const urls = [...new Set([...content.matchAll(/https?:\/\/[^\s<>"]+/g)].map((match) => cleanUrl(match[0])))];

  for (const rule of rules) {
    const primaryArticle = rule.primaryPattern.test(name);
    if (primaryArticle) checked.set(rule.label, (checked.get(rule.label) || 0) + 1);

    if (primaryArticle && !affiliateUrl && !(rule.label === "Amazon" && data.amazonAsin)) {
      findings.push({ brand: rule.label, file: name, message: "affiliateUrl manquant" });
    }
    const affiliateHostIsMerchant = rule.merchantHosts.test(hostOf(affiliateUrl));
    const mustUsePrimaryTracker = primaryArticle && rule.label !== "Amazon";
    if (affiliateUrl && (affiliateHostIsMerchant || mustUsePrimaryTracker) && !rule.isTracked(affiliateUrl)) {
      findings.push({
        brand: rule.label,
        file: name,
        message: "affiliateUrl sans suivi reconnu",
        url: affiliateUrl,
      });
    }

    for (const url of urls) {
      if (rule.merchantHosts.test(hostOf(url)) && !rule.isTracked(url)) {
        findings.push({ brand: rule.label, file: name, message: "lien marchand direct dans le texte", url });
      }
    }
  }
}

console.log("Contrôle des liens affiliés par marque");
for (const rule of rules) {
  const count = checked.get(rule.label) || 0;
  const errors = findings.filter((finding) => finding.brand === rule.label).length;
  console.log(`- ${rule.label}: ${count} article(s) actif(s), ${errors} anomalie(s)`);
}

if (findings.length) {
  console.error("\nAnomalies à corriger avant publication :");
  for (const finding of findings) {
    console.error(`- [${finding.brand}] ${finding.file}: ${finding.message}${finding.url ? ` — ${finding.url}` : ""}`);
  }
  if (strict) process.exitCode = 1;
} else {
  console.log("\nAucun lien non suivi détecté pour les marques contrôlées.");
}
