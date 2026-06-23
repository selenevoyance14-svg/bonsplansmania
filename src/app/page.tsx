import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import Header from "@/app/components/Header";
import NewsletterForm from "@/app/components/NewsletterForm";
import NewsletterInline from "@/app/components/NewsletterInline";
import { Star, Tag, FlaskConical, Trophy, ShoppingBag, Percent, Flame, type LucideIcon, Search, Sparkles, Baby, Smartphone, Home as HomeIcon, TreePine, Shirt } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import ArticleCardHorizontal from "@/app/components/ArticleCardHorizontal";
import StickyAdMobile from "@/app/components/StickyAdMobile";

export default function Home() {
  const allArticles = getAllArticles();

  // Nouvelles box beauté à découvrir : 4 dernières box non expirées
  // (la liste allArticles est déjà triée par max(date, updated) desc + actifs en haut)
  const latestBoxes = allArticles
    .filter((a) => a.meta.category === "box-beaute" && !isEffectivelyExpired(a.meta))
    .slice(0, 4);
  const latestBoxSlugs = new Set(latestBoxes.map((a) => a.meta.slug));

  // 🔥 Les bons plans du moment : 4 derniers bons plans + codes promo non expirés
  const topDeals = allArticles
    .filter((a) =>
      (a.meta.category === "bon-plan" || a.meta.category === "code-promo")
      && !isEffectivelyExpired(a.meta)
    )
    .slice(0, 4);
  const topDealSlugs = new Set(topDeals.map((a) => a.meta.slug));

  // Derniers concours & tests : focus sur les concours gratuits et les missions de
  // test produit (test-gratuit + test-avis), classés par date (les plus récents en
  // premier via allArticles déjà trié desc).
  const featured = allArticles
    .filter((a) =>
      (a.meta.category === "concours" || a.meta.category === "test-gratuit" || a.meta.category === "test-avis")
      && !isEffectivelyExpired(a.meta)
    )
    .slice(0, 4);
  const featuredSlugs = new Set(featured.map((a) => a.meta.slug));

  // Dernières offres : on exclut tout ce qui est déjà affiché plus haut
  const latest = allArticles
    .filter((a) =>
      !latestBoxSlugs.has(a.meta.slug)
      && !topDealSlugs.has(a.meta.slug)
      && !featuredSlugs.has(a.meta.slug)
    )
    .slice(0, 24);

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

      {/* ═══ NAVIGATION UNIFIÉE (catégories + univers en petits carrés) ═══ */}
      <section className="section-sm" style={{ paddingTop: "28px", paddingBottom: "8px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))", gap: "12px" }}>
            {[
              // Catégories iconiques conservées
              { href: "/categorie/test-produit", Icon: FlaskConical, label: "Tests Produits",    bg: "#FFF7ED", color: "#C2410C" },
              { href: "/categorie/box-beaute",   Icon: ShoppingBag,  label: "Box Beauté",        bg: "#FDF4FF", color: "#86198F" },
              // Hubs / univers (thèmes)
              { href: "/bons-plans-beaute",      Icon: Sparkles,     label: "Coin Beauté",       bg: "#FDF2F8", color: "#DB2777" },
              { href: "/bons-plans-bebe",        Icon: Baby,         label: "Coin Bébé",         bg: "#ECFEFF", color: "#0891B2" },
              { href: "/bons-plans-ninja",       Icon: Flame,        label: "Coin Ninja",        bg: "#FEF2F2", color: "#DC2626" },
              { href: "/bons-plans-tech",        Icon: Smartphone,   label: "Coin Tech",         bg: "#EFF6FF", color: "#2563EB" },
              { href: "/bons-plans-maison",      Icon: HomeIcon,     label: "Coin Maison",       bg: "#F0FDF4", color: "#16A34A" },
              { href: "/bons-plans-jardin",      Icon: TreePine,     label: "Jardin & Animaux",  bg: "#F7FEE7", color: "#65A30D" },
              { href: "/bons-plans-mode",        Icon: Shirt,        label: "Coin Mode",         bg: "#FAF5FF", color: "#7C3AED" },
            ].map((c) => (
              <a
                key={c.href}
                href={c.href}
                style={{
                  background: c.bg,
                  borderRadius: "14px",
                  padding: "20px 10px",
                  textDecoration: "none",
                  border: `1.5px solid ${c.color}22`,
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: "8px",
                  minHeight: "108px",
                }}
                className="cat-card"
              >
                {c.Icon ? <c.Icon size={28} color={c.color} aria-hidden /> : null}
                <div style={{ fontWeight: 700, color: c.color, fontSize: "0.82rem", lineHeight: "1.2" }}>{c.label}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NOUVELLES BOX BEAUTÉ À DÉCOUVRIR ═══ */}
      {latestBoxes.length > 0 && (
        <section className="section-sm" style={{ paddingTop: "40px", paddingBottom: "8px", background: "linear-gradient(180deg, #FDF4FF 0%, #FFFFFF 100%)" }}>
          <div className="container">
            <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <ShoppingBag size={24} color="#86198F" />
                  Nouvelles box beauté à découvrir
                </h2>
                <p>Les box du mois pour tester de nouveaux produits sans se ruiner</p>
              </div>
              <a href="/categorie/box-beaute" className="btn btn-secondary btn-sm">
                Tout voir →
              </a>
            </div>
            <div className="articles-grid articles-grid-4">
              {latestBoxes.map((article, index) => (
                <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ DERNIERS CONCOURS & TESTS ═══ */}
      {featured.length > 0 && (
        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>
                <Star size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "var(--accent)" }} />
                Derniers concours &amp; tests gratuits
              </h2>
              <p>Cadeaux à gagner et produits à tester gratuitement</p>
            </div>
            <div className="articles-grid articles-grid-4">
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

      {/* ═══ 🔥 LES BONS PLANS DU MOMENT (top revenue) ═══ */}
      {topDeals.length > 0 && (
        <section className="section-sm" style={{ paddingTop: "40px", paddingBottom: "8px", background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 100%)" }}>
          <div className="container">
            <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Flame size={24} color="#E63946" />
                  🔥 Les bons plans du moment
                </h2>
                <p>Les promos et codes en cours sur les grandes marques</p>
              </div>
              <a href="/bons-plans-en-cours" className="btn btn-secondary btn-sm">
                Tout voir →
              </a>
            </div>
            <div className="articles-grid articles-grid-4">
              {topDeals.map((article, index) => (
                <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

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
            <div className="bpm-card-h-grid">
              {latest.map((article) => (
                <ArticleCardHorizontal key={article.meta.slug} article={article} />
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
              <h4>Hubs saisonniers</h4>
              <ul className="footer-links" role="list">
                <li><a href="/ete-2026">☀️ Été 2026</a></li>
                <li><a href="/fete-des-peres-2026">🎁 Fête des Pères 21 juin</a></li>
                <li><a href="/noel-2026">🎄 Noël 2026</a></li>
                <li><a href="/blog">Tous les articles</a></li>
                <li><a href="/guide-gratuit">Guide gratuit</a></li>
                <li><a href="/marques">Toutes les marques</a></li>
              </ul>
            </div>
            <div>
              <h4>À propos</h4>
              <ul className="footer-links" role="list">
                <li><a href="/qui-suis-je">👋 Qui suis-je</a></li>
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
