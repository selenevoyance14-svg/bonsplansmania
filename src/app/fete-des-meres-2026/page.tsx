import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, Heart, Gift, Sparkles } from "lucide-react";
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

export const metadata: Metadata = {
  title: "Fête des Mères 2026 : Idées Cadeaux, Coffrets & Bons Plans — Bons Plans Mania",
  description: "Sélection complète de cadeaux pour la Fête des Mères 2026 (dimanche 7 juin) : coffrets beauté, bijoux, bougies, box, codes promo et idées made in France. Mis à jour quotidiennement.",
  alternates: { canonical: "https://bonsplansmania.fr/fete-des-meres-2026" },
};

function filterFeteDesMeres(): { tag: string; count: number }[] {
  return [];
}
// Placeholder for TS

export default async function FeteDesMeres2026Page() {
  const all = getAllArticles();
  const keywords = [
    "fête-des-mères", "fete-des-meres", "fete des meres", "fête des mères",
    "maman", "cadeau", "cadeaux", "fete-mere", "fête-mère",
  ];

  const articles = all.filter((a) => {
    const tags = (a.meta.tags || []).map((t) => t.toLowerCase());
    const title = (a.meta.title || "").toLowerCase();
    const desc = (a.meta.description || "").toLowerCase();
    return keywords.some((k) => tags.some((t) => t.includes(k)) || title.includes(k) || desc.includes(k));
  });

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
          name: "Fête des Mères 2026 — Cadeaux et Bons Plans",
          description: "Idées cadeaux, coffrets beauté et bons plans pour la Fête des Mères 2026 (dimanche 7 juin).",
          url: "https://bonsplansmania.fr/fete-des-meres-2026",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 20).map((a, i) => ({
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
            { "@type": "ListItem", position: 2, name: "Fête des Mères 2026" },
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
              <span><Heart size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Fête des Mères 2026</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Heart size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#e11d48" }} />
              Fête des Mères 2026 : les meilleurs cadeaux et bons plans
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              La <strong>Fête des Mères 2026</strong> aura lieu le <strong>dimanche 7 juin</strong>. Voici notre sélection d&apos;idées cadeaux testées, de coffrets beauté, de box, de bijoux et de bons plans pour gâter ta maman sans te ruiner. {articles.length} article{articles.length > 1 ? "s" : ""} à jour.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <Gift size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Comment bien choisir son cadeau de Fête des Mères ?
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Pour la <strong>Fête des Mères 2026</strong>, la règle d&apos;or : faire plaisir <strong>sans surprendre désagréablement</strong>. Commande 2 à 3 semaines avant le 7 juin pour éviter le rush des livraisons, et privilégie les produits <strong>personnalisés, made in France ou éco-conçus</strong> — les mamans sont de plus en plus sensibles à ce type de cadeaux authentiques.
            </p>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              <strong>Idées cadeaux selon la personnalité</strong> :
            </p>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Maman cocooning</strong> : coffret bougie + sel de bain + tisane (25-40€)</li>
              <li><strong>Maman élégante</strong> : bijou délicat, parfum made in France (30-80€)</li>
              <li><strong>Maman créative</strong> : kit DIY, carnet, 52 citations positives (15-35€)</li>
              <li><strong>Maman beauté</strong> : box beauté, coffrets Nuxe, Clarins, Yves Rocher (20-60€)</li>
              <li><strong>Maman gourmande</strong> : coffret thé, pâtisserie artisanale, vin (25-50€)</li>
              <li><strong>Maman sportive</strong> : équipement outdoor, vêtement technique, montre (40-120€)</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Sparkles size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Nos coups de cœur Fête des Mères
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Nos sélections éditoriales les plus récentes (remises en ligne à l&apos;approche du 7 juin) : coffrets beauté à moins de 30€, bijoux personnalisés, bougies parfumées maison DIY, et toutes les promos des marques partenaires. Le code <strong>5SITE5</strong> chez <a href="/article/mieux-que-des-fleurs-fete-des-meres-2026-cadeaux-code-promo-5-pourcent" style={{ color: "#e11d48", fontWeight: 600 }}>Mieux Que Des Fleurs</a> te donne -5% supplémentaires.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les articles Fête des Mères sont bientôt disponibles.
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
