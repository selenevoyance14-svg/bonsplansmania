import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import AlertPreview from "./AlertPreview";

export const metadata = {
  title: "Aperçu des alertes | Bons Plans Mania",
  robots: { index: false, follow: false },
};

export default function AlertePreviewPage() {
  const articles = getAllArticles().slice(0, 120).map((article) => ({
    slug: article.meta.slug,
    title: article.meta.title,
    description: article.meta.description,
    category: article.meta.category,
    tags: article.meta.tags,
    image: article.meta.image,
  }));

  return (
    <>
      <Header activePage="/alerte-preview" />
      <AlertPreview articles={articles} />
    </>
  );
}
