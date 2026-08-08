"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";
import { parsePrice } from "@/lib/price";
import { hasDirectMerchantCta, shouldHideAmazonPrice } from "@/lib/article-commerce";

interface ArticleListItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  imageAlt: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  readingTime: string;
  expired?: boolean;
  expiresSoon?: boolean;
  endDate?: string;
  featured?: boolean;
  tags?: string[];
  price?: string;
  amazonAsin?: string;
  affiliateUrl?: string;
}

interface BrandDef {
  /** Identifiant interne (utilisé dans la state) */
  key: string;
  /** Libellé affiché dans le select */
  label: string;
  /** Liste de mots-clés (insensibles à la casse/accents) à chercher dans les tags d'un article.
   *  Un article match si AU MOINS UN de ses tags contient AU MOINS UN keyword. */
  keywords: string[];
}

const PER_PAGE = 24;

const CTA_BY_COLOR: Record<string, string> = {
  "bon-plan": "Voir l'offre",
  "bon-plan-beaute": "Voir l'offre",
  "test-gratuit": "Voir les détails",
  "test-avis": "Lire le test",
  "comparatif": "Lire le comparatif",
  "concours": "Voir le concours",
  "box-beaute": "Voir la box",
  "code-promo": "Voir le code",
  "beaute": "Lire l'article",
  "calendrier-avent": "Découvrir",
  "calendrier": "Découvrir",
};

