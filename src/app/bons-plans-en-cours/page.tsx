import type { Metadata } from "next";
import { ChevronRight, Flame, Calendar } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";
import StickyAdMobile from "@/app/components/StickyAdMobile";

export const metadata: Metadata = {
  title: "Bons plans en cours cette semaine — BonsPlansMania",
  description: "Tous les bons plans, ventes privées, codes promo et soldes actifs cette semaine. Cdiscount, Showroom Privé, Sarenza, Amazon, Zooplus, L'Atelier du Sourcil et plus.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-en-cours" },
  openGraph: {
    title: "Bons plans en cours cette semaine",
    description: "Tous les bons plans actifs cette semaine sur les grandes marques : Cdiscount, Showroom Privé, Sarenza, Amazon, Zooplus et plus.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr/bons-plans-en-cours",
  },
};

export default function BonsPlansEnCoursPage() {
  const all = getAllArticles();
  const now = Date.now();
  const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;

  const liveDeals = all
    .filter((a) => {
      const cat = a.meta.category;
      if (cat !== "bon-plan" && cat !== "code-promo") return false;
      if (a.meta.expired) return false;
      const articleDate = new Date(a.meta.date).getTime();
      return now - articleDate < FOURTEEN_DAYS;
    })
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

  const featured = liveDeals.filter((a) => a.meta.featured);
  const others = liveDeals.filter((a) => !a.meta.featured);

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <Header />
      <main>
        <section style={{ background: "linear-gradient(135deg, #FFF0F0 0%, #FFF8F0 100%)", padding: "40px 0 28px", borderBottom: "2px solid #FECDD3" }}>
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Bons plans en cours</span>
            </nav>
            <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.3rem)", fontWeight: 800, marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
              <Flame size={28} color="#E63946" />
              Bons plans en cours cette semaine
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem", maxWidth: "780px", marginBottom: "12px" }}>
              Tous les bons plans, ventes privées et codes promo actifs en ce moment. Cdiscount, Showroom Privé, Sarenza, Amazon, Zooplus, L&apos;Atelier du Sourcil, MiiN Cosmetics et plus. Page mise à jour quotidiennement.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#6b7280", background: "white", padding: "6px 12px", borderRadius: "20px", border: "1px solid #FECDD3" }}>
              <Calendar size={14} />
              <span>Mise à jour : {today}</span>
            </div>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        {featured.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="section-title">
                <h2>
                  <Flame size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#E63946" }} />
                  Les bons plans à ne pas rater
                </h2>
                <p>Sélection rédactionnelle de la semaine</p>
              </div>
              <div className="articles-grid">
                {featured.map((article, index) => (
                  <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
                ))}
              </div>
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="section" style={{ background: "var(--muted)" }}>
            <div className="container">
              <div className="section-title">
                <h2>Tous les bons plans actifs</h2>
                <p>Publiés ces 14 derniers jours, encore valables</p>
              </div>
              <div className="articles-grid">
                {others.map((article) => (
                  <ArticleCard key={article.meta.slug} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}

        {liveDeals.length === 0 && (
          <section className="section">
            <div className="container" style={{ textAlign: "center", padding: "48px 0", color: "var(--muted-foreground)" }}>
              <p>Aucun bon plan actif cette semaine — revenez bientôt !</p>
              <a href="/categorie/bon-plan" className="btn btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
                Voir tous les bons plans →
              </a>
            </div>
          </section>
        )}

        <section className="section">
          <div className="container">
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", maxWidth: "780px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Comment on sélectionne nos bons plans</h2>
              <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
                Chaque jour, on déniche les <strong>meilleurs bons plans, codes promo et ventes privées</strong> du moment. On ne publie que les offres qu&apos;on a vérifiées : <strong>conditions transparentes, prix vraiment réduits, marques fiables</strong>.
              </p>
              <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
                Cette page liste <strong>uniquement les bons plans actifs</strong> publiés ces 14 derniers jours. Au-delà, on archive ou on met à jour. Pour les codes promo qui marchent toute l&apos;année, voir notre <a href="/codes-promo-permanents" style={{ color: "#E63946", fontWeight: 700 }}>page Codes promo permanents</a>.
              </p>
              <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
                <strong>Marques partenaires régulières</strong> : Amazon, Cdiscount, E.Leclerc, Showroom Privé, Sarenza, Zooplus, MiiN Cosmetics, L&apos;Atelier du Sourcil, Dr Pierre Ricaud, News Parfums, Yves Rocher.
              </p>
            </div>
          </div>
        </section>

        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>Aller plus loin</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {[
                { href: "/codes-promo-permanents", label: "Codes promo permanents", desc: "Réductions valables toute l'année", color: "#1D4ED8" },
                { href: "/categorie/bon-plan", label: "Tous les bons plans", desc: "Archives + actuel", color: "#E63946" },
                { href: "/code-promo", label: "Codes promo par marque", desc: "Sephora, Lookfantastic, YesStyle…", color: "#C2410C" },
                { href: "/categorie/box-beaute", label: "Box beauté en promo", desc: "My Little Box, Blissim, Biotyfull…", color: "#86198F" },
              ].map((c) => (
                <a key={c.href} href={c.href} style={{ background: "white", border: `1px solid ${c.color}22`, borderRadius: "16px", padding: "20px", textDecoration: "none", display: "block", transition: "transform 0.15s" }}>
                  <div style={{ fontWeight: 800, color: c.color, marginBottom: "6px", fontSize: "1.05rem" }}>{c.label}</div>
                  <div style={{ fontSize: "0.88rem", color: "#4b5563" }}>{c.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <StickyAdMobile />
    </>
  );
}
