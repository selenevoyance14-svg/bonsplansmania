"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface ArticleData {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  imageAlt: string;
  date: string;
}

const categoryLabels: Record<string, string> = {
  "bon-plan": "Bon Plan",
  "bon-plan-beaute": "Bon Plan",
  "test-gratuit": "Test Gratuit",
  "concours": "Concours",
  "box-beaute": "Box Beauté",
  "calendrier": "Calendrier",
  "calendrier-avent": "Calendrier de l'Avent",
  "beaute": "Beauté",
  "selection": "Beauté",
  "test-avis": "Test & Avis",
  "code-promo": "Code Promo",
};

export default function SearchClient({ articles }: { articles: ArticleData[] }) {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const q = query.trim().toLowerCase();

  // Si l'URL change (navigation client), on synchronise le champ
  useEffect(() => {
    const urlQ = searchParams?.get("q") ?? "";
    if (urlQ && urlQ !== query) setQuery(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const results = q
    ? articles.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      ).slice(0, 50)
    : [];

  return (
    <main style={{ minHeight: "80vh" }}>
      <section style={{ background: "var(--primary)", padding: "48px 0 40px" }}>
        <div className="container" style={{ maxWidth: "680px" }}>
          <h1 style={{ color: "white", fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 800, marginBottom: "24px", textAlign: "center" }}>
            Rechercher un bon plan
          </h1>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex : biotyfull, concours, test gratuit..."
              autoFocus
              style={{
                flex: 1, padding: "14px 18px", borderRadius: "12px",
                border: "none", fontSize: "1rem", outline: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
            <button
              type="button"
              style={{
                padding: "14px 24px", borderRadius: "12px", border: "none",
                background: "white", color: "var(--primary)", fontWeight: 700,
                fontSize: "0.95rem", cursor: "pointer", display: "flex",
                alignItems: "center", gap: "6px", whiteSpace: "nowrap",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Rechercher
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!q && (
            <p style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: "1.05rem", marginTop: "24px" }}>
              Tapez un mot-clé pour trouver un bon plan, concours ou test gratuit.
            </p>
          )}

          {q && results.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", marginBottom: "12px" }}>
                Aucun résultat pour <strong>&ldquo;{query}&rdquo;</strong>
              </p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
                Essayez avec un autre mot-clé ou parcourez les catégories depuis l&apos;accueil.
              </p>
            </div>
          )}

          {q && results.length > 0 && (
            <>
              <p style={{ marginBottom: "28px", color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
                <strong>{results.length}</strong> résultat{results.length > 1 ? "s" : ""} pour &ldquo;<strong>{query}</strong>&rdquo;
              </p>
              <div className="articles-grid">
                {results.map((article) => (
                  <a key={article.slug} href={`/article/${article.slug}`} className="card" style={{ textDecoration: "none" }}>
                    <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                      <Image src={article.image.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania-beige.png" : article.image} alt={article.imageAlt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                    <div className="card-body">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span className={`card-category card-category-${article.category}`} style={{ textTransform: "capitalize", fontSize: "0.75rem" }}>
                          {categoryLabels[article.category] ?? article.category}
                        </span>
                        <time style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                          {new Date(article.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" })}
                        </time>
                      </div>
                      <h3 className="card-title">{article.title}</h3>
                      <p className="card-excerpt">{article.description}</p>
                    </div>
                    <div className="card-footer">
                      <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.82rem" }}>Voir le bon plan →</span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
