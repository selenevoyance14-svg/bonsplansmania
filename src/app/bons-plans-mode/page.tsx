import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { MODE_BRANDS, MODE_PRODUCT_TYPES } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { ChevronRight, Shirt } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan":         { label: "Bon Plan",              color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           color: "test-avis" },
  "concours":         { label: "Concours",              color: "concours" },
  "box-beaute":       { label: "Box Beauté",            color: "box-beaute" },
  "beaute":           { label: "Beauté",                color: "beaute" },
  "selection":        { label: "Sélection",             color: "selection" },
  "calendrier-avent": { label: "Calendrier de l'Avent", color: "calendrier-avent" },
  "code-promo":       { label: "Code Promo",            color: "code-promo" },
};

export const metadata: Metadata = {
  title: "Bons plans mode, chaussures & accessoires — Bons Plans Mania",
  description: "Tous les bons plans mode du moment : chaussures, baskets, sneakers, sandales, montres, sacs, lunettes, vêtements. Nike, Adidas, Lacoste, Levi's, Calvin Klein, Tommy Hilfiger, Eastpak, Ray-Ban.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-mode" },
};

const EXACT_TAGS = new Set([
  // Génériques
  "mode", "mode-femme", "mode-homme", "mode-enfant", "vetement", "vetements",
  // Chaussures
  "chaussures", "chaussure", "baskets", "sneakers", "sandales", "bottes", "bottines",
  "tongs", "espadrilles", "mocassins", "derbies", "boots", "tennis",
  "skechers",
  // Montres analogiques (PAS connectees → c'est tech)
  "montre", "montre-homme", "montre-femme", "montre-quartz", "montre-analogique",
  "montre-automatique", "montre-mecanique", "montre-acier",
  // Sacs / bagagerie
  "sac-a-dos", "sac-a-main", "sac-cabine", "sac-voyage",
  "valise", "valise-cabine", "bagage", "bagagerie",
  // Lunettes
  "lunettes", "lunettes-soleil", "lunettes-vue", "ray-ban", "rayban",
  // Vetements
  "t-shirt", "tshirt", "polo", "jean", "jeans", "pull", "sweat", "hoodie",
  "robe", "doudoune", "blouson", "manteau", "veste", "pantalon", "short",
  "costume", "tailleur", "jupe", "blouse", "chemise",
  // Maillots / sous-vetements
  "maillot-bain", "maillot-de-bain", "boxer", "sous-vetements", "lingerie",
  // Accessoires
  "casquette", "chapeau", "ceinture", "portefeuille", "echarpe", "gants",
  // Bijoux
  "bracelet", "bracelet-cuir", "bague", "collier", "boucles-oreilles", "bijou", "bijoux",
]);

const SLUG_TOKENS = [
  // Chaussures
  "-chaussures-", "-baskets-", "-sneakers-", "-sandales-", "-bottes-", "-bottines-",
  "-mocassins-", "-derbies-", "-tongs-", "-boots-",
  // Montres (analogiques uniquement — voir EXCLUDED_SLUGS)
  "-montre-", "-montre-quartz-", "-montre-homme-", "-montre-femme-",
  "-montre-automatique-", "-montre-mecanique-",
  // Sacs / bagagerie
  "-sac-a-dos-", "-sac-a-main-", "-sac-cabine-", "-sac-voyage-", "-sac-isotherme-",
  "-valise-", "-valise-cabine-", "-bagage-", "-bagagerie-",
  // Lunettes
  "-lunettes-soleil-", "-lunettes-", "-ray-ban-", "-rayban-",
  // Vetements
  "-t-shirt-", "-tshirt-", "-polo-", "-jean-", "-jeans-", "-pull-",
  "-doudoune-", "-blouson-", "-manteau-", "-veste-",
  "-robe-", "-jupe-", "-short-", "-pantalon-",
  // Maillots
  "-maillot-bain-", "-maillot-de-bain-", "-boxer-",
  // Accessoires
  "-casquette-", "-bracelet-", "-bague-", "-collier-", "-ceinture-",
];

