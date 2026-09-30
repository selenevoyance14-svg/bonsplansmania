"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORY_CONFIG } from "./ArticleCard";
import { parsePrice } from "@/lib/price";
import { hasDirectMerchantCta, isOfferExpired } from "@/lib/article-commerce";
import { formatCardTitle } from "@/lib/display-title";
import ArticleDateLabel from "@/app/components/ArticleDateLabel";

type Article = {
    meta: {
        slug: string;
        title: string;
        description: string;
        date: string;
        updated?: string;
        category: string;
        image: string;
        imageAlt: string;
        price?: string;
        prix_origine?: string;
        expired?: boolean;
        endDate?: string;
        affiliateUrl?: string;
    };
};

export default function ArticleCardHorizontal({
    article,
    priority = false,
}: {
    article: Article;
    priority?: boolean;
}) {
    const cat = CATEGORY_CONFIG[article.meta.category] ?? CATEGORY_CONFIG["bon-plan"];
    const isExpired = isOfferExpired(article.meta);
    const { now, was, savings: savingsPct, savingsEur } = parsePrice(article.meta.price);
    const originalPrice = article.meta.prix_origine || was;
    const isFree = !!now && /gratuit/i.test(now);
    // "content-first" (concours, test-gratuit, test-avis, comparatif, beaute…) :
    // le CTA reste sur l'article, pas d'ouverture affiliée.
    const hasExternalAffiliate = hasDirectMerchantCta({
        category: article.meta.category,
        affiliateUrl: article.meta.affiliateUrl,
        expired: isExpired,
        endDate: article.meta.endDate,
    });
    const affiliateHref = hasExternalAffiliate ? `/go/${article.meta.slug}` : undefined;
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
                    style={{ objectFit: "contain", padding: "8px" }}
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
                    <ArticleDateLabel className="bpm-card-h-date" date={article.meta.date} updated={article.meta.updated} />
                </div>

                <h3 className="bpm-card-h-title">{formatCardTitle(article.meta.title)}</h3>
                <p className="bpm-card-h-excerpt">{article.meta.description}</p>

                <div className="bpm-card-h-footer">
                    <div className="bpm-card-h-price">
                        {now && (
                            <>
                                <span className={`bpm-card-h-price-now ${isFree ? "bpm-card-h-price-free" : ""}`}>{now}</span>
                                {originalPrice && <del className="bpm-card-h-price-was">{originalPrice}</del>}
                                {savingsEur && <span className="bpm-card-h-chip">{savingsEur}</span>}
                            </>
                        )}
                    </div>
                    {hasExternalAffiliate ? (
                        <a
                            href={affiliateHref!}
                            target="_blank"
                            rel="nofollow noopener sponsored"
                            className={`bpm-card-h-cta bpm-cta-${cat.color}`}
                            aria-label={`${cat.cta} — ${article.meta.title}`}
                        >
                            {cat.cta} <ArrowRight size={14} aria-hidden />
                        </a>
                    ) : (
                        <a
                            href={`/article/${article.meta.slug}`}
                            className={`bpm-card-h-cta bpm-cta-${cat.color}`}
                            aria-label={`${cat.cta} — ${article.meta.title}`}
                        >
                            {cat.cta} <ArrowRight size={14} aria-hidden />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
