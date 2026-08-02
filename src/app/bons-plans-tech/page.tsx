import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { TECH_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { ChevronRight, Smartphone, Laptop, Headphones } from "lucide-react";
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
  title: "Coin Tech : Bons Plans Tech & High-Tech — Bons Plans Mania",
  description: "Tous les bons plans tech du moment : smartphones, ordinateurs, écouteurs, montres connectées, écrans PC, caméras, liseuses. Apple, Samsung, Google, Xiaomi, Sony, JBL, LG.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-tech" },
};

const EXACT_TAGS = new Set([
  "tech", "high-tech", "smartphone", "smartphone-5g", "telephone",
  "ordinateur", "ordinateur-portable", "laptop", "macbook", "pc-portable", "tablette", "ipad",
  "ecouteurs", "ecouteurs-bluetooth", "casque", "casque-bluetooth", "airpods", "earbuds",
  "montre-connectee", "smartwatch", "pixel-watch", "galaxy-watch", "apple-watch",
  "ecran-pc", "moniteur", "ultrawide",
  "camera", "appareil-photo", "camera-360", "gopro", "insta360",
  "console", "playstation", "xbox", "nintendo", "switch", "nintendo-switch",
  "kindle", "liseuse", "kindle-colorsoft",
  "tv", "television", "ecran",
  "souris", "clavier", "casque-gaming", "gaming",
  "domotique", "maison-connectee", "alexa", "echo-hub", "amazon-echo",
  "apple", "samsung", "google", "xiaomi", "huawei", "oneplus", "sony", "jbl", "bose", "lg",
  "asus", "dell", "hp", "lenovo", "alienware", "microsoft", "razer", "logitech",
  "pixel-10-pro", "pixel-watch-4", "galaxy-s26", "galaxy-buds3-pro", "galaxy-a35",
  "redmi-note-15-pro", "macbook-air", "puce-m4",
]);

const SLUG_TOKENS = [
  "-smartphone-", "-ordinateur-", "-laptop-", "-macbook-", "-tablette-", "-ipad-",
  "-airpods-", "-pixel-", "-galaxy-", "-iphone-", "-ecouteurs-", "-casque-bluetooth-",
  "-montre-connectee-", "-smartwatch-", "-pixel-watch-",
  "-ecran-pc-", "-moniteur-", "-ultrawide-",
  "-camera-", "-insta360-", "-gopro-", "-camera-360-",
  "-nintendo-switch-", "-playstation-", "-xbox-",
  "-kindle-", "-liseuse-",
  "-galaxy-buds-", "-redmi-", "-xiaomi-",
  "-echo-hub-", "-amazon-echo-", "-maison-connectee-",
  "-tablette-", "-laptop-", "-ordinateur-portable-",
];

const BEBE_TOKENS = [
  "bebe-", "-bebe-", "puericulture", "biberon", "poussette", "siege-auto",
];

const EXCLUDED_TAGS_FROM_HERE = new Set(["puericulture", "allaitement", "tire-lait", "biberon", "poussette", "siege-auto", "babyphone", "tetine", "chaise-haute", "porte-bebe", "cosy-bebe", "lit-bebe", "table-a-langer", "couche-bebe", "lait-maternel"]);

const EXCLUDED_CATEGORIES = new Set(["test-gratuit", "test-avis", "concours", "box-beaute"]);

function isTechArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const slug = (meta.slug || "").toLowerCase();
  if (BEBE_TOKENS.some((k) => slug.includes(k))) return false;
  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXCLUDED_TAGS_FROM_HERE.has(t))) return false;
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansTechPage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isTechArticle(a.meta));

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
          name: "Coin Tech — Bons Plans Tech & High-Tech",
          description: "Tous les bons plans tech : smartphones, ordinateurs, écouteurs, montres connectées, écrans PC, caméras, liseuses.",
          url: "https://bonsplansmania.fr/bons-plans-tech",
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
            { "@type": "ListItem", position: 2, name: "Coin Tech" },
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
              <span><Smartphone size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Coin Tech</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Smartphone size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#2563eb" }} />
              Coin Tech : Bons Plans Tech & High-Tech
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Tous les <strong>bons plans tech & high-tech</strong> du moment : smartphones, ordinateurs portables, tablettes, écouteurs Bluetooth, montres connectées, écrans PC, caméras, consoles, liseuses. <strong>Apple, Samsung, Google, Xiaomi, Sony, JBL, LG, Microsoft</strong>… {articles.length} articles.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <Laptop size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Quand acheter ta tech au meilleur prix
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Le marché tech a des <strong>cycles de prix très marqués</strong>. Les meilleures fenêtres : <strong>Prime Days Amazon</strong> (mi-juillet), <strong>Black Friday</strong> (fin novembre), <strong>French Days</strong> (avril + septembre), <strong>soldes d&apos;hiver</strong> (janvier). Les nouveaux modèles sortent souvent en septembre (Apple iPhone, Samsung Galaxy mid-year) et créent automatiquement des baisses sur la génération précédente.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Headphones size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Les marques à suivre en tech
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Apple</strong> : MacBook Air M4, iPad, AirPods 4, Apple Watch</li>
              <li><strong>Samsung</strong> : Galaxy S26, Galaxy Buds3 Pro, Galaxy A35, Galaxy Watch</li>
              <li><strong>Google</strong> : Pixel 10 Pro, Pixel Watch 4, Pixel Buds</li>
              <li><strong>Xiaomi / Redmi</strong> : Redmi Note 15 Pro, Mi Watch</li>
              <li><strong>Sony / JBL / Bose</strong> : casques Bluetooth ANC</li>
              <li><strong>LG / Samsung écrans</strong> : moniteurs ultra-larges, OLED</li>
              <li><strong>Insta360 / GoPro</strong> : caméras 360 et action</li>
              <li><strong>Amazon Kindle</strong> : Kindle Colorsoft, Paperwhite, Scribe</li>
              <li><strong>Nintendo / Sony PlayStation</strong> : consoles & accessoires</li>
              <li><strong>Shokz</strong> : casques conduction osseuse (sport)</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              💡 Conseils pour acheter sa tech
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li>📈 <strong>Vérifie l&apos;historique de prix</strong> (Keepa, CamelCamelCamel) avant tout achat tech</li>
              <li>🆕 <strong>Génération précédente</strong> = souvent 80% des perfs à -30% du prix</li>
              <li>🔌 <strong>Pack avec accessoires</strong> (Galaxy S26 + JBL GO3) = top rapport qualité/prix</li>
              <li>↩️ <strong>30 jours de retour Amazon</strong> = tu testes sans risque</li>
              <li>⚖️ <strong>Garantie constructeur</strong> = même via Amazon, la garantie marque s&apos;applique</li>
            </ul>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans tech ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans tech seront bientôt disponibles.
              </p>
            ) : (
              <BrandFilter articles={cards} brands={TECH_BRANDS} />
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
