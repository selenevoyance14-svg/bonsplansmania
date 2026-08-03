import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import Header from "@/app/components/Header";
import NewsletterForm from "@/app/components/NewsletterForm";
import { ShoppingBag, Flame, Sparkles, Baby, Smartphone, Home as HomeIcon, TreePine, Gift, Percent, Trophy, PackageCheck } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import ArticleCardHorizontal from "@/app/components/ArticleCardHorizontal";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import HeroSearchBar from "@/app/components/HeroSearchBar";
import BrandOfTheWeek from "@/app/components/BrandOfTheWeek";
import SectionHeader from "@/app/components/SectionHeader";
import FeaturedPartner from "@/app/components/FeaturedPartner";
import {
  FEATURED_PARTNER,
  isFeaturedPartnerActive,
} from "@/lib/featured-partner";
import { Newspaper } from "lucide-react";

const HOME_CATEGORIES = [
  { href: "/categorie/concours", Icon: Trophy, label: "Concours gratuits", color: "#F59E0B" },
  { href: "/categorie/test-gratuit", Icon: PackageCheck, label: "Tests produits gratuits", color: "#7C3AED" },
  { href: "/bons-plans-beaute", Icon: Sparkles, label: "Bons plans Beauté", color: "#DB2777" },
  { href: "/categorie/box-beaute", Icon: ShoppingBag, label: "Box Beauté", color: "#86198F" },
  { href: "/code-promo", Icon: Percent, label: "Codes promo du moment", color: "#0F766E" },
  { href: "/bons-plans-maison", Icon: HomeIcon, label: "Maison & Cuisine", color: "#16A34A" },
  { href: "/bons-plans-tech", Icon: Smartphone, label: "Coin Tech", color: "#2563EB" },
  { href: "/bons-plans-bebe", Icon: Baby, label: "Bébé & Famille", color: "#0891B2" },
  { href: "/bons-plans-ninja", Icon: Flame, label: "Air Fryer & Ninja", color: "#DC2626" },
  { href: "/bons-plans-jardin", Icon: TreePine, label: "Jardin", color: "#65A30D" },
];

function isCommerciallyFresh(article: ReturnType<typeof getAllArticles>[number]): boolean {
  const effectiveDate = new Date(`${article.meta.date}T12:00:00`).getTime();
  if (!Number.isFinite(effectiveDate)) return false;
  const ageInDays = (Date.now() - effectiveDate) / 86_400_000;
  return ageInDays >= -1 && ageInDays <= 14;
}

