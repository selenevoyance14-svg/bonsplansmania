import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";


export const metadata: Metadata = {
  // /blog listait les 4 700 articles du site dans une seule page de 3,7 Mo :
  // aucun contenu propre, chaque article figurant déjà dans sa catégorie. Google
  // n'y voyait qu'un doublon géant (185 impressions, 2 clics, CTR 1,08 %).
  // La page reste en ligne et navigable, elle sort simplement de l'index.
  robots: { index: false, follow: true },
  title: "Tous les Articles : Bons Plans, Tests Gratuits, Concours — Bons Plans Mania",
  description: "Retrouvez tous nos articles : bons plans beauté, codes promo, tests de produits gratuits, jeux concours et avis sur les box beauté. Plus de 700 offres à découvrir, mises à jour quotidiennement.",
  alternates: { canonical: "https://bonsplansmania.fr/blog" },
};

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan":         { label: "Bon Plan",              color: "bon-plan" },
  "bon-plan-beaute":  { label: "Bon Plan",              color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           color: "test-avis" },
  "concours":         { label: "Concours",              color: "concours" },
  "box-beaute":       { label: "Box Beauté",            color: "box-beaute" },
  "beaute":           { label: "Beauté",                color: "beaute" },
  "selection":        { label: "Beauté",                color: "beaute" },
  "calendrier-avent": { label: "Calendrier de l'Avent", color: "calendrier-avent" },
};

export default function BlogPage() {
  const articles = getAllArticles();

  const cards = articles.map((a) => {
    const cat = categoryLabels[a.meta.category];
    return {
      slug: a.meta.slug,
      title: a.meta.title,
      description: a.meta.description,
      date: a.meta.date,
      image: a.meta.image,
      imageAlt: a.meta.imageAlt,
      category: a.meta.category,
      categoryLabel: cat?.label ?? a.meta.category,
      categoryColor: cat?.color ?? a.meta.category,
      readingTime: a.meta.readingTime,
      expired: a.meta.expired,
      endDate: a.meta.endDate,
      price: a.meta.price,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://bonsplansmania.fr" },
            { "@type": "ListItem", position: 2, name: "Tous les articles" },
          ],
        }) }}
      />
      <Header activePage="/blog" />
      <main>
        <section style={{ padding: "48px 0 32px", background: "linear-gradient(135deg, #ECFEFF 0%, #F0FDFA 100%)" }}>
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Tous les articles</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>Tous les articles</h1>
            <p style={{ color: "var(--muted-foreground)" }}>{articles.length} article{articles.length > 1 ? "s" : ""} — bons plans, tests, concours &amp; box</p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section">
          <div className="container">
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>Aucun article pour le moment.</p>
            ) : (
              <LoadMoreGrid articles={cards} />
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
      <StickyAdMobile />
    </>
  );
}
