import { getArticlesByTag } from "@/lib/articles";
import Header from "@/app/components/Header";
import Image from "next/image";
import type { Metadata } from "next";
import { Clock, ChevronRight, Tag } from "lucide-react";
import { notFound } from "next/navigation";


interface PageProps { params: Promise<{ slug: string }>; }

// Mapping slug → nom d'affichage
const BRAND_NAMES: Record<string, string> = {
  "nyx": "NYX Professional Makeup",
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
  "vichy": "Vichy",
  "rimmel": "Rimmel",
  "catrice": "Catrice",
  "essence": "Essence",
  "nivea": "Nivea",
  "pantene": "Pantene",
  "ogx": "OGX",
  "glowria": "Glowria",
  "prescription-lab": "Prescription Lab",
  "biotyfull": "Biotyfull Box",
  "blissim": "Blissim",
  "my-little-box": "My Little Box",
  "lookfantastic": "Lookfantastic",
  "igraal": "iGraal",
  "ebuyclub": "eBuyClub",
  "poulpeo": "Poulpeo",
  "swagbucks": "Swagbucks",
  "amazon": "Amazon",
  "sephora": "Sephora",
  "yves-rocher": "Yves Rocher",
  "nailmatic": "Nailmatic",
  "garancia": "Garancia",
  "sabon": "Sabon",
};

export function generateStaticParams() {
  return Object.keys(BRAND_NAMES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = BRAND_NAMES[slug] || slug;
  return {
    title: `${name} — Bons Plans & Articles | BonsPlansMania`,
    description: `Tous les bons plans, tests produits et avis sur ${name}. Retrouvez les meilleures offres ${name} sur BonsPlansMania.`,
    alternates: { canonical: `https://bonsplansmania.fr/marque/${slug}` },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const articles = getArticlesByTag(slug);
  const name = BRAND_NAMES[slug] || slug.replace(/-/g, " ");

  if (articles.length === 0) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: name,
          description: `Tous les bons plans, tests produits et avis sur ${name}.`,
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
            { "@type": "ListItem", position: 2, name: "Marques", item: "https://bonsplansmania.fr/#marques" },
            { "@type": "ListItem", position: 3, name: name },
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
              <a href="/#marques">Marques</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>{name}</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Tag size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />{name}
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              {articles.length} article{articles.length > 1 ? "s" : ""} sur {name}
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="articles-grid">
              {articles.map((article) => (
                <a key={article.meta.slug} href={`/article/${article.meta.slug}`} className="card" style={{ textDecoration: "none" }}>
                  <div style={{ position: "relative", height: "190px", overflow: "hidden" }}>
                    <Image src={article.meta.image} alt={article.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                  </div>
                  <div className="card-body">
                    <div style={{ marginBottom: "10px" }}>
                      <time style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                        {new Date(article.meta.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" })}
                      </time>
                    </div>
                    <h2 className="card-title">{article.meta.title}</h2>
                    <p className="card-excerpt">{article.meta.description}</p>
                  </div>
                  <div className="card-footer">
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {article.meta.readingTime}</span>
                    <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.82rem" }}>Lire →</span>
                  </div>
                </a>
              ))}
            </div>
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
