import { getAllArticles, getFeaturedArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import NewsletterForm from "@/app/components/NewsletterForm";
import NewsletterInline from "@/app/components/NewsletterInline";
import Image from "next/image";
import { Clock, Tag, Gift, Calendar, Trophy, Star, Flame, ShoppingBag, TreePine, FlaskConical, Sparkles, type LucideIcon } from "lucide-react";
import CurrentMonth from "@/app/components/CurrentMonth";
import AdBlock from "@/app/components/AdBlock";


type CategoryConfig = { label: string; Icon: LucideIcon; color: string };

const categoryConfig: Record<string, CategoryConfig> = {
  "bon-plan":         { label: "Bon Plan",              Icon: Tag,          color: "bon-plan" },
  "bon-plan-beaute":  { label: "Bon Plan",              Icon: Tag,          color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          Icon: Gift,         color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           Icon: FlaskConical, color: "test-avis" },
  "concours":         { label: "Concours",              Icon: Trophy,       color: "concours" },
  "box-beaute":       { label: "Box Beauté",            Icon: ShoppingBag,  color: "box-beaute" },
  "beaute":           { label: "Beauté",                Icon: Sparkles,     color: "beaute" },
  "selection":        { label: "Beauté",                Icon: Sparkles,     color: "beaute" },
  "calendrier":       { label: "Calendrier",            Icon: Calendar,     color: "calendrier" },
  "calendrier-avent": { label: "Calendrier de l'Avent", Icon: TreePine,     color: "calendrier-avent" },
};

export default function Home() {
  const allArticles = getAllArticles();
  const featured = getFeaturedArticles().slice(0, 6);
  const latest = allArticles.slice(0, 24);

  // La date est gérée côté client par le composant CurrentMonth

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
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <Flame size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} /> Mis à jour — <CurrentMonth />
          </div>
          <h1>
            Les meilleurs <em>bons plans beauté</em><br />
            tests gratuits &amp; concours
          </h1>
          <p className="hero-subtitle">
            Chaque jour, on déniche les meilleures offres : échantillons gratuits,
            réductions, jeux concours et tests de produits beauté pour vous.
          </p>
          <div className="hero-cta">
            <a href="/categorie/bon-plan" className="btn btn-primary">
              <Tag size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Voir les bons plans
            </a>
            <a href="/categorie/test-produit" className="btn btn-secondary">
              <FlaskConical size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Tests produits
            </a>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="container">
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{allArticles.length}+</span>
            <span className="stat-label">Bons plans</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Gratuit</span>
          </div>
          <div className="stat-item">
            <span className="stat-number"><Star size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "2px" }} fill="currentColor" /> 4.8</span>
            <span className="stat-label">Note lecteurs</span>
          </div>
          <a href="/categorie/code-promo" className="stat-item" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="stat-number">Codes Promo</span>
            <span className="stat-label">Réductions exclusives</span>
          </a>
        </div>
      </section>

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
              { href: "/categorie/calendrier-avent", Icon: TreePine, label: "Calendrier de l'Avent", desc: "Les meilleurs calendriers", bg: "#F0FDF4", color: "#15803D" },
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
              {featured.map((article, index) => {
                const cat = categoryConfig[article.meta.category];
                return (
                  <a key={article.meta.slug} href={`/article/${article.meta.slug}`} className="card" style={{ textDecoration: "none" }}>
                    <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                      <Image
                        src={article.meta.image}
                        alt={article.meta.imageAlt}
                        fill style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                      />
                    </div>
                    <div className="card-body">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span className={`card-category card-category-${cat?.color ?? article.meta.category}`}>
                          {cat?.Icon && <cat.Icon size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />}{cat?.label ?? article.meta.category}
                        </span>
                        <time style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                          {new Date(article.meta.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" })}
                        </time>
                      </div>
                      <h3 className="card-title">{article.meta.title}</h3>
                      <p className="card-excerpt">{article.meta.description}</p>
                    </div>
                    <div className="card-footer">
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} /> {article.meta.readingTime}
                      </span>
                      <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.82rem" }}>
                        Lire →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ NEWSLETTER MILIEU ═══ */}
      <section className="container" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
        <NewsletterInline />
      </section>

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
              {latest.map((article) => {
                const cat = categoryConfig[article.meta.category];
                return (
                  <a key={article.meta.slug} href={`/article/${article.meta.slug}`} className="card" style={{ textDecoration: "none" }}>
                    <div style={{ position: "relative", height: "190px", overflow: "hidden" }}>
                      <Image
                        src={article.meta.image}
                        alt={article.meta.imageAlt}
                        fill style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span className={`card-category card-category-${cat?.color ?? article.meta.category}`}>
                          {cat?.Icon && <cat.Icon size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />}{cat?.label ?? article.meta.category}
                        </span>
                        <time style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                          {new Date(article.meta.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" })}
                        </time>
                      </div>
                      <h3 className="card-title">{article.meta.title}</h3>
                      <p className="card-excerpt">{article.meta.description}</p>
                    </div>
                    <div className="card-footer">
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} /> {article.meta.readingTime}
                      </span>
                      <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.82rem" }}>Lire →</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <NewsletterForm />
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
                <li><a href="/categorie/bon-plan">Bons Plans</a></li>
                <li><a href="/categorie/test-produit">Tests Produits</a></li>
                <li><a href="/categorie/concours">Concours</a></li>
                <li><a href="/categorie/box-beaute">Box Beauté</a></li>
              </ul>
            </div>
            <div>
              <h4>Hubs permanents</h4>
              <ul className="footer-links" role="list">
                <li><a href="/amazon-bons-plans">🛒 Amazon Bons Plans</a></li>
                <li><a href="/bons-plans-bebe">👶 Bons Plans Bébé</a></li>
                <li><a href="/meilleures-box-beaute">⭐ Meilleures Box Beauté</a></li>
                <li><a href="/tests-beaute-skincare">✨ Tests Beauté & Skincare</a></li>
              </ul>
            </div>
            <div>
              <h4>Hubs saison</h4>
              <ul className="footer-links" role="list">
                <li><a href="/fete-des-meres-2026">🌸 Fête des Mères</a></li>
                <li><a href="/fete-des-peres-2026">👨 Fête des Pères</a></li>
                <li><a href="/soldes-ete-2026">☀️ Soldes d&apos;Été</a></li>
                <li><a href="/rentree-scolaire-2026">🎒 Rentrée Scolaire</a></li>
                <li><a href="/halloween-2026">🎃 Halloween</a></li>
                <li><a href="/black-friday-2026">🛍️ Black Friday</a></li>
                <li><a href="/calendrier-avent-2026">🎄 Calendrier de l&apos;Avent</a></li>
                <li><a href="/noel-2026">🎁 Noël</a></li>
                <li><a href="/saint-valentin-2026">💕 Saint-Valentin</a></li>
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
    </>
  );
}
