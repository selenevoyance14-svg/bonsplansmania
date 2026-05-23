import { getAllArticles, getFeaturedArticles, getDealOfDay } from "@/lib/articles";
import Header from "@/app/components/Header";
import NewsletterForm from "@/app/components/NewsletterForm";
import NewsletterInline from "@/app/components/NewsletterInline";
import { Star, Tag, FlaskConical, Trophy, ShoppingBag, Percent, Flame, type LucideIcon, Search } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import DealOfDay from "@/app/components/DealOfDay";
import DealTicker from "@/app/components/DealTicker";
import StickyAdMobile from "@/app/components/StickyAdMobile";

export default function Home() {
  const allArticles = getAllArticles();
  const featured = getFeaturedArticles().slice(0, 6);
  const dealOfDay = getDealOfDay();

  // Bons plans actifs : bon-plan/code-promo, non expirés, des 14 derniers jours, max 6
  const now = Date.now();
  const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;
  const liveDeals = allArticles
    .filter((a) => (a.meta.category === "bon-plan" || a.meta.category === "code-promo") && !a.meta.expired && now - new Date(a.meta.date).getTime() < FOURTEEN_DAYS)
    .slice(0, 6);
  const liveDealSlugs = new Set(liveDeals.map((a) => a.meta.slug));

  // Dernières offres : on exclut les bons plans déjà affichés au-dessus pour éviter la duplication
  const latest = allArticles.filter((a) => !liveDealSlugs.has(a.meta.slug)).slice(0, 24);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BonsPlansMania",
    url: "https://bonsplansmania.fr",
    description: "Les meilleurs bons plans beaute, tests de produits gratuits, jeux concours et avis sur les box beaute.",
    publisher: {
      "@type": "Organization",
      name: "Bons Plans Mania",
      url: "https://bonsplansmania.fr",
      logo: { "@type": "ImageObject", url: "https://bonsplansmania.fr/icon.svg" },
      contactPoint: { "@type": "ContactPoint", email: "bonsplansmania@gmail.com", contactType: "customer service" },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bonsplansmania.fr/recherche?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Header activePage="/" />

      <main>
      {/* ═══ HERO v2 ═══ */}
      <section className="bpm-hero">
        <div className="container">
          <h1>Les meilleurs bons plans du moment.</h1>
          <p className="bpm-hero-sub">
            Chaque jour, on déniche pour vous : échantillons gratuits,
            réductions, jeux concours et tests de produits beauté.
          </p>

          <form action="/recherche" method="get" className="bpm-hero-search" role="search">
            <input
              type="search"
              name="q"
              placeholder="Une marque, un produit, un mot-clé…"
              aria-label="Rechercher un bon plan, un test, un concours"
            />
            <button type="submit">
              <Search size={16} aria-hidden /> Chercher
            </button>
          </form>
        </div>
      </section>

      {/* Pub mobile above-the-fold home : 70-80% du trafic est mobile, max d'impressions/RPM */}
      <div className="ad-mobile-only container" style={{ display: "none", paddingTop: "12px" }}>
        <AdBlock />
      </div>

      {/* ═══ BONS PLANS ACTIFS (top revenue) ═══ */}
      {liveDeals.length > 0 && (
        <section className="section-sm" style={{ paddingTop: "40px", paddingBottom: "8px", background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 100%)" }}>
          <div className="container">
            <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Flame size={24} color="#E63946" />
                  Bons plans actifs cette semaine
                </h2>
                <p>Les promos et codes en cours sur les grandes marques</p>
              </div>
              <a href="/bons-plans-en-cours" className="btn btn-secondary btn-sm">
                Tout voir →
              </a>
            </div>
            <div className="articles-grid">
              {liveDeals.map((article, index) => (
                <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ TICKER ═══ */}
      <DealTicker articles={latest} />

      {/* ═══ CATÉGORIES ═══ */}
      <section className="section-sm" style={{ paddingTop: "56px" }}>
        <div className="container">
          <div className="section-title">
            <h2>Parcourir par catégorie</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {([
              { href: "/categorie/bon-plan", Icon: Tag, label: "Bons Plans", desc: "Réductions & promos", bg: "#FFF0F0", color: "#E63946" },
              { href: "/categorie/test-produit", Icon: FlaskConical, label: "Tests Produits", desc: "Tests gratuits & avis", bg: "#FFF7ED", color: "#C2410C" },
              { href: "/categorie/concours", Icon: Trophy, label: "Concours", desc: "Jeux & cadeaux à gagner", bg: "#F0FDF4", color: "#166534" },
              { href: "/categorie/box-beaute", Icon: ShoppingBag, label: "Box Beauté", desc: "Tests & avis de box", bg: "#FDF4FF", color: "#86198F" },
              { href: "/categorie/code-promo", Icon: Percent, label: "Codes Promo", desc: "Réductions actives", bg: "#EFF6FF", color: "#1D4ED8" },
            ] as { href: string; Icon: LucideIcon; label: string; desc: string; bg: string; color: string }[]).map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                style={{
                  background: cat.bg, borderRadius: "16px",
                  padding: "24px 20px", textDecoration: "none",
                  border: `1.5px solid ${cat.color}22`,
                  transition: "all 0.2s", display: "block",
                }}
                className="cat-card"
              >
                <div style={{ marginBottom: "10px" }}><cat.Icon size={32} color={cat.color} /></div>
                <div style={{ fontWeight: 700, color: cat.color, marginBottom: "4px" }}>{cat.label}</div>
                <div style={{ fontSize: "0.82rem", color: "#4b5563" }}>{cat.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ARTICLES EN VEDETTE ═══ */}
      {featured.length > 0 && (
        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>
                <Star size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "var(--accent)" }} />
                À la une
              </h2>
              <p>Nos meilleures offres du moment</p>
            </div>
            <div className="articles-grid">
              {featured.map((article, index) => (
                <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ NEWSLETTER MILIEU ═══ */}
      <section className="container" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
        <NewsletterInline />
      </section>

      {/* ═══ DEAL DU JOUR ═══ */}
      {dealOfDay && <DealOfDay article={dealOfDay} />}

      {/* ═══ PUB ENTRE VEDETTES ET DERNIERS ═══ */}
      <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
        <AdBlock />
      </section>

      {/* ═══ DERNIERS ARTICLES ═══ */}
      <section className="section">
        <div className="container">
          <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h2>Dernières offres</h2>
              <p>Toutes nos publications récentes</p>
            </div>
            <a href="/blog" className="btn btn-secondary btn-sm">
              Tout voir →
            </a>
          </div>
          {latest.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "48px 0" }}>
              Aucun article pour le moment — revenez bientôt !
            </p>
          ) : (
            <div className="articles-grid">
              {latest.map((article) => (
                <ArticleCard key={article.meta.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <NewsletterForm />

      {/* Multiplex avant footer : recommandations natives AdSense, RPM nettement plus élevé que display ici */}
      <section className="container" style={{ paddingTop: "16px", paddingBottom: "24px" }}>
        <AdBlock format="multiplex" />
      </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="/" className="logo-footer">BonsPlansMania</a>
              <p>
                Les meilleurs bons plans beauté, tests de produits gratuits,
                jeux concours et avis sur les box beauté. Chaque jour de nouvelles offres.
              </p>
            </div>
            <div>
              <h4>Catégories</h4>
              <ul className="footer-links" role="list">
                <li><a href="/bons-plans-en-cours">🔥 Bons plans en cours</a></li>
                <li><a href="/codes-promo-permanents">♾️ Codes promo permanents</a></li>
                <li><a href="/categorie/bon-plan">Tous les bons plans</a></li>
                <li><a href="/categorie/test-produit">Tests Produits</a></li>
                <li><a href="/categorie/concours">Concours</a></li>
                <li><a href="/categorie/box-beaute">Box Beauté</a></li>
              </ul>
            </div>
            <div>
              <h4>Le site</h4>
              <ul className="footer-links" role="list">
                <li><a href="/blog">Tous les articles</a></li>
                <li><a href="/guide-gratuit">Guide gratuit</a></li>
                <li><a href="/marques">Toutes les marques</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul className="footer-links" role="list">
                <li><a href="mailto:bonsplansmania@gmail.com">bonsplansmania@gmail.com</a></li>
                <li style={{ marginTop: "4px" }}><a href="/partenariats">Partenariats &amp; collaborations</a></li>
                <li style={{ marginTop: "12px" }}><a href="/mentions-legales">Mentions légales</a></li>
                <li><a href="/confidentialite">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          {/* Marques */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px", marginTop: "8px" }}>
            <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8B9099", marginBottom: "14px" }}>Marques</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                ["nyx", "NYX"], ["maybelline", "Maybelline"], ["loreal", "L'Oréal"], ["garnier", "Garnier"],
                ["cerave", "CeraVe"], ["la-roche-posay", "La Roche-Posay"], ["neutrogena", "Neutrogena"],
                ["kerastase", "Kérastase"], ["moroccanoil", "Moroccanoil"], ["nuxe", "Nuxe"],
                ["weleda", "Weleda"], ["bioderma", "Bioderma"], ["rimmel", "Rimmel"], ["catrice", "Catrice"],
                ["nivea", "Nivea"], ["glowria", "Glowria"], ["prescription-lab", "Prescription Lab"],
                ["biotyfull", "Biotyfull"], ["blissim", "Blissim"], ["igraal", "iGraal"],
                ["ebuyclub", "eBuyClub"], ["poulpeo", "Poulpeo"], ["sephora", "Sephora"],
                ["yves-rocher", "Yves Rocher"], ["amazon", "Amazon"],
              ].map(([slug, label]) => (
                <a
                  key={slug}
                  href={`/marque/${slug}`}
                  style={{
                    fontSize: "0.75rem",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#B0B7BF",
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
      <StickyAdMobile />
    </>
  );
}
