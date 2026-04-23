import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, ShoppingBag, Sparkles, Percent } from "lucide-react";
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
  title: "Les Meilleures Box Beauté 2026 : Comparatif, Avis et Codes Promo — Bons Plans Mania",
  description: "Comparatif 2026 des meilleures box beauté : Biotyfull Box, Blissim, Glowria, Lookfantastic, L'Arôma Box. Avis, prix, codes promo et offres découverte. Mis à jour chaque mois.",
  alternates: { canonical: "https://bonsplansmania.fr/meilleures-box-beaute" },
};

export default async function MeilleuresBoxBeautePage() {
  const all = getAllArticles();

  // Strict : catégorie box-beaute OU slug/tag qui mentionne explicitement une box (pas de match sur le titre, trop permissif)
  const slugTokens = ["biotyfull-box", "blissim-box", "glowria-box", "box-beaute", "aromabox", "laromabox", "lookfantastic-beauty-box", "my-little-box", "kookie-box", "prescription-lab", "box-decouverte-beaute"];
  const exactTags = new Set(["box-beaute", "box-beauté", "biotyfull-box", "blissim", "glowria", "lookfantastic-beauty-box", "aromabox", "laromabox", "my-little-box", "prescription-lab", "kookie-box", "beauty-box"]);
  const articles = all.filter((a) => {
    if (a.meta.category === "box-beaute") return true;
    const slug = (a.meta.slug || "").toLowerCase();
    const tags = (a.meta.tags || []).map((t) => t.toLowerCase());
    if (slugTokens.some((k) => slug.includes(k))) return true;
    if (tags.some((t) => exactTags.has(t))) return true;
    return false;
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
          name: "Les Meilleures Box Beauté 2026",
          description: "Comparatif et avis des meilleures box beauté : Biotyfull Box, Blissim, Glowria, Lookfantastic, L'Arôma Box.",
          url: "https://bonsplansmania.fr/meilleures-box-beaute",
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
            { "@type": "ListItem", position: 2, name: "Meilleures Box Beauté" },
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
              <span><ShoppingBag size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Meilleures Box Beauté</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <ShoppingBag size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#db2777" }} />
              Les Meilleures Box Beauté 2026 : Comparatif et Avis
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Tu hésites entre <strong>Biotyfull Box, Blissim, Glowria, Lookfantastic ou L&apos;Arôma Box</strong> ? On a testé toutes les box beauté du marché français pour t&apos;aider à choisir la plus adaptée à ton profil et à ton budget. {articles.length} avis et bons plans à jour.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <Sparkles size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Pourquoi s&apos;abonner à une box beauté ?
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Une <strong>box beauté</strong>, c&apos;est une sélection mensuelle de <strong>5 à 8 produits</strong> (miniatures ou format vente) livrée chez toi entre 15 et 30€/mois. Tu découvres de nouvelles marques avant qu&apos;elles ne deviennent virales, tu testes des routines complètes à petit prix, et tu reçois une <strong>valeur souvent supérieure à 100€</strong> pour quelques euros.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>Notre classement des box beauté 2026</h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Les box que l&apos;on recommande selon ton profil :
            </p>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Biotyfull Box</strong> (≈19,90€/mois) : LA référence bio française avec produits format vente. Parfaite pour celles qui veulent du naturel et du made in France. <a href="/article/biotyfull-box-du-jamais-vu-8-box-prix-1-foreo-offerte-avril-2026" style={{ color: "#db2777", fontWeight: 600 }}>Voir l&apos;offre DU JAMAIS VU</a></li>
              <li><strong>Blissim</strong> (≈15€/mois) : la box généraliste à prix doux, idéale pour les débutantes en beauté</li>
              <li><strong>Glowria</strong> : la box skincare premium pour les peaux exigeantes</li>
              <li><strong>Lookfantastic</strong> : box internationale avec beaucoup de marques UK et US</li>
              <li><strong>L&apos;Arôma Box</strong> (≈19,90€/mois) : aromathérapie et bien-être naturel. <a href="/article/laromabox-promo-10-euros-premiere-box-mars-2026" style={{ color: "#db2777", fontWeight: 600 }}>-10€ sur la 1ère box</a></li>
              <li><strong>Beauté Privée</strong> : ventes privées beauté sans engagement mensuel</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Percent size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Les offres découverte et codes promo actuels
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              La plupart des box proposent une <strong>offre spéciale sur la 1ère box</strong> (entre -10€ et -50%). On met à jour cette page régulièrement avec les meilleurs codes promo disponibles. Pense aussi à combiner le cashback <strong>iGraal</strong> (2,5% pour les nouveaux clients) pour optimiser tes économies.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous nos avis et bons plans box beauté
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les avis box beauté seront bientôt disponibles.
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
