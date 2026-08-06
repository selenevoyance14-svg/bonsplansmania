import { getAllArticles, getArticlesByTag, getArticlesByTagSlug } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, ExternalLink, Info, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import AdBlock from "@/app/components/AdBlock";
import { getStaticTagSlugs, slugifyTag } from "@/lib/tag-pages";
import { BRAND_EDITORIAL_PAGES, getCurrentBrandOffers } from "@/lib/brand-editorial-data";

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan":         { label: "Bon Plan",              color: "bon-plan" },
  "bon-plan-beaute":  { label: "Bon Plan",              color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           color: "test-avis" },
  "concours":         { label: "Concours",              color: "concours" },
  "box-beaute":       { label: "Box Beauté",            color: "box-beaute" },
  "beaute":           { label: "Beauté",                color: "beaute" },
  "selection":        { label: "Beauté",                color: "beaute" },
  "calendrier-avent": { label: "Calendrier de l'Avent", color: "calendrier-avent" },
  "code-promo":       { label: "Code Promo",            color: "code-promo" },
};

// Build slug → raw tag map once (first occurrence wins)
function getTagSlugMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const article of getAllArticles()) {
    for (const tag of article.meta.tags || []) {
      const slug = slugifyTag(tag);
      if (slug && !map.has(slug)) map.set(slug, tag);
    }
  }
  return map;
}

// Nicely formatted display name for known brand slugs
const brandDisplayNames: Record<string, string> = {
  "nyx": "NYX",
  "maybelline": "Maybelline",
  "loreal": "L'Oréal",
  "garnier": "Garnier",
  "cerave": "CeraVe",
  "la-roche-posay": "La Roche-Posay",
  "neutrogena": "Neutrogena",
  "kerastase": "Kérastase",
  "moroccanoil": "Moroccanoil",
  "nuxe": "Nuxe",
  "weleda": "Weleda",
  "bioderma": "Bioderma",
  "rimmel": "Rimmel",
  "catrice": "Catrice",
  "nivea": "Nivea",
  "glowria": "Glowria",
  "prescription-lab": "Prescription Lab",
  "biotyfull": "Biotyfull",
  "blissim": "Blissim",
  "igraal": "iGraal",
  "ebuyclub": "eBuyClub",
  "poulpeo": "Poulpeo",
  "sephora": "Sephora",
  "yves-rocher": "Yves Rocher",
  "amazon": "Amazon",
};

