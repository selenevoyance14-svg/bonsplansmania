import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { JARDIN_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { ChevronRight, TreePine, Waves, Flame } from "lucide-react";
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
  title: "Coin Jardin & Animaux & Animaux : Bons Plans Jardin, Piscine, Animalerie 2026 — Bons Plans Mania",
  description: "Tous les bons plans jardin & animaux du moment : robots tondeuse, robots piscine, barbecues, mobilier outdoor, outils jardinage, arbres à chat, litières, croquettes, colliers GPS. Worx, Segway Navimow, Aiper, Feandrea, Tractive, Zooplus.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-jardin" },
};

const EXACT_TAGS = new Set([
  // Tondeuses (gazon uniquement — pas cheveux / barbe / corps)
  "robot-tondeuse", "tondeuse-gazon", "tondeuse-thermique", "tondeuse-autoportee", "tracteur-tondeuse",
  // Piscine
  "piscine", "robot-piscine", "aspirateur-piscine", "spa", "jacuzzi",
  "entretien-piscine", "chlore-piscine", "pompe-piscine", "filtre-piscine",
  // BBQ
  "barbecue", "bbq", "plancha", "fumoir", "grill",
  // Outils jardin
  "outils-jardin", "outil-jardin", "taille-haie", "tronconneuse", "souffleur",
  "debroussailleuse", "scarificateur", "broyeur-vegetaux",
  // Mobilier
  "mobilier-outdoor", "mobilier-jardin", "salon-jardin", "table-jardin",
  "chaise-jardin", "transat", "hamac", "parasol", "tonnelle", "pergola",
  // Nettoyage
  "nettoyeur-haute-pression", "karcher",
  // Plantes / déco
  "plantes", "pot-jardin", "decoration-jardin", "luminaire-exterieur",
  // Marques
  "worx", "segway", "segway-navimow", "navimow-x420", "navimow-i210",
  "husqvarna", "gardena", "karcher", "stihl", "ryobi", "ego",
  "aiper", "wybot", "medoxa", "ecoflow", "wave-3",
  "black-decker", "bxpw1500pe",
  // Outdoor / camping
  "camping", "outdoor", "glaciere-electrique", "tente-jardin",
  // Animaux / animalerie (Yann préfère ranger ici)
  "animaux", "animalerie", "chat", "chien", "chats", "chiens",
  "arbre a chat", "arbre à chat", "arbre-a-chat", "grattoir-chat",
  "litiere", "litière", "litiere-chat", "bac-litiere",
  "maison-toilette-chat", "litiere-autonettoyante",
  "niche-chien", "niche-chat", "cage-chat", "cage-chien",
  "gamelle", "gamelle-chat", "gamelle-chien", "distributeur-croquettes",
  "croquettes", "pate-chat", "pate-chien", "alimentation-animaux",
  "collier-gps", "collier-chat", "collier-chien", "tracker-animaux",
  "jouet-chat", "jouet-chien", "harnais-chien", "laisse-chien",
  "aquarium", "terrarium", "cage-rongeur", "nac",
  "feandrea", "tractive", "kippy", "zooplus", "edgard-cooper",
  "gitelsnour", "pawhut", "petkit", "ubpet", "savic", "flamingo",
  "royal-canin", "purina", "pro-plan", "ultra-premium-direct",
  "catit", "jummico", "palnests",
]);

const SLUG_TOKENS = [
  "-robot-tondeuse-", "-tondeuse-gazon-", "-tondeuse-autoportee-", "-tondeuse-thermique-", "-tracteur-tondeuse-",
  "-robot-piscine-", "-piscine-", "-spa-",
  "-barbecue-", "-bbq-", "-plancha-", "-fumoir-",
  "-mobilier-outdoor-", "-mobilier-jardin-", "-salon-jardin-",
  "-parasol-", "-tonnelle-", "-transat-", "-hamac-",
  "-nettoyeur-haute-pression-", "-taille-haie-", "-tronconneuse-",
  "-souffleur-", "-debroussailleuse-",
  "-glaciere-electrique-", "-glaciere-",
  "segway-navimow-", "worx-vision-", "aiper-", "wybot-", "medoxa-",
  "ecoflow-wave-",
  // Animaux / animalerie
  "-arbre-a-chat-", "-litiere-", "-bac-litiere-", "-niche-chien-", "-niche-chat-",
  "-gamelle-", "-distributeur-croquettes-", "-croquettes-",
  "-collier-gps-", "-collier-chat-", "-collier-chien-",
  "-jouet-chat-", "-jouet-chien-", "-harnais-chien-", "-laisse-chien-",
  "-aquarium-", "-terrarium-", "-cage-rongeur-",
  "feandrea-", "tractive-", "kippy-", "zooplus-", "gitelsnour-",
  "pawhut-", "petkit-", "ubpet-", "savic-", "flamingo-", "catit-",
  "jummico-", "palnests-", "edgard-cooper-",
];

const BEBE_TOKENS = [
  "bebe-", "-bebe-", "puericulture", "biberon", "poussette", "siege-auto",
  "couches-", "babymoov",
];

