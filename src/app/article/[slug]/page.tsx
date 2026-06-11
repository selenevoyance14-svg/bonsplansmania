import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles, getAllArticles, getPrevNextArticle } from "@/lib/articles";
import Image from "next/image";
import type { Metadata } from "next";
import { Clock, ExternalLink, ChevronRight, Star, Scale, Heart } from "lucide-react";
import Header from "@/app/components/Header";
import LikeButton from "@/app/components/LikeButton";
import NewsletterInline from "@/app/components/NewsletterInline";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import InContentAdsInit from "@/app/components/InContentAdsInit";
import IgraalConcoursCTA from "@/app/components/IgraalConcoursCTA";
import FlashDeals from "@/app/components/FlashDeals";
import TopBonsPlansPremium from "@/app/components/TopBonsPlansPremium";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.meta.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const BASE_URL = "https://bonsplansmania.fr";
  return {
    title: article.meta.seoTitle || `${article.meta.title} | Bons Plans Mania`,
    description: article.meta.seoDescription || article.meta.description,
    alternates: { canonical: `${BASE_URL}/article/${slug}` },
    openGraph: {
      title: article.meta.title, description: article.meta.description,
      // Fallback /og-image.png si l'image article est en SVG : Facebook, LinkedIn, Pinterest,
      // WhatsApp ignorent ou rejettent les SVG → partage cassé. ~1600 vieux articles utilisent
      // encore .svg comme image, on remplace par le hero PNG du site jusqu'à régénération.
      images: [article.meta.image.endsWith('.svg') ? '/og-image.png' : article.meta.image],
      type: "article",
      publishedTime: article.meta.date,
    },
    twitter: {
      card: "summary_large_image",
      title: article.meta.title,
      description: article.meta.description,
      images: [article.meta.image.endsWith('.svg') ? '/og-image.png' : article.meta.image],
    },
    ...(article.meta.noindex && { robots: { index: false, follow: false } }),
  };
}

