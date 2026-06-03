"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
  /** Stable slug colour key, e.g. "bon-plan" / "test-gratuit" */
  categoryColor: string;
  readingTime: string;
  expired?: boolean;
  /** Optional price, e.g. "149,99€" or "13€ au lieu de 987€" */
  price?: string;
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

function parseAmount(text: string): number | undefined {
  const cleaned = text.replace(/\s+/g, "");
  const m = cleaned.match(/(\d+(?:[.,]\d+)?)\s*€/);
  if (m) {
    const n = parseFloat(m[1].replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }
  const m2 = cleaned.match(/(\d+(?:[.,]\d+)?)/);
  if (m2) {
    const n = parseFloat(m2[1].replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function parsePrice(raw?: string): { now?: string; was?: string; savings?: string } {
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

    if (explicitPct !== undefined) {
      return { now, was, savings: `−${explicitPct}%` };
    }

    const nowNum = parseAmount(now);
    const wasNum = parseAmount(was);
    let savings: string | undefined;
    if (
      Number.isFinite(nowNum) &&
      Number.isFinite(wasNum) &&
      wasNum! > nowNum! &&
      nowNum! > 0
    ) {
      const pct = Math.round(((wasNum! - nowNum!) / wasNum!) * 100);
      if (pct > 0 && pct < 95) {
        savings = `−${pct}%`;
      }
    }
    return { now, was, savings };
  }

  if (explicitPct !== undefined) {
    return { now: raw.trim(), savings: `−${explicitPct}%` };
  }
  return { now: raw.trim() };
}

export default function LoadMoreGrid({ articles }: { articles: ArticleListItem[] }) {
  const [visible, setVisible] = useState(PER_PAGE);
  const shown = articles.slice(0, visible);
  const hasMore = visible < articles.length;

  return (
    <>
      <div className="articles-grid">
        {shown.map((article, index) => {
          const cta = CTA_BY_COLOR[article.categoryColor] ?? "Lire l'article";
          const badge = BADGE_BY_COLOR[article.categoryColor];
          const { now, was, savings } = parsePrice(article.price);
          // Pub intercalée après les positions 7 et 15 (toutes les 8 cartes)
          // gridColumn '1 / -1' = la pub prend toute la largeur de la grille
          const showAdAfter = index === 7 || index === 15;
          return (
            <Fragment key={article.slug}>
              <a
                href={`/article/${article.slug}`}
                className={`bpm-card bpm-card-${article.categoryColor} ${article.expired ? "bpm-card-expired" : ""}`}
              >
                <div className="bpm-card-image">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <span className={`bpm-card-pill bpm-pill-${article.categoryColor}`}>
                    {article.categoryLabel}
                  </span>
                  {savings ? (
                    <span className="bpm-card-discount">{savings}</span>
                  ) : badge ? (
                    <span className={`bpm-card-badge bpm-badge-${article.categoryColor}`}>{badge}</span>
                  ) : null}
                  {article.expired && <span className="bpm-card-expired-badge">Terminé</span>}
                </div>

                <div className="bpm-card-body">
                  <h2 className="bpm-card-title">{article.title}</h2>
                  <p className="bpm-card-excerpt">{article.description}</p>
                  {now && (
                    <div className="bpm-card-price">
                      <span className="bpm-card-price-now">{now}</span>
                      {was && <span className="bpm-card-price-was">{was}</span>}
                    </div>
                  )}
                </div>

                <div className={`bpm-card-footer bpm-footer-${article.categoryColor}`}>
                  <time className="bpm-card-date">
                    {new Date(article.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" })}
                  </time>
                  <span className="bpm-card-cta">
                    {cta} <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </a>
              {showAdAfter && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <AdBlock format={index === 7 ? "in-article" : "display"} />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => setVisible((v) => v + PER_PAGE)}
            className="btn btn-primary"
            style={{ cursor: "pointer" }}
          >
            Voir plus d&apos;articles ({articles.length - visible} restants)
          </button>
        </div>
      )}
    </>
  );
}
