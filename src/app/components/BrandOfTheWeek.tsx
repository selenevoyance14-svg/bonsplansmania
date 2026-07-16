import { BRAND_OF_THE_WEEK } from "@/lib/highlight-brand";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import ArticleCard from "@/app/components/ArticleCard";
import { Star, ArrowRight } from "lucide-react";

// Cherche les 4 derniers deals actifs de la marque du moment.
// Matching resserré : la marque doit apparaître dans le TITRE (les tags secondaires
// suffiraient à faire matcher un multi-marques type "top shampoings" qui mentionne 8 marques,
// on veut les articles VRAIMENT dédiés à la marque).
function findBrandArticles(slug: string, name: string, limit = 4) {
  const needle = slug.toLowerCase();
  const needleName = name.toLowerCase();
  const all = getAllArticles();
  return all
    .filter((a) => {
      if (isEffectivelyExpired(a.meta)) return false;
      if (a.meta.category !== "bon-plan" && a.meta.category !== "code-promo") return false;
      const title = (a.meta.title ?? "").toLowerCase();
      return title.includes(needle) || title.includes(needleName);
    })
    .slice(0, limit);
}

export default function BrandOfTheWeek() {
  const brand = BRAND_OF_THE_WEEK;
  const articles = findBrandArticles(brand.slug, brand.name, 4);
  if (articles.length === 0) return null;

  const bg = brand.bg ?? "#FDF2F8";
  const color = brand.color ?? "#DB2777";

  return (
    <section
      className="section-sm"
      style={{
        paddingTop: "40px",
        paddingBottom: "8px",
        background: `linear-gradient(180deg, ${bg} 0%, #FFFFFF 100%)`,
      }}
    >
      <div className="container">
        <div
          className="section-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: color,
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              <Star size={12} aria-hidden /> Marque à l&apos;honneur cette semaine
            </div>
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
              {brand.emoji && <span aria-hidden>{brand.emoji}</span>}
              <span>{brand.name}</span>
            </h2>
            <p style={{ marginTop: "6px", maxWidth: "640px" }}>{brand.tagline}</p>
          </div>
          <a href={brand.hubUrl} className="btn btn-secondary btn-sm">
            Voir tout <ArrowRight size={14} aria-hidden style={{ verticalAlign: "middle", marginLeft: "4px" }} />
          </a>
        </div>
        <div className="articles-grid articles-grid-4">
          {articles.map((article, index) => (
            <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
