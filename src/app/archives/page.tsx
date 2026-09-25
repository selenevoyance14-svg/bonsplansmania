import type { Metadata } from "next";
import { getArchivedArticles } from "@/lib/articles";
import ArchiveListing, { ARCHIVE_PAGE_SIZE } from "./ArchiveListing";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Archives des offres terminées",
  description: "Consultez les anciens bons plans, concours et tests produits publiés sur Bons Plans Mania, classés du plus récent au plus ancien.",
  alternates: { canonical: "https://bonsplansmania.fr/archives" },
};

export default function ArchivesPage() {
  const allArticles = getArchivedArticles();
  const articles = allArticles.slice(0, ARCHIVE_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(allArticles.length / ARCHIVE_PAGE_SIZE));

  const archiveJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Archives des offres terminées",
    description: "Anciens bons plans, concours et tests produits publiés sur Bons Plans Mania.",
    url: "https://bonsplansmania.fr/archives",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allArticles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.meta.title,
        url: `https://bonsplansmania.fr/article/${article.meta.slug}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(archiveJsonLd) }} />
      <ArchiveListing
        articles={articles}
        currentPage={1}
        totalPages={totalPages}
        totalArticles={allArticles.length}
      />
    </>
  );
}
