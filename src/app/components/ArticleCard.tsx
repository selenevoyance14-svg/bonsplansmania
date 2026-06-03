import Image from "next/image";
import {
    Tag, Gift, Trophy, ShoppingBag, Sparkles, Calendar, TreePine,
    FlaskConical, Percent, ArrowRight, type LucideIcon,
} from "lucide-react";

export type CardCategoryConfig = {
    label: string;
    Icon: LucideIcon;
    color: string;
    cta: string;
    badge?: string;
};

export const CATEGORY_CONFIG: Record<string, CardCategoryConfig> = {
    "bon-plan":         { label: "Bon Plan",   Icon: Tag,          color: "bon-plan",         cta: "Voir l'offre" },
    "bon-plan-beaute":  { label: "Bon Plan",   Icon: Tag,          color: "bon-plan",         cta: "Voir l'offre" },
    "test-gratuit":     { label: "Test Gratuit", Icon: Gift,       color: "test-gratuit",     cta: "Postuler" },
    "test-avis":        { label: "Test & Avis", Icon: FlaskConical, color: "test-avis",       cta: "Lire le test" },
    "concours":         { label: "Concours",   Icon: Trophy,       color: "concours",         cta: "Participer" },
    "box-beaute":       { label: "Box Beauté", Icon: ShoppingBag,  color: "box-beaute",       cta: "Voir la box",  badge: "Box" },
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
    };
};

/**
 * Parse a price string. Returns { now, was, savings } when both prices
 * present, or { now } if only one. Recognises "X au lieu de Y".
 */
function parsePrice(raw?: string): { now?: string; was?: string; savings?: string } {
    if (!raw) return {};
    const m = raw.match(/^(.+?)\s*au lieu de\s*(.+?)$/i);
    if (m) {
        const now = m[1].trim();
        const was = m[2].trim();
        const nowNum = parseFloat(now.replace(/[^\d,.]/g, "").replace(",", "."));
        const wasNum = parseFloat(was.replace(/[^\d,.]/g, "").replace(",", "."));
        let savings: string | undefined;
        if (Number.isFinite(nowNum) && Number.isFinite(wasNum) && wasNum > nowNum) {
            const pct = Math.round(((wasNum - nowNum) / wasNum) * 100);
            savings = `−${pct}%`;
        }
        return { now, was, savings };
    }
    return { now: raw.trim() };
}

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
    const isExpired = article.meta.expired === true;
    const { now, was, savings } = parsePrice(article.meta.price);

    return (
        <a
            href={`/article/${article.meta.slug}`}
            className={`bpm-card bpm-card-${cat.color} ${isExpired ? "bpm-card-expired" : ""}`}
        >
            <div className="bpm-card-image">
                <Image
                    src={article.meta.image}
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

            <div className={`bpm-card-footer bpm-footer-${cat.color}`}>
                <time className="bpm-card-date">{formatDate(article.meta.date)}</time>
                <span className="bpm-card-cta">
                    {cat.cta} <ArrowRight size={14} aria-hidden />
                </span>
            </div>
        </a>
    );
}