const categoryConfig: Record<string, { label: string; emoji: string }> = {
  "bon-plan":        { label: "Bon Plan",     emoji: "🏷️" },
  "bon-plan-beaute": { label: "Bon Plan",     emoji: "🏷️" },
  "test-gratuit":    { label: "Test Gratuit", emoji: "🎁" },
  "test-avis":       { label: "Test & Avis",  emoji: "🧪" },
  "concours":        { label: "Concours",     emoji: "🏆" },
  "box-beaute":      { label: "Box Beauté",   emoji: "💄" },
  "beaute":            { label: "Beauté",               emoji: "✨" },
  "selection":         { label: "Beauté",               emoji: "✨" },
  "calendrier-avent":  { label: "Calendrier de l'Avent", emoji: "🎄" },
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const cat = categoryConfig[article.meta.category];
  const affiliateUrl = article.meta.affiliateUrl || "#";
  const affiliateLabel = article.meta.affiliateLabel || "Voir l'offre";
  // Articles "gratuit" : on cache le CTA en haut (l'utilisateur veut juste participer/recevoir)
  // et on ajoute un bloc cross-sell "promo flash" après le contenu pour récupérer ce trafic
  const isFreebieCategory = article.meta.category === "concours" || article.meta.category === "test-gratuit";
  const relatedArticles = getRelatedArticles(slug, article.meta.category, 4, article.meta.tags);
  const { prev: prevArticle, next: nextArticle } = getPrevNextArticle(slug, article.meta.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.meta.title,
    description: article.meta.description,
    datePublished: article.meta.date,
    dateModified: article.meta.updated || article.meta.date,
    image: `https://bonsplansmania.fr${article.meta.image}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://bonsplansmania.fr/article/${slug}`,
    },
    author: { "@type": "Organization", name: "Bons Plans Mania", url: "https://bonsplansmania.fr" },
    publisher: {
      "@type": "Organization",
      name: "Bons Plans Mania",
      url: "https://bonsplansmania.fr",
      logo: { "@type": "ImageObject", url: "https://bonsplansmania.fr/icon.svg" },
    },
  };

  // Schema Product pour les articles avec prix (rich snippets Google)
  // IMPORTANT : on extrait le 1er nombre du price (ex: "13€ au lieu de 987€" -> "13").
  // Si le price ne contient AUCUN chiffre exploitable (ex: "Gratuit", "Sur devis"),
  // on n'émet PAS le bloc Product du tout — sinon GSC remonte "price manquant dans offers".
  // aggregateRating + review ne sont injectés QUE si rating réel (sinon "Spammy structured data").
  const priceMatch = article.meta.price?.match(/[\d]+([.,][\d]+)?/)?.[0];
  const cleanPrice = priceMatch ? priceMatch.replace(",", ".") : null;
  const productJsonLd = cleanPrice && affiliateUrl !== "#" ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: article.meta.title,
    description: article.meta.description,
    image: `https://bonsplansmania.fr${article.meta.image}`,
    ...(article.meta.rating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: article.meta.rating,
        bestRating: 5,
        ratingCount: 1,
      },
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: article.meta.rating,
          bestRating: 5,
        },
        author: {
          "@type": "Organization",
          name: "BonsPlansMania",
        },
        reviewBody: article.meta.description,
      },
    } : {}),
    offers: {
      "@type": "Offer",
      url: `https://bonsplansmania.fr/article/${slug}`,
      price: cleanPrice,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  } : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://bonsplansmania.fr" },
      { "@type": "ListItem", position: 2, name: cat?.label ?? article.meta.category, item: `https://bonsplansmania.fr/categorie/${article.meta.category}` },
      { "@type": "ListItem", position: 3, name: article.meta.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {productJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header activePage="/blog" />

      <main className="article-page">
        <div className="container">
          <nav className="breadcrumbs">
            <a href="/">Accueil</a>
            <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
            <a href={`/categorie/${article.meta.category}`}>{cat?.emoji} {cat?.label ?? article.meta.category}</a>
            <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
            <span>{article.meta.title}</span>
          </nav>

          <article className="article">
            {article.meta.expired && (
              <div style={{ background: "#FEE2E2", border: "2px solid #F87171", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", textAlign: "center" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem", color: "#B91C1C" }}>
                  Ce concours est terminé
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.88rem", color: "#DC2626" }}>
                  Cette offre n'est plus disponible. Découvrez nos <a href="/categorie/concours" style={{ color: "#B91C1C", textDecoration: "underline", fontWeight: 600 }}>concours en cours</a>.
                </p>
              </div>
            )}
            <div className="article-header">
              <div className="article-meta-top">
                <span className={`pill pill-${article.meta.category}`}>{cat?.emoji} {cat?.label}</span>
                <time dateTime={article.meta.date}>
                  {new Date(article.meta.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" })}
                </time>
                {article.meta.updated && (
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #6b7280)" }}>
                    (mis à jour le {new Date(article.meta.updated + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" })})
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={13} /> {article.meta.readingTime}
                </span>
              </div>

              <h1>{article.meta.title}</h1>
              <p className="article-subtitle">{article.meta.description}</p>

              {(article.meta.rating || article.meta.price || (affiliateUrl !== "#" && !isFreebieCategory)) && (
                <div className="article-rating-bar">
                  {article.meta.rating && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ display: "flex", gap: "2px", color: "var(--accent)" }}>
                        {Array.from({ length: Math.round(article.meta.rating) }, (_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </span>
                      <strong>{article.meta.rating}/5</strong>
                    </div>
                  )}
                  {article.meta.price && (
                    <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.05rem" }}>{article.meta.price}</span>
                  )}
                  {affiliateUrl !== "#" && !isFreebieCategory && (
                    <a href={affiliateUrl} className="btn btn-primary btn-sm" target="_blank" rel="nofollow sponsored noopener">
                      {affiliateLabel} <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Pub mobile-only above the fold (avant l'image hero) — boost RPM mobile (70-80% du trafic) */}
            <div className="ad-mobile-only" style={{ display: "none" }}>
              <AdBlock />
            </div>

            <div className="article-hero-image" style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", maxHeight: "450px" }}>
              <Image src={article.meta.image} alt={article.meta.imageAlt} width={800} height={450} style={{ width: "100%", height: "100%", objectFit: "contain", maxHeight: "450px" }} priority />
            </div>

            {/* Pub après l'image hero (desktop principalement) */}
            <AdBlock />

            {/* Cross-sell PREMIUM en haut pour les articles freebies (concours / test-gratuit)
                qui ne génèrent pas de revenu direct : on capte le visiteur AVANT qu'il clique
                "Participer" en lui montrant nos vrais bons plans rémunérateurs (Awin, Igraal, Rakuten). */}
            {isFreebieCategory && <TopBonsPlansPremium currentSlug={slug} />}

            <NewsletterInline />

            <div className="article-content">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content, affiliateUrl !== "#" && !isFreebieCategory ? affiliateUrl : undefined, affiliateUrl !== "#" && !isFreebieCategory ? affiliateLabel : undefined, article.meta.image) }} />
            </div>
            {/* Initialise les blocs AdSense in-article injectés dans le contenu Markdown ci-dessus */}
            <InContentAdsInit />

            {/* Pub après le contenu */}
            <AdBlock />

            {/* Bloc cross-sell "promo flash" : AVANT le CTA principal pour les freebies
                (le visiteur doit voir les bons plans avant de quitter le site via "Participer") */}
            {isFreebieCategory && <FlashDeals slug={slug} />}

            {/* Articles connexes AVANT la CTA affilié : si le visiteur ne clique pas sur l'affilié,
                il doit voir 4 autres articles pertinents avant d'envisager de quitter le site.
                Position-clé pour réduire le bounce rate (mesuré ~100% au 3 juin 2026). */}
            {relatedArticles.length > 0 && (
              <section className="related-articles" style={{ margin: "32px 0" }}>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "16px" }}>A lire aussi</h2>
                <div className="articles-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                  {relatedArticles.map((related) => {
                    const relCat = categoryConfig[related.meta.category];
                    return (
                      <a key={related.meta.slug} href={`/article/${related.meta.slug}`} className="card" style={{ textDecoration: "none" }}>
                        <div style={{ position: "relative", height: "140px", overflow: "hidden" }}>
                          <Image src={related.meta.image} alt={related.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="25vw" />
                        </div>
                        <div className="card-body" style={{ padding: "12px" }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {relCat?.emoji} {relCat?.label}
                          </span>
                          <h3 className="card-title" style={{ fontSize: "0.92rem", lineHeight: 1.3, margin: "6px 0 0" }}>{related.meta.title}</h3>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {affiliateUrl !== "#" && (
              <div style={{ textAlign: "center", margin: "40px 0", padding: "32px", background: "linear-gradient(135deg, #FFF0F0 0%, #FFF8F0 100%)", borderRadius: "16px", border: "2px solid #FECDD3" }}>
                <p style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: "16px", color: "var(--foreground)" }}>Profiter de cette offre</p>
                <a href={affiliateUrl} className="btn btn-primary" target="_blank" rel="nofollow sponsored noopener" style={{ padding: "14px 32px", fontSize: "1rem" }}>
                  {affiliateLabel} <ExternalLink size={15} />
                </a>
              </div>
            )}
          </article>

          {/* CTA cashback iGraal sur articles concours uniquement (profil concouriste = profil cashback) */}
          {article.meta.category === "concours" && <IgraalConcoursCTA />}

          {/* Multiplex (recommandations natives AdSense) avant les articles liés — RPM nettement plus haut que display ici */}
          <AdBlock format="multiplex" />

          {/* Navigation séquentielle prev/next dans la même catégorie — renforce le maillage SEO chronologique */}
          {(prevArticle || nextArticle) && (
            <nav aria-label="Navigation entre articles" style={{ margin: "32px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {prevArticle ? (
                <a href={`/article/${prevArticle.meta.slug}`} style={{ display: "block", padding: "16px", background: "white", border: "1px solid var(--border, #e5e7eb)", borderRadius: "12px", textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground, #6b7280)", marginBottom: "6px" }}>← Article précédent</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.4 }}>{prevArticle.meta.title}</div>
                </a>
              ) : <div />}
              {nextArticle ? (
                <a href={`/article/${nextArticle.meta.slug}`} style={{ display: "block", padding: "16px", background: "white", border: "1px solid var(--border, #e5e7eb)", borderRadius: "12px", textDecoration: "none", color: "inherit", textAlign: "right" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground, #6b7280)", marginBottom: "6px" }}>Article suivant →</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.4 }}>{nextArticle.meta.title}</div>
                </a>
              ) : <div />}
            </nav>
          )}

          {/* Section "A lire aussi" déplacée plus haut (avant la CTA affilié) pour réduire le bounce rate. */}

          {/* Navigation par catégorie pour maillage interne */}
          <nav style={{ margin: "40px 0", padding: "24px", background: "var(--muted, #f3f4f6)", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "12px" }}>Explorer par catégorie</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                { slug: "bon-plan", label: "Bons Plans", emoji: "🏷️" },
                { slug: "test-gratuit", label: "Tests Gratuits", emoji: "🎁" },
                { slug: "concours", label: "Concours", emoji: "🏆" },
                { slug: "box-beaute", label: "Box Beauté", emoji: "💄" },
                { slug: "code-promo", label: "Codes Promo", emoji: "🎟️" },
                { slug: "beaute", label: "Beauté", emoji: "✨" },
              ].filter(c => c.slug !== article.meta.category).map(({ slug: catSlug, label, emoji }) => (
                <a key={catSlug} href={`/categorie/${catSlug}`}
                  style={{ padding: "6px 14px", borderRadius: "999px", background: "white", fontSize: "0.82rem", color: "var(--text, #374151)", textDecoration: "none", fontWeight: 500, border: "1px solid var(--border, #e5e7eb)" }}>
                  {emoji} {label}
                </a>
              ))}
            </div>
          </nav>

          {/* Éléments secondaires : like, partage, disclaimer, tags */}
          <div style={{ maxWidth: "780px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", margin: "32px 0 16px" }}>
              <LikeButton slug={slug} />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #6b7280)" }}>Partager :</span>
              {[
                { href: `https://wa.me/?text=${encodeURIComponent(article.meta.title + " - https://bonsplansmania.fr/article/" + slug)}`, label: "WhatsApp", bg: "#25d366", color: "white" },
                { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://bonsplansmania.fr/article/" + slug)}`, label: "Facebook", bg: "#1877f2", color: "white" },
                { href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent("https://bonsplansmania.fr/article/" + slug)}&description=${encodeURIComponent(article.meta.title)}`, label: "Pinterest", bg: "#e60023", color: "white" },
                { href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.meta.title)}&url=${encodeURIComponent("https://bonsplansmania.fr/article/" + slug)}`, label: "X", bg: "#000", color: "white" },
              ].map(({ href, label, bg, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 14px", borderRadius: "999px", background: bg, color, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
                  {label}
                </a>
              ))}
            </div>

            <div className="affiliate-disclaimer">
              <p style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.82rem" }}>
                <Scale size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  <strong>Transparence :</strong> Certains liens de cet article sont des liens affiliés.
                  Si vous passez commande via ces liens, nous recevons une petite commission sans surcoût pour vous.
                  Cela nous aide à continuer à dénicher les meilleures offres gratuitement.{" "}
                  <Heart size={12} style={{ display: "inline", color: "var(--primary)" }} />
                </span>
              </p>
            </div>

            {article.meta.tags.length > 0 && (
              <div style={{ margin: "24px 0", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #6b7280)", fontWeight: 600 }}>Tags :</span>
                {article.meta.tags.map((tag) => (
                  <a key={tag} href={`/marque/${tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                    style={{ padding: "4px 12px", borderRadius: "999px", background: "var(--muted, #f3f4f6)", fontSize: "0.78rem", color: "var(--text, #374151)", textDecoration: "none", fontWeight: 500 }}>
                    {tag}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CTA sticky mobile (priorité au CTA affilié quand il existe) */}
      {affiliateUrl !== "#" ? (
        <div className="sticky-cta-mobile">
          <a href={affiliateUrl} className="btn btn-primary" target="_blank" rel="nofollow sponsored noopener" style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: "1rem" }}>
            {affiliateLabel} <ExternalLink size={15} />
          </a>
        </div>
      ) : (
        /* Pas d'affilié → on place une pub sticky AdSense à la place pour monétiser quand même */
        <StickyAdMobile />
      )}

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

function renderMarkdown(content: string, affiliateUrl?: string, affiliateLabel?: string, heroImage?: string): string {
  // Supprime la 1ère image du MDX si elle correspond à l'image de mise en avant (évite le doublon avec la hero)
  let cleaned = content;
  if (heroImage) {
    const escaped = heroImage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const heroImgRegex = new RegExp(`^!\\[[^\\]]*\\]\\(${escaped}\\)\\s*$`, "m");
    cleaned = cleaned.replace(heroImgRegex, "");
  }
  const lines = cleaned.split("\n");
  const out: string[] = [];
  let inTable = false;
  let inProduct = false;
  let productData: Record<string, string> = {};
  let h2Count = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Product card block: :::product ... :::
    if (line === ":::product") {
      inProduct = true;
      productData = {};
      continue;
    }
    if (inProduct && line === ":::") {
      // Render product card
      const name = productData.name || "";
      const price = productData.price || "";
      const oldPrice = productData.oldPrice || "";
      const url = productData.url || affiliateUrl || "#";
      const label = productData.label || "Voir l'offre";
      const badge = productData.badge || "";
      const desc = productData.desc || "";
      const rating = productData.rating || "";

      let ratingHtml = "";
      if (rating) {
        const stars = Math.round(parseFloat(rating));
        ratingHtml = `<div class="product-card-rating"><span class="product-card-stars">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</span> <strong>${rating}/5</strong></div>`;
      }

      out.push(`<div class="product-card">${badge ? `<span class="product-card-badge">${badge}</span>` : ""}<div class="product-card-info"><strong class="product-card-name">${fmt(name)}</strong>${desc ? `<p class="product-card-desc">${fmt(desc)}</p>` : ""}${ratingHtml}</div><div class="product-card-action">${oldPrice ? `<span class="product-card-old-price">${oldPrice}</span>` : ""}${price ? `<span class="product-card-price">${price}</span>` : ""}<a href="${url}" class="btn btn-primary btn-sm" target="_blank" rel="nofollow sponsored noopener">${label} <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></div></div>`);
      inProduct = false;
      continue;
    }
    if (inProduct) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) productData[match[1]] = match[2];
      continue;
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      if (/^\|[\s\-:|]+\|$/.test(line) && !line.replace(/[\s|:\-]/g, "")) continue;
      if (!inTable) {
        out.push('<div class="table-wrapper"><table class="comparison-table"><thead><tr>');
        const cells = line.split("|").filter(Boolean).map(c => `<th>${fmt(c.trim())}</th>`);
        out.push(cells.join(""), "</tr></thead><tbody>");
        inTable = true;
        continue;
      }
      const cells = line.split("|").filter(Boolean).map(c => `<td>${fmt(c.trim())}</td>`);
      out.push("<tr>", ...cells, "</tr>");
      continue;
    }
    if (inTable) { out.push("</tbody></table></div>"); inTable = false; }
    out.push(line);
  }
  if (inTable) out.push("</tbody></table></div>");

  let html = out.join("\n");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, (_match, title) => {
    h2Count++;
    let prefix = "";
    if (h2Count % 4 === 0) {
      // Bloc AdSense in-article tous les 4 H2 (réduction depuis "% 2" le 11/06/2026 pour améliorer la lisibilité
      // et favoriser le CTR vers les liens affiliés Amazon. Format fluid = RPM plus élevé que display sur les contenus longs).
      // Le push est fait côté client par <InContentAdsInit /> car <script> dans innerHTML ne s'exécute pas.
      prefix = `<ins class="adsbygoogle" style="display:block;text-align:center;margin:32px 0;min-height:250px" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-5064203547863113" data-ad-slot="9104262184"></ins>`;
    } else if (affiliateUrl && h2Count % 3 === 0) {
      prefix = `<div class="cta-inline"><a href="${affiliateUrl}" class="btn btn-primary btn-sm" target="_blank" rel="nofollow sponsored noopener">${affiliateLabel || "Voir l\u0027offre"} <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></div>`;
    }
    return `${prefix}<h2>${title}</h2>`;
  });
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure style="margin:24px 0;text-align:center;background:#fff;border-radius:12px;overflow:hidden;padding:12px"><img src="$2" alt="$1" loading="lazy" style="max-width:100%;max-height:500px;height:auto;object-fit:contain;border-radius:8px;margin:0 auto;display:block" /><figcaption style="font-size:0.82rem;color:#6b7280;margin-top:8px">$1</figcaption></figure>');
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, (_match, text, url) => {
    // Liens internes (relatifs, ancres, ou bonsplansmania.fr) : suivis par Google, pas de nofollow/sponsored, navigation dans le même onglet
    const isInternal = /^(\/|#|https?:\/\/(?:www\.)?bonsplansmania\.fr)/i.test(url);
    if (isInternal) {
      return `<a href="${url}" rel="noopener">${text}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="nofollow sponsored noopener">${text}</a>`;
  });
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, "<ul>$&</ul>");
  html = "<p>" + html.replace(/\n\n+/g, "</p><p>") + "</p>";
  html = html.replace(/<p>(<h[23]>)/g, "$1").replace(/(<\/h[23]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ul>)/g, "$1").replace(/(<\/ul>)<\/p>/g, "$1");
  html = html.replace(/<p>(<hr>)<\/p>/g, "$1");
  html = html.replace(/<p>(<div class="table-wrapper">)/g, "$1").replace(/(<\/div>)<\/p>/g, "$1");
  html = html.replace(/<p>(<div class="product-card">)/g, "$1");
  html = html.replace(/<p>\s*<\/p>/g, "");
  return html;
}

function fmt(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
}
