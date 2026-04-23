import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, Baby, Gift, Heart } from "lucide-react";
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
  title: "Bons Plans Bébé & Enfants 2026 : Puériculture, Promos et Tests Gratuits — Bons Plans Mania",
  description: "Les meilleurs bons plans bébé et enfants : biberons, poussettes, sièges auto, vêtements, jouets, tests gratuits. Économisez sur Philips Avent, MAM, Chicco, Thermobaby.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-bebe" },
};

export default async function BonsPlansBebePage() {
  const all = getAllArticles();
  // Strict : slug OR tag exact (pas de match sur title/description qui polluait massivement).
  const slugTokens = [
    "bebe", "puericulture", "biberon", "tetine", "poussette", "siege-auto", "landau",
    "babycook", "babyphone", "tire-lait", "chaise-haute", "berceau", "cododo", "sophie-la-girafe",
    "babyboom", "mamadvisor", "allaitement", "grossesse", "maternite", "parent-bebe",
    "philips-avent", "thermobaby", "babymoov", "vertbaudet", "babybio", "biolane", "chicco-",
    "babyphone", "kesser", "bebeboutik",
  ];
  const exactTags = new Set([
    "bebe", "puericulture", "biberon", "tetine", "poussette", "siege-auto", "maman",
    "maternite", "allaitement", "grossesse", "babyboom", "enfant", "parent",
    "philips-avent", "mam", "chicco", "thermobaby", "babymoov", "tigex", "vertbaudet",
    "babybio", "biolane", "vulli", "kesser", "sophie-la-girafe",
  ]);

  const articles = all.filter((a) => {
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
          name: "Bons Plans Bébé & Enfants 2026",
          description: "Tous les bons plans, promos et tests gratuits sur la puériculture et les produits bébé.",
          url: "https://bonsplansmania.fr/bons-plans-bebe",
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
            { "@type": "ListItem", position: 2, name: "Bons Plans Bébé" },
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
              <span><Baby size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Bons Plans Bébé</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Baby size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#0ea5e9" }} />
              Bons Plans Bébé & Enfants 2026
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Toutes les <strong>meilleures promos puériculture</strong> : biberons Philips Avent et MAM, poussettes, sièges auto, vêtements Vertbaudet, couches, soins bébé. Et les <strong>tests gratuits</strong> pour recevoir des produits bébé à tester chez toi. {articles.length} articles mis à jour quotidiennement.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <Heart size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Où trouver les meilleurs bons plans bébé ?
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Les <strong>dépenses bébé</strong> peuvent vite s&apos;accumuler : entre le matériel de puériculture, les vêtements qu&apos;il faut renouveler tous les 3 mois, les couches, le lait infantile et les soins… il y a de quoi doubler son budget. La bonne nouvelle : de nombreuses <strong>promos récurrentes</strong> existent sur Amazon, VertBaudet, Babyboom et les ventes privées Bebeboutik.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>Les marques à suivre en puériculture</h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Philips Avent</strong> : biberons Natural Response, tétines et tire-lait</li>
              <li><strong>MAM</strong> : biberons Easy Active et sucettes ergonomiques</li>
              <li><strong>Chicco</strong> : berceaux Next2Me cododo, poussettes, accessoires</li>
              <li><strong>Thermobaby</strong> : rehausseurs, réducteurs WC, mobilier bébé</li>
              <li><strong>Biolane</strong> : soins bébé bio et naturels</li>
              <li><strong>Babybio / HIPP</strong> : alimentation bio pour bébé</li>
              <li><strong>Vulli</strong> : Sophie la Girafe et jouets de dentition</li>
              <li><strong>KESSER</strong> : poussettes combinées et remorques vélo</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Gift size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Les tests gratuits bébé à saisir
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Plusieurs plateformes proposent régulièrement des <strong>produits bébé à tester gratuitement</strong> : Mamadvisor (Magicmaman), ConsoBaby, Babyboom, Sampleo. Tu reçois le produit à domicile en échange d&apos;un avis sincère. C&apos;est un excellent moyen de découvrir de nouvelles marques sans investir.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans bébé ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans bébé seront bientôt disponibles.
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
