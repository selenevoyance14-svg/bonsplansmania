import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { JOUETS_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { ChevronRight, ToyBrick, Gift, Sparkles } from "lucide-react";
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
  title: "Coin Jouets : Bons Plans Jouets Enfants — Bons Plans Mania",
  description: "Tous les bons plans jouets du moment : LEGO, Playmobil, Barbie, jeux de société, peluches, poupées, jouets éducatifs. Idées cadeaux à prix doux toute l'année.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-jouets" },
};

const EXACT_TAGS = new Set([
  // Génériques
  "jouet", "jouets", "jouet-enfant", "jouets-enfants", "jeu", "jeux",
  "cadeau-enfant", "cadeau-jouet", "ludique", "ludotheque",
  // Catégories
  "jeu-de-societe", "jeux-de-societe", "board-game", "carte", "jeu-de-cartes",
  "puzzle", "puzzles",
  "peluche", "peluches", "doudou",
  "poupee", "poupees", "poupon",
  "jouet-educatif", "jouet-eveil", "jouet-construction",
  "voiture-jouet", "circuit-voiture", "petite-voiture",
  "figurine", "figurines",
  "kit-creatif", "loisirs-creatifs",
  // Marques
  "lego", "playmobil", "mattel", "hasbro", "barbie", "hot-wheels",
  "monopoly", "nerf", "ravensburger", "asmodee", "djeco", "haba",
  "vtech", "fisher-price", "schleich", "sylvanian-families",
  "funko", "funko-pop", "squishmallows",
  "pokemon", "pokémon", "disney", "marvel", "star-wars",
  "crayola", "smoby", "play-doh", "bandai", "tiptoi",
]);

const SLUG_TOKENS = [
  "-jouet-", "jouet-", "-jouets-",
  "-jeu-de-societe-", "-jeux-societe-", "-jeu-cartes-", "-jeux-cartes-",
  "-puzzle-", "-puzzles-",
  "-peluche-", "-peluches-", "-doudou-",
  "-poupee-", "-poupees-", "-barbie-", "-barbi-",
  "-jouet-educatif-", "-jouet-eveil-", "-construction-",
  "-figurine-", "-figurines-",
  "-kit-creatif-", "-loisirs-creatifs-",
  "lego-", "playmobil-", "mattel-", "hasbro-", "barbie-",
  "hot-wheels-", "monopoly-", "nerf-", "ravensburger-",
  "asmodee-", "djeco-", "haba-", "vtech-", "fisher-price-",
  "schleich-", "sylvanian-", "funko-", "squishmallows-",
  "pokemon-", "disney-", "marvel-", "star-wars-",
  "crayola-", "smoby-", "play-doh-", "bandai-", "tiptoi-",
];

// Exclusions : on évite les overlaps avec d'autres hubs
const EXCLUDED_TOKENS = [
  // Bébé / puériculture pure → reste dans Coin Bébé
  "biberon", "tetine", "tire-lait", "chaise-haute", "poussette", "siege-auto",
  "porte-bebe", "babyphone", "couches-", "lange-",
  // Tech (console / jeu vidéo) → reste dans Coin Tech
  "nintendo-switch-game", "playstation-game", "xbox-game", "ps5-jeu",
];

const EXCLUDED_TAGS_FROM_HERE = new Set([
  "puericulture", "allaitement", "tire-lait", "biberon", "poussette", "siege-auto",
  "babyphone", "tetine", "chaise-haute", "porte-bebe", "cosy-bebe", "lit-bebe",
  "table-a-langer", "couche-bebe", "lait-maternel",
  // Beauté, mode et rentrée disposent déjà de leurs propres univers.
  "beaute", "parfum", "eau-de-toilette", "sac-a-dos-enfant", "montre-enfant",
  "fournitures-scolaires", "papeterie",
  // Matériel professionnel de loisirs créatifs, mais pas jouet enfant.
  "graveur-laser", "decoupe-laser", "laser-co2", "fablab",
]);

const EXCLUDED_CATEGORIES = new Set(["test-gratuit", "test-avis", "concours", "box-beaute"]);

function isJouetsArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const slug = (meta.slug || "").toLowerCase();
  if (EXCLUDED_TOKENS.some((k) => slug.includes(k))) return false;
  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXCLUDED_TAGS_FROM_HERE.has(t))) return false;
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansJouetsPage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isJouetsArticle(a.meta));

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
          name: "Coin Jouets — Bons Plans Jouets Enfants",
          description: "Tous les bons plans jouets : LEGO, Playmobil, Barbie, jeux de société, peluches, poupées, jouets éducatifs.",
          url: "https://bonsplansmania.fr/bons-plans-jouets",
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
            { "@type": "ListItem", position: 2, name: "Coin Jouets" },
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
              <span><ToyBrick size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Coin Jouets</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <ToyBrick size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#F59E0B" }} />
              Coin Jouets : Bons Plans Jouets Enfants
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Tous les <strong>bons plans jouets</strong> du moment : LEGO, Playmobil, Barbie, jeux de société, peluches, poupées, jouets éducatifs, kits créatifs. <strong>Cadeaux d&apos;anniversaire, Noël, fêtes</strong> ou simple petit plaisir. {articles.length} articles.
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
              Quand acheter ses jouets au meilleur prix
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Les <strong>jouets ont des cycles de prix très marqués</strong>. Les meilleures fenêtres : <strong>Prime Days Amazon</strong> (mi-juillet), <strong>Black Friday</strong> (fin novembre), <strong>French Days</strong>, <strong>soldes d&apos;hiver</strong> et <strong>été</strong>, et surtout les <strong>destockages post-Noël</strong> (janvier). Pour Noël, le bon réflexe c&apos;est d&apos;<strong>acheter en septembre-octobre</strong> : les prix montent en décembre quand le stock se raréfie.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Sparkles size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Les marques à suivre
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>LEGO</strong> : sets City, Friends, Star Wars, Marvel, Harry Potter, Technic, Architecture</li>
              <li><strong>Playmobil</strong> : 1.2.3, City Life, Pirates, Knight, Western</li>
              <li><strong>Mattel</strong> : Barbie, Hot Wheels, Polly Pocket, Fisher-Price</li>
              <li><strong>Hasbro</strong> : Monopoly, Trivial Pursuit, Nerf, Play-Doh, Transformers, My Little Pony</li>
              <li><strong>Ravensburger</strong> : puzzles 100/500/1000/5000 pièces, jeux éducatifs Tiptoi</li>
              <li><strong>Asmodee</strong> : Dixit, 7 Wonders, Unlock!, Time&apos;s Up, Catan</li>
              <li><strong>Djeco / Haba</strong> : jouets en bois, jeux éducatifs, créatif</li>
              <li><strong>Vtech / Fisher-Price</strong> : jouets d&apos;éveil et électroniques pour les petits</li>
              <li><strong>Schleich</strong> : figurines animaux ultra réalistes</li>
              <li><strong>Squishmallows / Funko Pop / Sylvanian Families</strong> : collectionnables</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              💡 Conseils pour acheter malin
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li>📈 <strong>Vérifie l&apos;historique de prix</strong> (Keepa, CamelCamelCamel) avant tout achat — les jouets baissent souvent</li>
              <li>🎁 <strong>Achète à l&apos;avance</strong> : septembre-octobre pour Noël, février-mars pour les cadeaux d&apos;anniversaire d&apos;été</li>
              <li>📦 <strong>LEGO retiring</strong> : les sets bientôt arrêtés (status &ldquo;Retiring soon&rdquo;) prennent souvent +30 à +50% une fois épuisés</li>
              <li>♻️ <strong>Set / boîte abîmé(e)</strong> : Amazon Warehouse vend des jouets en boîte ouverte à -20 à -40% — souvent neufs dedans</li>
              <li>🧒 <strong>Adapte l&apos;âge</strong> : indication âge minimum sur la boîte = <em>légal</em>, pas pédagogique (un enfant peut être prêt avant ou après)</li>
            </ul>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans jouets ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans jouets seront bientôt disponibles.
              </p>
            ) : (
              <BrandFilter articles={cards} brands={JOUETS_BRANDS} />
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
