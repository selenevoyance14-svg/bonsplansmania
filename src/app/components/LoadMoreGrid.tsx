"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

interface ArticleCard {
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
}

const PER_PAGE = 24;

export default function LoadMoreGrid({ articles }: { articles: ArticleCard[] }) {
  const [visible, setVisible] = useState(PER_PAGE);
  const shown = articles.slice(0, visible);
  const hasMore = visible < articles.length;

  return (
    <>
      <div className="articles-grid">
        {shown.map((article) => (
          <a key={article.slug} href={`/article/${article.slug}`} className="card" style={{ textDecoration: "none", ...(article.expired ? { opacity: 0.55, filter: "grayscale(40%)" } : {}) }}>
            {article.expired && (
              <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2, background: "#DC2626", color: "white", padding: "3px 10px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3px" }}>
                Terminé
              </div>
            )}
            <div style={{ position: "relative", height: "190px", overflow: "hidden" }}>
              <Image src={article.image} alt={article.imageAlt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
            </div>
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span className={`card-category card-category-${article.categoryColor}`}>
                  {article.categoryLabel}
                </span>
                <time style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                  {new Date(article.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" })}
                </time>
              </div>
              <h2 className="card-title">{article.title}</h2>
              <p className="card-excerpt">{article.description}</p>
            </div>
            <div className="card-footer">
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {article.readingTime}</span>
              <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.82rem" }}>Lire →</span>
            </div>
          </a>
        ))}
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
