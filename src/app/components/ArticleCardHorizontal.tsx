"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORY_CONFIG } from "./ArticleCard";
import { parsePrice } from "@/lib/price";
import { hasDirectMerchantCta, isOfferExpired } from "@/lib/article-commerce";

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
        endDate?: string;
        affiliateUrl?: string;
    };
};

/**
 * Date absolue, jamais relative.
 *
 * Le frontmatter ne stocke qu'un JOUR (`date: "2026-07-31"`), pas une heure.
 * L'ancien libellé « il y a Xh » devait donc inventer une heure — il prenait
 * midi — et affichait « il y a 9h » à 21 h sur un article publié le soir même.
 * Une précision que la donnée n'a pas. On affiche donc la date, point.
 */
function formatArticleDate(iso: string): string {
    const d = new Date(iso + "T12:00:00");
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        timeZone: "Europe/Paris",
    });
}

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
                    <time className="bpm-card-h-date" dateTime={article.meta.date}>
                        {formatArticleDate(article.meta.date)}
                    </time>
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
