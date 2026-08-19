import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight, ExternalLink } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import NewsletterInline from "@/app/components/NewsletterInline";
import { CODE_PROMO_BRANDS, getBrandBySlug } from "@/lib/code-promo-data";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";

interface PageProps { params: Promise<{ marque: string }>; }

export async function generateStaticParams() {
  return CODE_PROMO_BRANDS.map((b) => ({ marque: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) return {};
  return {
    title: `Bons plans et codes promo ${brand.name} ${new Date().getFullYear()} | BonsPlansMania`,
    description: `Tous nos articles bons plans, promos et codes ${brand.name}. Réductions et offres en cours mis à jour régulièrement.`,
    alternates: { canonical: `https://bonsplansmania.fr/code-promo/${brand.slug}` },
  };
}

function matchesBrand(tags: string[], matchTags: string[]): boolean {
  const lowerTags = tags.map((t) => t.toLowerCase());
  return matchTags.some((m) => lowerTags.includes(m.toLowerCase()));
}

const COMMERCIAL_CATEGORIES = new Set([
  "bon-plan",
  "code-promo",
  "box-beaute",
  "calendrier-avent",
]);

function matchingBrandCount(tags: string[]): number {
  return CODE_PROMO_BRANDS.filter((candidate) =>
    matchesBrand(tags, candidate.matchTags),
  ).length;
}

/**
 * Une offre de marque doit être commerciale et consacrée à cette marque.
 * Les comparatifs et sélections multi-marques restent utiles, mais ne doivent
 * jamais gonfler le compteur des « offres en cours ».
 */
function isDirectBrandOffer(category: string, tags: string[]): boolean {
  return COMMERCIAL_CATEGORIES.has(category) && matchingBrandCount(tags) === 1;
}

export default async function CodePromoBrandPage({ params }: PageProps) {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) notFound();

  const allMatching = getAllArticles().filter((a) => matchesBrand(a.meta.tags, brand.matchTags));
  const directOffers = allMatching.filter((a) =>
    isDirectBrandOffer(a.meta.category, a.meta.tags),
  );
  const active = directOffers.filter((a) => !isEffectivelyExpired(a.meta));
  const expired = directOffers.filter((a) => isEffectivelyExpired(a.meta));
  const guides = allMatching.filter((a) =>
    !isDirectBrandOffer(a.meta.category, a.meta.tags) &&
    !isEffectivelyExpired(a.meta),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Bons plans et codes promo ${brand.name}`,
    url: `https://bonsplansmania.fr/code-promo/${brand.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://bonsplansmania.fr" },
        { "@type": "ListItem", position: 2, name: "Codes promo", item: "https://bonsplansmania.fr/code-promo" },
        { "@type": "ListItem", position: 3, name: brand.name },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <main>
        <section style={{ background: "linear-gradient(135deg, #0EA5A9 0%, #0891A5 100%)", padding: "44px 0 30px", color: "white" }}>
          <div className="container">
            <nav className="breadcrumbs" style={{ color: "rgba(255,255,255,0.85)" }}>
              <a href="/" style={{ color: "rgba(255,255,255,0.85)" }}>Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <a href="/code-promo" style={{ color: "rgba(255,255,255,0.85)" }}>Codes promo</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>{brand.name}</span>
            </nav>
            <h1 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)", fontWeight: 900, marginBottom: "10px", letterSpacing: "-0.02em" }}>
              Bons plans et codes promo {brand.name}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "1.05rem", maxWidth: "780px", marginBottom: "20px", lineHeight: 1.5 }}>
              {active.length > 0 ? (
                <><strong>{active.length} offre{active.length > 1 ? "s" : ""}</strong> consacrée{active.length > 1 ? "s" : ""} à {brand.name}, plus nos guides et comparatifs utiles.</>
              ) : (
                <>Aucun code promo {brand.name} vérifié actuellement. Retrouve la boutique et nos guides utiles ci-dessous.</>
              )}
            </p>
            <a
              href={brand.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "white",
                color: "#0EA5A9",
                padding: "12px 26px",
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 8px 18px -6px rgba(0,0,0,0.2)",
              }}
            >
              {brand.affiliateLabel} <ExternalLink size={15} />
            </a>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        {brand.currentOffer && (
          <section className="section-sm">
            <div className="container">
              <div style={{
                maxWidth: "760px",
                margin: "0 auto",
                padding: "24px",
                border: `2px solid ${brand.color}`,
                borderRadius: "18px",
                background: "white",
                boxShadow: "0 12px 30px -18px rgba(0,0,0,0.35)",
                textAlign: "center",
              }}>
                <p style={{ margin: "0 0 6px", color: "#6B7280", fontWeight: 700 }}>Code promo vérifié</p>
                <div style={{ fontSize: "clamp(1.7rem, 6vw, 2.5rem)", fontWeight: 900, letterSpacing: "0.06em", color: brand.color }}>
                  {brand.currentOffer.code}
                </div>
                <p style={{ fontSize: "1.15rem", fontWeight: 800, margin: "8px 0 4px" }}>{brand.currentOffer.discount}</p>
                <p style={{ color: "#6B7280", margin: "0 0 16px" }}>{brand.currentOffer.conditions}</p>
                <a href={brand.affiliateUrl} target="_blank" rel="nofollow sponsored noopener" className="btn btn-primary" style={{ padding: "12px 24px" }}>
                  Utiliser {brand.currentOffer.code} <ExternalLink size={15} />
                </a>
                <p style={{ color: "#9CA3AF", fontSize: "0.78rem", margin: "12px 0 0" }}>Vérifié le {brand.currentOffer.verifiedAt}</p>
              </div>
            </div>
          </section>
        )}

        {active.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="section-title">
                <h2>Offres et bons plans {brand.name}</h2>
                <p>{active.length} article{active.length > 1 ? "s" : ""}</p>
              </div>
              <div className="articles-grid">
                {active.map((a) => (
                  <a key={a.meta.slug} href={`/article/${a.meta.slug}`} className="card" style={{ textDecoration: "none" }}>
                    <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                      <Image src={a.meta.image.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania-beige.png" : a.meta.image} alt={a.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{a.meta.title}</h3>
                      <p className="card-excerpt">{a.meta.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {guides.length > 0 && (
          <section className="section-sm">
            <div className="container">
              <div className="section-title">
                <h2>Guides et sélections autour de {brand.name}</h2>
                <p>Ces contenus peuvent citer plusieurs marques et ne sont pas comptés comme des offres {brand.name}.</p>
              </div>
              <div className="articles-grid">
                {guides.slice(0, 12).map((a) => (
                  <a key={a.meta.slug} href={`/article/${a.meta.slug}`} className="card" style={{ textDecoration: "none" }}>
                    <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                      <Image src={a.meta.image.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania-beige.png" : a.meta.image} alt={a.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{a.meta.title}</h3>
                      <p className="card-excerpt">{a.meta.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {expired.length > 0 && (
          <section className="section-sm">
            <div className="container">
              <details>
                <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "1.1rem", padding: "12px 0" }}>
                  Voir aussi {expired.length} ancien{expired.length > 1 ? "s" : ""} bon{expired.length > 1 ? "s" : ""} plan{expired.length > 1 ? "s" : ""} {brand.name} (terminé{expired.length > 1 ? "s" : ""})
                </summary>
                <div className="articles-grid" style={{ marginTop: "16px" }}>
                  {expired.slice(0, 12).map((a) => (
                    <a key={a.meta.slug} href={`/article/${a.meta.slug}`} className="card" style={{ textDecoration: "none", opacity: 0.55, filter: "grayscale(40%)" }}>
                      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2, background: "#DC2626", color: "white", padding: "3px 10px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700 }}>Terminé</div>
                      <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                        <Image src={a.meta.image.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania-beige.png" : a.meta.image} alt={a.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="33vw" loading="lazy" />
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">{a.meta.title}</h3>
                      </div>
                    </a>
                  ))}
                </div>
              </details>
            </div>
          </section>
        )}

        {active.length === 0 && expired.length === 0 && guides.length === 0 && (
          <section className="section">
            <div className="container">
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "48px 0" }}>
                Aucun article {brand.name} pour le moment. Reviens bientôt !
              </p>
            </div>
          </section>
        )}

        <NewsletterInline />

        <section className="section-sm" style={{ background: "linear-gradient(135deg, #ECFEFF 0%, #F0FDFA 100%)", padding: "32px 0", marginTop: "32px" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <a href={brand.affiliateUrl} target="_blank" rel="nofollow sponsored noopener" className="btn btn-primary" style={{ padding: "14px 30px", fontSize: "1rem" }}>
              {brand.affiliateLabel} <ExternalLink size={15} />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
