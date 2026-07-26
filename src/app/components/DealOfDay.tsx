import Image from "next/image";
import { Zap, ArrowRight } from "lucide-react";
import { CATEGORY_CONFIG } from "@/app/components/ArticleCard";
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
    };
};

function formatDate(iso: string): string {
    return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris",
    });
}

export default function DealOfDay({ article }: { article: Article }) {
    const cat = CATEGORY_CONFIG[article.meta.category] ?? CATEGORY_CONFIG["bon-plan"];
    const { now, was, savings } = parsePrice(article.meta.price);

    return (
        <section className="container" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
            <div className="bpm-deal-header">
                <Zap size={18} aria-hidden />
                <span>Deal du jour</span>
            </div>
            <a
                href={`/article/${article.meta.slug}`}
                className={`bpm-deal bpm-deal-${cat.color}`}
            >
                <div className="bpm-deal-image">
                    <Image
                        src={article.meta.image}
                        alt={article.meta.imageAlt}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                    <span className={`bpm-card-pill bpm-pill-${cat.color}`}>
                        <cat.Icon size={12} aria-hidden /> {cat.label}
                    </span>
                    {savings && <span className="bpm-deal-discount">{savings}</span>}
                </div>

                <div className="bpm-deal-body">
                    <h3 className="bpm-deal-title">{article.meta.title}</h3>
                    <p className="bpm-deal-excerpt">{article.meta.description}</p>

                    {now && (
                        <div className="bpm-deal-price">
                            <span className="bpm-deal-price-now">{now}</span>
                            {was && <span className="bpm-deal-price-was">{was}</span>}
                        </div>
                    )}

                    <div className="bpm-deal-footer">
                        <time className="bpm-deal-date">{formatDate(article.meta.date)}</time>
                        <span className={`bpm-deal-cta bpm-footer-${cat.color}`}>
                            {cat.cta} <ArrowRight size={16} aria-hidden />
                        </span>
                    </div>
                </div>
            </a>
        </section>
    );
}
