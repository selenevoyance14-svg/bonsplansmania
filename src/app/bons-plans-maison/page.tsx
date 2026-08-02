import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { MAISON_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { ChevronRight, Home, ChefHat, Wind } from "lucide-react";
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
  title: "Coin Maison : Bons Plans Maison & Cuisine — Bons Plans Mania",
  description: "Tous les bons plans maison et cuisine du moment : aspirateurs, robots, airfryers, machines à café, ventilateurs, climatiseurs, purificateurs d'air, électroménager. Ninja, Tefal, De'Longhi, Philips, Ecovacs.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-maison" },
};

const EXACT_TAGS = new Set([
  // Aspirateurs / robots
  "aspirateur", "aspirateur-balai", "aspirateur-laveur", "aspirateur-sans-fil",
  "aspirateur-robot", "robot-aspirateur", "robot-laveur", "shampouineuse",
  // Cuisine - airfryer
  "airfryer", "friteuse-sans-huile", "friteuse",
  // Cuisine - café
  "machine-cafe", "cafetiere", "cafetiere-filtre", "broyeur-grain", "expresso",
  // Cuisine - autres
  "blender", "mixeur", "mixeur-plongeant", "sorbetiere", "extracteur-de-jus", "slow-juicer",
  "batterie-cuisine", "casserole", "poele", "faitout", "cocotte",
  "robot-cuiseur", "robot-cuisine", "robot-cuiseur-vapeur",
  "machine-pain", "machine-pates", "yaourtiere", "machine-granite", "machine-glace",
  // Ventilation / climatisation / canicule
  "ventilateur", "ventilateur-tour", "ventilateur-plafond", "ventilateur-circulateur",
  "ventilateur-nebuliseur", "brumisateur",
  "climatiseur", "climatiseur-mobile", "climatiseur-portable", "climatisation",
  "purificateur-air", "purificateur-eau",
  "humidificateur", "deshumidificateur",
  // Gros électroménager
  "lave-linge", "seche-linge", "lave-vaisselle", "refrigerateur", "congelateur",
  // Maison entretien
  "nettoyeur", "nettoyeur-sols", "nettoyeur-vapeur",
  "fer-repasser", "centrale-vapeur",
  // Linge & déco
  "linge-de-maison", "drap", "couette", "oreiller", "decoration",
  // Gammes exclusivement maison (les marques multi-univers comme Dyson,
  // Philips ou Samsung ne suffisent jamais seules à classer un article).
  "ninja-foodi", "ninja-creami", "ninja-slushi", "ninja-crispi",
  "tefal-ingenio", "tefal-duetto", "deebot-t50",
  "hydrofast", "matrix-i9", "matrix-s9",
]);

const SLUG_TOKENS = [
  "-aspirateur-", "-airfryer-", "-friteuse-", "-machine-cafe-", "-cafetiere-",
  "-blender-", "-mixeur-", "-sorbetiere-", "-extracteur-jus-", "-slow-juicer-",
  "-batterie-cuisine-", "-robot-cuiseur-", "-machine-granite-", "-creami-",
  "-ventilateur-", "-climatiseur-", "-brumisateur-", "-nebuliseur-",
  "-purificateur-", "-humidificateur-", "-deshumidificateur-",
  "-shampouineuse-", "-nettoyeur-sols-", "-nettoyeur-vapeur-",
  "-robot-laveur-", "-robot-aspirateur-", "-aspirateur-laveur-",
  "-foodi-", "-creami-", "-slushi-", "-crispi-", "-ingenio-", "-duetto-",
];

const BEBE_TOKENS = [
  "bebe-", "-bebe-", "puericulture", "biberon", "poussette", "siege-auto",
  "couches-", "babymoov", "babyphone", "tetine", "chaise-haute",
];

const EXCLUDED_TAGS_FROM_HERE = new Set(["puericulture", "allaitement", "tire-lait", "biberon", "poussette", "siege-auto", "babyphone", "tetine", "chaise-haute", "porte-bebe", "cosy-bebe", "lit-bebe", "table-a-langer", "couche-bebe", "lait-maternel"]);

const EXCLUDED_CATEGORIES = new Set(["test-gratuit", "test-avis", "concours", "box-beaute"]);

const BEAUTY_TAGS = new Set([
  "beaute", "coiffure", "cheveux", "soin-cheveux", "seche-cheveux",
  "lisseur", "boucleur", "multistyler", "airwrap", "barbe", "soin-barbe",
  "tondeuse-barbe", "tondeuse-cheveux", "rasage", "epilation", "maquillage",
  "soin-visage", "visage", "parfum", "parfum-femme", "parfum-homme",
]);

const BEAUTY_SLUG_TOKENS = [
  "-airwrap-", "-corrale-", "-lisseur-", "-boucleur-", "-seche-cheveux-",
  "-coiffure-", "-cheveux-", "-barbe-", "-rasoir-", "-epilateur-",
  "-maquillage-", "-parfum-", "-soin-visage-", "-soins-visage-",
];

