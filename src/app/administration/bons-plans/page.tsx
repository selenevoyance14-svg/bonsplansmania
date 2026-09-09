import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import DealsCockpit, { type CockpitDeal } from "./DealsCockpit";

export const metadata: Metadata = {
  title: "Cockpit des bons plans",
  robots: { index: false, follow: false, noarchive: true },
};

export default function DealsAdministrationPage() {
  const deals: CockpitDeal[] = getAllArticles()
    .filter((article) => ["bon-plan", "bon-plan-beaute", "box-beaute", "code-promo"].includes(article.meta.category))
    .slice(0, 24)
    .map(({ meta }, index) => ({
      slug: meta.slug,
      title: meta.title,
      merchant: meta.tags.find((tag) => ["amazon", "lookfantastic", "prozis", "cdiscount", "yesstyle", "carrefour"].includes(tag.toLowerCase())) || meta.tags[0] || "Autre",
      category: meta.category,
      price: meta.price || (meta.amazonAsin ? "Prix Amazon automatique" : "Prix à vérifier"),
      updated: meta.updated || meta.date,
      image: meta.image,
      status: index % 7 === 0 ? "price-drop" : index % 9 === 0 ? "warning" : "ok",
      amazon: Boolean(meta.amazonAsin),
    }));

  return <DealsCockpit initialDeals={deals} />;
}
