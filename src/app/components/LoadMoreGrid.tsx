"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";
import { parsePrice } from "@/lib/price";

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
  /** True si l'article se termine dans les 7 prochains jours */
  expiresSoon?: boolean;
  /** Date de fin de l'offre (YYYY-MM-DD), utilisée pour le badge urgence */
  endDate?: string;
  /** Optional price, e.g. "149,99€" or "13€ au lieu de 987€" */
  price?: string;
  /** Optional affiliate URL — when set, the CTA points directly to the merchant */
  affiliateUrl?: string;
}

const PER_PAGE = 24;

const CTA_BY_COLOR: Record<string, string> = {
  "bon-plan": "Voir l'offre",
  "bon-plan-beaute": "Voir l'offre",
  "test-gratuit": "Postuler",
  "test-avis": "Lire le test",
  "comparatif": "Lire le comparatif",
  "concours": "Participer",
  "box-beaute": "Voir la box",
  "code-promo": "Voir le code",
  "beaute": "Lire l'article",
  "calendrier-avent": "Découvrir",
  "calendrier": "Découvrir",
};

const BADGE_BY_COLOR: Record<string, string> = {
  "code-promo": "Code",
};

export default function LoadMoreGrid({ articles }: { articles: ArticleListItem[] }) {
  const [visible, setVisible] = useState(PER_PAGE);
  const shown = articles.slice(0, visible);
  const hasMore = visible < articles.length;

  return (
    <>
      <div className="bpm-card-h-grid">
        {shown.map((article, index) => {
          const cta = CTA_BY_COLOR[article.categoryColor] ?? "Lire l'article";
          const badge = BADGE_BY_COLOR[article.categoryColor];
          const { now, was, savings } = parsePrice(article.price);
          const isFree = !!now && /gratuit/i.test(now);
          // Pub intercalée après les positions 7 et 15 (toutes les 8 cartes) — inchangé
          const showAdAfter = index === 7 || index === 15;
          const articleHref = `/article/${article.slug}`;
          const hasExternalAffiliate = !!article.affiliateUrl && /^https?:\/\//.test(article.affiliateUrl) && !article.expired;
          return (
            <Fragment key={article.slug}>
              <article
                className={`bpm-card-h bpm-card-h-${article.categoryColor} ${article.expired ? "bpm-card-h-expired" : ""}`}
              >
                <a
                  href={articleHref}
                  className="bpm-card-h-main-link"
                  aria-label={article.title}
                />
                <div className="bpm-card-h-image">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 120px, 200px"
                    loading="lazy"
                  />
                  {savings ? (
                    <span className="bpm-card-h-discount">{savings}</span>
                  ) : badge ? (
                    <span className={`bpm-card-h-badge bpm-badge-${article.categoryColor}`}>{badge}</span>
                  ) : null}
                  {article.expired && <span className="bpm-card-h-expired-badge">Terminé</span>}
                  {!article.expired && article.expiresSoon && (
                    <span className="bpm-card-h-soon-badge">⏰ Bientôt fini</span>
                  )}
                </div>

                <div className="bpm-card-h-body">
                  <div className="bpm-card-h-meta">
                    <span className={`bpm-card-h-pill bpm-pill-${article.categoryColor}`}>
                      {article.categoryLabel}
                    </span>
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
                    {hasExternalAffiliate ? (
                      <a
                        href={article.affiliateUrl!}
                        target="_blank"
                        rel="nofollow noopener sponsored"
                        className={`bpm-card-h-cta bpm-cta-${article.categoryColor}`}
                        aria-label={`${cta} — ${article.title}`}
                      >
                        {cta} <ArrowRight size={14} aria-hidden />
                      </a>
                    ) : (
                      <span className={`bpm-card-h-cta bpm-cta-${article.categoryColor}`}>
                        {cta} <ArrowRight size={14} aria-hidden />
                      </span>
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
