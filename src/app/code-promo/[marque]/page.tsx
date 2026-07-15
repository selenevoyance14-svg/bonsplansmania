import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight, ExternalLink } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import NewsletterInline from "@/app/components/NewsletterInline";
import { CODE_PROMO_BRANDS, getBrandBySlug } from "@/lib/code-promo-data";
import { getAllArticles } from "@/lib/articles";

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

export default async function CodePromoBrandPage({ params }: PageProps) {
  const { marque } = await params;
  const brand = getBrandBySlug(marque);
  if (!brand) notFound();

  const allMatching = getAllArticles().filter((a) => matchesBrand(a.meta.tags, brand.matchTags));
  const active = allMatching.filter((a) => !a.meta.expired);
  const expired = allMatching.filter((a) => a.meta.expired);

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
        <section style={{ background: `linear-gradient(135deg, ${brand.color}22 0%, ${brand.color}11 100%)`, padding: "40px 0 32px", borderBottom: `2px solid ${brand.color}33` }}>
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <a href="/code-promo">Codes promo</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>{brand.name}</span>
            </nav>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, marginBottom: "10px" }}>
              Bons plans et codes promo {brand.name}
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "1rem", maxWidth: "780px", marginBottom: "20px" }}>
              {active.length} bon{active.length > 1 ? "s" : ""} plan{active.length > 1 ? "s" : ""} en cours, mis à jour régulièrement.
            </p>
            <a href={brand.affiliateUrl} target="_blank" rel="nofollow sponsored noopener" className="btn btn-primary" style={{ padding: "12px 26px", fontSize: "1rem" }}>
              {brand.affiliateLabel} <ExternalLink size={15} />
            </a>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        {active.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="section-title">
                <h2>Nos bons plans {brand.name} en cours</h2>
                <p>{active.length} article{active.length > 1 ? "s" : ""}</p>
              </div>
              <div className="articles-grid">
                {active.map((a) => (
                  <a key={a.meta.slug} href={`/article/${a.meta.slug}`} className="card" style={{ textDecoration: "none" }}>
                    <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                      <Image src={a.meta.image.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania.png" : a.meta.image} alt={a.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
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
                        <Image src={a.meta.image.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania.png" : a.meta.image} alt={a.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="33vw" loading="lazy" />
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

        {active.length === 0 && expired.length === 0 && (
          <section className="section">
            <div className="container">
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "48px 0" }}>
                Aucun article {brand.name} pour le moment. Reviens bientôt !
              </p>
            </div>
          </section>
        )}

        <NewsletterInline />

        <section className="section-sm" style={{ background: `linear-gradient(135deg, ${brand.color}22 0%, ${brand.color}11 100%)`, padding: "32px 0", marginTop: "32px" }}>
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