function getDisplayName(slug: string, fallbackTag: string): string {
  if (brandDisplayNames[slug]) return brandDisplayNames[slug];
  // Capitalize first letter of each word in the fallback tag
  return fallbackTag
    .split(/[-\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const staticSlugs = getStaticTagSlugs(
    getAllArticles().map((article) => article.meta.tags || [])
  );
  return [...staticSlugs].map((slug) => ({ slug }));
}

interface PageProps { params: Promise<{ slug: string }>; }

/**
 * La normalisation est volontairement limitée à Carrefour pour cette migration.
 * Les autres pages marques conservent leur comportement historique jusqu'à ce
 * qu'un audit dédié confirme que le regroupement de leurs variantes est souhaité.
 */
function getBrandArticles(slug: string, rawTag: string) {
  return slug === "carrefour"
    ? getArticlesByTagSlug(slug)
    : getArticlesByTag(rawTag);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const map = getTagSlugMap();
  const rawTag = map.get(slug);
  if (!rawTag) return {};
  const display = getDisplayName(slug, rawTag);
  const count = getBrandArticles(slug, rawTag).length;
  const title = `${display} : ${count} bons plans et promos`;
  const description = `Tous les bons plans, promos et tests produits ${display} du moment : ${count} article${count > 1 ? "s" : ""} mis à jour régulièrement sur Bons Plans Mania.`;
  return {
    title,
    description,
    alternates: { canonical: `https://bonsplansmania.fr/marque/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://bonsplansmania.fr/marque/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const map = getTagSlugMap();
  const rawTag = map.get(slug);
  if (!rawTag) notFound();

  const display = getDisplayName(slug, rawTag);
  const articles = getBrandArticles(slug, rawTag);
  const editorialPage = BRAND_EDITORIAL_PAGES[slug];
  const activeOffers = editorialPage ? getCurrentBrandOffers(editorialPage) : [];

  const cards = articles.map((a) => {
    const cl = categoryLabels[a.meta.category];
    return {
      slug: a.meta.slug,
      title: a.meta.title,
      description: a.meta.description,
      date: a.meta.date,
      image: a.meta.image,
      imageAlt: a.meta.imageAlt,
      category: a.meta.category,
      categoryLabel: cl?.label ?? a.meta.category,
      categoryColor: cl?.color ?? a.meta.category,
      readingTime: a.meta.readingTime,
      expired: a.meta.expired,
      endDate: a.meta.endDate,
      price: a.meta.price,
      amazonAsin: a.meta.amazonAsin,
      affiliateUrl: a.meta.affiliateUrl,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: display,
          description: `Bons plans, promos et tests produits ${display}`,
          url: `https://bonsplansmania.fr/marque/${slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 10).map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://bonsplansmania.fr/article/${a.meta.slug}`,
              name: a.meta.title,
            })),
          },
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://bonsplansmania.fr" },
            { "@type": "ListItem", position: 2, name: "Marques", item: "https://bonsplansmania.fr" },
            { "@type": "ListItem", position: 3, name: display },
          ],
        }) }}
      />
      <Header />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span><Tag size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />{display}</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Tag size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />{display}
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              Tous les bons plans, promos et tests {display} — {articles.length} article{articles.length > 1 ? "s" : ""}
            </p>
          </div>
        </section>

        {editorialPage && (
          <section className="section-sm">
            <div className="container">
              {editorialPage.commercialPartnershipActive && (
                <div
                  role="note"
                  style={{
                    padding: "14px 18px",
                    marginBottom: "18px",
                    border: "2px solid #1D4ED8",
                    borderRadius: "12px",
                    background: "#EFF6FF",
                    color: "#1E3A8A",
                    fontWeight: 700,
                  }}
                >
                  Collaboration commerciale avec {display}
                </div>
              )}

              <div style={{ padding: "24px", border: "1px solid var(--border)", borderRadius: "16px", background: "white" }}>
                <p style={{ marginTop: 0 }}>{editorialPage.introduction}</p>

                <h2 style={{ marginTop: "28px" }}>Services {display} vérifiés</h2>
                <div className="grid grid-2" style={{ gap: "14px" }}>
                  {editorialPage.services.map((service) => (
                    <article key={service.name} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px" }}>
                      <h3 style={{ marginTop: 0, marginBottom: "8px", fontSize: "1.05rem" }}>{service.name}</h3>
                      <p style={{ margin: "0 0 10px" }}>{service.description}</p>
                      <a href={service.officialUrl} target="_blank" rel="noopener">
                        Source officielle <ExternalLink size={13} aria-hidden style={{ display: "inline", verticalAlign: "middle" }} />
                      </a>
                    </article>
                  ))}
                </div>

                <h2 style={{ marginTop: "28px" }}>Offres {display} vérifiées</h2>
                {activeOffers.length === 0 ? (
                  <p style={{ padding: "14px", borderRadius: "10px", background: "#F8FAFC" }}>
                    <Info size={16} aria-hidden style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                    Aucune offre commerciale n’est publiée ici tant que ses conditions et sa validité n’ont pas été vérifiées sur une source officielle.
                  </p>
                ) : (
                  <div>
                    {activeOffers.map((offer) => {
                      const href = offer.commercialUrl || offer.officialUrl;
                      const isCommercial = Boolean(offer.commercialUrl);
                      return (
                        <article key={offer.title}>
                          <h3>{offer.title}</h3>
                          <p>{offer.conditions}</p>
                          <a
                            href={href}
                            target="_blank"
                            rel={isCommercial ? "nofollow sponsored noopener" : "noopener"}
                          >
                            Consulter l’offre <ExternalLink size={13} aria-hidden />
                          </a>
                        </article>
                      );
                    })}
                  </div>
                )}

                <h2 style={{ marginTop: "28px" }}>Questions fréquentes</h2>
                {editorialPage.faq.map((item) => (
                  <details key={item.question} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 700 }}>{item.question}</summary>
                    <p style={{ marginBottom: 0 }}>{item.answer}</p>
                  </details>
                ))}

                <h2 style={{ marginTop: "28px" }}>À consulter aussi</h2>
                <ul>
                  {editorialPage.internalLinks.map((link) => (
                    <li key={link.href}><a href={link.href}>{link.label}</a></li>
                  ))}
                </ul>

                <p style={{ marginBottom: 0, color: "var(--muted-foreground)", fontSize: "0.88rem" }}>
                  Dernière vérification :{" "}
                  <time dateTime={editorialPage.verifiedAt}>
                    {new Date(`${editorialPage.verifiedAt}T12:00:00`).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "Europe/Paris",
                    })}
                  </time>
                  {" · "}
                  <a href={editorialPage.officialSourceUrl} target="_blank" rel="noopener">
                    source officielle {display}
                  </a>
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section">
          <div className="container">
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Aucun article pour cette marque pour le moment.
              </p>
            ) : (
              <LoadMoreGrid articles={cards} />
            )}
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
