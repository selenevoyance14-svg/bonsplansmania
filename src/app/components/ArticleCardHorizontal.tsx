"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORY_CONFIG, DEAL_FIRST_CATEGORIES } from "./ArticleCard";
import { parsePrice } from "@/lib/price";

type Article = {
    meta: {
        slug: string;
        title: string;
        description: string;
        date: string;
        category: string;
        image: string;
        imageAlt: string;
        price?: string;
        expired?: boolean;
        affiliateUrl?: string;
    };
};

function formatRelativeDate(iso: string): string {
    const d = new Date(iso + "T12:00:00");
    const diffMs = Date.now() - d.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffD = Math.floor(diffH / 24);
    if (diffH < 1) return "à l'instant";
    if (diffH < 24) return `il y a ${diffH}h`;
    if (diffD < 7) return `il y a ${diffD}j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });
}

export default function ArticleCardHorizontal({
    article,
    priority = false,
}: {
    article: Article;
    priority?: boolean;
}) {
    const cat = CATEGORY_CONFIG[article.meta.category] ?? CATEGORY_CONFIG["bon-plan"];
    const isExpired = article.meta.expired === true;
    const { now, was, savings: savingsPct, savingsEur } = parsePrice(article.meta.price);
    const isFree = !!now && /gratuit/i.test(now);
    const isDealFirst = DEAL_FIRST_CATEGORIES.has(article.meta.category);
    // "content-first" (test-avis, comparatif, beaute…) : le CTA reste sur l'article, pas d'ouverture affiliée
    const hasExternalAffiliate = isDealFirst && !!article.meta.affiliateUrl && /^https?:\/\//.test(article.meta.affiliateUrl) && !isExpired;
    return (
        <article
            className={`bpm-card-h bpm-card-h-${cat.color} ${isExpired ? "bpm-card-h-expired" : ""}`}
        >
            <a
                href={`/article/${article.meta.slug}`}
                className="bpm-card-h-main-link"
                aria-label={article.meta.title}
            />
            <div className="bpm-card-h-image">
                <Image
                    src={article.meta.image}
                    alt={article.meta.imageAlt}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 120px, 180px"
                    priority={priority}
                    loading={priority ? undefined : "lazy"}
                />
                {savingsPct ? (
                    <span className="bpm-card-h-discount">{savingsPct}</span>
                ) : cat.badge ? (
                    <span className={`bpm-card-h-badge bpm-badge-${cat.color}`}>{cat.badge}</span>
                ) : null}
                {isExpired && <span className="bpm-card-h-expired-badge">Terminé</span>}
            </div>

            <div className="bpm-card-h-body">
                <div className="bpm-card-h-meta">
                    <span className={`bpm-card-h-pill bpm-pill-${cat.color}`}>
                        <cat.Icon size={11} aria-hidden /> {cat.label}
                    </span>
                    <span className="bpm-card-h-sep" aria-hidden>·</span>
                    <time className="bpm-card-h-date">{formatRelativeDate(article.meta.date)}</time>
                </div>

                <h3 className="bpm-card-h-title">{article.meta.title}</h3>
                <p className="bpm-card-h-excerpt">{article.meta.description}</p>

                <div className="bpm-card-h-footer">
                    <div className="bpm-card-h-price">
                        {now && (
                            <>
                                <span className={`bpm-card-h-price-now ${isFree ? "bpm-card-h-price-free" : ""}`}>{now}</span>
                                {was && <span className="bpm-card-h-price-was">{was}</span>}
                                {savingsEur && <span className="bpm-card-h-chip">{savingsEur}</span>}
                            </>
                        )}
                    </div>
                    {hasExternalAffiliate ? (
                        <a
                            href={article.meta.affiliateUrl!}
                            target="_blank"
                            rel="nofollow noopener sponsored"
                            className={`bpm-card-h-cta bpm-cta-${cat.color}`}
                            aria-label={`${cat.cta} — ${article.meta.title}`}
                        >
                            {cat.cta} <ArrowRight size={14} aria-hidden />
                        </a>
                    ) : (
                        <span className={`bpm-card-h-cta bpm-cta-${cat.color}`}>
                            {cat.cta} <ArrowRight size={14} aria-hidden />
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
