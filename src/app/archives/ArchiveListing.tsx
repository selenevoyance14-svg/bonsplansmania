import Image from "next/image";
import Link from "next/link";
import { Archive, ChevronRight, Tags } from "lucide-react";
import Header from "@/app/components/Header";
import type { Article } from "@/lib/articles";
import styles from "./archive.module.css";

export const ARCHIVE_PAGE_SIZE = 24;

function formatDate(value?: string): string {
  if (!value) return "Date de fin non précisée";
  return new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
}

function pageHref(page: number): string {
  return page === 1 ? "/archives" : `/archives/page/${page}`;
}

function visiblePages(currentPage: number, totalPages: number): number[] {
  const pages = new Set([1, totalPages]);
  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page);
  }
  return [...pages].sort((a, b) => a - b);
}

export default function ArchiveListing({
  articles,
  currentPage,
  totalPages,
  totalArticles,
}: {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  totalArticles: number;
}) {
  const pageNumbers = visiblePages(currentPage, totalPages);

  return (
    <>
      <Header />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Fil d’Ariane">
              <Link href="/">Accueil</Link>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Archives</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Archive size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />
              Archives des offres terminées
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "780px" }}>
              Retrouvez {totalArticles.toLocaleString("fr-FR")} anciens bons plans, concours et tests produits. Ces fiches restent accessibles à titre informatif, mais leurs offres ne sont plus valables.
            </p>
            <Link href="/bons-plans-en-cours" className="btn btn-primary" style={{ marginTop: "16px" }}>
              <Tags size={15} /> Voir les offres en cours
            </Link>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <p style={{ margin: "0 0 18px", color: "#6b7280", fontSize: ".86rem" }}>
              Page {currentPage} sur {totalPages}
            </p>
            <div className={styles.grid}>
              {articles.map((article) => (
                <Link key={article.meta.slug} href={`/article/${article.meta.slug}`} className={styles.card}>
                  <span className={styles.imageWrap}>
                    <Image
                      src={article.meta.image}
                      alt={article.meta.imageAlt || article.meta.title}
                      fill
                      sizes="92px"
                      className={styles.image}
                    />
                  </span>
                  <span className={styles.content}>
                    <span className={styles.badge}>TERMINÉ</span>
                    <span className={styles.title}>{article.meta.title}</span>
                    <span className={styles.date}>Fin : {formatDate(article.meta.endDate || article.meta.updated || article.meta.date)}</span>
                  </span>
                </Link>
              ))}
            </div>

            <nav className={styles.pagination} aria-label="Pagination des archives">
              {currentPage > 1 ? (
                <Link href={pageHref(currentPage - 1)} rel="prev">Précédent</Link>
              ) : (
                <span className={styles.disabled} aria-disabled="true">Précédent</span>
              )}

              {pageNumbers.map((page, index) => {
                const previous = pageNumbers[index - 1];
                return (
                  <span key={page} style={{ display: "contents" }}>
                    {previous && page - previous > 1 ? <span aria-hidden="true">…</span> : null}
                    {page === currentPage ? (
                      <span className={styles.current} aria-current="page">{page}</span>
                    ) : (
                      <Link href={pageHref(page)}>{page}</Link>
                    )}
                  </span>
                );
              })}

              {currentPage < totalPages ? (
                <Link href={pageHref(currentPage + 1)} rel="next">Suivant</Link>
              ) : (
                <span className={styles.disabled} aria-disabled="true">Suivant</span>
              )}
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
