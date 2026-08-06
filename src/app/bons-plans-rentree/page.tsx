import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { RENTREE_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { ChevronRight, GraduationCap, Backpack, Sparkles } from "lucide-react";
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
  title: "Bons plans fournitures scolaires — Bons Plans Mania",
  description: "Tous les bons plans rentrée scolaire du moment : cartables, trousses, crayons, feutres, cahiers, agendas, calculatrices. BIC, Maped, STABILO, Clairefontaine, Faber-Castell. Économiser sur la liste de fournitures.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-rentree" },
};

const EXACT_TAGS = new Set([
  // Génériques rentrée
  "rentree", "rentrée", "rentree-scolaire", "rentrée-scolaire",
  "fournitures", "fournitures-scolaires", "materiel-scolaire",
  "ecole", "école", "college", "collège", "lycee", "lycée", "primaire", "maternelle",
  "kit-rentree", "liste-fournitures",
  // Fournitures : écrire
  // Pas "crayon" seul (matche crayon sourcils/yeux/lèvres maquillage)
  "crayon-couleur", "crayons-couleur", "crayon-graphite", "crayons-graphite",
  "crayon-papier", "crayons-papier", "crayon-a-papier", "crayons-de-couleur",
  "feutre", "feutres", "feutre-coloriage", "surligneur", "surligneurs",
  "stylo", "stylos", "stylo-bille", "stylo-plume", "stylo-effacable",
  // Pas "roller" seul : c'est aussi un roll-on de soin ou d'huile essentielle.
  "porte-mine", "porte-mines", "stylo-roller", "gel-pen",
  "gomme", "gommes", "taille-crayon", "taille-crayons",
  // Fournitures : peindre / coloriage
  "coloriage", "peinture", "gouache", "aquarelle", "pinceau", "pinceaux",
  "kit-coloriage", "kit-peinture", "loisirs-creatifs-scolaire",
  "craie", "craies", "craie-wax",
  // Fournitures : cahiers / papeterie
  "cahier", "cahiers", "cahier-clairefontaine", "carnet", "agenda", "agendas",
  "trieur", "trieurs", "classeur", "classeurs",
  // Pas "chemise" ni "pochette" seuls : une chemise c'est aussi un vêtement,
  // une pochette c'est aussi une poche de glace ou un sac à main.
  "chemise-cartonnee", "chemises-cartonnees", "chemise-a-elastique",
  "pochette-plastique", "pochettes-plastique", "pochette-transparente",
  "protege-cahier", "protège-cahier", "feuilles", "papier", "sous-main",
  // Fournitures : géométrie
  "regle", "règle", "equerre", "équerre", "compas", "rapporteur",
  "geometrie", "géométrie", "kit-geometrie", "kit-géométrie",
  // Fournitures : maths / sciences
  "calculatrice", "calculatrices", "calculatrice-scientifique",
  "casio", "casio-fx", "texas-instruments", "ti-nspire",
  // Contenants : sacs / trousses
  "cartable", "cartables", "sac-a-dos", "sac-a-dos-ecole", "sac-dos",
  // Pas "trousse" seul (matche trousse maquillage/rasage/soin/parfum)
  "trousse-scolaire", "trousses-scolaires", "trousse-a-crayons", "trousse-rentree", "trousse-ecole", "plumier",
  "sac-piscine", "sac-sport-ecole",
  // Colles / scotch
  "colle", "colles", "baton-colle", "batons-de-colle", "scotch", "adhesif",
  // Marques papeterie
  "bic", "bic-kids", "maped", "maped-color-peps", "color-peps",
  "stabilo", "stabilo-boss", "stabilo-natureCOLORS",
  "clairefontaine", "oxford", "faber-castell", "staedtler",
  "pilot", "pilot-frixion", "frixion", "paper-mate", "sharpie",
  "posca", "canson", "crayola",
  // Licences enfants souvent utilisées pour fournitures
  "minecraft-ecole", "roblox-ecole", "disney-ecole",
]);

