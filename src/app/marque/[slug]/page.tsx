import { getAllArticles, getArticlesByTag } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import AdBlock from "@/app/components/AdBlock";

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan":         { label: "Bon Plan",              color: "bon-plan" },
  "bon-plan-beaute":  { label: "Bon Plan",              color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           color: "test-avis" },
  "concours":         { label: "Concours",              color: "concours" },
  "box-beaute":       { label: "Box Beauté",            color: "box-beaute" },
  "beaute":           { label: "Beauté",                color: "beaute" },
  "selection":        { label: "Beauté",                color: "beaute" },
  "calendrier-avent": { label: "Calendrier de l'Avent", color: "calendrier-avent" },
  "code-promo":       { label: "Code Promo",            color: "code-promo" },
};

function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Build slug → raw tag map once (first occurrence wins)
function getTagSlugMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const article of getAllArticles()) {
    for (const tag of article.meta.tags || []) {
      const slug = slugifyTag(tag);
      if (slug && !map.has(slug)) map.set(slug, tag);
    }
  }
  return map;
}

// Nicely formatted display name for known brand slugs
const brandDisplayNames: Record<string, string> = {
  "nyx": "NYX",
  "maybelline": "Maybelline",
  "loreal": "L'Oréal",
  "garnier": "Garnier",
  "cerave": "CeraVe",
  "la-roche-posay": "La Roche-Posay",
  "neutrogena": "Neutrogena",
  "kerastase": "Kérastase",
  "moroccanoil": "Moroccanoil",
  "nuxe": "Nuxe",
  "weleda": "Weleda",
  "bioderma": "Bioderma",
  "rimmel": "Rimmel",
  "catrice": "Catrice",
  "nivea": "Nivea",
  "glowria": "Glowria",
  "prescription-lab": "Prescription Lab",
  "biotyfull": "Biotyfull",
  "blissim": "Blissim",
  "igraal": "iGraal",
  "ebuyclub": "eBuyClub",
  "poulpeo": "Poulpeo",
  "sephora": "Sephora",
  "yves-rocher": "Yves Rocher",
  "amazon": "Amazon",
};

function getDisplayName(slug: string, fallbackTag: string): string {
  if (brandDisplayNames[slug]) return brandDisplayNames[slug];
  // Capitalize first letter of each word in the fallback tag
  return fallbackTag
    .split(/[-\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const slugs = Array.from(getTagSlugMap().keys());
  return slugs.map((slug) => ({ slug }));
}

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const map = getTagSlugMap();
  const rawTag = map.get(slug);
  if (!rawTag) return {};
  const display = getDisplayName(slug, rawTag);
  const count = getArticlesByTag(rawTag).length;
  return {
    title: `${display} : ${count} bons plans et promos — Bons Plans Mania`,
    description: `Tous les bons plans, promos et tests produits ${display} du moment : ${count} article${count > 1 ? "s" : ""} mis à jour régulièrement sur Bons Plans Mania.`,
    alternates: { canonical: `https://bonsplansmania.fr/marque/${slug}` },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const map = getTagSlugMap();
  const rawTag = map.get(slug);
  if (!rawTag) notFound();

  const display = getDisplayName(slug, rawTag);
  const articles = getArticlesByTag(rawTag);

  const cards = articles.map((a) => {
    const cl = categoryLabels[a.meta.category];
    return {
      slug: a.meta.slug,
      title: a.meta.title,
      description: a.meta.description,
      date: a.meta.date,
      image: a.meta.image,
      imageAlt: a.meta.imageAlt,
      category: a.meta.category,
      categoryLabel: cl?.label ?? a.meta.category,
      categoryColor: cl?.color ?? a.meta.category,
      readingTime: a.meta.readingTime,
      expired: a.meta.expired,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: display,
          description: `Bons plans, promos et tests produits ${display}`,
          url: `https://bonsplansmania.fr/marque/${slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 10).map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://bonsplansmania.fr/article/${a.meta.slug}`,
              name: a.meta.title,
            })),
          },
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://bonsplansmania.fr" },
            { "@type": "ListItem", position: 2, name: "Marques", item: "https://bonsplansmania.fr" },
            { "@type": "ListItem", position: 3, name: display },
          ],
        }) }}
      />
      <Header />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span><Tag size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />{display}</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Tag size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />{display}
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              Tous les bons plans, promos et tests {display} — {articles.length} article{articles.length > 1 ? "s" : ""}
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section">
          <div className="container">
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Aucun article pour cette marque pour le moment.
              </p>
            ) : (
              <LoadMoreGrid articles={cards} />
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
