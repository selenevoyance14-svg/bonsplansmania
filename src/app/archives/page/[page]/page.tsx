import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArchivedArticles } from "@/lib/articles";
import ArchiveListing, { ARCHIVE_PAGE_SIZE } from "../../ArchiveListing";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const totalPages = Math.ceil(getArchivedArticles().length / ARCHIVE_PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Archives des offres terminées — page ${page}`,
    description: `Anciens bons plans, concours et tests produits publiés sur Bons Plans Mania — page ${page}.`,
    alternates: { canonical: `https://bonsplansmania.fr/archives/page/${page}` },
    robots: { index: false, follow: true },
  };
}

export default async function ArchivePage({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageParam } = await params;
  const currentPage = Number(pageParam);
  const allArticles = getArchivedArticles();
  const totalPages = Math.max(1, Math.ceil(allArticles.length / ARCHIVE_PAGE_SIZE));

  if (!Number.isInteger(currentPage) || currentPage < 2 || currentPage > totalPages) notFound();

  const start = (currentPage - 1) * ARCHIVE_PAGE_SIZE;
  return (
    <ArchiveListing
      articles={allArticles.slice(start, start + ARCHIVE_PAGE_SIZE)}
      currentPage={currentPage}
      totalPages={totalPages}
      totalArticles={allArticles.length}
    />
  );
}
