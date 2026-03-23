"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

interface BrandArticle {
  slug: string;
  title: string;
  date: string;
  category: string;
}

interface BrandData {
  slug: string;
  name: string;
  count: number;
  articles: BrandArticle[];
}

const categoryLabels: Record<string, string> = {
  "bon-plan": "Bon Plan",
  "bon-plan-beaute": "Bon Plan",
  "test-gratuit": "Test Gratuit",
  test: "Test Produit",
  concours: "Concours",
  "box-beaute": "Box Beauté",
  selection: "Sélection",
  "calendrier-avent": "Calendrier",
  "code-promo": "Code Promo",
};

export default function MarquesList({ brands }: { brands: BrandData[] }) {
  const [openBrand, setOpenBrand] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? brands.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      )
    : brands;

  return (
    <>
      {/* Barre de recherche */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Rechercher une marque..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px 16px",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            fontSize: "0.95rem",
            background: "var(--surface)",
            color: "var(--foreground)",
          }}
        />
      </div>

      {/* Grille de marques */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "12px",
        }}
      >
        {filtered.map((brand) => {
          const isOpen = openBrand === brand.slug;
          return (
            <div
              key={brand.slug}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius)",
                border: `1px solid ${isOpen ? "var(--primary)" : "var(--border)"}`,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              {/* Header cliquable */}
              <button
                onClick={() => setOpenBrand(isOpen ? null : brand.slug)}
                style={{
                  width: "100%",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--foreground)",
                    }}
                  >
                    {brand.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--muted-foreground)",
                      marginTop: "2px",
                    }}
                  >
                    {brand.count} article{brand.count > 1 ? "s" : ""}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown
                    size={18}
                    style={{ color: "var(--primary)", flexShrink: 0 }}
                  />
                ) : (
                  <ChevronRight
                    size={18}
                    style={{ color: "var(--muted-foreground)", flexShrink: 0 }}
                  />
                )}
              </button>

              {/* Dropdown articles */}
              {isOpen && (
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "8px 0",
                  }}
                >
                  {brand.articles.map((article) => (
                    <a
                      key={article.slug}
                      href={`/article/${article.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        textDecoration: "none",
                        color: "var(--foreground)",
                        fontSize: "0.88rem",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--muted)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "2px 6px",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--muted)",
                          color: "var(--muted-foreground)",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {categoryLabels[article.category] || article.category}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {article.title}
                      </span>
                    </a>
                  ))}
                  {brand.count > 8 && (
                    <a
                      href={`/marque/${brand.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 16px",
                        textDecoration: "none",
                        color: "var(--primary)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      <ExternalLink size={14} />
                      Voir les {brand.count} articles {brand.name}
                    </a>
                  )}
                  {brand.count <= 8 && (
                    <a
                      href={`/marque/${brand.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 16px",
                        textDecoration: "none",
                        color: "var(--primary)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      <ExternalLink size={14} />
                      Voir la page {brand.name}
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "40px 0" }}>
          Aucune marque trouvée pour &quot;{search}&quot;
        </p>
      )}
    </>
  );
}
