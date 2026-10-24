// Génère functions/data/affiliate-mapping.json à partir des frontmatters MDX,
// des offres de la page codes promo et des codes promo permanents.
// Le mapping est lu côté serveur par functions/go/[slug].ts pour rediriger sans exposer le lien affilié dans le HTML.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  CODE_PROMO_OFFERS,
  getOfferAffiliateAlias,
  getOfferDestinationUrl,
} from "../src/lib/code-promo-offers";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PERMANENTS_DATA = path.join(process.cwd(), "src", "lib", "codes-permanents-data.ts");
const OUT_FILE = path.join(process.cwd(), "functions", "data", "affiliate-mapping.json");
const AMAZON_PARTNER_TAG = "lebrunnathali-21";

type Row = { url: string; label?: string };
type ExtraAffiliateLink = { alias?: unknown; url?: unknown; label?: unknown };

function secureAmazonAffiliateUrl(value: string): string {
  try {
    const url = new URL(value);
    if (
      url.hostname === "amazon.fr" ||
      url.hostname.endsWith(".amazon.fr")
    ) {
      url.searchParams.set("tag", AMAZON_PARTNER_TAG);
      return url.toString();
    }
  } catch {
    return value;
  }

  return value;
}

function collectMdx(mapping: Record<string, Row>): number {
  if (!fs.existsSync(CONTENT_DIR)) return 0;
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  let count = 0;
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data } = matter(raw);
    const url = typeof data.affiliateUrl === "string" ? data.affiliateUrl.trim() : "";
    if (!url || !/^https?:\/\//i.test(url)) continue;
    mapping[slug] = {
      url: secureAmazonAffiliateUrl(url),
      ...(typeof data.affiliateLabel === "string" ? { label: data.affiliateLabel } : {}),
    };
    const alias = typeof data.affiliateAlias === "string" ? data.affiliateAlias.trim() : "";
    if (alias) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias)) {
        throw new Error(`[affiliate-mapping] Alias invalide dans ${file} : ${alias}`);
      }
      if (mapping[alias]) {
        throw new Error(`[affiliate-mapping] Alias déjà utilisé dans ${file} : ${alias}`);
      }
      mapping[alias] = mapping[slug];
    }

    const extraLinks = Array.isArray(data.affiliateLinks)
      ? (data.affiliateLinks as ExtraAffiliateLink[])
      : [];
    for (const extraLink of extraLinks) {
      const extraAlias = typeof extraLink?.alias === "string" ? extraLink.alias.trim() : "";
      const extraUrl = typeof extraLink?.url === "string" ? extraLink.url.trim() : "";
      if (!extraAlias || !extraUrl || !/^https?:\/\//i.test(extraUrl)) continue;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(extraAlias)) {
        throw new Error(`[affiliate-mapping] Alias secondaire invalide dans ${file} : ${extraAlias}`);
      }
      if (mapping[extraAlias]) {
        throw new Error(`[affiliate-mapping] Alias secondaire déjà utilisé dans ${file} : ${extraAlias}`);
      }
      mapping[extraAlias] = {
        url: secureAmazonAffiliateUrl(extraUrl),
        ...(typeof extraLink.label === "string" ? { label: extraLink.label } : {}),
      };
    }
    count++;
  }
  return count;
}

// Parse src/lib/codes-permanents-data.ts pour extraire brandSlug + affiliateUrl
// de chaque offre permanente. Les slugs sont utilisés côté featured teaser
// (permanent-codes-featured.ts) via /go/permanent-<brandSlug>.
function collectPermanentCodes(mapping: Record<string, Row>): number {
  if (!fs.existsSync(PERMANENTS_DATA)) return 0;
  const src = fs.readFileSync(PERMANENTS_DATA, "utf8");
  // Match chaque bloc contenant brandSlug: "..." et affiliateUrl: "..."
  const blockRegex = /brandSlug:\s*"([^"]+)"[\s\S]*?affiliateUrl:\s*"([^"]+)"/g;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = blockRegex.exec(src)) !== null) {
    const slug = m[1];
    const url = m[2];
    if (!/^https?:\/\//i.test(url)) continue;
    if (!slug) continue;
    mapping[`permanent-${slug}`] = { url };
    count++;
  }
  return count;
}

function collectCodePromoOffers(mapping: Record<string, Row>): number {
  let count = 0;
  const uniqueOffers = new Map(
    CODE_PROMO_OFFERS.map((offer) => [getOfferAffiliateAlias(offer), offer]),
  );

  for (const [alias, offer] of uniqueOffers) {
    const url = getOfferDestinationUrl(offer).trim();
    if (!/^https?:\/\//i.test(url)) continue;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias)) {
      throw new Error(`[affiliate-mapping] Alias code promo invalide : ${alias}`);
    }
    if (mapping[alias]) {
      throw new Error(`[affiliate-mapping] Alias code promo déjà utilisé : ${alias}`);
    }

    mapping[alias] = {
      url: secureAmazonAffiliateUrl(url),
      label: offer.title,
    };
    count++;
  }

  return count;
}

function main() {
  const mapping: Record<string, Row> = {};
  const mdxCount = collectMdx(mapping);
  const offerCount = collectCodePromoOffers(mapping);
  const codeCount = collectPermanentCodes(mapping);
  const entryCount = Object.keys(mapping).length;

  const manualFile = path.join(path.dirname(OUT_FILE), "manual-affiliate-mapping.json");
  if (fs.existsSync(manualFile)) {
    const manualMapping = JSON.parse(fs.readFileSync(manualFile, "utf8")) as Record<string, unknown>;
    const collisions = Object.keys(manualMapping).filter((slug) => slug in mapping);
    if (collisions.length > 0) {
      throw new Error(
        `[affiliate-mapping] Collision entre les mappings généré et manuel : ${collisions.join(", ")}`,
      );
    }
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(mapping, null, 0));

  console.log(
    `[affiliate-mapping] ${mdxCount} fichiers MDX + ${offerCount} offres codes promo + ${codeCount} codes permanents = ${entryCount} entrées écrites dans ${path.relative(process.cwd(), OUT_FILE)}`,
  );
}

main();
