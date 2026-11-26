import type { Metadata } from "next";
import { ChevronRight, Sun, Calendar, Umbrella, Sparkles, Wind, Baby, Heart } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import { getSummerThemes } from "@/lib/summer-selection";

export const metadata: Metadata = {
  title: "Bons plans été : solaires et vacances — BonsPlansMania",
  description:
    "Retrouvez les bons plans de l'été : protections solaires, autobronzants, ventilateurs, vacances, plage et produits adaptés aux bébés.",
  alternates: { canonical: "https://bonsplansmania.fr/ete" },
  openGraph: {
    title: "Bons plans été — Solaires, vacances et fraîcheur",
    description:
      "Toutes nos sélections, bons plans et concours pour l'été : solaires bio, autobronzants, parasols, ventilateurs, maillots et équipements de plage.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr/ete",
  },
};

type ArticleType = ReturnType<typeof getAllArticles>[number];

export default function Ete2026Page() {
  const all = getAllArticles();

  const summer = all
    .filter((article) => !isEffectivelyExpired(article.meta) && getSummerThemes(article.meta).length > 0)
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
  const byTheme = (theme: string) => summer.filter((article) => getSummerThemes(article.meta).includes(theme)).slice(0, 6);
  const solaires = byTheme("solaires");
  const autobronzants = byTheme("autobronzants");
  const climatisation = byTheme("anti-canicule");
  const vacances = byTheme("vacances");
  const bebeEte = byTheme("bebe-ete");
  const featured = summer.filter((article) => article.meta.featured).slice(0, 6);
  const displayedCount = new Set([...solaires, ...autobronzants, ...climatisation, ...vacances, ...bebeEte, ...featured].map((article) => article.meta.slug)).size;

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const sections: { id: string; title: string; desc: string; Icon: typeof Sun; color: string; articles: ArticleType[] }[] = [
    { id: "solaires", title: "☀️ Crèmes solaires & soins SPF", desc: "Protections bio, visage & corps, bébé, anti-taches", Icon: Sun, color: "#F59E0B", articles: solaires },
    { id: "autobronzants", title: "✨ Autobronzants & glow", desc: "Soins autobronzants pour le visage et le corps", Icon: Sparkles, color: "#EAB308", articles: autobronzants },
    { id: "anti-canicule", title: "🌬️ Anti-canicule : ventilateurs & climatisation", desc: "Ventilateurs silencieux, climatiseurs mobiles, brumisateurs", Icon: Wind, color: "#0EA5E9", articles: climatisation },
    { id: "vacances", title: "🏖️ Vacances, parasols & camping", desc: "Équipements de plage, baignade, camping et séjours estivaux", Icon: Umbrella, color: "#EC4899", articles: vacances },
    { id: "bebe-ete", title: "👶 Bébé en été : maillots, couches bain, anti-UV", desc: "Vêtements UPF 50+, couches piscine, brassards", Icon: Baby, color: "#10B981", articles: bebeEte },
  ];

  return (
    <>
      <Header />
      <main>
        <section
          style={{
            background: "linear-gradient(135deg, #FEF3C7 0%, #FED7AA 50%, #FCA5A5 100%)",
            padding: "48px 0 32px",
            borderBottom: "3px solid #F59E0B",
          }}
        >
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Été</span>
            </nav>
            <h1
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 2.7rem)",
                fontWeight: 800,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                color: "#7C2D12",
              }}
            >
              <Sun size={36} color="#F59E0B" />
              Les bons plans de l&apos;été
            </h1>
            <p style={{ color: "#7C2D12", fontSize: "1.1rem", maxWidth: "820px", marginBottom: "16px", lineHeight: 1.6 }}>
              Retrouvez nos sélections saisonnières : protections solaires, autobronzants,
              ventilateurs, équipements pour la plage et les vacances, produits adaptés aux
              bébés. Les offres signalées comme terminées sont exclues de cette sélection.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  color: "#7C2D12",
                  background: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid #FCA5A5",
                }}
              >
                <Calendar size={14} />
                <span>Mise à jour : {today}</span>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  color: "white",
                  background: "#DC2626",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: 700,
                }}
              >
                🔥 {displayedCount} articles dans la sélection
              </div>
            </div>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        {/* Quick links anchors */}
        <section className="section" style={{ paddingTop: "20px", paddingBottom: "8px" }}>
          <div className="container">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              {sections.filter((s) => s.articles.length > 0).map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{
                    background: "white",
                    border: `2px solid ${s.color}`,
                    color: s.color,
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured highlight */}
        {featured.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="section-title">
                <h2>
                  <Heart size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#EC4899" }} />
                  Nos coups de cœur de l&apos;été
                </h2>
                <p>Des articles liés aux thèmes de l’été</p>
              </div>
              <div className="articles-grid">
                {featured.map((article, index) => (
                  <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sections by theme */}
        {sections.map((sec, i) => (
          sec.articles.length > 0 && (
            <section key={sec.id} id={sec.id} className="section" style={{ background: i % 2 === 0 ? "var(--muted)" : "white" }}>
              <div className="container">
                <div className="section-title">
                  <h2>
                    <sec.Icon size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: sec.color }} />
                    {sec.title}
                  </h2>
                  <p>{sec.desc}</p>
                </div>
                <div className="articles-grid">
                  {sec.articles.map((article) => (
                    <ArticleCard key={article.meta.slug} article={article} />
                  ))}
                </div>
              </div>
            </section>
          )
        ))}

        {summer.length === 0 && (
          <section className="section">
            <div className="container" style={{ textAlign: "center", padding: "48px 0", color: "var(--muted-foreground)" }}>
              <p>Aucun article été indexé pour le moment — on enrichit bientôt !</p>
              <a href="/categorie/bon-plan" className="btn btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
                Voir tous les bons plans →
              </a>
            </div>
          </section>
        )}

        {/* Related hubs */}
        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>À découvrir aussi</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {[
                { href: "/categorie/bon-plan", label: "🛍️ Tous les bons plans", desc: "Toutes catégories confondues", color: "#0EA5A9" },
                { href: "/categorie/concours", label: "🎁 Concours en cours", desc: "Jeux gratuits, instants gagnants", color: "#7C3AED" },
                { href: "/categorie/test-gratuit", label: "🆓 Tests gratuits", desc: "Campagnes ambassadrice", color: "#16A34A" },
                { href: "/categorie/box-beaute", label: "📦 Box beauté", desc: "Blissim, Glowria, Biotyfull…", color: "#86198F" },
              ].map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  style={{
                    background: "white",
                    border: `1px solid ${c.color}22`,
                    borderRadius: "16px",
                    padding: "20px",
                    textDecoration: "none",
                    display: "block",
                    transition: "transform 0.15s",
                  }}
                >
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
