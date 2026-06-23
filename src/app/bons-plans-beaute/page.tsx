import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { BEAUTE_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { ChevronRight, Sparkles, Gift, Heart } from "lucide-react";
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
  title: "Coin Beauté : Bons Plans Beauté 2026 — Bons Plans Mania",
  description: "Tous les bons plans beauté du moment : soin visage, maquillage, parfum, cheveux. Sephora, Marionnaud, L'Oréal, Garnier, Caudalie, Vichy, Kerargan, Biotyfull, Glowria. Box beauté et tests gratuits.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-beaute" },
};

// Filtre ultra-strict : tag exact OU slug contient token dédié beauté.
// Jamais de match sur title/description (trop permissif).
const EXACT_TAGS = new Set([
  // Génériques
  "beaute", "beauté", "parfum", "maquillage", "cosmetique", "cosmétique",
  "soin-visage", "soin-corps", "soin-cheveux", "cheveux", "masque-visage",
  "skincare", "skincare-fridge", "anti-age", "anti-rides", "anti-acne",
  // Box beauté
  "box-beaute", "biotyfull", "glowria", "blissim", "prescription-lab",
  // Enseignes
  "sephora", "marionnaud", "nocibe", "yves-rocher", "parfumerie",
  // Marques (top 30)
  "loreal", "l-oreal", "loreal-paris", "garnier", "nivea", "revlon",
  "maybelline", "kerargan", "caudalie", "vichy", "la-roche-posay",
  "weleda", "embryolisse", "biodance", "evoluderm", "boho-green",
  "luxeol", "hairlust", "twentydc", "twenty-dc", "lancome", "clarins",
  "estee-lauder", "yves-saint-laurent", "dior", "chanel", "guerlain",
  "armani", "hugo-boss", "paco-rabanne",
  // Cheveux / kératine
  "keratine", "argan", "shampoing", "apres-shampoing", "masque-cheveux",
  // Autres
  "rouge-a-levres", "fond-de-teint", "fards-paupieres", "mascara",
  "vernis-ongles", "soin-solaire", "auto-bronzant",
  // Soin homme : tondeuses cheveux/barbe/corps, rasoirs, épilateurs
  "soin-homme", "barbe", "tondeuse-cheveux", "tondeuse-barbe", "tondeuse-corps",
  "tondeuse-multifonction", "rasoir", "rasoir-electrique", "epilateur",
  "huile-barbe", "soin-barbe",
  // Marques soin/épilation/coiffure
  "babyliss", "babylissmen", "remington", "andis", "wahl", "moser",
  "philips-series", "braun", "braun-silk-epil", "gillette", "gillette-labs",
  "rowenta-beauty", "foreo",
]);

const SLUG_TOKENS = [
  "-beaute-", "beaute-", "-beauty-", "parfum-", "-parfum-", "maquillage-",
  "cosmetique-", "soin-visage", "soin-corps", "soin-cheveux", "masque-visage",
  "biotyfull", "glowria", "blissim", "prescription-lab", "sephora", "marionnaud",
  "nocibe", "yves-rocher", "kerargan", "biodance", "evoluderm", "boho-green",
  "luxeol", "hairlust", "twentydc", "twenty-dc", "caudalie", "weleda",
  "vichy", "la-roche-posay", "embryolisse",
  "loreal-", "garnier-", "-nivea-", "nivea-", "revlon-", "maybelline-", "lancome-",
  "clarins", "yves-saint-laurent", "dior-parfum", "chanel-parfum", "guerlain",
  "armani-parfum", "hugo-boss-parfum", "paco-rabanne",
  "keratine", "argan-", "shampoing", "apres-shampoing", "masque-cheveux",
  "rouge-a-levres", "fond-de-teint", "fards-paupieres", "mascara-",
  "vernis-ongles", "auto-bronzant",
  // Soin homme : tondeuses, rasoirs, épilateurs
  "-tondeuse-cheveux-", "-tondeuse-barbe-", "-tondeuse-corps-",
  "-tondeuse-multifonction-", "-rasoir-", "-rasoir-electrique-",
  "-epilateur-", "-huile-barbe-", "-soin-barbe-", "-soin-homme-",
  "babyliss-", "remington-", "andis-", "wahl-",
  "braun-silk-epil-", "braun-series-", "gillette-",
  "philips-series-", "foreo-",
];

// Slugs à exclure : Coin bébé / puériculture (ne doivent pas remonter en Beauté
// même si jamais un tag "soin-" matchait par erreur)
const BEBE_TOKENS = [
  "bebe-", "-bebe-", "puericulture", "biberon", "poussette", "siege-auto",
  "babyboom", "babycook", "babyphone", "tire-lait", "chaise-haute", "cododo",
  "berceau", "tetine", "landau", "mamadvisor", "consobaby",
];

