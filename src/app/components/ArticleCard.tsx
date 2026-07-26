import Image from "next/image";
import {
    Tag, Gift, Trophy, ShoppingBag, Sparkles, Calendar, TreePine,
    FlaskConical, Percent, ArrowRight, type LucideIcon,
} from "lucide-react";
import { parsePrice } from "@/lib/price";
import { DIRECT_DEAL_CATEGORIES, hasDirectMerchantCta, isOfferExpired } from "@/lib/article-commerce";

export type CardCategoryConfig = {
    label: string;
    Icon: LucideIcon;
    color: string;
    cta: string;
    badge?: string;
};

/**
 * Catégories "deal-first" — le CTA de la carte pointe directement vers l'URL affilié
 * (bon plan Amazon, box à commander, code promo à saisir).
 *
 * Les contenus gratuits (concours, test-gratuit) et éditoriaux sont "content-first" :
 * le CTA ouvre l'article pour que la lectrice lise le contenu éditorial avant de sortir.
 */
export const DEAL_FIRST_CATEGORIES = DIRECT_DEAL_CATEGORIES;

export const CATEGORY_CONFIG: Record<string, CardCategoryConfig> = {
    "bon-plan":         { label: "Bon Plan",   Icon: Tag,          color: "bon-plan",         cta: "Voir l'offre" },
    "bon-plan-beaute":  { label: "Bon Plan",   Icon: Tag,          color: "bon-plan",         cta: "Voir l'offre" },
    "test-gratuit":     { label: "Test Gratuit", Icon: Gift,       color: "test-gratuit",     cta: "Voir les détails" },
    "test-avis":        { label: "Test & Avis", Icon: FlaskConical, color: "test-avis",       cta: "Lire le test" },
    "comparatif":       { label: "Comparatif",  Icon: FlaskConical, color: "test-avis",       cta: "Lire le comparatif" },
    "concours":         { label: "Concours",   Icon: Trophy,       color: "concours",         cta: "Voir le concours" },
    "box-beaute":       { label: "Box Beauté", Icon: ShoppingBag,  color: "box-beaute",       cta: "Voir la box" },
    "beaute":           { label: "Beauté",     Icon: Sparkles,     color: "beaute",           cta: "Lire l'article" },
    "selection":        { label: "Beauté",     Icon: Sparkles,     color: "beaute",           cta: "Lire l'article" },
    "calendrier":       { label: "Calendrier", Icon: Calendar,     color: "calendrier",       cta: "Découvrir" },
    "calendrier-avent": { label: "Calendrier de l'Avent", Icon: TreePine, color: "calendrier-avent", cta: "Découvrir" },
    "code-promo":       { label: "Code Promo", Icon: Percent,      color: "code-promo",       cta: "Voir le code", badge: "Code" },
};

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

function formatDate(iso: string): string {
    return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
        day: "numeric", month: "short", timeZone: "Europe/Paris",
    });
}

export default function ArticleCard({
    article,
    priority = false,
}: {
    article: Article;
    priority?: boolean;
}) {
    const cat = CATEGORY_CONFIG[article.meta.category] ?? CATEGORY_CONFIG["bon-plan"];
    const isExpired = isOfferExpired(article.meta);
    const { now, was, savings } = parsePrice(article.meta.price);
    const articleHref = `/article/${article.meta.slug}`;
    const rawAffiliate = article.meta.affiliateUrl;
    // "content-first" (test-avis, comparatif, beaute…) : le footer reste sur l'article même si affiliateUrl existe.
    const hasExternalAffiliate = hasDirectMerchantCta({
        category: article.meta.category,
        affiliateUrl: rawAffiliate,
        expired: isExpired,
        endDate: article.meta.endDate,
    });
    // On ne laisse JAMAIS le vrai lien affilié dans le HTML : /go/<slug> côté Cloudflare Function fait le 302
    const affiliateHref = hasExternalAffiliate ? `/go/${article.meta.slug}` : rawAffiliate;
    const rawImage = article.meta.image ?? "";
    const displayImage = rawImage.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania.png" : rawImage;

    return (
        <article className={`bpm-card bpm-card-${cat.color} ${isExpired ? "bpm-card-expired" : ""}`}>
            <a href={articleHref} className="bpm-card-inner-link">
                <div className="bpm-card-image">
                    <Image
                        src={displayImage}
                        alt={article.meta.imageAlt}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={priority}
                        loading={priority ? undefined : "lazy"}
                    />
                    <span className={`bpm-card-pill bpm-pill-${cat.color}`}>
                        <cat.Icon size={12} aria-hidden /> {cat.label}
                    </span>
                    {savings ? (
                        <span className="bpm-card-discount">{savings}</span>
                    ) : cat.badge ? (
                        <span className={`bpm-card-badge bpm-badge-${cat.color}`}>{cat.badge}</span>
                    ) : null}
                    {isExpired && <span className="bpm-card-expired-badge">Terminé</span>}
                </div>

                <div className="bpm-card-body">
                    <h3 className="bpm-card-title">{article.meta.title}</h3>
                    <p className="bpm-card-excerpt">{article.meta.description}</p>

                    {now && (
                        <div className="bpm-card-price">
                            <span className="bpm-card-price-now">{now}</span>
                            {was && <span className="bpm-card-price-was">{was}</span>}
                        </div>
                    )}
                </div>
            </a>

            {hasExternalAffiliate && !isExpired ? (
                <a
                    href={affiliateHref!}
                    target="_blank"
                    rel="nofollow noopener sponsored"
                    className={`bpm-card-footer bpm-footer-${cat.color}`}
                >
                    <time className="bpm-card-date">{formatDate(article.meta.date)}</time>
                    <span className="bpm-card-cta">
                        {cat.cta} <ArrowRight size={14} aria-hidden />
                    </span>
                </a>
            ) : (
                <a href={articleHref} className={`bpm-card-footer bpm-footer-${cat.color}`}>
                    <time className="bpm-card-date">{formatDate(article.meta.date)}</time>
                    <span className="bpm-card-cta">
                        {cat.cta} <ArrowRight size={14} aria-hidden />
                    </span>
                </a>
            )}
        </article>
    );
}
