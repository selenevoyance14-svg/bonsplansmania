"use client";

import { Fragment, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";

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
  "test-gratuit": "Postuler",
  "test-avis": "Lire le test",
  "concours": "Participer",
  "box-beaute": "Voir la box",
  "code-promo": "Voir le code",
  "beaute": "Lire l'article",
  "calendrier-avent": "Découvrir",
  "calendrier": "Découvrir",
};

const BADGE_BY_COLOR: Record<string, string> = {
  "box-beaute": "Box",
  "code-promo": "Code",
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function parseAmount(text: string): number | undefined {
  const trimmed = text.trim();
  const strict = trimmed.match(/^[(]?\s*(\d{1,3}(?:[\s ]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*€/);
  if (strict) {
    const cleaned = strict[1].replace(/[\s ]/g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function parsePrice(raw?: string): { now?: string; was?: string; savings?: string; nowNum?: number } {
  if (!raw) return {};
  const explicitPctMatch = raw.match(/-\s*(\d{1,2})\s*%/);
  let explicitPct: number | undefined;
  if (explicitPctMatch) {
    const n = parseInt(explicitPctMatch[1], 10);
    if (n > 0 && n < 100) explicitPct = n;
  }
  const m = raw.match(/^(.+?)\s*au lieu de\s*(.+?)$/i);
  if (m) {
    const now = m[1].trim();
    const was = m[2].trim();
    const nowNum = parseAmount(now);
    const wasNum = parseAmount(was);
    let savings: string | undefined;
    if (explicitPct !== undefined) {
      savings = `−${explicitPct}%`;
    } else if (Number.isFinite(nowNum) && Number.isFinite(wasNum) && wasNum! > nowNum! && nowNum! > 0) {
      const pct = Math.round(((wasNum! - nowNum!) / wasNum!) * 100);
      if (pct > 0 && pct < 95) savings = `−${pct}%`;
    }
    return { now, was, savings, nowNum };
  }
  const nowNum = parseAmount(raw);
  let savings: string | undefined;
  if (explicitPct !== undefined) savings = `−${explicitPct}%`;
  return { now: raw.trim(), nowNum, savings };
}

type SortBy = "recent" | "oldest" | "price-asc" | "price-desc";

export default function BrandFilter({ articles, brands }: { articles: ArticleListItem[]; brands: BrandDef[] }) {
  const [visible, setVisible] = useState(PER_PAGE);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");

  // Pré-calcul : pour chaque article, trouver les clés des marques qui matchent
  const enriched = useMemo(() => {
    return articles.map((a) => {
      const tagSet = (a.tags || []).map(normalize);
      const matchedKeys: string[] = [];
      for (const brand of brands) {
        const normalizedKeywords = brand.keywords.map(normalize);
        const matches = tagSet.some((tag) =>
          normalizedKeywords.some((kw) => tag === kw || tag.includes(kw))
        );
        if (matches) matchedKeys.push(brand.key);
      }
      const parsed = parsePrice(a.price);
      return { article: a, matchedKeys, ...parsed };
    });
  }, [articles, brands]);

  // Marques disponibles (≥ 1 article)
  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of enriched) {
      for (const key of e.matchedKeys) {
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return brands
      .filter((b) => (counts.get(b.key) || 0) > 0)
      .map((b) => ({ ...b, count: counts.get(b.key) || 0 }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [enriched, brands]);

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
            onChange={(e) => setSelectedBrand(e.target.value)}
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
          onChange={(e) => setSortBy(e.target.value as SortBy)}
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
              const isFree = !!now && /gratuit/i.test(now);
              const showAdAfter = index === 7 || index === 15;
              return (
                <Fragment key={article.slug}>
                  <a href={`/article/${article.slug}`} className={`bpm-card-h bpm-card-h-${article.categoryColor} ${article.expired ? "bpm-card-h-expired" : ""}`}>
                    <div className="bpm-card-h-image">
                      <Image src={article.image} alt={article.imageAlt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 120px, 200px" loading="lazy" />
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
                        <div className="bpm-card-h-price">
                          {now && (
                            <>
                              <span className={`bpm-card-h-price-now ${isFree ? "bpm-card-h-price-free" : ""}`}>{now}</span>
                              {was && <span className="bpm-card-h-price-was">{was}</span>}
                              {savings && <span className="bpm-card-h-chip">{savings}</span>}
                            </>
                          )}
                        </div>
                        <span className={`bpm-card-h-cta bpm-cta-${article.categoryColor}`}>{cta} <ArrowRight size={14} aria-hidden /></span>
                      </div>
                    </div>
                  </a>
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