const BADGE_BY_COLOR: Record<string, string> = {
  "code-promo": "Code",
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Les anciens articles n'ont pas toujours de champ `price` dans leur
 * frontmatter, alors que le prix est présent dans le titre ou la description.
 * On l'utilise comme solution de secours afin que les tris par prix restent
 * fiables pendant la remise à niveau progressive des archives.
 */
function getSortablePrice(article: ArticleListItem): number | undefined {
  const structured = parsePrice(article.price).nowAmount;
  if (structured !== undefined) return structured;

  const fallbackText = `${article.title} ${article.description}`;
  const match = fallbackText.match(/(?:^|\s)(\d{1,4}(?:[\s\u00a0]\d{3})*(?:[.,]\d{1,2})?)\s*€/);
  if (!match) return undefined;

  const amount = Number.parseFloat(
    match[1].replace(/[\s\u00a0]/g, "").replace(",", "."),
  );
  return Number.isFinite(amount) ? amount : undefined;
}

type SortBy = "recent" | "oldest" | "price-asc" | "price-desc";

export default function BrandFilter({ articles, brands, sortBrandsBy = "count" }: { articles: ArticleListItem[]; brands: BrandDef[]; sortBrandsBy?: "count" | "alpha" }) {
  const [visible, setVisible] = useState(PER_PAGE);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");

  // Une même marque peut provenir de plusieurs univers (ex. Philips en beauté,
  // maison et tech). On fusionne ses mots-clés pour éviter les options en double.
  const uniqueBrands = useMemo(() => {
    const merged = new Map<string, BrandDef>();
    for (const brand of brands) {
      const current = merged.get(brand.key);
      if (!current) {
        merged.set(brand.key, brand);
        continue;
      }
      merged.set(brand.key, {
        ...current,
        keywords: Array.from(new Set([...current.keywords, ...brand.keywords])),
      });
    }
    return Array.from(merged.values());
  }, [brands]);

  // Pré-calcul : pour chaque article, trouver les clés des marques qui matchent
  const enriched = useMemo(() => {
    return articles.map((a) => {
      const tagSet = (a.tags || []).map(normalize);
      const matchedKeys: string[] = [];
      for (const brand of uniqueBrands) {
        const normalizedKeywords = brand.keywords.map(normalize);
        const matches = tagSet.some((tag) =>
          normalizedKeywords.some((kw) => tag === kw || tag.includes(kw))
        );
        if (matches) matchedKeys.push(brand.key);
      }
      const parsed = parsePrice(a.price);
      return { article: a, matchedKeys, ...parsed, nowNum: getSortablePrice(a) };
    });
  }, [articles, uniqueBrands]);

  // Marques disponibles (≥ 1 article)
  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of enriched) {
      for (const key of e.matchedKeys) {
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return uniqueBrands
      .filter((b) => (counts.get(b.key) || 0) > 0)
      .map((b) => ({ ...b, count: counts.get(b.key) || 0 }))
      .sort((a, b) => {
        if (sortBrandsBy === "alpha") return a.label.localeCompare(b.label);
        return b.count - a.count || a.label.localeCompare(b.label);
      });
  }, [enriched, uniqueBrands, sortBrandsBy]);

  const hasPriceData = useMemo(() => enriched.some((e) => e.nowNum !== undefined), [enriched]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (selectedBrand) {
      list = list.filter((e) => e.matchedKeys.includes(selectedBrand));
    }
    const sorted = [...list];
    const expiredFirst = (a: typeof sorted[number], b: typeof sorted[number]) => {
      const aExp = a.article.expired ? 1 : 0;
      const bExp = b.article.expired ? 1 : 0;
      return aExp - bExp;
    };
    if (sortBy === "recent") {
      sorted.sort((a, b) => expiredFirst(a, b) || (new Date(b.article.date).getTime() - new Date(a.article.date).getTime()));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => expiredFirst(a, b) || (new Date(a.article.date).getTime() - new Date(b.article.date).getTime()));
    } else if (sortBy === "price-asc") {
      sorted.sort((a, b) => expiredFirst(a, b) || ((a.nowNum ?? Infinity) - (b.nowNum ?? Infinity)));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => expiredFirst(a, b) || ((b.nowNum ?? -Infinity) - (a.nowNum ?? -Infinity)));
    }
    return sorted.map((e) => e.article);
  }, [enriched, selectedBrand, sortBy]);

  const activeFilters = (selectedBrand ? 1 : 0) + (sortBy !== "recent" ? 1 : 0);
  const reset = () => {
    setSelectedBrand("");
    setSortBy("recent");
    setVisible(PER_PAGE);
  };

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  useEffect(() => {
    const controller = new AbortController();
    const asins = Array.from(new Set(filtered.slice(0, visible).flatMap((article) => {
      const asin = article.amazonAsin
        || article.affiliateUrl?.match(/amazon\.fr\/[^\s]*\/dp\/([A-Z0-9]{10})/i)?.[1]
        || article.affiliateUrl?.match(/amazon\.fr\/dp\/([A-Z0-9]{10})/i)?.[1];
      return asin ? [asin.toUpperCase()] : [];
    })));

    Promise.all(asins.map(async (asin) => {
      try {
        const response = await fetch(`/api/amazon/${encodeURIComponent(asin)}`, { signal: controller.signal });
        if (!response.ok) return;
        const offer = await response.json() as { price?: string };
        if (offer.price) {
          document.querySelectorAll<HTMLElement>(`[data-amazon-price="${asin}"]`).forEach((element) => {
            element.textContent = offer.price!;
          });
        }
      } catch {
        // Le libellé Amazon reste affiché si l'API ne répond pas.
      }
    }));

    return () => controller.abort();
  }, [filtered, visible]);

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    paddingRight: "32px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "white",
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "#1f2937",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  };
  const activeSelectStyle: React.CSSProperties = {
    ...selectStyle,
    borderColor: "#1f2937",
    background: "#1f2937",
    color: "white",
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {availableBrands.length > 0 && (
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setVisible(PER_PAGE);
            }}
            style={selectedBrand ? activeSelectStyle : selectStyle}
            aria-label="Filtrer par marque"
          >
            <option value="">Toutes les marques</option>
            {availableBrands.map((b) => (
              <option key={b.key} value={b.key}>
                {b.label} ({b.count})
              </option>
            ))}
          </select>
        )}

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as SortBy);
            setVisible(PER_PAGE);
          }}
          style={sortBy !== "recent" ? activeSelectStyle : selectStyle}
          aria-label="Trier par"
        >
          <option value="recent">Plus récent</option>
          <option value="oldest">Plus ancien</option>
          {hasPriceData && <option value="price-asc">Prix croissant</option>}
          {hasPriceData && <option value="price-desc">Prix décroissant</option>}
        </select>

        <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: "0.88rem" }}>
          {filtered.length} article{filtered.length > 1 ? "s" : ""}
        </span>
        {activeFilters > 0 && (
          <button
            onClick={reset}
            style={{
              padding: "8px 12px",
              background: "transparent",
              color: "#DC2626",
              border: "1px solid #DC262644",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <X size={14} /> Effacer
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#6b7280" }}>
          <p style={{ marginBottom: "16px" }}>Aucun article ne correspond.</p>
          <button onClick={reset} style={{ padding: "10px 20px", background: "#1f2937", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
            Réinitialiser
          </button>
        </div>
      ) : (
        <>
          <div className="bpm-card-h-grid">
            {shown.map((article, index) => {
              const cta = CTA_BY_COLOR[article.categoryColor] ?? "Lire l'article";
              const badge = BADGE_BY_COLOR[article.categoryColor];
              const { now, was, savings } = parsePrice(article.price);
              const amazonAsin = article.amazonAsin
                || article.affiliateUrl?.match(/amazon\.fr\/[^\s]*\/dp\/([A-Z0-9]{10})/i)?.[1]
                || article.affiliateUrl?.match(/amazon\.fr\/dp\/([A-Z0-9]{10})/i)?.[1];
              const isAmazonOffer = !!amazonAsin || /(?:amazon\.fr|amzn\.(?:to|eu)|link\.amazon)/i.test(article.affiliateUrl || "");
              const hideAmazonPrice = shouldHideAmazonPrice(article.slug);
              const isFree = !!now && /gratuit/i.test(now);
              const showAdAfter = index === 7 || index === 15;
              const hasExternalAffiliate = hasDirectMerchantCta({
                category: article.category,
                affiliateUrl: article.affiliateUrl,
                expired: article.expired,
                endDate: article.endDate,
              });
              // Le vrai lien affilié reste côté serveur (Cloudflare Function /go/[slug])
              const affiliateHref = hasExternalAffiliate ? `/go/${article.slug}` : "#";
              return (
                <Fragment key={article.slug}>
                  <article className={`bpm-card-h bpm-card-h-${article.categoryColor} ${article.expired ? "bpm-card-h-expired" : ""}`}>
                    <a
                      href={`/article/${article.slug}`}
                      className="bpm-card-h-main-link"
                      aria-label={article.title}
                    />
                    <div className="bpm-card-h-image">
                      <Image src={article.image.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania.png" : article.image} alt={article.imageAlt} fill style={{ objectFit: "contain", padding: "8px" }} sizes="(max-width: 768px) 120px, 200px" loading="lazy" />
                      {savings ? <span className="bpm-card-h-discount">{savings}</span> : badge ? <span className={`bpm-card-h-badge bpm-badge-${article.categoryColor}`}>{badge}</span> : null}
                      {article.expired && <span className="bpm-card-h-expired-badge">Terminé</span>}
                      {!article.expired && article.expiresSoon && <span className="bpm-card-h-soon-badge">⏰ Bientôt fini</span>}
                    </div>
                    <div className="bpm-card-h-body">
                      <div className="bpm-card-h-meta">
                        <span className={`bpm-card-h-pill bpm-pill-${article.categoryColor}`}>{article.categoryLabel}</span>
                        <span className="bpm-card-h-sep" aria-hidden>·</span>
                        <time className="bpm-card-h-date">
                          {new Date(article.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" })}
                        </time>
                      </div>
                      <h2 className="bpm-card-h-title">{article.title}</h2>
                      <p className="bpm-card-h-excerpt">{article.description}</p>
                      <div className="bpm-card-h-footer">
                        {(now || (isAmazonOffer && hasExternalAffiliate && !hideAmazonPrice)) && (
                          <div className="bpm-card-h-price">
                            <span className={`bpm-card-h-price-now ${isFree ? "bpm-card-h-price-free" : ""}`} data-amazon-price={amazonAsin?.toUpperCase()}>
                              {now || "Prix sur Amazon"}
                            </span>
                            {was && <span className="bpm-card-h-price-was">{was}</span>}
                            {savings && <span className="bpm-card-h-chip">{savings}</span>}
                          </div>
                        )}
                        {hasExternalAffiliate ? (
                          <a
                            href={affiliateHref}
                            target="_blank"
                            rel="nofollow noopener sponsored"
                            className={`bpm-card-h-cta bpm-cta-${article.categoryColor}`}
                            aria-label={`${cta} — ${article.title}`}
                          >
                            {cta} <ArrowRight size={14} aria-hidden />
                          </a>
                        ) : (
                          <a
                            href={`/article/${article.slug}`}
                            className={`bpm-card-h-cta bpm-cta-${article.categoryColor}`}
                            aria-label={`${cta} — ${article.title}`}
                          >
                            {cta} <ArrowRight size={14} aria-hidden />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                  {showAdAfter && (
                    <AdBlock format={index === 7 ? "in-article" : "display"} />
                  )}
                </Fragment>
              );
            })}
          </div>
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button onClick={() => setVisible((v) => v + PER_PAGE)} className="btn btn-primary" style={{ cursor: "pointer" }}>
                Voir plus d&apos;articles ({filtered.length - visible} restants)
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export type { BrandDef };
