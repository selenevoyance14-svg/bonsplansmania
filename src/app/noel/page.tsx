import type { Metadata } from "next";
import { ChevronRight, TreePine, Calendar, Gift, Sparkles, Trophy, Heart } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import { matchesSeasonalKeywords } from "@/lib/seasonal-match";

export const metadata: Metadata = {
  title: "Bons plans Noël : calendriers de l'Avent — BonsPlansMania",
  description:
    "Retrouvez les bons plans Noël : calendriers de l'Avent, coffrets cadeaux, offres Black Friday, concours et codes promo de fin d'année.",
  alternates: { canonical: "https://bonsplansmania.fr/noel" },
  openGraph: {
    title: "Noël — Calendriers de l'Avent, cadeaux, bons plans",
    description:
      "Toutes nos sélections, calendriers de l'Avent et idées cadeaux Noël. Box beauté, coffrets, jouets, high-tech, concours.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr/noel",
  },
};

type ArticleType = ReturnType<typeof getAllArticles>[number];

const KEYWORDS = [
  "noel",
  "noël",
  "calendrier-avent",
  "calendrier de l'avent",
  "calendrier avent",
  "avent",
  "black-friday",
  "black friday",
  "cyber-monday",
  "fete-fin-annee",
  "cadeau noel",
  "cadeau-noel",
  "coffret noel",
  "decembre-2026",
  "novembre-2026",
];

function matches(article: ArticleType): boolean {
  const haystack = [
    article.meta.title.toLowerCase(),
    article.meta.description.toLowerCase(),
    ...(article.meta.tags || []).map((t) => t.toLowerCase()),
  ].join(" ");
  return matchesSeasonalKeywords(haystack, KEYWORDS);
}

export default function Noel2026Page() {
  const all = getAllArticles();

  const articles = all
    .filter((a) => !isEffectivelyExpired(a.meta) && matches(a))
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

  const calendriers = articles.filter((a) => {
    const haystack = [a.meta.title.toLowerCase(), ...(a.meta.tags || []).map((t) => t.toLowerCase())].join(" ");
    return matchesSeasonalKeywords(haystack, ["calendrier", "avent"]);
  }).slice(0, 6);

  const blackFriday = articles.filter((a) => {
    const haystack = [a.meta.title.toLowerCase(), ...(a.meta.tags || []).map((t) => t.toLowerCase())].join(" ");
    return matchesSeasonalKeywords(haystack, ["black friday", "black-friday", "cyber-monday"]);
  }).slice(0, 6);

  const coffrets = articles.filter((a) => {
    const haystack = [a.meta.title.toLowerCase(), ...(a.meta.tags || []).map((t) => t.toLowerCase())].join(" ");
    return matchesSeasonalKeywords(haystack, ["coffret", "cadeau"]);
  }).slice(0, 6);

  const concoursNoel = articles.filter((a) => a.meta.category === "concours").slice(0, 6);
  const featured = articles.filter((a) => a.meta.featured).slice(0, 6);

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const sections: { id: string; title: string; desc: string; Icon: typeof Gift; color: string; articles: ArticleType[] }[] = [
    { id: "calendriers", title: "🎄 Calendriers de l'Avent", desc: "Beauté, gourmandise, enfants — toutes les box", Icon: TreePine, color: "#16A34A", articles: calendriers },
    { id: "black-friday", title: "🔥 Black Friday & Cyber Monday", desc: "Les meilleurs deals novembre-décembre", Icon: Sparkles, color: "#000000", articles: blackFriday },
    { id: "coffrets", title: "🎁 Coffrets cadeaux & idées Noël", desc: "Pour elle, pour lui, pour les enfants", Icon: Gift, color: "#DC2626", articles: coffrets },
    { id: "concours-noel", title: "🏆 Concours Noël & fin d'année", desc: "Jeux gratuits pour gagner des cadeaux", Icon: Trophy, color: "#7C3AED", articles: concoursNoel },
  ];

  return (
    <>
      <Header />
      <main>
        <section
          style={{
            background: "linear-gradient(135deg, #14532D 0%, #166534 50%, #DC2626 100%)",
            padding: "48px 0 32px",
            borderBottom: "3px solid #DC2626",
          }}
        >
          <div className="container">
            <nav className="breadcrumbs" style={{ color: "white" }}>
              <a href="/" style={{ color: "white" }}>Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.7 }} />
              <span style={{ color: "white" }}>Noël</span>
            </nav>
            <h1
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 2.7rem)",
                fontWeight: 800,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                color: "white",
              }}
            >
              <TreePine size={36} color="#FBBF24" />
              Les bons plans de Noël
            </h1>
            <p style={{ color: "white", fontSize: "1.1rem", maxWidth: "820px", marginBottom: "16px", lineHeight: 1.6, opacity: 0.95 }}>
              Retrouvez les <strong>calendriers de l&apos;Avent</strong>, les idées cadeaux,
              les coffrets, les offres du <strong>Black Friday</strong> et les concours de
              fin d&apos;année. Les offres terminées sont retirées automatiquement.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  color: "#14532D",
                  background: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: 600,
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
                🎄 {articles.length} articles Noël
              </div>
            </div>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        {/* Quick links */}
        <section className="section" style={{ paddingTop: "20px", paddingBottom: "8px" }}>
          <div className="container">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{
                    background: "white",
                    border: `2px solid ${s.color === "#000000" ? "#374151" : s.color}`,
                    color: s.color === "#000000" ? "#374151" : s.color,
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="section-title">
                <h2>
                  <Heart size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#DC2626" }} />
                  Nos coups de cœur de Noël
                </h2>
                <p>Sélection rédactionnelle des meilleurs deals de fin d&apos;année</p>
              </div>
              <div className="articles-grid">
                {featured.map((article, index) => (
                  <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
                ))}
              </div>
            </div>
          </section>
        )}

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

        {articles.length === 0 && (
          <section className="section">
            <div className="container" style={{ textAlign: "center", padding: "48px 0", color: "var(--muted-foreground)" }}>
              <p>On prépare la sélection Noël, reviens en septembre pour les premiers calendriers de l&apos;Avent !</p>
              <a href="/categorie/calendrier-avent" className="btn btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
                Voir l&apos;archive Calendriers Avent →
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
                { href: "/ete", label: "☀️ Été", desc: "Solaires, vacances, anti-canicule", color: "#F59E0B" },
                { href: "/calendriers-de-l-avent-concours-2026", label: "🏆 Calendriers concours 2026", desc: "Jeux gratuits et cadeaux à gagner", color: "#991B1B" },
                { href: "/categorie/calendrier-avent", label: "🎄 Tous les calendriers Avent", desc: "Archives + actuels", color: "#16A34A" },
                { href: "/categorie/box-beaute", label: "📦 Box beauté", desc: "Blissim, Glowria, Biotyfull…", color: "#86198F" },
                { href: "/categorie/concours", label: "🎁 Concours en cours", desc: "Jeux gratuits", color: "#7C3AED" },
                { href: "/categorie/code-promo", label: "🏷️ Codes promo", desc: "Réductions actives", color: "#DC2626" },
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