function isBeauteArticle(meta: { slug?: string; tags?: string[] }) {
  const slug = (meta.slug || "").toLowerCase();
  // Exclure d'office si c'est un article bébé/puériculture
  if (BEBE_TOKENS.some((k) => slug.includes(k))) return false;

  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansBeautePage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isBeauteArticle(a.meta));

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
      tags: a.meta.tags,
      price: a.meta.price,
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
          name: "Coin Beauté — Bons Plans Beauté 2026",
          description: "Tous les bons plans, promos, box, tests gratuits et avis sur les produits de beauté, soin et maquillage.",
          url: "https://bonsplansmania.fr/bons-plans-beaute",
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
            { "@type": "ListItem", position: 2, name: "Coin Beauté" },
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
              <span><Sparkles size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Coin Beauté</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Sparkles size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#ec4899" }} />
              Coin Beauté : Bons Plans Beauté 2026
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Toutes les <strong>promos, box, tests gratuits et avis beauté</strong> du moment : soin visage, maquillage, parfum, cheveux. Sephora, Marionnaud, L&apos;Oréal, Garnier, Caudalie, Vichy, La Roche-Posay, Kerargan, Hairlust… Et les <strong>box mensuelles</strong> (Biotyfull, Glowria, Blissim, Prescription Lab) pour découvrir de nouvelles marques. {articles.length} articles.
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
              Où trouver les meilleurs bons plans beauté ?
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              La <strong>beauté</strong> est l&apos;un des budgets les plus élastiques : entre les soins visage, le maquillage, le parfum et les cheveux, on peut vite y laisser plusieurs centaines d&apos;euros par mois. La bonne nouvelle : de nombreux <strong>bons plans récurrents</strong> existent sur Amazon (top des ventes L&apos;Oréal, Garnier, Maybelline), chez Sephora et Marionnaud (jours VIP), via les <strong>box beauté mensuelles</strong> (Biotyfull, Glowria, Blissim) et sur des sites comme ParfumsMoinsChers (parfums luxe -75 %).
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>Les marques à suivre en beauté</h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>L&apos;Oréal Paris</strong> : Revitalift Filler, Elnett, Elsève, Casting Crème</li>
              <li><strong>Garnier</strong> : Bio, Ultra Doux, Ambre Solaire, Skin Active</li>
              <li><strong>Caudalie</strong> : Vinopure, Premier Cru, Resveratrol Lift</li>
              <li><strong>Vichy &amp; La Roche-Posay</strong> : soin visage dermo-cosmétique</li>
              <li><strong>Kerargan</strong> : kératine + argan, soin cheveux abîmés</li>
              <li><strong>Hairlust</strong> : compléments alimentaires beauté cheveux</li>
              <li><strong>Twenty DC</strong> : collagène marin, Cosmetic Food</li>
              <li><strong>Léa Nature</strong> : Boho Green, So&apos;Bio Étic, Florame, Jonzac</li>
              <li><strong>Weleda &amp; Embryolisse</strong> : soin naturel français iconique</li>
              <li><strong>BIODANCE</strong> : sheet masks K-beauty hydrogel</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Gift size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Box beauté mensuelles : la stratégie maligne
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Pour <strong>~ 15-30 € par mois</strong>, les box beauté permettent de recevoir <strong>5 à 10 produits</strong> (souvent en formats généreux) d&apos;une valeur 3 à 5× supérieure au prix payé. <strong>Biotyfull Box</strong> reste la référence française la plus complète. <strong>Glowria</strong> mise sur le luxe accessible. <strong>Blissim</strong> change chaque mois. <strong>Prescription Lab</strong> propose des box thématiques exigeantes. Toutes accessibles sans engagement.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Gift size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Tests gratuits beauté à saisir
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Plusieurs plateformes proposent régulièrement des <strong>produits beauté à tester gratuitement</strong> : Sampleo, Trnd, Beauty Trial, Le Club Léa Nature, testerdesproduits.fr. Tu reçois le produit chez toi en échange d&apos;un avis sincère. C&apos;est un excellent moyen de découvrir des marques bio et indépendantes (Hairlust, Cattier, Algologie, Ixage…) sans débourser un centime.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans beauté ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans beauté seront bientôt disponibles.
              </p>
            ) : (
              <BrandFilter articles={cards} brands={BEAUTE_BRANDS} />
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