// Exclusions : tout ce qui doit rester ailleurs
// - bebe → coin bébé
// - montre-connectee / smartwatch / bracelet-activite → coin tech
// - parfum → coin beauté
// - collier-gps → animaux
const EXCLUDED_TOKENS = [
  "bebe-", "-bebe-", "puericulture", "biberon", "poussette", "siege-auto",
  "couches-", "babymoov", "babyphone", "tetine", "chaise-haute",
  "montre-connectee", "smartwatch", "bracelet-activite", "bracelet-connecte",
  "fitbit", "garmin", "pixel-watch", "apple-watch", "galaxy-watch",
  "-parfum-", "parfum-", "eau-de-parfum", "eau-de-toilette",
  "parfums-", "-parfums-", "-beaute-", "beaute-", "-cosmetique-",
  "-maquillage-", "-soin-visage-", "-soins-visage-", "-soin-cheveux-",
  "-glaciere-", "glaciere-", "-sac-isotherme-", "-lunch-box-",
  "-incontinence-", "incontinence-", "-change-ceinture-",
  "collier-gps", "gps-chien", "gps-chat", "tracker-sante",
  // Jouets - un "-robe-" dans un slug Barbie/poupée = jouet, pas mode
  "-barbie-", "barbie-", "-poupee-", "poupee-", "-playmobil-", "playmobil-",
  "-figurine-", "figurine-", "-peluche-", "peluche-",
  "-pat-patrouille-", "pat-patrouille-", "-unicorn-academy-", "unicorn-academy-",
  "-disney-princesse-", "disney-princesse-",
];

const EXCLUDED_TAGS_FROM_HERE = new Set(["puericulture", "allaitement", "tire-lait", "biberon", "poussette", "siege-auto", "babyphone", "tetine", "chaise-haute", "porte-bebe", "cosy-bebe", "lit-bebe", "table-a-langer", "couche-bebe", "lait-maternel"]);

const EXCLUDED_CATEGORIES = new Set(["test-gratuit", "test-avis", "concours", "box-beaute"]);

const BEAUTY_TAGS = new Set([
  "beaute", "kit beaute", "cosmetique", "cosmetiques", "maquillage",
  "soin-visage", "soins-visage", "soin-cheveux", "coiffure", "cheveux",
  "parfum", "parfum femme", "parfum homme", "parfum ete", "eau de parfum",
  "eau de toilette", "skincare", "solaire", "protection solaire",
  "incontinence", "parapharmacie", "glaciere", "glaciere-electrique",
  "sac-isotherme", "isotherme", "lunch-bag",
]);

function isModeArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const slug = (meta.slug || "").toLowerCase();
  if (EXCLUDED_TOKENS.some((k) => slug.includes(k))) return false;
  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXCLUDED_TAGS_FROM_HERE.has(t))) return false;
  if (tags.some((t) => BEAUTY_TAGS.has(t))) return false;
  // Exclure aussi par tag les montres connectées / fitness trackers
  if (tags.some((t) => t === "montre-connectee" || t === "smartwatch" || t === "bracelet-activite" || t === "bracelet-connecte")) return false;
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansModePage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isModeArticle(a.meta));

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
          name: "Coin Mode — Bons Plans Mode, Chaussures & Accessoires",
          description: "Tous les bons plans mode : chaussures, baskets, sneakers, sandales, montres analogiques, sacs, lunettes, vêtements.",
          url: "https://bonsplansmania.fr/bons-plans-mode",
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
            { "@type": "ListItem", position: 2, name: "Coin Mode" },
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
              <span><Shirt size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Coin Mode</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Shirt size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#be185d" }} />
              Coin Mode : Bons Plans Mode, Chaussures & Accessoires
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Tous les <strong>bons plans mode</strong> du moment : chaussures, baskets, sneakers, sandales, montres analogiques, sacs, valises, lunettes, vêtements. <strong>Nike, Adidas, Lacoste, Levi&apos;s, Calvin Klein, Tommy Hilfiger, Eastpak, Ray-Ban, Reebok, Asics, Hoka</strong>… {articles.length} articles.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>


        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans mode ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans mode seront bientôt disponibles.
              </p>
            ) : (
              <BrandFilter articles={cards} brands={MODE_BRANDS} productTypes={MODE_PRODUCT_TYPES} />
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
