import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles, getAllArticles } from "@/lib/articles";
import Image from "next/image";
import type { Metadata } from "next";
import { Clock, ExternalLink, ChevronRight, Star, Scale, Heart } from "lucide-react";
import Header from "@/app/components/Header";
import LikeButton from "@/app/components/LikeButton";
import NewsletterInline from "@/app/components/NewsletterInline";
import AdBlock from "@/app/components/AdBlock";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return getAllArticles().filter((a) => !a.meta.expired).map((a) => ({ slug: a.meta.slug }));
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
      images: [article.meta.image], type: "article",
      publishedTime: article.meta.date,
    },
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
  const relatedArticles = getRelatedArticles(slug, article.meta.category, 3, article.meta.tags);

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
  const productJsonLd = article.meta.price && affiliateUrl !== "#" ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: article.meta.title,
    description: article.meta.description,
    image: `https://bonsplansmania.fr${article.meta.image}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: article.meta.rating || 4.5,
      bestRating: 5,
      ratingCount: article.meta.rating ? 1 : 12,
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: article.meta.rating || 4.5,
        bestRating: 5,
      },
      author: {
        "@type": "Organization",
        name: "BonsPlansMania",
      },
      reviewBody: article.meta.description,
    },
    offers: {
      "@type": "Offer",
      url: `https://bonsplansmania.fr/article/${slug}`,
      price: article.meta.price.replace(/[^0-9.,]/g, "").replace(",", "."),
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

              {(article.meta.rating || article.meta.price || affiliateUrl !== "#") && (
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
                  {affiliateUrl !== "#" && (
                    <a href={affiliateUrl} className="btn btn-primary btn-sm" target="_blank" rel="nofollow sponsored noopener">
                      {affiliateLabel} <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="article-hero-image" style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", maxHeight: "450px" }}>
              <Image src={article.meta.image} alt={article.meta.imageAlt} width={800} height={450} style={{ width: "100%", height: "100%", objectFit: "contain", maxHeight: "450px" }} priority />
            </div>

            {/* Pub après l'image hero */}
            <AdBlock />

            <NewsletterInline />

            <div className="article-content">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content, affiliateUrl !== "#" ? affiliateUrl : undefined, affiliateUrl !== "#" ? affiliateLabel : undefined) }} />
            </div>

            {/* Pub après le contenu */}
            <AdBlock />

            {affiliateUrl !== "#" && (
              <div style={{ textAlign: "center", margin: "40px 0", padding: "32px", background: "linear-gradient(135deg, #FFF0F0 0%, #FFF8F0 100%)", borderRadius: "16px", border: "2px solid #FECDD3" }}>
                <p style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: "16px", color: "var(--foreground)" }}>Profiter de cette offre</p>
                <a href={affiliateUrl} className="btn btn-primary" target="_blank" rel="nofollow sponsored noopener" style={{ padding: "14px 32px", fontSize: "1rem" }}>
                  {affiliateLabel} <ExternalLink size={15} />
                </a>
              </div>
            )}
          </article>

          {/* Pub avant les articles liés */}
          <AdBlock />

          {relatedArticles.length > 0 && (
            <section className="related-articles">
              <h2>A lire aussi</h2>
              <div className="articles-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {relatedArticles.map((related) => {
                  const relCat = categoryConfig[related.meta.category];
                  return (
                    <a key={related.meta.slug} href={`/article/${related.meta.slug}`} className="card" style={{ textDecoration: "none" }}>
                      <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                        <Image src={related.meta.image} alt={related.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="33vw" />
                      </div>
                      <div className="card-body">
                        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {relCat?.emoji} {relCat?.label}
                        </span>
                        <h3 className="card-title">{related.meta.title}</h3>
                        <p className="card-excerpt">{related.meta.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

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
                  <span key={tag}
                    style={{ padding: "4px 12px", borderRadius: "999px", background: "var(--muted, #f3f4f6)", fontSize: "0.78rem", color: "var(--text, #374151)", fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CTA sticky mobile */}
      {affiliateUrl !== "#" && (
        <div className="sticky-cta-mobile">
          <a href={affiliateUrl} className="btn btn-primary" target="_blank" rel="nofollow sponsored noopener" style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: "1rem" }}>
            {affiliateLabel} <ExternalLink size={15} />
          </a>
        </div>
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

function renderMarkdown(content: string, affiliateUrl?: string, affiliateLabel?: string): string {
  const lines = content.split("\n");
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
    if (h2Count % 3 === 0) {
      // Emplacement pub Ezoic tous les 3 H2
      prefix = `<div id="ezoic-pub-ad-placeholder-${200 + h2Count}" class="ad-container" style="text-align:center;margin:24px 0;min-height:90px;overflow:hidden"></div>`;
    } else if (affiliateUrl && h2Count % 2 === 0) {
      prefix = `<div class="cta-inline"><a href="${affiliateUrl}" class="btn btn-primary btn-sm" target="_blank" rel="nofollow sponsored noopener">${affiliateLabel || "Voir l\u0027offre"} <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></div>`;
    }
    return `${prefix}<h2>${title}</h2>`;
  });
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure style="margin:24px 0;text-align:center;background:#fff;border-radius:12px;overflow:hidden;padding:12px"><img src="$2" alt="$1" loading="lazy" style="max-width:100%;max-height:500px;height:auto;object-fit:contain;border-radius:8px;margin:0 auto;display:block" /><figcaption style="font-size:0.82rem;color:#6b7280;margin-top:8px">$1</figcaption></figure>');
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="nofollow sponsored noopener">$1</a>');
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
