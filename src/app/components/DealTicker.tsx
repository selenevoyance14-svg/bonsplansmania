type Article = {
    meta: {
        slug: string;
        title: string;
        seoTitle?: string;
    };
};

const MAX_LEN = 60;

function shorten(raw: string): string {
    const cleaned = raw.split(/\s+[—–-]\s+/)[0].trim();
    if (cleaned.length <= MAX_LEN) return cleaned;
    return cleaned.slice(0, MAX_LEN).replace(/\s+\S*$/, "") + "…";
}

export default function DealTicker({ articles }: { articles: Article[] }) {
    const items = articles.slice(0, 20);
    if (items.length === 0) return null;
    const loop = [...items, ...items];

    return (
        <div className="bpm-ticker" aria-label="Derniers bons plans">
            <div className="bpm-ticker-track">
                {loop.map((article, i) => {
                    const label = shorten(article.meta.seoTitle || article.meta.title);
                    return (
                        <a
                            key={`${article.meta.slug}-${i}`}
                            href={`/article/${article.meta.slug}`}
                            className="bpm-ticker-item"
                        >
                            {label}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
