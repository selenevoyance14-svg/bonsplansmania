import type { Metadata } from "next";
import { expiresSoon, getAllArticles, getAllPublishedArticles } from "@/lib/articles";
import DealsCockpit, { type CockpitDeal, type CockpitSummary } from "./DealsCockpit";

export const metadata: Metadata = {
  title: "Cockpit des bons plans",
  robots: { index: false, follow: false, noarchive: true },
};

const DEAL_CATEGORIES = new Set(["bon-plan", "bon-plan-beaute", "box-beaute", "code-promo"]);
const KNOWN_MERCHANTS = [
  "Amazon", "Lookfantastic", "Prozis", "Cdiscount", "YesStyle", "Carrefour", "iGraal",
  "Poulpeo", "Pranarom", "Electro Depot", "Léa Nature", "Greenweez", "Darty", "Adopt",
];

function merchantFromUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    for (const key of ["ued", "url", "redir", "lp"]) {
      const destination = parsed.searchParams.get(key);
      if (destination) return merchantFromUrl(decodeURIComponent(destination));
    }
    return parsed.hostname.replace(/^www\./, "").split(".")[0]?.replace(/-/g, " ");
  } catch {
    return undefined;
  }
}

function detectMerchant(tags: string[], affiliateUrl?: string): string {
  const source = `${tags.join(" ")} ${affiliateUrl || ""}`.toLowerCase();
  return KNOWN_MERCHANTS.find((name) => source.includes(name.toLowerCase()))
    || merchantFromUrl(affiliateUrl)
    || tags[0]
    || "Autre";
}

export default function DealsAdministrationPage() {
  const activeArticles = getAllArticles().filter((article) => DEAL_CATEGORIES.has(article.meta.category));
  const publishedArticles = getAllPublishedArticles().filter((article) => DEAL_CATEGORIES.has(article.meta.category));
  const homepageSlugs = new Set(activeArticles.slice(0, 15).map(({ meta }) => meta.slug));

  const deals: CockpitDeal[] = activeArticles.map(({ meta }) => {
    const missingLink = !meta.affiliateUrl || meta.affiliateUrl === "#";
    const missingImage = (!meta.image || meta.image.includes("placeholder")) && !meta.amazonAsin;
    const missingPrice = !meta.price && !meta.amazonAsin && meta.category !== "code-promo";
    const amazonPriceToCheck = Boolean(meta.amazonAsin && !meta.price);
    const status: CockpitDeal["status"] = missingLink
      ? "missing-link"
      : missingImage
        ? "missing-image"
        : missingPrice
          ? "missing-price"
          : amazonPriceToCheck
            ? "price-check"
          : expiresSoon(meta)
            ? "expiring"
            : "ok";

    return {
      slug: meta.slug,
      title: meta.title,
      merchant: detectMerchant(meta.tags, meta.affiliateUrl),
      category: meta.category,
      price: meta.price || (meta.amazonAsin ? "Prix Amazon en direct" : "Non renseigné"),
      updated: meta.updated || meta.date,
      image: meta.image,
      status,
      onHomepage: homepageSlugs.has(meta.slug),
      amazonAsin: meta.amazonAsin,
      affiliateUrl: meta.affiliateUrl,
      endDate: meta.endDate,
    };
  });

  const summary: CockpitSummary = {
    totalActive: activeArticles.length,
    totalCodes: activeArticles.filter(({ meta }) => meta.category === "code-promo").length,
    totalArchived: Math.max(0, publishedArticles.length - activeArticles.length),
    displayed: deals.length,
  };

  return <DealsCockpit initialDeals={deals} summary={summary} />;
}
