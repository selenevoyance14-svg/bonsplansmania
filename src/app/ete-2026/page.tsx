import type { Metadata } from "next";
import { ChevronRight, Sun, Calendar, Umbrella, Sparkles, Wind, Baby, Heart } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";
import StickyAdMobile from "@/app/components/StickyAdMobile";

export const metadata: Metadata = {
  title: "Été 2026 : tous les bons plans, sélections beauté solaire, vacances & anti-canicule — BonsPlansMania",
  description:
    "Hub Été 2026 : crèmes solaires bio, autobronzants, parasols, ventilateurs, climatiseurs, maillots bébé UPF 50+, box d'été, cadeaux Fête des Pères et bons plans vacances. Sélection mise à jour quotidiennement.",
  alternates: { canonical: "https://bonsplansmania.fr/ete-2026" },
  openGraph: {
    title: "Été 2026 — Bons plans solaires, vacances, anti-canicule",
    description:
      "Toutes nos sélections, bons plans et concours pour l'été 2026 : solaires bio, autobronzants, parasols, ventilateurs, maillots, box beauté été.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr/ete-2026",
  },
};

type ArticleType = ReturnType<typeof getAllArticles>[number];

const SUMMER_KEYWORDS = [
  "ete-2026",
  "solaire",
  "spf50",
  "spf-50",
  "autobronzant",
  "auto-bronzant",
  "bronzage",
  "vacances",
  "parasol",
  "ventilateur",
  "climatiseur",
  "anti-canicule",
  "canicule",
  "maillot-bain",
  "bebe-ete",
  "piscine",
  "plage",
  "fete-des-peres",
  "ete",
];

function matchesSummer(article: ArticleType): boolean {
  const haystack = [
    article.meta.title.toLowerCase(),
    article.meta.description.toLowerCase(),
    ...(article.meta.tags || []).map((t) => t.toLowerCase()),
  ].join(" ");
  return SUMMER_KEYWORDS.some((kw) => haystack.includes(kw));
}

export default function Ete2026Page() {
  const all = getAllArticles();

  const summer = all
    .filter((a) => !a.meta.expired && matchesSummer(a))
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

  const byTag = (kw: string | string[]) => {
    const kws = Array.isArray(kw) ? kw : [kw];
    return summer.filter((a) => {
      const haystack = [
        a.meta.title.toLowerCase(),
        a.meta.description.toLowerCase(),
        ...(a.meta.tags || []).map((t) => t.toLowerCase()),
      ].join(" ");
      return kws.some((k) => haystack.includes(k));
    });
  };

  const solaires = byTag(["solaire", "spf50", "spf-50", "uv50"]).slice(0, 6);
  const autobronzants = byTag(["autobronzant", "auto-bronzant", "bronzage"]).slice(0, 6);
  const climatisation = byTag(["ventilateur", "climatiseur", "anti-canicule", "canicule", "brumisateur"]).slice(0, 6);
  const vacances = byTag(["parasol", "vacances", "camping", "mobil-home"]).slice(0, 6);
  const bebeEte = byTag(["bebe-ete", "maillot-bain", "piscine-bebe", "couches-bain", "brassard"]).slice(0, 6);
  const featured = summer.filter((a) => a.meta.featured).slice(0, 6);

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const sections: { id: string; title: string; desc: string; Icon: typeof Sun; color: string; articles: ArticleType[] }[] = [
    { id: "solaires", title: "☀️ Crèmes solaires & soins SPF", desc: "Protections bio, visage & corps, bébé, anti-taches", Icon: Sun, color: "#F59E0B", articles: solaires },
    { id: "autobronzants", title: "✨ Autobronzants & glow", desc: "Sans soleil, sans UV — peau dorée naturelle", Icon: Sparkles, color: "#EAB308", articles: autobronzants },
    { id: "anti-canicule", title: "🌬️ Anti-canicule : ventilateurs & climatisation", desc: "Ventilateurs silencieux, climatiseurs mobiles, brumisateurs", Icon: Wind, color: "#0EA5E9", articles: climatisation },
    { id: "vacances", title: "🏖️ Vacances, parasols & camping", desc: "Tout pour le jardin, terrasse, séjour à la mer", Icon: Umbrella, color: "#EC4899", articles: vacances },
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
              <span>Été 2026</span>
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
              Été 2026 sur BonsPlansMania
            </h1>
            <p style={{ color: "#7C2D12", fontSize: "1.1rem", maxWidth: "820px", marginBottom: "16px", lineHeight: 1.6 }}>
              Toute notre sélection pour <strong>survivre à l&apos;été 2026</strong> avec style : crèmes solaires bio, autobronzants, parasols, ventilateurs anti-canicule, maillots bébé UPF 50+, box beauté d&apos;été, cadeaux Fête des Pères et bons plans vacances. Mise à jour quotidienne.
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
                🔥 {summer.length} articles été
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
                <p>Sélection rédactionnelle des meilleurs deals saisonniers</p>
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

        {/* Why this hub */}
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
              <h2 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Pourquoi un hub Été 2026 ?</h2>
              <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
                L&apos;été 2026 s&apos;annonce <strong>caniculaire</strong> et les besoins sont nombreux : protéger sa peau du soleil avec des <strong>crèmes solaires bio efficaces</strong>, garder bébé au frais avec des <strong>maillots UPF 50+</strong>, équiper son intérieur avec un <strong>ventilateur silencieux ou un climatiseur mobile</strong>, sans oublier les <strong>cadeaux Fête des Pères</strong> (21 juin 2026).
              </p>
              <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
                Cette page rassemble <strong>tous nos articles, bons plans et sélections d&apos;été</strong> en un seul endroit. On la met à jour <strong>quotidiennement</strong> avec les nouveaux deals que l&apos;on déniche sur Amazon, Cdiscount, Beauty Success, BAÏJA, Acorelle, Dr Pierre Ricaud, L&apos;Occitane et plus.
              </p>
              <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
                <strong>Astuce</strong> : épingle cette page dans tes favoris ou abonne-toi à notre newsletter — tu seras alerté(e) dès qu&apos;un nouveau bon plan été arrive.
              </p>
            </div>
          </div>
        </section>

        {/* Related hubs */}
        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>Tu aimes l&apos;été ? Explore aussi…</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {[
                { href: "/fete-des-peres-2026", label: "🎁 Fête des Pères 2026", desc: "Idées cadeaux 21 juin", color: "#1D4ED8" },
                { href: "/categorie/bon-plan", label: "🛍️ Tous les bons plans", desc: "Toutes catégories confondues", color: "#0EA5A9" },
                { href: "/categorie/concours", label: "🎁 Concours en cours", desc: "Jeux gratuits, instants gagnants", color: "#7C3AED" },
                { href: "/categorie/test-gratuit", label: "🆓 Tests gratuits", desc: "Campagnes ambassadrice", color: "#16A34A" },
                { href: "/categorie/box-beaute", label: "📦 Box beauté", desc: "Blissim, Glowria, Biotyfull…", color: "#86198F" },
                { href: "/noel-2026", label: "🎄 Noël 2026 (à venir)", desc: "Anticipe les calendriers Avent", color: "#DC2626" },
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
