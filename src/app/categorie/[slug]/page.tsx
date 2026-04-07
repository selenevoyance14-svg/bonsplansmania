import { getArticlesByCategory } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, Tag, Gift, Trophy, ShoppingBag, Calendar, TreePine, FlaskConical, Ticket, Sparkles, type LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";

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


export async function generateStaticParams() {
  return ["bon-plan", "test-gratuit", "test-avis", "test-produit", "concours", "box-beaute", "beaute", "selection", "calendrier", "calendrier-avent", "code-promo"].map((slug) => ({ slug }));
}

interface PageProps { params: Promise<{ slug: string }>; }

const categoryConfig: Record<string, { label: string; Icon: LucideIcon; desc: string; seoTitle: string; seoDesc: string; color: string }> = {
  "bon-plan":         { label: "Bons Plans",             Icon: Tag,          desc: "Toutes les réductions, promos et codes exclusifs", seoTitle: "Bons Plans Beauté & Promos : Codes Promo, Réductions — Bons Plans Mania", seoDesc: "Tous les bons plans beauté, codes promo et réductions du moment. Économisez sur vos marques préférées : Sephora, Yves Rocher, Amazon, Lookfantastic et plus. Mis à jour quotidiennement.", color: "bon-plan" },
  "test-produit":     { label: "Tests Produits",           Icon: FlaskConical, desc: "Tests gratuits et avis détaillés sur les produits beauté", seoTitle: "Tests Produits : Tests Gratuits et Avis Beauté — Bons Plans Mania", seoDesc: "Tous nos tests produits : tests gratuits (Trustt, ConsoBaby, Amazon) et avis détaillés sur les cosmétiques, soins et maquillage. Mis à jour quotidiennement.", color: "test-gratuit" },
  "test-gratuit":     { label: "Tests Gratuits",          Icon: Gift,         desc: "Des produits à tester gratuitement avant tout le monde", seoTitle: "Tests Gratuits : Produits Beauté à Tester Gratuitement — Bons Plans Mania", seoDesc: "Recevez des produits beauté gratuits à tester chez vous. Missions Trustt, ConsoBaby, TikTok et plus. Inscrivez-vous et testez les nouveautés avant tout le monde.", color: "test-gratuit" },
  "test-avis":        { label: "Tests & Avis",            Icon: FlaskConical, desc: "Nos tests et avis détaillés sur les produits beauté", seoTitle: "Tests & Avis Produits Beauté : Avis et Comparatifs — Bons Plans Mania", seoDesc: "Tests et avis détaillés sur les produits beauté. Comparatifs, notes et recommandations pour bien choisir vos cosmétiques, soins et maquillage.", color: "test-avis" },
  "concours":         { label: "Concours",                Icon: Trophy,       desc: "Les meilleurs jeux concours avec des lots à gagner", seoTitle: "Concours & Jeux : Gagnez des Lots Beauté, Tech, Voyages — Bons Plans Mania", seoDesc: "Les meilleurs jeux concours gratuits avec des lots à gagner : coffrets beauté, voyages, high-tech, bons d'achat. Participez en quelques clics, mis à jour chaque jour.", color: "concours" },
  "box-beaute":       { label: "Box Beauté",              Icon: ShoppingBag,  desc: "Tests et avis complets sur les box beauté du moment", seoTitle: "Box Beauté : Avis, Comparatifs et Bons Plans — Bons Plans Mania", seoDesc: "Découvrez les meilleures box beauté du moment : Blissim, Biotyfull Box, Lookfantastic. Avis détaillés, comparatifs et codes promo pour économiser sur vos abonnements.", color: "box-beaute" },
  "beaute":           { label: "Beauté",                   Icon: Sparkles,     desc: "Tutos, guides, comparatifs et avis sur les produits beauté", seoTitle: "Conseils Beauté : Tutos, Tests et Guides — Bons Plans Mania", seoDesc: "Tutos maquillage, comparatifs soins, guides skincare et avis produits. Tous nos conseils beauté pour bien choisir vos cosmétiques.", color: "beaute" },
  "selection":        { label: "Sélection",               Icon: Calendar,     desc: "Nos coups de cœur et sélections du moment", seoTitle: "Sélections Beauté : Nos Coups de Cœur — Bons Plans Mania", seoDesc: "Nos sélections et coups de cœur beauté du moment. Les meilleurs produits testés et approuvés par la rédaction, à prix doux.", color: "selection" },
  "calendrier":       { label: "Calendrier",              Icon: Calendar,     desc: "Calendriers beauté et coffrets à saisir", seoTitle: "Calendriers Beauté : Offres et Coffrets — Bons Plans Mania", seoDesc: "Calendriers beauté et coffrets à saisir. Les meilleures offres sur les calendriers des grandes marques beauté.", color: "calendrier" },
  "calendrier-avent": { label: "Calendrier de l'Avent",  Icon: TreePine,     desc: "Les meilleurs calendriers de l'avent beauté du moment", seoTitle: "Calendriers de l'Avent Beauté : Comparatif et Bons Plans — Bons Plans Mania", seoDesc: "Les meilleurs calendriers de l'Avent beauté : Sephora, Dior, Rituals, Lookfantastic. Comparatif complet, prix, contenu et codes promo pour les acheter moins cher.", color: "calendrier-avent" },
  "code-promo":       { label: "Codes Promo",             Icon: Ticket,       desc: "Les meilleurs codes promo et réductions du moment", seoTitle: "Codes Promo Beauté & Mode : Réductions Exclusives — Bons Plans Mania", seoDesc: "Tous les codes promo beauté et mode du moment : Blanche Porte, Dr Pierre Ricaud, Sephora, Yves Rocher. Codes vérifiés et mis à jour régulièrement.", color: "code-promo" },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryConfig[slug];
  if (!cat) return {};
  return {
    title: cat.seoTitle,
    description: cat.seoDesc,
    alternates: { canonical: `https://bonsplansmania.fr/categorie/${slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = categoryConfig[slug];
  if (!cat) notFound();

  // Page parente test-produit : regroupe test-gratuit + test-avis
  const articles = slug === "test-produit"
    ? [...getArticlesByCategory("test-gratuit"), ...getArticlesByCategory("test-avis")]
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
            {slug === "test-produit" && (
              <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
                <a href="/categorie/test-gratuit" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "24px", background: "#FFF7ED", color: "#C2410C", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", border: "1.5px solid #C2410C22" }}>
                  <Gift size={14} /> Tests Gratuits
                </a>
                <a href="/categorie/test-avis" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "24px", background: "#EDE9FE", color: "#6D28D9", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", border: "1.5px solid #6D28D922" }}>
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