export function isMaisonArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const slug = (meta.slug || "").toLowerCase();
  if (BEBE_TOKENS.some((k) => slug.includes(k))) return false;
  if (BEAUTY_SLUG_TOKENS.some((k) => slug.includes(k))) return false;
  // Exclure jardin / piscine
  if (slug.includes("robot-tondeuse") || slug.includes("robot-piscine") || slug.includes("-piscine-") || slug.includes("-jardin-") || slug.includes("-tondeuse-") || slug.includes("-barbecue-") || slug.includes("-bbq-")) return false;
  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXCLUDED_TAGS_FROM_HERE.has(t))) return false;
  if (tags.some((t) => BEAUTY_TAGS.has(t))) return false;
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansMaisonPage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isMaisonArticle(a.meta));

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
          name: "Coin Maison — Bons Plans Maison & Cuisine",
          description: "Tous les bons plans maison et cuisine : aspirateurs, robots, airfryers, machines à café, ventilateurs, climatiseurs, purificateurs.",
          url: "https://bonsplansmania.fr/bons-plans-maison",
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
            { "@type": "ListItem", position: 2, name: "Coin Maison" },
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
              <span><Home size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Coin Maison</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Home size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#16a34a" }} />
              Coin Maison : Bons Plans Maison & Cuisine
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Tous les <strong>bons plans maison & cuisine</strong> du moment : aspirateurs, robots aspirateurs/laveurs, airfryers, machines à café, sorbetières, batteries de cuisine, ventilateurs, climatiseurs mobiles, purificateurs d&apos;air, électroménager. <strong>Ninja, Tefal, De&apos;Longhi, Philips, Ecovacs, Roborock, Tineco</strong>… {articles.length} articles.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <ChefHat size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Cuisine : les tendances à suivre
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              La cuisine vit une révolution avec l&apos;<strong>airfryer</strong> (Ninja, Tefal, Philips), la <strong>sorbetière maison</strong> (le Ninja CREAMi cartonne) et la <strong>machine à granités</strong> (Ninja SLUSHi parfait pour l&apos;été). Les <strong>machines à café automatiques</strong> avec broyeur (De&apos;Longhi Magnifica) deviennent l&apos;équipement standard. Côté petit électroménager, <strong>Russell Hobbs</strong> et <strong>Bosch</strong> offrent les meilleurs rapports qualité/prix.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              🤖 Robots aspirateurs : l&apos;essentiel à savoir
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Les <strong>robots aspirateurs avec station Omni</strong> (vidage + lavage serpillère automatique) sont devenus le standard. <strong>Ecovacs T50 Omni</strong>, <strong>Roborock QV 35A</strong>, <strong>Narwal Freo S</strong>… Le prix d&apos;entrée a chuté à ~250-300 € pour des modèles très complets. Pour les sols mixtes (parquet + tapis), choisir un modèle avec <strong>serpillère rotative</strong> et <strong>relevable</strong>. Pour les animaux, viser un modèle <strong>ZeroTangle</strong> (anti-cheveux).
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Wind size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Canicule : les solutions
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li>❄️ <strong>Climatiseur mobile 9000 BTU</strong> : ~220-280 € (couvre ~25 m²)</li>
              <li>🌪️ <strong>Ventilateur sur pied / colonne</strong> : 30-80 €</li>
              <li>💧 <strong>Ventilateur nébuliseur</strong> : refroidissement -5 à -7°C, ~70 €</li>
              <li>🌬️ <strong>Ventilateur de plafond</strong> : silencieux, longue durée, ~80-150 €</li>
              <li>🌱 <strong>Purificateur d&apos;air HEPA</strong> : anti-pollen + qualité air, ~150-300 €</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              Les marques à suivre en maison & cuisine
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Ninja</strong> (airfryer Foodi, CREAMi, SLUSHi) — la marque à suivre → <a href="/bons-plans-ninja">voir le Coin Ninja</a></li>
              <li><strong>Tefal</strong> : Ingenio batterie amovible, airfryers</li>
              <li><strong>De&apos;Longhi</strong> : machines café Magnifica</li>
              <li><strong>Philips</strong> : purificateurs d&apos;air, airfryers, batterie de cuisine</li>
              <li><strong>Ecovacs / Roborock / Narwal</strong> : robots aspirateurs premium</li>
              <li><strong>Tineco / Bissell</strong> : aspirateurs laveurs + shampouineuses</li>
              <li><strong>Russell Hobbs / Kenwood / Moulinex</strong> : petit électro accessible</li>
              <li><strong>Voltman / Kesser / Euhomy</strong> : climatiseurs mobiles bon rapport</li>
            </ul>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans maison & cuisine ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans maison & cuisine seront bientôt disponibles.
              </p>
            ) : (
              <BrandFilter articles={cards} brands={MAISON_BRANDS} />
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
