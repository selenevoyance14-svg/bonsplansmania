import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, Sparkles, Flower2, FlaskConical } from "lucide-react";
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
  title: "Tests Beauté Skincare & Maquillage 2026 : Avis, Guides et Tests Gratuits — Bons Plans Mania",
  description: "Nos tests et avis skincare et maquillage : soins visage, anti-âge, anti-cernes, fond de teint, mascara, K-beauty. Guides complets et tests gratuits à saisir.",
  alternates: { canonical: "https://bonsplansmania.fr/tests-beaute-skincare" },
};

export default async function TestsBeauteSkincarePage() {
  const all = getAllArticles();
  const beautyCats = ["test-avis", "test-gratuit", "beaute", "box-beaute", "selection"];
  const beautyKeywords = [
    "skincare", "maquillage", "creme", "crème", "serum", "sérum", "soin",
    "visage", "contour-yeux", "anti-age", "anti-âge", "anti-ride",
    "anti-cerne", "fond-de-teint", "mascara", "rouge-a-levres", "rouge à lèvres",
    "blush", "teint", "correcteur", "illuminateur", "parfum",
    "k-beauty", "coreen", "coréen", "yesstyle", "erborian",
    "cosmetique", "cosmétique", "clean-beauty", "vegan beaute", "bio",
    "hydratation", "nettoyant", "lotion", "exfoliant", "masque visage",
    "cheveux", "shampoing", "shampooing", "conditioner", "coloration",
    "maybelline", "nyx", "loreal", "cerave", "la roche-posay", "bioderma",
    "nuxe", "avene", "avène", "uriage", "neutrogena", "sephora", "yves rocher",
  ];

  const articles = all.filter((a) => {
    if (beautyCats.includes(a.meta.category)) return true;
    const tags = (a.meta.tags || []).map((t) => t.toLowerCase());
    const title = (a.meta.title || "").toLowerCase();
    const desc = (a.meta.description || "").toLowerCase();
    return beautyKeywords.some((k) => tags.some((t) => t.includes(k)) || title.includes(k) || desc.includes(k));
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
          name: "Tests Beauté Skincare & Maquillage 2026",
          description: "Tous nos tests, avis, guides et tests gratuits sur les produits skincare et maquillage.",
          url: "https://bonsplansmania.fr/tests-beaute-skincare",
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
            { "@type": "ListItem", position: 2, name: "Tests Beauté Skincare & Maquillage" },
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
              <span><Sparkles size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Tests Beauté Skincare & Maquillage</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Sparkles size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#db2777" }} />
              Tests Beauté Skincare & Maquillage 2026
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Tous nos <strong>tests, guides et avis beauté</strong> sur les soins visage, le maquillage, l&apos;anti-âge, la K-beauty et les marques incontournables. Plus de <strong>tests gratuits</strong> pour recevoir des produits à tester chez toi. {articles.length} articles mis à jour régulièrement.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <Flower2 size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Notre approche des tests beauté
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              On teste les produits beauté <strong>dans la vraie vie</strong> — pas juste une photo devant un miroir. Chaque avis reflète un usage réel sur plusieurs jours ou semaines, avec photos, retours honnêtes et comparaisons avec des produits équivalents. L&apos;objectif : t&apos;aider à choisir <strong>les vraies pépites</strong> sans te faire piéger par le marketing.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>Nos guides les plus complets</h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><a href="/article/guide-anti-cernes-meilleurs-regard-frais-lumineux-2026" style={{ color: "#db2777", fontWeight: 600 }}>Guide anti-cernes 2026</a> : Pomponne, Maybelline Fit Me, Glow Not Dry, Erborian Super BB</li>
              <li><a href="/article/guide-creme-solaire-hydratante-visage-protection-optimale-2026" style={{ color: "#db2777", fontWeight: 600 }}>Guide crème solaire hydratante visage</a> : Avène, Bioderma, Nuxe, La Roche-Posay</li>
              <li><a href="/article/guide-fond-de-teint-effet-naturel-magnifaik-pour-celles-qui-n-aiment-pas-se-maquiller-2026" style={{ color: "#db2777", fontWeight: 600 }}>Quel fond de teint choisir quand on n&apos;aime pas se maquiller ?</a></li>
              <li><a href="/article/guide-comment-cacher-cernes-sans-effet-platre-methode-magnifaik-2026" style={{ color: "#db2777", fontWeight: 600 }}>Comment cacher les cernes sans effet plâtre ?</a></li>
              <li><a href="/article/maquillage-peau-mature-7-conseils-resultat-naturel-raffine-2026" style={{ color: "#db2777", fontWeight: 600 }}>Maquillage peau mature : 7 conseils pour un résultat naturel</a></li>
              <li><a href="/article/guide-huile-essentielle-lavande-fine-bienfaits-utilisations-2026" style={{ color: "#db2777", fontWeight: 600 }}>Guide huile essentielle lavande fine</a></li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <FlaskConical size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Les tests gratuits beauté du moment
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Plusieurs plateformes recrutent des ambassadrices pour tester <strong>gratuitement</strong> les nouveaux produits beauté : Trustt, Mamadvisor, Free Cosmetic Testing, Babyboom, programme Sunstar GUM. Tu reçois les produits à domicile en échange d&apos;un avis sincère — souvent publié sur Instagram ou sur la plateforme. Un excellent moyen de découvrir des marques avant leur lancement grand public.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous nos tests et avis beauté ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les tests beauté seront bientôt disponibles.
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
