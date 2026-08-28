import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { BEBE_BRANDS } from "@/lib/brand-filters";
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
  title: "Coin Bébé : Bons Plans Puériculture — Bons Plans Mania",
  description: "Les meilleurs bons plans bébé et puériculture : biberons, poussettes, sièges auto, cododo, soins bébé, tests gratuits. Philips Avent, MAM, Chicco, Thermobaby, Biolane.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-bebe" },
};

// Filtre ultra-strict : tag exact OU slug contient token dédié bébé.
// Jamais de match sur title/description (trop permissif, pollue avec maquillage/mode).
const EXACT_TAGS = new Set([
  "bebe", "bébé", "puericulture", "puériculture", "maternite", "maternité", "allaitement", "babyboom",
  "grossesse", "parent-bebe", "bebeboutik", "babybjorn", "babybjörn",
  "beaba", "béaba", "chicco", "maxi-cosi", "momcozy",
  "couche", "couches", "couches-bebe", "couches bébé", "couches-ecologiques",
  "couches écologiques", "culottes-apprentissage", "culottes apprentissage",
  "lingettes-bebe", "lingettes bébé", "lait-infantile", "lait infantile",
]);
const SLUG_TOKENS = [
  "bebe-", "-bebe-", "puericulture", "biberon", "poussette", "siege-auto",
  "babyboom", "babycook", "babyphone", "tire-lait", "chaise-haute", "cododo",
  "landau", "allaitement", "mamadvisor", "bebeboutik", "berceau", "tetine",
  "vertbaudet-bebe", "babybjorn", "baby-bjorn", "beaba-", "chicco-",
  "maxi-cosi-", "momcozy-", "table-langer", "table-a-langer", "rehausseur-chaise",
  "transat-balance", "tour-observation", "couche-", "couches-",
  "culotte-apprentissage", "lingettes-bebe", "lait-infantile",
  "sucette-medicament", "trousse-soin-bebe", "chariot-marche", "draisienne",
];

const EXCLUDED_CATEGORIES = new Set(["test-gratuit", "test-avis", "concours", "box-beaute"]);

function isBebeArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  const slug = (meta.slug || "").toLowerCase();
  if (slug.startsWith("bebe-")) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansBebePage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isBebeArticle(a.meta));

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
      endDate: a.meta.endDate,
      tags: a.meta.tags,
      price: a.meta.price,
      amazonAsin: a.meta.amazonAsin,
      affiliateUrl: a.meta.affiliateUrl,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Coin Bébé — Bons Plans Puériculture",
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
            { "@type": "ListItem", position: 2, name: "Coin Bébé" },
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
              <span><Baby size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Coin Bébé</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Baby size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#0ea5e9" }} />
              Coin Bébé : Bons Plans Puériculture
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Toutes les <strong>promos et tests bébé</strong> du moment : biberons Philips Avent et MAM, poussettes, sièges auto, cododo, soins Biolane, couches, vêtements Vertbaudet, ventes privées Bebeboutik. Et les <strong>tests gratuits</strong> pour recevoir des produits bébé à domicile. {articles.length} articles.
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
              Les <strong>dépenses bébé</strong> peuvent vite s&apos;accumuler : entre le matériel de puériculture, les vêtements à renouveler tous les 3 mois, les couches, le lait infantile et les soins… il y a de quoi doubler son budget. La bonne nouvelle : de nombreuses <strong>promos récurrentes</strong> existent sur Amazon, Vertbaudet, Bebeboutik (ventes privées) et les grandes enseignes (Leclerc, Carrefour).
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>Les marques à suivre en puériculture</h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Philips Avent</strong> : biberons Natural Response, tétines, tire-lait</li>
              <li><strong>MAM</strong> : biberons Easy Active et sucettes ergonomiques</li>
              <li><strong>Chicco</strong> : berceaux Next2Me cododo, poussettes, accessoires</li>
              <li><strong>Thermobaby</strong> : rehausseurs, réducteurs WC, mobilier</li>
              <li><strong>Biolane</strong> : soins bébé bio et naturels</li>
              <li><strong>Babybio / HIPP</strong> : alimentation bio pour bébé</li>
              <li><strong>Vulli</strong> : Sophie la Girafe et jouets de dentition</li>
              <li><strong>Vertbaudet</strong> : vêtements, linge de lit et déco chambre</li>
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
              <BrandFilter articles={cards} brands={BEBE_BRANDS} />
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
