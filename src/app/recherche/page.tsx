import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import SearchClient from "./SearchClient";

export const metadata = {
  title: "Rechercher un bon plan | BonsPlansMania",
  description: "Recherchez parmi tous les bons plans, tests gratuits, concours et box beauté de BonsPlansMania.",
};

export default function RecherchePage() {
  const all = getAllArticles();
  const articlesData = all.map((a) => ({
    slug: a.meta.slug,
    title: a.meta.title,
    description: a.meta.description,
    category: a.meta.category,
    tags: a.meta.tags,
    image: a.meta.image,
    imageAlt: a.meta.imageAlt,
    date: a.meta.date,
  }));

  return (
    <>
      <Header activePage="/recherche" />
      <SearchClient articles={articlesData} />
    </>
  );
}
