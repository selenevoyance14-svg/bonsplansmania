import { getAllArticles } from "@/lib/articles";
import {
  BRAND_DEFINITIONS,
  getNormalizedBrandTags,
  normalizeBrandTag,
} from "@/lib/brand-directory";
import Header from "@/app/components/Header";
import type { Metadata } from "next";
import { Tag, ChevronRight } from "lucide-react";
import MarquesList from "./MarquesList";


export const metadata: Metadata = {
  title: "Toutes les Marques — Bons Plans & Articles | BonsPlansMania",
  description:
    "Retrouvez toutes les marques beauté et bons plans sur BonsPlansMania : L'Oréal, Garnier, Sephora, NYX, CeraVe, Bioderma et bien plus.",
  alternates: { canonical: "https://bonsplansmania.fr/marques" },
};

interface BrandData {
  slug: string;
  name: string;
  count: number;
  articles: { slug: string; title: string; date: string; category: string }[];
}

export default function MarquesPage() {
  const allArticles = getAllArticles();

  const brands: BrandData[] = BRAND_DEFINITIONS
    .map((brand) => {
      const normalizedTags = getNormalizedBrandTags(brand);
      const articles = allArticles.filter((article) =>
        article.meta.tags.some((tag) =>
          normalizedTags.has(normalizeBrandTag(tag)),
        ),
      );
      return {
        slug: brand.slug,
        name: brand.name,
        count: articles.length,
        articles: articles.slice(0, 8).map((a) => ({
          slug: a.meta.slug,
          title: a.meta.title,
          date: a.meta.date,
          category: a.meta.category,
        })),
      };
    })
    .filter((b) => b.count > 0)
    .sort((a, b) =>
      a.name.localeCompare(b.name, "fr", {
        sensitivity: "base",
        ignorePunctuation: true,
      }),
    );

  const totalArticles = brands.reduce((sum, b) => sum + b.count, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Toutes les Marques",
            description:
              "Toutes les marques beauté et bons plans sur BonsPlansMania.",
            url: "https://bonsplansmania.fr/marques",
          }),
        }}
      />
      <Header />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight
                size={12}
                style={{ margin: "0 4px", opacity: 0.5 }}
              />
              <span>Marques</span>
            </nav>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              <Tag
                size={22}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: "8px",
                }}
              />
              Toutes les Marques
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              {brands.length} marques — {totalArticles} articles au total
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <MarquesList brands={brands} />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} BonsPlansMania — Certains liens sont
              des liens affiliés.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