// Exclusions pour éviter les faux positifs (tondeuse cheveux/barbe matchait "tondeuse")
const EXCLUDED_TOKENS = [
  "-tondeuse-cheveux-", "-tondeuse-barbe-", "-tondeuse-corps-",
  "-tondeuse-multifonction-", "tondeuse-cheveux", "tondeuse-barbe",
  "-cheveux-", "-barbe-", "-rasoir-",
];

const EXCLUDED_TAGS_FROM_HERE = new Set(["puericulture", "allaitement", "tire-lait", "biberon", "poussette", "siege-auto", "babyphone", "tetine", "chaise-haute", "porte-bebe", "cosy-bebe", "lit-bebe", "table-a-langer", "couche-bebe", "lait-maternel"]);

const EXCLUDED_CATEGORIES = new Set(["test-gratuit", "test-avis", "concours", "box-beaute"]);

function isJardinArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const slug = (meta.slug || "").toLowerCase();
  if (BEBE_TOKENS.some((k) => slug.includes(k))) return false;
  if (EXCLUDED_TOKENS.some((k) => slug.includes(k))) return false;
  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXCLUDED_TAGS_FROM_HERE.has(t))) return false;
  // Exclure par tag les tondeuses cheveux/barbe
  if (tags.some((t) => t.includes("cheveux") || t.includes("barbe") || t.includes("rasoir"))) return false;
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansJardinPage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isJardinArticle(a.meta));

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
          name: "Coin Jardin & Animaux & Animaux — Bons Plans Jardin, Piscine, Animalerie 2026",
          description: "Tous les bons plans jardin & animaux : robots tondeuse, robots piscine, barbecues, mobilier outdoor, outils jardinage, arbres à chat, litières, croquettes, colliers GPS animaux.",
          url: "https://bonsplansmania.fr/bons-plans-jardin",
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
            { "@type": "ListItem", position: 2, name: "Coin Jardin & Animaux & Animaux" },
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
              <span><TreePine size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Coin Jardin & Animaux</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <TreePine size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#65a30d" }} />
              Coin Jardin & Animaux : Bons Plans Jardin, Piscine & Animalerie 2026
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Tous les <strong>bons plans jardin, piscine et outdoor</strong> du moment : robots tondeuse, robots piscine, barbecues, mobilier de jardin, outils jardinage, nettoyeurs haute pression. <strong>Worx, Segway Navimow, AIPER, Wybot, Medoxa, EcoFlow, Black+Decker</strong>… {articles.length} articles.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              🌱 Robots tondeuse : la révolution 2026
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Les <strong>robots tondeuse sans fil périmétrique</strong> sont devenus accessibles en 2026 grâce aux technologies <strong>RTK + VSLAM + LiDAR</strong>. <strong>Segway Navimow</strong> (i210 LiDAR Pro, X420), <strong>Worx Vision Cloud</strong>, <strong>Husqvarna Automower</strong> couvrent tous les besoins. Plus besoin d&apos;enterrer un fil dans le jardin. Pour les terrains pentus (jusqu&apos;à 80%), choisir un modèle <strong>4 roues motrices</strong>.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Waves size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Robots piscine : adieu la corvée
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Les <strong>robots piscine sans fil</strong> remplacent définitivement les robots filaires : autonomie 90-180 min, navigation intelligente, auto-stationnement. <strong>AIPER Scuba SE</strong>, <strong>Wybot A1</strong>, <strong>Medoxa</strong> pour les piscines hors-sol et enterrées jusqu&apos;à 80 m². Pour les très grandes piscines, viser un robot avec couverture <strong>fond + paroi + ligne d&apos;eau</strong>.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Flame size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Barbecues : choisir selon ses besoins
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li>🪵 <strong>BBQ charbon</strong> : authentique, économique, mais long à allumer</li>
              <li>⚡ <strong>BBQ électrique</strong> : balcon, immeubles, propre, rapide</li>
              <li>🔥 <strong>BBQ gaz</strong> : confortable, contrôle précis, idéal famille</li>
              <li>🌲 <strong>BBQ pellet/fumoir</strong> : Ninja Woodfire, Traeger, Weber SmokeFire</li>
              <li>🥩 <strong>Plancha</strong> : alternative douce, surface lisse</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              🛋️ Mobilier outdoor & terrasse
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Les <strong>soldes d&apos;été</strong> (juin-juillet) et la <strong>fin de saison</strong> (août-septembre) sont les meilleurs moments pour acheter du mobilier de jardin : -30 à -60% chez Maisons du Monde, Carrefour, Amazon, La Foir&apos;Fouille. Privilégier des matériaux durables : <strong>résine tressée</strong>, <strong>aluminium</strong> ou <strong>teck huilé</strong>.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              💦 Nettoyeurs haute pression
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              <strong>Black+Decker, Karcher, Bosch</strong> dominent. Pour une terrasse + voiture en ville : <strong>100-130 bars</strong> suffisent (~80-150 €). Pour une grande terrasse, façade ou allée : viser <strong>140-160 bars</strong> et un <strong>débit ≥ 450 L/h</strong>.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans jardin & animaux ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans jardin seront bientôt disponibles.
              </p>
            ) : (
              <BrandFilter articles={cards} brands={JARDIN_BRANDS} />
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
