import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import { getAllArticles, isEffectivelyExpired, expiresSoon, type Article } from "@/lib/articles";
import { parsePrice } from "@/lib/price";
import { FEATURED_PARTNER, isFeaturedPartnerActive } from "@/lib/featured-partner";

export const metadata: Metadata = {
  title: "Bons plans du jour : coupons Amazon et petits prix",
  description: "Retrouvez les meilleurs bons plans du jour, les coupons Amazon à cocher, les offres remboursées ou cagnottées et les promotions à moins de 20 euros.",
  alternates: { canonical: "https://bonsplansmania.fr/offres-du-jour/partenaire" },
  robots: { index: false, follow: true },
};

export type Selection = "partner" | "carrefour" | "coupons" | "refund" | "small";

const featuredPartnerActive = isFeaturedPartnerActive(FEATURED_PARTNER, new Date());
const currentPartnerBrand = featuredPartnerActive ? FEATURED_PARTNER.brandName : "Carrefour";
const currentPartnerMerchant = featuredPartnerActive ? FEATURED_PARTNER.merchant : "carrefour";

const selections: Record<Selection, { label: string; title: string; description: string }> = {
  partner: {
    label: "Offres partenaire",
    title: `Toutes les offres ${currentPartnerBrand} du moment`,
    description: `Les offres prioritaires de ${currentPartnerBrand}, sélectionnées et expliquées clairement.`,
  },
  carrefour: {
    label: "Offres Carrefour",
    title: "Toutes les offres Carrefour du moment",
    description: "Promotions, remises immédiates et avantages crédités sur la carte Carrefour, avec les conditions de chaque offre.",
  },
  coupons: {
    label: "Coupons Amazon",
    title: "Tous les coupons Amazon à cocher",
    description: "Les offres Amazon dont le prix baisse après avoir coché le coupon, avec le véritable prix final indiqué.",
  },
  refund: {
    label: "Remboursé / cagnotté",
    title: "Toutes les offres remboursées ou cagnottées",
    description: "Les offres qui permettent de récupérer tout ou partie du prix en remboursement ou sur une carte fidélité.",
  },
  small: {
    label: "Moins de 20 €",
    title: "Toutes les offres à moins de 20 €",
    description: "Les petits prix réellement exploitables, sans codes abstraits ni remises sans prix final.",
  },
};

function isRefundArticle(article: Article) {
  const searchable = [article.meta.title, article.meta.description, article.meta.price, ...(article.meta.tags ?? [])].join(" ");
  return /100\s*%\s*(?:rembours|cagnott|crédit)|rembours|cagnott|crédité.+carte|carte.+crédité/i.test(searchable);
}

function isCarrefourArticle(article: Article) {
  const searchable = [article.meta.title, article.meta.description, article.meta.affiliateUrl, ...(article.meta.tags ?? [])].join(" ");
  return /carrefour/i.test(searchable);
}

function isPartnerArticle(article: Article, merchant: string) {
  const searchable = [article.meta.title, article.meta.description, article.meta.affiliateUrl, ...(article.meta.tags ?? [])].join(" ");
  return searchable.toLocaleLowerCase("fr-FR").includes(merchant.toLocaleLowerCase("fr-FR"));
}

function matchesSelection(article: Article, selection: Selection) {
  const hasCoupon = article.meta.tags?.some((tag) => tag.toLocaleLowerCase("fr-FR") === "coupon-amazon");
  if (selection === "partner") return isPartnerArticle(article, currentPartnerMerchant);
  if (selection === "carrefour") return isCarrefourArticle(article);
  if (selection === "coupons") return hasCoupon;
  if (selection === "refund") return isRefundArticle(article);
  if (selection === "small") {
    const amount = parsePrice(article.meta.price).nowAmount;
    return article.meta.category !== "code-promo"
      && !hasCoupon
      && !/^\s*[-−]/.test(article.meta.price ?? "")
      && !/code promo/i.test(article.meta.title)
      && amount !== undefined
      && amount > 0
      && amount <= 20;
  }
  return false;
}

const selectionHrefs: Record<Selection, string> = {
  partner: "/offres-du-jour/partenaire",
  carrefour: "/offres-du-jour/carrefour",
  coupons: "/offres-du-jour/coupons",
  refund: "/offres-du-jour/rembourse",
  small: "/offres-du-jour/moins-de-20-euros",
};

export function OffersSelectionPage({ selection }: { selection: Selection }) {
  const current = selections[selection];
  const articles = getAllArticles()
    .filter((article) => !isEffectivelyExpired(article.meta))
    .filter((article) => ["bon-plan", "bon-plan-beaute", "box-beaute", "code-promo", "calendrier-avent"].includes(article.meta.category))
    .filter((article) => matchesSelection(article, selection))
    .sort((a, b) => new Date(b.meta.updated ?? b.meta.date).getTime() - new Date(a.meta.updated ?? a.meta.date).getTime());

  const cards = articles.map((article) => ({
    slug: article.meta.slug,
    title: article.meta.title,
    description: article.meta.description,
    date: article.meta.updated ?? article.meta.date,
    image: article.meta.image,
    imageAlt: article.meta.imageAlt,
    category: article.meta.category,
    categoryLabel: selection === "partner" ? `Offre ${currentPartnerBrand}` : selection === "carrefour" ? "Offre Carrefour" : selection === "coupons" ? "Coupon Amazon" : selection === "refund" ? "Remboursé / cagnotté" : selection === "small" ? "Moins de 20 €" : "Bon plan",
    categoryColor: article.meta.category === "code-promo" ? "code-promo" : "bon-plan",
    readingTime: article.meta.readingTime,
    expired: false,
    expiresSoon: expiresSoon(article.meta),
    endDate: article.meta.endDate,
    price: article.meta.price,
    affiliateUrl: article.meta.affiliateUrl,
  }));

  return (
    <>
      <Header activePage="/bons-plans-en-cours" />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs">
              <Link href="/">Accueil</Link>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Offres du jour</span>
            </nav>
            <h1 style={{ fontSize: "clamp(1.7rem,4vw,2.25rem)", fontWeight: 800, marginBottom: "9px" }}>
              <Sparkles size={24} style={{ display: "inline", verticalAlign: "middle", marginRight: "9px", color: "#7D293D" }} />
              {current.title}
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "760px" }}>{current.description}</p>
            <nav aria-label="Types d’offres" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "22px" }}>
              {(Object.entries(selections) as [Selection, typeof selections[Selection]][]).map(([key, item]) => (
                <Link
                  key={key}
                  href={selectionHrefs[key]}
                  aria-current={key === selection ? "page" : undefined}
                  style={{ padding: "9px 14px", borderRadius: "999px", border: `1px solid ${key === selection ? "#7D293D" : "#D9D2C8"}`, background: key === selection ? "#7D293D" : "#fff", color: key === selection ? "#fff" : "#514A45", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-title" style={{ marginBottom: "22px" }}>
              <h2>{articles.length} offre{articles.length > 1 ? "s" : ""} actuellement disponible{articles.length > 1 ? "s" : ""}</h2>
              <p>Les articles sont classés par date de vérification, du plus récent au plus ancien.</p>
            </div>
            {cards.length > 0 ? <LoadMoreGrid articles={cards} /> : <p>Aucune offre disponible dans cette sélection pour le moment.</p>}
          </div>
        </section>
      </main>
      <StickyAdMobile />
    </>
  );
}

export default function OffresDuJourPage() {
  return <OffersSelectionPage selection="partner" />;
}