// SLUG_TOKENS : slugs qui garantissent contexte scolaire.
// PAS de "-trousse-" ni "-crayon-" seuls (trop greedy — matchent trousse maquillage,
// trousse rasage, crayon sourcils, crayon yeux, crayon lèvres…).
// Versions spécifiquement scolaires uniquement.
const SLUG_TOKENS = [
  "-rentree-", "rentree-", "-rentrée-", "rentrée-",
  "-fournitures-", "fournitures-", "-fournitures-scolaires-",
  // Crayons : versions strictement scolaires
  "-crayon-couleur-", "-crayons-couleur-", "crayon-couleur",
  "-crayon-graphite-", "-crayons-graphite-",
  "-crayon-papier-", "-crayons-papier-", "-crayon-a-papier-",
  "-crayons-de-couleur-",
  "-feutre-", "-feutres-", "feutre-coloriage",
  // "-stylo-" seul attrapait le stylo de microneedling : versions écriture only.
  "-stylos-", "-stylo-bille-", "-stylo-plume-", "-stylo-effacable-", "-stylo-gel-",
  "-surligneur-", "-surligneurs-",
  "-coloriage-", "coloriage-",
  "-cahier-", "-cahiers-", "-carnet-", "-agenda-", "-agendas-",
  // Trousses : versions strictement scolaires
  "-trousse-scolaire-", "-trousses-scolaires-",
  "-trousse-a-crayons-", "-trousse-rentree-", "-trousse-ecole-",
  "-cartable-", "-cartables-",
  "-classeur-", "-classeurs-", "-trieur-", "-trieurs-",
  "-compas-", "-regle-", "-règle-", "-equerre-", "-équerre-",
  "-calculatrice-", "-calculatrices-",
  "-baton-colle-", "-batons-de-colle-",
  "-kit-coloriage-", "-kit-peinture-",
  // Marques papeterie
  "bic-kids-", "-bic-kids-", "maped-", "-maped-",
  "stabilo-", "-stabilo-",
  "clairefontaine-", "-clairefontaine-",
  // Pas "oxford-" seul : la toile Oxford est un tissu, pas la marque de cahiers.
  "faber-castell-", "staedtler-",
  "pilot-", "paper-mate-", "sharpie-",
  "posca-", "canson-", "crayola-",
];

// Exclusions : jouets purs (LEGO, Playmobil, poupées, jeux de société) restent en /bons-plans-jouets
// + maquillage sourcils/yeux/lèvres (crayon-sourcils, crayon-yeux, crayon-levres) n'est PAS scolaire
const EXCLUDED_TOKENS = [
  "-lego-", "lego-", "-playmobil-", "playmobil-",
  "-barbie-", "barbie-", "-poupee-", "poupee-",
  "-nerf-", "nerf-", "-hot-wheels-", "hot-wheels-",
  "-jeu-de-societe-", "-jeux-societe-", "-puzzle-", "-puzzles-",
  "-peluche-", "peluches-", "-doudou-",
  "-figurine-", "figurines-",
  "-funko-", "funko-", "-squishmallows-",
  // Maquillage — les "crayons" beauté ne sont pas des crayons scolaires
  "-atelier-du-sourcil-", "atelier-du-sourcil-",
  "-sourcil-", "-sourcils-",
  "-crayon-sourcils-", "-crayon-yeux-", "-crayon-levres-", "-crayon-contour-",
  "-mascara-", "-eyeliner-", "-fard-", "-fard-a-paupieres-",
  "-blush-", "-highlighter-", "-enlumineur-",
  "-rouge-a-levres-", "-baume-a-levres-", "-huile-a-levres-",
  "-vernis-a-ongles-", "-vernis-", "-fond-de-teint-",
  "-palette-maquillage-", "-palette-fards-",
];

const EXCLUDED_CATEGORIES = new Set(["test-gratuit", "test-avis", "concours", "box-beaute"]);

/**
 * Veto par thème : un article porteur d'un de ces tags n'est pas scolaire,
 * quel que soit le mot qui l'aurait fait entrer.
 *
 * Sans ce garde-fou, un seul mot ambigu suffisait à faire basculer un article
 * dans le coin rentrée : le tag `bic` amenait un comparatif de rasoirs jetables,
 * `classeur` un guide de budget familial, `sac-a-dos` une valise cabine Ryanair,
 * et le tag `rentree` posé sur une liseuse ou un shopping beauté suffisait seul.
 */
const EXCLUDED_TAGS = new Set([
  // Beauté / soin
  "beaute", "beauté", "maquillage", "cosmetique", "cosmétique", "parfum",
  "soin-visage", "soin-corps", "soin-cheveux", "creme", "crème",
  "rasoir", "rasoirs", "rasage", "epilation", "épilation",
  "aromatherapie", "aromathérapie", "huile-essentielle", "huiles-essentielles",
  "anti-moustiques", "microneedling",
  // Mode et chaussures — la rentrée ici, ce sont les fournitures, pas la
  // garde-robe : le tag `rentree` posé sur des bottines ou un code promo
  // vêtements suffisait à les faire entrer.
  "mode", "mode-homme", "mode-femme", "mode-enfant", "chemise-homme",
  "vetement", "vêtement", "vetements", "vetements-enfants", "vetements-enfant",
  "chaussures", "chaussure", "bottines", "bottines-enfant", "baskets",
  // Bagagerie de voyage. Pas "voyage" seul : un sac à dos d'école le porte
  // souvent aussi (l'Eastpak Padded Pak'R est tagué école ET voyage).
  "valise", "bagage", "bagage-main", "bagage-cabine", "sac-cabine",
  // Maison / finances / high-tech
  "budget", "budget-familial", "liseuse", "jardin", "terrasse",
]);

