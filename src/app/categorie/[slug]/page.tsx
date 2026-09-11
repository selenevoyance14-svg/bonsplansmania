import { getArticlesByCategory, isEffectivelyExpired, expiresSoon } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import BrandFilter from "@/app/components/BrandFilter";
import { ALL_DEAL_BRANDS, BOX_BEAUTE_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { Archive, ChevronRight, Tag, Gift, Trophy, ShoppingBag, Calendar, TreePine, FlaskConical, Ticket, Sparkles, type LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan":         { label: "Bon Plan",              color: "bon-plan" },
  "bon-plan-beaute":  { label: "Bon Plan",              color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           color: "test-avis" },
  "comparatif":       { label: "Comparatif",             color: "test-avis" },
  "concours":         { label: "Concours",              color: "concours" },
  "box-beaute":       { label: "Box Beauté",            color: "box-beaute" },
  "beaute":           { label: "Beauté",                color: "beaute" },
  "selection":        { label: "Beauté",                color: "beaute" },
  "calendrier-avent": { label: "Calendrier de l'Avent", color: "calendrier-avent" },
  "code-promo":       { label: "Code Promo",            color: "code-promo" },
};


export async function generateStaticParams() {
  return ["bon-plan", "test-gratuit", "test-avis", "test-produit", "comparatif", "beaute", "selection", "concours", "box-beaute", "calendrier", "calendrier-avent", "code-promo"].map((slug) => ({ slug }));
}

interface PageProps { params: Promise<{ slug: string }>; }

const categoryConfig: Record<string, { label: string; Icon: LucideIcon; desc: string; seoTitle: string; seoDesc: string; color: string }> = {
  // seoTitle : raccourcis < 60 chars (suppression du suffixe "— Bons Plans Mania" déjà présent dans le siteName)
  // Cette page rassemble TOUS les bons plans, tous univers confondus (2 900+
  // articles : beauté, bébé, maison, tech, mode, papeterie…). Son seoTitle
  // annonçait « Bons Plans Beauté », ce qui la mettait en concurrence avec
  // /bons-plans-beaute tout en affichant des cahiers et des sacs à dos.
  // Elle se présente désormais pour ce qu'elle est : le sommaire général.
  "bon-plan":         { label: "Bons Plans",             Icon: Tag,          desc: "Toutes les réductions et promos du moment, tous univers confondus", seoTitle: "Tous nos bons plans : beauté, maison, bébé et tech", seoDesc: "Toutes nos réductions et promos du moment, tous univers confondus : beauté, bébé, maison, tech et mode. Chaque offre indique son prix et sa date de vérification.", color: "bon-plan" },
  "test-produit":     { label: "Tests Produits",           Icon: FlaskConical, desc: "Tests produits gratuits et avis détaillés", seoTitle: "Tests produits : tests gratuits et avis détaillés", seoDesc: "Tous nos tests produits : les tests gratuits ouverts (Trustt, Sampleo, ConsoBaby, Blissim) et nos avis détaillés. Beauté, bébé, maison, alimentaire.", color: "test-gratuit" },
  "test-gratuit":     { label: "Tests Gratuits",          Icon: Gift,         desc: "Les campagnes en cours pour candidater à des tests de produits", seoTitle: "Tests produits gratuits : campagnes et candidatures", seoDesc: "Découvrez les campagnes de tests produits : dates limites, profils recherchés, conditions de participation et lien pour candidater gratuitement.", color: "test-gratuit" },
  "test-avis":        { label: "Tests & Avis",            Icon: FlaskConical, desc: "Tests réellement effectués et analyses détaillées de produits", seoTitle: "Tests et avis produits : essais et analyses détaillées", seoDesc: "Découvrez nos tests réellement effectués et nos analyses de produits : utilisation, composition, avantages, limites et conseils avant achat.", color: "test-avis" },
  "comparatif":       { label: "Comparatifs",             Icon: FlaskConical, desc: "Des comparatifs et guides d'achat pour choisir selon tes besoins", seoTitle: "Comparatifs produits et guides d'achat 2026", seoDesc: "Comparez les produits selon leurs caractéristiques, usages, prix constatés, avantages et limites : beauté, maison, bébé, high-tech et loisirs.", color: "test-avis" },
  "concours":         { label: "Concours",                Icon: Trophy,       desc: "Jeux concours, instants gagnants et tirages au sort", seoTitle: "Jeux concours, instants gagnants et tirages au sort", seoDesc: "Tous les jeux concours gratuits du moment : instants gagnants, tirages au sort et concours créatifs. Dates limites, nombre de lots et règlement vérifiés.", color: "concours" },
  "box-beaute":       { label: "Box Beauté",              Icon: ShoppingBag,  desc: "Offres, contenus et conditions des box beauté du moment", seoTitle: "Box beauté 2026 : offres, prix et comparatif", seoDesc: "Comparez les box beauté 2026 : prix datés, contenu, valeur annoncée, abonnement et conditions de résiliation. Offres Glowria, Blissim et Prescription Lab.", color: "box-beaute" },
  "beaute":           { label: "Guides & Tests Beauté",    Icon: Sparkles,     desc: "Tutos, guides, avis et tests sur les produits beauté, soins et bien-être", seoTitle: "Beauté : guides, avis et tests produits", seoDesc: "Tutos maquillage, routines skincare, guides huiles essentielles, tests de marques (Nuxe, Weleda, Clarins, Foreo) et avis produits. Toute la beauté en un seul hub.", color: "beaute" },
  "selection":        { label: "Sélection",               Icon: Calendar,     desc: "Nos coups de cœur et sélections du moment", seoTitle: "Sélections Beauté : Nos Coups de Cœur", seoDesc: "Nos sélections et coups de cœur beauté du moment. Les meilleurs produits testés et approuvés par la rédaction, à prix doux.", color: "selection" },
  "calendrier":       { label: "Calendrier",              Icon: Calendar,     desc: "Calendriers beauté et coffrets à saisir", seoTitle: "Calendriers Beauté : Offres et Coffrets", seoDesc: "Calendriers beauté et coffrets à saisir. Les meilleures offres sur les calendriers des grandes marques beauté.", color: "calendrier" },
  "calendrier-avent": { label: "Calendrier de l'Avent",  Icon: TreePine,     desc: "Les meilleurs calendriers de l'Avent du moment", seoTitle: "Calendriers de l'Avent : comparatif, prix et contenu", seoDesc: "Les meilleurs calendriers de l'Avent : beauté, gourmandise, enfants. Comparatif, prix, contenu détaillé et codes promo pour les acheter moins cher.", color: "calendrier-avent" },
  "code-promo":       { label: "Codes Promo",             Icon: Ticket,       desc: "Les codes promo et réductions du moment, toutes marques", seoTitle: "Codes promo et réductions du moment, toutes marques", seoDesc: "Tous les codes promo du moment, toutes marques et tous univers : beauté, mode, maison, alimentaire. Validité et conditions indiquées sur chaque code.", color: "code-promo" },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryConfig[slug];
  if (!cat) return {};
  return {
    title: cat.seoTitle,
    description: cat.seoDesc,
    alternates: { canonical: `https://bonsplansmania.fr/categorie/${slug}` },
    openGraph: {
      title: cat.seoTitle,
      description: cat.seoDesc,
      url: `https://bonsplansmania.fr/categorie/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: cat.seoTitle,
      description: cat.seoDesc,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = categoryConfig[slug];
  if (!cat) notFound();

  // Pages parentes : elles n'ont pas d'article à elles, elles agrègent leurs
  // sous-catégories. Sans ça, /categorie/calendrier s'affichait « 0 article »
  // alors que calendrier-avent en compte plusieurs (constaté le 02/08/2026).
  const PARENT_CATEGORIES: Record<string, string[]> = {
    "test-produit": ["test-gratuit", "test-avis"],
    "calendrier": ["calendrier-avent"],
  };
  const children = PARENT_CATEGORIES[slug];
  const articles = children
    ? children
        .flatMap((c) => getArticlesByCategory(c))
        .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    : getArticlesByCategory(slug);

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
      expired: isEffectivelyExpired(a.meta),
      expiresSoon: expiresSoon(a.meta),
      endDate: a.meta.endDate,
      featured: a.meta.featured,
      tags: a.meta.tags,
      price: a.meta.price,
      amazonAsin: a.meta.amazonAsin,
      affiliateUrl: a.meta.affiliateUrl,
    };
  });

  // Catégories où les filtres sont utiles (avec prix / marques / remises)
  // Filtres : liste blanche dédiée par catégorie (box-beaute, bon-plan)
  const useBoxFilter = slug === "box-beaute";
  const useBonPlanFilter = slug === "bon-plan";
  // Tri seul (sans dropdown marques) pour faciliter le nettoyage des vieilles entrées
  const useSortOnlyFilter = ["concours", "test-produit", "test-gratuit", "test-avis"].includes(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: cat.label,
          description: cat.desc,
          url: `https://bonsplansmania.fr/categorie/${slug}`,
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
            { "@type": "ListItem", position: 2, name: cat.label },
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
              <span><cat.Icon size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />{cat.label}</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <cat.Icon size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />{cat.label}
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              {cat.desc} — {articles.length} article{articles.length > 1 ? "s" : ""}
            </p>
            {slug === "bon-plan" && (
              <a
                href="/archives/bons-plans"
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginTop: "16px", padding: "10px 18px", borderRadius: "2px", background: "#7F1D1D", color: "white", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}
              >
                <Archive size={15} /> Consulter les bons plans terminés
              </a>
            )}
            {slug === "concours" && (
              <a
                href="/calendriers-de-l-avent-concours-2026"
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginTop: "16px", padding: "10px 18px", borderRadius: "2px", background: "#991B1B", color: "white", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}
              >
                <TreePine size={15} /> Calendriers de l’Avent concours 2026
              </a>
            )}
            {slug === "test-produit" && (
              <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
                <a href="/categorie/test-gratuit" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "2px", background: "#E4EFEA", color: "#1F6D58", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", border: "1px solid #BFD6CC" }}>
                  <Gift size={14} /> Tests Gratuits
                </a>
                <a href="/categorie/test-avis" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "2px", background: "#ECE6F0", color: "#5E416F", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", border: "1px solid #D4C7DB" }}>
                  <FlaskConical size={14} /> Tests & Avis
                </a>
              </div>
            )}
          </div>
        </section>


        <section className="section">
          <div className="container">
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Aucun article dans cette catégorie pour le moment.
              </p>
            ) : useBoxFilter ? (
              <BrandFilter articles={cards} brands={BOX_BEAUTE_BRANDS} />
            ) : useBonPlanFilter ? (
              <BrandFilter articles={cards} brands={ALL_DEAL_BRANDS} sortBrandsBy="alpha" />
            ) : useSortOnlyFilter ? (
              <BrandFilter articles={cards} brands={[]} />
            ) : (
              <LoadMoreGrid articles={cards} />
            )}

            {/* Pagination statique : lien vers les pages paginées pour que Google découvre tous les articles
                (le LoadMoreGrid charge en JS donc les articles 25+ sont invisibles dans le HTML statique) */}
            {articles.length > 24 && (
              <nav aria-label="Pagination" style={{ marginTop: "40px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ padding: "10px 16px", fontWeight: 600 }}>Page 1 sur {Math.ceil(articles.length / 24)}</span>
                <a href={`/categorie/${slug}/page/2`} rel="next" style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border, #e5e7eb)", textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Suivante <ChevronRight size={16} />
                </a>
              </nav>
            )}
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "24px" }}>
          <AdBlock format="in-article" />
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
      <StickyAdMobile />
    </>
  );
}
