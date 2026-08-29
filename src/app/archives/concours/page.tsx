import type { Metadata } from "next";
import { Archive, ChevronRight, Trophy } from "lucide-react";
import Header from "@/app/components/Header";
import { getArchivedArticlesByCategory } from "@/lib/articles";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Archives des jeux concours terminés",
  description: "Retrouvez les anciens jeux concours publiés sur Bons Plans Mania. Chaque fiche indique clairement que la participation est terminée.",
  alternates: { canonical: "https://bonsplansmania.fr/archives/concours" },
};

function formatDate(value?: string): string {
  if (!value) return "Date de fin non précisée";
  return new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
}

export default function ConcoursArchivesPage() {
  const articles = getArchivedArticlesByCategory("concours");

  return (
    <>
      <Header />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <a href="/categorie/concours">Concours</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Archives</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Archive size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />
              Archives des concours
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "760px" }}>
              Ces {articles.length} jeux sont terminés. Ils restent consultables pour retrouver les résultats, les lots et les anciennes modalités, mais il n’est plus possible d’y participer.
            </p>
            <a href="/categorie/concours" className="btn btn-primary" style={{ marginTop: "16px" }}>
              <Trophy size={15} /> Voir les concours en cours
            </a>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {articles.map((article) => (
                <a
                  key={article.meta.slug}
                  href={`/article/${article.meta.slug}`}
                  style={{ display: "block", padding: "18px", border: "1px solid #FCA5A5", borderRadius: "12px", background: "#FFF7F7", color: "inherit", textDecoration: "none" }}
                >
                  <span style={{ display: "inline-block", marginBottom: "8px", padding: "4px 9px", borderRadius: "999px", background: "#FEE2E2", color: "#B91C1C", fontSize: "0.72rem", fontWeight: 800 }}>
                    TERMINÉ
                  </span>
                  <h2 style={{ margin: "0 0 8px", fontSize: "1rem", lineHeight: 1.35 }}>{article.meta.title}</h2>
                  <p style={{ margin: 0, color: "#7F1D1D", fontSize: "0.82rem" }}>
                    Fin : {formatDate(article.meta.endDate)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