/**
 * Faux positifs de EXCLUDED_TOKENS : ces produits sont bien scolaires malgré
 * un mot d'exclusion dans leur slug. « BIC Highlighter Grip » est un surligneur,
 * pas un enlumineur de maquillage — mais les deux s'appellent highlighter.
 */
const EXCLUSION_EXCEPTIONS = ["bic-highlighter"];

function isRentreeArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const slug = (meta.slug || "").toLowerCase();
  const exempt = EXCLUSION_EXCEPTIONS.some((k) => slug.includes(k));
  if (!exempt && EXCLUDED_TOKENS.some((k) => slug.includes(k))) return false;
  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXCLUDED_TAGS.has(t))) return false;
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansRentreePage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isRentreeArticle(a.meta));

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
          name: "Coin Rentrée — Bons Plans Fournitures Scolaires",
          description: "Tous les bons plans rentrée : cartables, trousses, crayons, feutres, cahiers, agendas, calculatrices. BIC, Maped, STABILO, Clairefontaine.",
          url: "https://bonsplansmania.fr/bons-plans-rentree",
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
            { "@type": "ListItem", position: 2, name: "Coin Rentrée" },
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
              <span><GraduationCap size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Coin Rentrée</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <GraduationCap size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#0EA5A9" }} />
              Coin Rentrée : Bons Plans Fournitures Scolaires
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Tous les <strong>bons plans rentrée scolaire</strong> du moment : <strong>cartables, trousses, crayons, feutres, cahiers, agendas, calculatrices</strong>. Marques françaises et internationales : <strong>BIC, Maped, STABILO, Clairefontaine, Faber-Castell, Casio</strong>. Réduire la facture de la liste de fournitures. {articles.length} articles.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <Backpack size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Quand acheter ses fournitures au meilleur prix
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              La <strong>fenêtre optimale</strong> se situe <strong>mi-juillet à fin août</strong> : les enseignes ont chargé les rayons, les promos tournent en continu et le stock est plein. Attendre septembre est <strong>le pire moment</strong> — les prix remontent, les cartables les plus demandés sont épuisés, les meilleures références de crayons partent. <strong>Amazon, Cdiscount, Fnac et grandes surfaces</strong> font souvent leurs meilleures promos <strong>mi-août</strong>. Les <strong>packs multi-produits</strong> *(BIC Kids 120 pcs, Maped Color&apos;Peps 150 pcs)* écrasent le coût par pièce.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Sparkles size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Les marques à suivre
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>BIC / BIC Kids</strong> : stylos, feutres, crayons, boîtes multi-produits — le meilleur rapport qualité/prix français</li>
              <li><strong>Maped / Color&apos;Peps</strong> : crayons triangulaires ergonomiques, feutres lavables, coffrets créatifs</li>
              <li><strong>STABILO</strong> : surligneurs BOSS iconiques, pointFine, pastel, NatureCOLORS</li>
              <li><strong>Clairefontaine / Oxford</strong> : cahiers, agendas, feuilles double-page — la référence française</li>
              <li><strong>Faber-Castell / Staedtler</strong> : crayons de couleur premium, feutres pinceau, matériel dessin</li>
              <li><strong>Pilot Frixion / Paper Mate</strong> : stylos effaçables, rollers gel</li>
              <li><strong>Sharpie / Posca / Canson</strong> : marqueurs permanents, marqueurs peinture, papier dessin</li>
              <li><strong>Casio / Texas Instruments</strong> : calculatrices scientifiques collège / lycée</li>
              <li><strong>Licences enfants</strong> : Minecraft, Roblox, Disney pour trousses / cartables / kits coloriage</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              💡 Conseils pour équiper malin
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li>📋 <strong>Récupère la liste de fournitures</strong> tôt — dès juin de préférence, sinon dès la fin des classes</li>
              <li>📦 <strong>Privilégie les packs multi-produits</strong> : BIC Kids 120 pcs, Maped Color&apos;Peps 150 pcs, STABILO BOSS 23 pastel/fluo — le coût par pièce s&apos;écroule</li>
              <li>♻️ <strong>Réutilise l&apos;année précédente</strong> ce qui va bien *(règle, équerre, compas, calculatrice, cartable en bon état).* La rentrée ce n&apos;est pas racheter à zéro</li>
              <li>🎨 <strong>Les grandes marques françaises</strong> *(BIC, Maped, Clairefontaine)* durent une année scolaire complète — vs premier prix qui casse en octobre</li>
              <li>💰 <strong>Cashback iGraal</strong> : jusqu&apos;à 3 % rendus sur Amazon, Cdiscount, Fnac — active avant de payer</li>
              <li>👨‍👩‍👧‍👦 <strong>Foyer plusieurs enfants</strong> = mutualise les gros packs de crayons / feutres au lieu d&apos;acheter individuellement</li>
            </ul>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans rentrée ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans rentrée seront bientôt disponibles.
              </p>
            ) : (
              <BrandFilter articles={cards} brands={RENTREE_BRANDS} />
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
