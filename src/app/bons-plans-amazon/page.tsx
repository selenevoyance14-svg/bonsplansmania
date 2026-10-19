import type { Metadata } from "next";
import { ChevronRight, ShoppingCart } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import BrandFilter from "@/app/components/BrandFilter";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import { getAllArticles } from "@/lib/articles";

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan": { label: "Bon Plan", color: "bon-plan" },
  "bon-plan-beaute": { label: "Bon Plan", color: "bon-plan" },
  "code-promo": { label: "Code Promo", color: "code-promo" },
  "selection": { label: "Sélection", color: "selection" },
};

export const metadata: Metadata = {
  title: "Bons plans Amazon : promos et baisses de prix du moment",
  description:
    "Retrouvez les bons plans Amazon actuellement publiés : jouets, beauté, maison, bébé et high-tech, avec prix et conditions vérifiés.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-amazon" },
  openGraph: {
    title: "Bons plans Amazon du moment",
    description:
      "Les offres Amazon actuellement publiées sur Bons Plans Mania, avec prix, réductions et conditions vérifiés.",
    url: "https://bonsplansmania.fr/bons-plans-amazon",
    type: "website",
  },
};

const ALLOWED_CATEGORIES = new Set([
  "bon-plan",
  "bon-plan-beaute",
  "code-promo",
  "selection",
]);

const AMAZON_PRODUCT_TYPES = [
  {
    key: "jouets",
    label: "Jouets & jeux",
    keywords: ["jouet", "jeu", "lego", "playmobil", "poupee", "puzzle", "play-doh", "magnetique", "gabby", "peppa pig"],
  },
  {
    key: "beaute",
    label: "Beauté & soins",
    keywords: ["beaute", "soin", "maquillage", "serum", "creme", "parfum", "shampoing", "rasoir", "brosse a dents", "nivea", "maybelline"],
  },
  {
    key: "maison-cuisine",
    label: "Maison & cuisine",
    keywords: ["maison", "cuisine", "air fryer", "friteuse", "ninja", "tefal", "cafe", "bougie", "linge", "aspirateur", "electromenager"],
  },
  {
    key: "high-tech",
    label: "High-tech",
    keywords: ["high-tech", "ordinateur", "pc portable", "smartphone", "tablette", "ecouteur", "casque", "camera", "montre connectee", "television"],
  },
  {
    key: "bebe-enfant",
    label: "Bébé & enfant",
    keywords: ["bebe", "enfant", "puericulture", "naissance", "tour d'observation", "chaise haute", "poussette", "siege auto"],
  },
  {
    key: "mode",
    label: "Mode & accessoires",
    keywords: ["mode", "vetement", "chaussure", "basket", "sac", "montre", "bijou", "accessoire mode"],
  },
  {
    key: "jardin-bricolage",
    label: "Jardin & bricolage",
    keywords: ["jardin", "bricolage", "outil", "barbecue", "tondeuse", "terrasse", "exterieur"],
  },
  {
    key: "sport-loisirs",
    label: "Sport & loisirs",
    keywords: ["sport", "fitness", "velo", "camping", "loisir", "voyage"],
  },
];

function isAmazonOffer(meta: {
  amazonAsin?: string;
  affiliateUrl?: string;
  archiveOnly?: boolean;
  category?: string;
}) {
  if (meta.archiveOnly || !meta.category || !ALLOWED_CATEGORIES.has(meta.category)) return false;
  if (meta.amazonAsin) return true;
  return /(?:amazon\.fr|amzn\.(?:to|eu)|link\.amazon)/i.test(meta.affiliateUrl || "");
}

export default function BonsPlansAmazonPage() {
  const articles = getAllArticles().filter((article) => isAmazonOffer(article.meta));

  const cards = articles.map((article) => {
    const label = categoryLabels[article.meta.category];
    return {
      slug: article.meta.slug,
      title: article.meta.title,
      description: article.meta.description,
      date: article.meta.date,
      image: article.meta.image,
      imageAlt: article.meta.imageAlt,
      category: article.meta.category,
      categoryLabel: label?.label ?? article.meta.category,
      categoryColor: label?.color ?? article.meta.category,
      readingTime: article.meta.readingTime,
      expired: article.meta.expired,
      endDate: article.meta.endDate,
      featured: article.meta.featured,
      tags: article.meta.tags,
      price: article.meta.price,
      prix_origine: article.meta.prix_origine,
      deliveryPrice: article.meta.deliveryPrice,
      merchant: article.meta.merchant,
      amazonAsin: article.meta.amazonAsin,
      affiliateUrl: article.meta.affiliateUrl,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Bons plans Amazon du moment",
            description:
              "Les offres Amazon actuellement publiées sur Bons Plans Mania, avec prix et conditions vérifiés.",
            url: "https://bonsplansmania.fr/bons-plans-amazon",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: articles.length,
              itemListElement: articles.slice(0, 20).map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://bonsplansmania.fr/article/${article.meta.slug}`,
                name: article.meta.title,
              })),
            },
          }),
        }}
      />
      <Header activePage="/bons-plans-amazon" />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>
                <ShoppingCart size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                Bons plans Amazon
              </span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <ShoppingCart size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#b45309" }} />
              Bons plans Amazon du moment
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "760px" }}>
              Retrouvez les <strong>promotions et baisses de prix Amazon</strong> actuellement publiées : jouets, beauté, maison, bébé et high-tech. Les prix peuvent évoluer rapidement ; vérifiez toujours le montant final sur Amazon. {articles.length} offres.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Toutes les offres Amazon ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Aucun bon plan Amazon actif pour le moment.
              </p>
            ) : (
              <BrandFilter
                articles={cards}
                brands={[]}
                productTypes={AMAZON_PRODUCT_TYPES}
                productTypeAllLabel="Tous les rayons"
                productTypeAriaLabel="Filtrer les offres Amazon par rayon"
                showPriceFilter
              />
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
      <StickyAdMobile />
    </>
  );
}
