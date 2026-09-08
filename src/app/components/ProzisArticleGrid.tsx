"use client";

import { useMemo, useState } from "react";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import { parsePrice } from "@/lib/price";

type ProzisCategory = "all" | "vetements" | "complements" | "alimentation" | "accessoires" | "autres";
type ProzisSort = "recent" | "price-asc" | "price-desc" | "discount";

interface ProzisArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  imageAlt: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  readingTime: string;
  expired?: boolean;
  endDate?: string;
  price?: string;
  amazonAsin?: string;
  affiliateUrl?: string;
  tags?: string[];
}

const CATEGORY_LABELS: Record<Exclude<ProzisCategory, "all">, string> = {
  vetements: "Vêtements",
  complements: "Compléments alimentaires",
  alimentation: "Alimentation & protéines",
  accessoires: "Sport & accessoires",
  autres: "Autres bons plans",
};

const CLOTHING_RE = /\b(legging|short|sweat|hoodie|body|brassi[eè]re|soutien-gorge|lingerie|v[eê]tement|t-shirt|d[eé]bardeur|jogging|pantalon|robe|veste)\b/i;
const SUPPLEMENT_RE = /\b(compl[eé]ment|capsule|g[eé]lule|comprim[eé]|vitamine|biotine|om[eé]ga|glucosamine|propolis|ail noir|amino|cr[eé]atine|magn[eé]sium|collag[eè]ne)\b/i;
const FOOD_RE = /\b(whey|prot[eé]ine|avoine|pancake|barre|snack|beurre de cacahu[eè]te|p[aâ]te [aà] tartiner|dextrin|alimentation|petit d[eé]jeuner)\b/i;
const ACCESSORY_RE = /\b(accessoire|shaker|gourde|sac|serviette|ceinture|gant|tapis|halt[eè]re|fitness|sport)\b/i;

function getProzisCategory(article: ProzisArticle): Exclude<ProzisCategory, "all"> {
  const searchable = [article.title, article.description, ...(article.tags || [])].join(" ");
  if (CLOTHING_RE.test(searchable)) return "vetements";
  if (SUPPLEMENT_RE.test(searchable)) return "complements";
  if (FOOD_RE.test(searchable)) return "alimentation";
  if (ACCESSORY_RE.test(searchable)) return "accessoires";
  return "autres";
}

export default function ProzisArticleGrid({ articles }: { articles: ProzisArticle[] }) {
  const [category, setCategory] = useState<ProzisCategory>("all");
  const [sort, setSort] = useState<ProzisSort>("recent");

  const categoryCounts = useMemo(() => {
    const counts = new Map<Exclude<ProzisCategory, "all">, number>();
    for (const article of articles) {
      const value = getProzisCategory(article);
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    return counts;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const filtered = category === "all"
      ? [...articles]
      : articles.filter((article) => getProzisCategory(article) === category);

    return filtered.sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);
      if (sort === "price-asc") return (priceA.nowAmount ?? Infinity) - (priceB.nowAmount ?? Infinity);
      if (sort === "price-desc") return (priceB.nowAmount ?? -Infinity) - (priceA.nowAmount ?? -Infinity);
      if (sort === "discount") return (priceB.discountPct ?? 0) - (priceA.discountPct ?? 0);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [articles, category, sort]);

  const selectStyle: React.CSSProperties = {
    minWidth: "210px",
    padding: "10px 38px 10px 13px",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    backgroundColor: "white",
    color: "#1f2937",
    fontSize: "0.92rem",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <>
      <div
        aria-label="Filtres des bons plans Prozis"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          padding: "16px",
          marginBottom: "24px",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          background: "#F8FAFC",
        }}
      >
        <label style={{ display: "grid", gap: "5px", fontSize: "0.78rem", fontWeight: 700, color: "#64748B" }}>
          CATÉGORIE
          <select value={category} onChange={(event) => setCategory(event.target.value as ProzisCategory)} style={selectStyle}>
            <option value="all">Tous les produits ({articles.length})</option>
            {(Object.keys(CATEGORY_LABELS) as Exclude<ProzisCategory, "all">[])
              .filter((value) => (categoryCounts.get(value) || 0) > 0)
              .map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABELS[value]} ({categoryCounts.get(value)})
                </option>
              ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: "5px", fontSize: "0.78rem", fontWeight: 700, color: "#64748B" }}>
          TRIER PAR
          <select value={sort} onChange={(event) => setSort(event.target.value as ProzisSort)} style={selectStyle}>
            <option value="recent">Les plus récents</option>
            <option value="price-asc">Prix : moins cher au plus cher</option>
            <option value="price-desc">Prix : plus cher au moins cher</option>
            <option value="discount">Plus grosse réduction</option>
          </select>
        </label>

        <span style={{ marginLeft: "auto", color: "#64748B", fontSize: "0.9rem", fontWeight: 600 }} aria-live="polite">
          {filteredArticles.length} produit{filteredArticles.length > 1 ? "s" : ""}
        </span>
      </div>

      {filteredArticles.length > 0 ? (
        <LoadMoreGrid key={`${category}-${sort}`} articles={filteredArticles} />
      ) : (
        <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "48px 0" }}>
          Aucun bon plan dans cette catégorie pour le moment.
        </p>
      )}
    </>
  );
}
