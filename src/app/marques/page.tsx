import { getAllArticles } from "@/lib/articles";
import { CODE_PROMO_BRANDS } from "@/lib/code-promo-data";
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

const BRAND_NAMES: Record<string, string> = {
  nyx: "NYX Professional Makeup",
  maybelline: "Maybelline",
  loreal: "L'Oréal",
  garnier: "Garnier",
  cerave: "CeraVe",
  "la-roche-posay": "La Roche-Posay",
  neutrogena: "Neutrogena",
  kerastase: "Kérastase",
  moroccanoil: "Moroccanoil",
  nuxe: "Nuxe",
  weleda: "Weleda",
  bioderma: "Bioderma",
  vichy: "Vichy",
  rimmel: "Rimmel",
  catrice: "Catrice",
  essence: "Essence",
  nivea: "Nivea",
  pantene: "Pantene",
  ogx: "OGX",
  glowria: "Glowria",
  "prescription-lab": "Prescription Lab",
  biotyfull: "Biotyfull Box",
  blissim: "Blissim",
  "my-little-box": "My Little Box",
  lookfantastic: "Lookfantastic",
  igraal: "iGraal",
  ebuyclub: "eBuyClub",
  poulpeo: "Poulpeo",
  swagbucks: "Swagbucks",
  amazon: "Amazon",
  sephora: "Sephora",
  "yves-rocher": "Yves Rocher",
  nailmatic: "Nailmatic",
  garancia: "Garancia",
  sabon: "Sabon",
};

interface BrandData {
  slug: string;
  name: string;
  count: number;
  articles: { slug: string; title: string; date: string; category: string }[];
}

function normalizeBrandTag(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MarquesPage() {
  const allArticles = getAllArticles();

  // Réunit les marques historiques et les marques partenaires, sans doublon
  // d'affichage. Les matchTags existants permettent de retrouver les variantes
  // telles que "Beauty Success" / "beauty-success".
  const brandDefinitions = new Map<
    string,
    { slug: string; name: string; matchTags: string[] }
  >();

  for (const brand of CODE_PROMO_BRANDS) {
    brandDefinitions.set(normalizeBrandTag(brand.name), {
      slug: brand.slug,
      name: brand.name,
      matchTags: brand.matchTags,
    });
  }

  for (const [slug, name] of Object.entries(BRAND_NAMES)) {
    const key = normalizeBrandTag(name);
    if (!brandDefinitions.has(key)) {
      brandDefinitions.set(key, { slug, name, matchTags: [slug] });
    }
  }

  const brands: BrandData[] = Array.from(brandDefinitions.values())
    .map(({ slug, name, matchTags }) => {
      const normalizedTags = new Set(matchTags.map(normalizeBrandTag));
      const articles = allArticles.filter((article) =>
        article.meta.tags.some((tag) =>
          normalizedTags.has(normalizeBrandTag(tag)),
        ),
      );
      return {
        slug,
        name,
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
