import type { Metadata } from "next";
import { ChevronRight, Gift, Calendar, Sparkles, Trophy, ShoppingBag, Watch, Heart } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import { matchesSeasonalKeywords } from "@/lib/seasonal-match";

export const metadata: Metadata = {
  // La fête des pères 2026 avait lieu le 21 juin : la page est périmée depuis.
  // 133 impressions pour 3 clics en position 17,9. Sortie de l'index jusqu'à
  // l'édition suivante.
  robots: { index: false, follow: true },
  title: "Fête des Pères : idées cadeaux papa — BonsPlansMania",
  description:
    "Hub Fête des Pères (dimanche 21 juin) : idées cadeaux papa originales et accessibles, bons plans grooming, parfum, high-tech, montres connectées, box homme, concours dédiés. Mise à jour quotidienne.",
  alternates: { canonical: "https://bonsplansmania.fr/fete-des-peres" },
  openGraph: {
    title: "Fête des Pères — Idées cadeaux & bons plans papa",
    description:
      "Toutes nos sélections cadeaux et bons plans Fête des Pères 21 juin 2026 : grooming, parfum, high-tech, montres, box homme.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr/fete-des-peres",
  },
};

type ArticleType = ReturnType<typeof getAllArticles>[number];

const KEYWORDS = [
  "fete-des-peres",
  "fête des pères",
  "fete des peres",
  "cadeau papa",
  "cadeaux papa",
  "papa",
  "monsieur",
  "homme",
  "grooming",
  "barbe",
  "rasage",
  "parfum homme",
  "montre",
  "watch",
  "box-homme",
  "box monsieur",
];

function matches(article: ArticleType): boolean {
  const haystack = [
    article.meta.title.toLowerCase(),
    article.meta.description.toLowerCase(),
    ...(article.meta.tags || []).map((t) => t.toLowerCase()),
  ].join(" ");
  return matchesSeasonalKeywords(haystack, KEYWORDS);
}

export default function FeteDesPeres2026Page() {
  const all = getAllArticles();

  const articles = all
    .filter((a) => !isEffectivelyExpired(a.meta) && matches(a))
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

  const byKw = (kw: string | string[]) => {
    const kws = Array.isArray(kw) ? kw : [kw];
    return articles.filter((a) => {
      const haystack = [
        a.meta.title.toLowerCase(),
        a.meta.description.toLowerCase(),
        ...(a.meta.tags || []).map((t) => t.toLowerCase()),
      ].join(" ");
      return matchesSeasonalKeywords(haystack, kws);
    });
  };

  const grooming = byKw(["grooming", "barbe", "rasage", "box-homme", "monsieur"]).slice(0, 6);
  const parfums = byKw(["parfum homme", "eau de toilette homme", "eau de parfum"]).slice(0, 6);
  const hightech = byKw(["montre", "watch", "ecouteurs", "smartphone", "tablette", "casque"]).slice(0, 6);
  const concours = articles.filter((a) => a.meta.category === "concours").slice(0, 6);
  const featured = articles.filter((a) => a.meta.featured).slice(0, 6);

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const sections: { id: string; title: string; desc: string; Icon: typeof Gift; color: string; articles: ArticleType[] }[] = [
    { id: "grooming", title: "🧔 Grooming & soins homme", desc: "Box rasage, barbe, soins visage, déodorants", Icon: ShoppingBag, color: "#1F2937", articles: grooming },
    { id: "parfums", title: "🌿 Parfums homme & eaux de toilette", desc: "Coffrets, codes promo, ventes flash", Icon: Sparkles, color: "#7C3AED", articles: parfums },
    { id: "hightech", title: "⌚ High-tech & montres connectées", desc: "Bracelets, smartwatches, écouteurs, gadgets", Icon: Watch, color: "#0EA5E9", articles: hightech },
    { id: "concours", title: "🎁 Concours spécial papa", desc: "Jeux gratuits et instants gagnants à offrir", Icon: Trophy, color: "#DC2626", articles: concours },
  ];

  return (
    <>
      <Header />
      <main>
        <section
          style={{
            background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)",
            padding: "48px 0 32px",
            borderBottom: "3px solid #2563EB",
          }}
        >
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Fête des Pères</span>
            </nav>
            <h1
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 2.7rem)",
                fontWeight: 800,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                color: "#1E3A8A",
              }}
            >
              <Gift size={36} color="#2563EB" />
              Fête des Pères — dimanche 21 juin
            </h1>
            <p style={{ color: "#1E3A8A", fontSize: "1.1rem", maxWidth: "820px", marginBottom: "16px", lineHeight: 1.6 }}>
              Toutes nos sélections, <strong>idées cadeaux papa</strong>, bons plans et concours pour la <strong>Fête des Pères du 21 juin 2026</strong>. Grooming, parfums, high-tech, montres connectées, box homme : on a couvert tous les budgets, tous les styles de papa.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  color: "#1E3A8A",
                  background: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid #93C5FD",
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
                  background: "#2563EB",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: 700,
                }}
              >
                🎁 {articles.length} idées cadeaux
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
                    border: `2px solid ${s.color}`,
                    color: s.color,
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
                  Nos coups de cœur cadeaux papa
                </h2>
                <p>Sélection rédactionnelle des meilleures idées 2026</p>
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
              <p>On enrichit cette page avec nos idées cadeaux Fête des Pères, reviens vite !</p>
              <a href="/categorie/bon-plan" className="btn btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
                Voir tous les bons plans →
              </a>
            </div>
          </section>
        )}

        {/* Why */}
        <section className="section">
          <div className="container">
            <div
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "28px",
                maxWidth: "820px",
                margin: "0 auto",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Notre sélection Fête des Pères</h2>
              <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
                Cette année, la <strong>Fête des Pères tombe le dimanche 21 juin 2026</strong>. Pour t&apos;aider à trouver le cadeau parfait, on a sélectionné <strong>les meilleurs bons plans et idées</strong> par catégorie : <strong>grooming & rasage</strong> (Box Monsieur, baumes barbe), <strong>parfums</strong> (codes promo, coffrets), <strong>high-tech</strong> (montres connectées Garmin, Fitbit, Xiaomi), et <strong>concours</strong> à participer pour gagner un cadeau original.
              </p>
              <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
                <strong>Astuce</strong> : commande avant le <strong>17 juin</strong> pour être sûr(e) d&apos;être livré(e) à temps (Amazon Prime + 2 jours de marge).
              </p>
            </div>
          </div>
        </section>

        {/* Related hubs */}
        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>Autres événements & hubs</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {[
                { href: "/ete", label: "☀️ Été", desc: "Solaires, vacances, anti-canicule", color: "#F59E0B" },
                { href: "/noel", label: "🎄 Noël (à venir)", desc: "Calendriers Avent + cadeaux", color: "#DC2626" },
                { href: "/categorie/box-beaute", label: "📦 Box beauté & lifestyle", desc: "Toutes nos box du moment", color: "#86198F" },
                { href: "/categorie/concours", label: "🎁 Tous les concours", desc: "Jeux gratuits actuels", color: "#7C3AED" },
                { href: "/categorie/code-promo", label: "🏷️ Codes promo", desc: "Réductions actives", color: "#1D4ED8" },
                { href: "/categorie/bon-plan", label: "🛍️ Tous les bons plans", desc: "Toutes catégories", color: "#0EA5A9" },
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
