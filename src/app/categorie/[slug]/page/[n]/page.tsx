import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronLeft, type LucideIcon, Tag, FlaskConical, Gift, Trophy, ShoppingBag, Sparkles, TreePine, Calendar, Ticket } from "lucide-react";
import Header from "@/app/components/Header";
import { getArticlesByCategory, isEffectivelyExpired } from "@/lib/articles";

const PER_PAGE = 24;

export const dynamic = "force-static";

export function generateStaticParams() {
  const slugs = ["bon-plan", "test-gratuit", "test-avis", "test-produit", "comparatif", "concours", "box-beaute", "selection", "calendrier", "calendrier-avent", "code-promo"];
  const params: { slug: string; n: string }[] = [];
  for (const slug of slugs) {
    const articles = slug === "test-produit"
      ? [...getArticlesByCategory("test-gratuit"), ...getArticlesByCategory("test-avis")]
      : getArticlesByCategory(slug);
    const totalPages = Math.ceil(articles.length / PER_PAGE);
    // On commence à 2 (la page 1 = /categorie/[slug])
    for (let n = 2; n <= totalPages; n++) {
      params.push({ slug, n: String(n) });
    }
  }
  return params;
}

interface PageProps { params: Promise<{ slug: string; n: string }>; }

const categoryConfig: Record<string, { label: string; Icon: LucideIcon; desc: string; color: string }> = {
  "bon-plan":         { label: "Bons Plans",            Icon: Tag,          desc: "Toutes les réductions, promos et codes exclusifs", color: "bon-plan" },
  "test-produit":     { label: "Tests Produits",        Icon: FlaskConical, desc: "Tests gratuits et avis détaillés sur les produits beauté", color: "test-gratuit" },
  "test-gratuit":     { label: "Tests Gratuits",        Icon: Gift,         desc: "Des produits à tester gratuitement avant tout le monde", color: "test-gratuit" },
  "test-avis":        { label: "Tests & Avis",          Icon: FlaskConical, desc: "Nos tests et avis détaillés sur les produits beauté", color: "test-avis" },
  "comparatif":       { label: "Comparatifs",           Icon: FlaskConical, desc: "Nos comparatifs pour choisir les meilleurs produits au meilleur prix", color: "test-avis" },
  "concours":         { label: "Concours",              Icon: Trophy,       desc: "Les meilleurs jeux concours avec des lots à gagner", color: "concours" },
  "box-beaute":       { label: "Box Beauté",            Icon: ShoppingBag,  desc: "Tests et avis complets sur les box beauté du moment", color: "box-beaute" },
  "beaute":           { label: "Beauté",                Icon: Sparkles,     desc: "Tutos, guides, comparatifs et avis sur les produits beauté", color: "beaute" },
  "selection":        { label: "Sélection",             Icon: Calendar,     desc: "Nos coups de cœur et sélections du moment", color: "selection" },
  "calendrier":       { label: "Calendrier",            Icon: Calendar,     desc: "Calendriers beauté et coffrets à saisir", color: "calendrier" },
  "calendrier-avent": { label: "Calendrier de l'Avent", Icon: TreePine,     desc: "Les meilleurs calendriers de l'avent beauté du moment", color: "calendrier-avent" },
  "code-promo":       { label: "Codes Promo",           Icon: Ticket,       desc: "Les meilleurs codes promo et réductions du moment", color: "code-promo" },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, n } = await params;
  const cat = categoryConfig[slug];
  if (!cat) return {};
  const pageNum = parseInt(n, 10);
  const articles = slug === "test-produit"
    ? [...getArticlesByCategory("test-gratuit"), ...getArticlesByCategory("test-avis")]
    : getArticlesByCategory(slug);
  const totalPages = Math.ceil(articles.length / PER_PAGE);
  if (!Number.isFinite(pageNum) || pageNum < 2 || pageNum > totalPages) return {};

  const title = `${cat.label} — Page ${pageNum} sur ${totalPages}`;
  const description = `${cat.desc}. Page ${pageNum} sur ${totalPages} — ${articles.length} articles au total.`;
  return {
    title,
    description,
    alternates: { canonical: `https://bonsplansmania.fr/categorie/${slug}/page/${pageNum}` },
    // robots noindex sur les pages paginées 2+ : on ne veut pas concurrencer la page principale en SERP
    // mais on garde "follow" pour que Google découvre tous les articles via le maillage
    robots: { index: false, follow: true },
    openGraph: { title, description, url: `https://bonsplansmania.fr/categorie/${slug}/page/${pageNum}`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPaginatedPage({ params }: PageProps) {
  const { slug, n } = await params;
  const cat = categoryConfig[slug];
  if (!cat) notFound();
  const pageNum = parseInt(n, 10);
  const articles = slug === "test-produit"
    ? [...getArticlesByCategory("test-gratuit"), ...getArticlesByCategory("test-avis")]
        .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    : getArticlesByCategory(slug);
  const totalPages = Math.ceil(articles.length / PER_PAGE);
  if (!Number.isFinite(pageNum) || pageNum < 2 || pageNum > totalPages) notFound();

  const start = (pageNum - 1) * PER_PAGE;
  const pageArticles = articles.slice(start, start + PER_PAGE);

  // Liens prev/next pour le head (rel) ET pour la navigation visuelle
  const prevHref = pageNum === 2 ? `/categorie/${slug}` : `/categorie/${slug}/page/${pageNum - 1}`;
  const nextHref = pageNum < totalPages ? `/categorie/${slug}/page/${pageNum + 1}` : null;

  return (
    <>
      {/* rel="prev" / rel="next" pour Google */}
      <link rel="prev" href={`https://bonsplansmania.fr${prevHref}`} />
      {nextHref && <link rel="next" href={`https://bonsplansmania.fr${nextHref}`} />}
      <Header />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <a href={`/categorie/${slug}`}><cat.Icon size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />{cat.label}</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Page {pageNum}</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <cat.Icon size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />{cat.label} — Page {pageNum}
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              Page {pageNum} sur {totalPages} — {articles.length} article{articles.length > 1 ? "s" : ""} au total
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="articles-grid">
              {pageArticles.map((a) => (
                <a key={a.meta.slug} href={`/article/${a.meta.slug}`} className={`bpm-card bpm-card-${cat.color} ${isEffectivelyExpired(a.meta) ? "bpm-card-expired" : ""}`}>
                  <div className="bpm-card-image">
                    <Image src={a.meta.image.toLowerCase().endsWith(".svg") ? "/images/articles/_placeholder-bonsplansmania.png" : a.meta.image} alt={a.meta.imageAlt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                  </div>
                  <div className="bpm-card-body">
                    <h3 className="bpm-card-title">{a.meta.title}</h3>
                    <p className="bpm-card-excerpt">{a.meta.description}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Pagination */}
            <nav aria-label="Pagination" style={{ marginTop: "40px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <a href={prevHref} rel="prev" style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border, #e5e7eb)", textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <ChevronLeft size={16} /> Précédente
              </a>
              <span style={{ padding: "10px 16px", fontWeight: 600 }}>Page {pageNum} sur {totalPages}</span>
              {nextHref ? (
                <a href={nextHref} rel="next" style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border, #e5e7eb)", textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Suivante <ChevronRight size={16} />
                </a>
              ) : (
                <span style={{ padding: "10px 16px", color: "var(--muted-foreground, #9ca3af)" }}>Suivante</span>
              )}
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