export default function Home() {
  const allArticles = getAllArticles();
  const featuredPartnerInitiallyActive = isFeaturedPartnerActive(
    FEATURED_PARTNER,
    new Date(),
  );

  // Nouvelles box beauté à découvrir : 4 dernières box non expirées
  // (la liste allArticles est déjà triée par max(date, updated) desc + actifs en haut)
  const latestBoxes = allArticles
    .filter((a) => a.meta.category === "box-beaute" && !isEffectivelyExpired(a.meta))
    .slice(0, 4);
  const latestBoxSlugs = new Set(latestBoxes.map((a) => a.meta.slug));

  // Une correction d'un ancien article ne doit pas le transformer artificiellement
  // en « offre récente » : seule la date de publication est utilisée ici.
  const topDealCandidates = allArticles
    .filter((a) =>
      (a.meta.category === "bon-plan" || a.meta.category === "code-promo")
      && !isEffectivelyExpired(a.meta)
      && isCommerciallyFresh(a)
      && Boolean(a.meta.affiliateUrl)
    )
    .toSorted((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    .slice(0, 4)
    .map(({ meta }) => ({ meta }));
  const topDealSlugs = new Set(topDealCandidates.map((a) => a.meta.slug));

  // Dernières offres : on exclut tout ce qui est déjà affiché plus haut
  const latest = allArticles
    .filter((a) =>
      !latestBoxSlugs.has(a.meta.slug)
      && !topDealSlugs.has(a.meta.slug)
      && a.meta.category !== "concours"
      && a.meta.category !== "test-gratuit"
    )
    .toSorted((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    .slice(0, 10);

  // Garder les tests produits visibles sur l'accueil même lorsque plusieurs concours
  // sont publiés le même jour : 2 derniers tests + 2 derniers concours, tous actifs.
  // Ici on trie volontairement sur `date` uniquement : une simple correction d'un
  // ancien article ne doit pas le faire passer devant un test fraîchement publié.
  const latestProductTests = allArticles
    .filter((a) =>
      (a.meta.category === "test-gratuit" || a.meta.category === "test-produit")
      && !isEffectivelyExpired(a.meta)
    )
    .toSorted((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    .slice(0, 2);
  const latestContests = allArticles
    .filter((a) =>
      a.meta.category === "concours" && !isEffectivelyExpired(a.meta)
    )
    .toSorted((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    .slice(0, 2);
  const freeOpportunities = [...latestProductTests, ...latestContests];

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
      {/* ═══ HERO ═══ */}
      <section className="bpm-hero">
        <div className="container bpm-hero-layout">
          <div className="bpm-hero-copy">
            <span className="bpm-hero-kicker"><span aria-hidden>🔥</span> Les bonnes affaires du moment</span>
            <h1>Les bons plans qui valent <span>vraiment le coup</span></h1>
            <p className="bpm-hero-sub">
              Promotions, codes promo, box beauté, concours et tests gratuits :
              retrouvez ici les offres les plus intéressantes du moment.
            </p>
            <HeroSearchBar />
          </div>
        </div>
      </section>

      {/* ═══ NAVIGATION RAPIDE ═══ */}
      <section className="home-categories-section">
        <div className="container">
          <div className="home-categories-intro">
            <span>Explorer par univers</span>
            <p>Allez directement aux offres qui vous intéressent.</p>
          </div>
          <div className="home-categories-grid">
            {HOME_CATEGORIES.map((c, index) => (
              <a key={c.href} href={c.href} className={`home-category-card ${index >= 5 ? "home-category-secondary" : ""}`}>
                <span className="home-category-icon" style={{ color: c.color, background: `${c.color}12` }}>
                  <c.Icon size={24} aria-hidden />
                </span>
                <span>{c.label}</span>
              </a>
            ))}
          </div>
          <details className="home-categories-more">
            <summary>Voir tous les univers</summary>
            <div className="home-categories-extra-grid">
              {HOME_CATEGORIES.slice(5).map((c) => (
                <a key={`mobile-${c.href}`} href={c.href} className="home-category-card">
                  <span className="home-category-icon" style={{ color: c.color, background: `${c.color}12` }}><c.Icon size={22} aria-hidden /></span>
                  <span>{c.label}</span>
                </a>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* ═══ 🔥 LES BONS PLANS DU MOMENT — priorité conversion ═══ */}
      {topDealCandidates.length > 0 && (
        <section id="offres-du-jour" className="section-sm home-top-deals">
          <div className="container">
            <SectionHeader
              badge="Publié récemment"
              badgeIcon={<Flame size={12} aria-hidden />}
              title="Les offres à regarder maintenant"
              subtitle="Quatre bons plans publiés ces 14 derniers jours, avec prix et conditions visibles."
              color="#0EA5A9"
              href="/bons-plans-en-cours"
            />
            <div className="articles-grid articles-grid-4">
              {topDealCandidates.map((article, index) => (
                <ArticleCard key={article.meta.slug} article={article} priority={index === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FeaturedPartner
        partner={FEATURED_PARTNER}
        initiallyActive={featuredPartnerInitiallyActive}
      />

      {/* ═══ NOUVELLES BOX BEAUTÉ À DÉCOUVRIR ═══ */}
      {latestBoxes.length > 0 && (
        <section className="section-sm" style={{ paddingTop: "56px", paddingBottom: "12px", background: "linear-gradient(180deg, #FDF4FF 0%, #FFFFFF 100%)" }}>
          <div className="container">
            <SectionHeader
              badge="Nouveautés du mois"
              badgeIcon={<ShoppingBag size={12} aria-hidden />}
              title="Box beauté à découvrir"
              titleEmoji="💄"
              subtitle="Tester des marques premium sans exploser ton budget."
              color="#86198F"
              href="/categorie/box-beaute"
            />
            <div className="articles-grid articles-grid-4">
              {latestBoxes.map((article, index) => (
                <ArticleCard key={article.meta.slug} article={article} priority={index === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sur mobile, garder au moins une sélection d'offres visible avant la première publicité. */}
      <div className="ad-mobile-only container" style={{ display: "none", paddingTop: "12px" }}>
        <AdBlock />
      </div>

      {/* Bloc « Réductions valables toute l'année » retiré de l'accueil le
          02/08/2026. La page /codes-promo-permanents reste en ligne et
          accessible depuis le menu Bons plans. */}

      {/* ═══ PUB ENTRE VEDETTES ET DERNIERS ═══ */}
      <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
        <AdBlock />
      </section>

      {/* ═══ DERNIERS ARTICLES ═══ */}
      <section className="section" style={{ paddingTop: "40px" }}>
        <div className="container">
          <SectionHeader
            badge="Fil actualités"
            badgeIcon={<Newspaper size={12} aria-hidden />}
            title="Les dernières publications"
            subtitle="Une sélection courte pour voir rapidement ce qui vient d'être publié."
            color="#334155"
            href="/blog"
          />
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

      {/* ═══ MARQUE DU MOMENT : grand bandeau sans cartes secondaires ═══ */}
      <BrandOfTheWeek />

      {freeOpportunities.length > 0 && (
        <section className="section-sm home-free-opportunities">
          <div className="container">
            <SectionHeader
              badge="100 % gratuit"
              badgeIcon={<Gift size={12} aria-hidden />}
              title="Concours et tests produits"
              subtitle="Les 2 derniers tests produits et les 2 derniers concours encore ouverts."
              color="#7C3AED"
              href="/categorie/concours"
            />
            <div className="articles-grid articles-grid-4">
              {freeOpportunities.map((article) => (
                <ArticleCard key={article.meta.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

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
                <li><a href="/code-promo">🏷️ Codes promo du moment</a></li>
                <li><a href="/codes-promo-permanents">♾️ Réductions toute l&apos;année</a></li>
                <li><a href="/categorie/bon-plan">Tous les bons plans</a></li>
                <li><a href="/categorie/test-produit">Tests Produits</a></li>
                <li><a href="/categorie/concours">Concours</a></li>
                <li><a href="/categorie/box-beaute">Box Beauté</a></li>
              </ul>
            </div>
            <div>
              <h4>Explorer</h4>
              <ul className="footer-links" role="list">
                <li><a href="/ete">☀️ Été</a></li>
                <li><a href="/noel">🎄 Noël</a></li>
                <li><a href="/marques">Toutes les marques</a></li>
                <li><a href="/blog">Tous les articles</a></li>
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
