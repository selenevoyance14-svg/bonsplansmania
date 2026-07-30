import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
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
  description: "Les bons plans beauté publiés sur Bons Plans Mania : soins du visage, maquillage, parfums et cheveux. Prix datés, offres affiliées et filtres par marque.",
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
  // Enseignes / parapharmacies
  "sephora", "marionnaud", "nocibe", "yves-rocher", "parfumerie",
  "beauty-success", "beautysuccess", "lookfantastic", "notino",
  "perfumes-club", "perfumesclub", "origines-parfums", "originesparfums",
  "parfums-moins-chers", "greenweez", "mademoiselle-bio",
  "cocooncenter", "easypara", "easyparapharmacie",
  // Plateformes K-beauty
  "yesstyle", "stylevana",
  // Marques (top 30)
  "loreal", "l-oreal", "loreal-paris", "garnier", "nivea", "revlon",
  "maybelline", "kerargan", "caudalie", "vichy", "la-roche-posay",
  "weleda", "embryolisse", "biodance", "evoluderm", "boho-green",
  "luxeol", "hairlust", "twentydc", "twenty-dc", "lancome", "clarins",
  "estee-lauder", "yves-saint-laurent", "dior", "chanel", "guerlain",
  "armani", "hugo-boss", "paco-rabanne",
  // Marques classiques additionnelles
  "cerave", "biotherm", "clinique", "dove", "nuxe", "erborian",
  "kerastase", "kérastase", "olaplex", "mixa", "kiehls", "kiehl-s",
  "elizabeth-arden", "kiko", "kiko-milano", "lierac", "topicrem",
  "the-ordinary", "ordinary", "aveda", "schwarzkopf", "gliss",
  "herbal-essences", "head-shoulders", "franck-provost", "mugler",
  "thierry-mugler", "hermes-parfum", "oulac", "nyx", "makeup-revolution",
  "revitalash", "poderm", "coco-eve", "cocunat", "melvita",
  "jeanne-en-provence", "bioderma", "avene", "avène", "eucerin",
  "uriage", "sanoflore", "cattier", "sisley", "filorga", "sanogyl",
  // Marques K-beauty
  "cosrx", "medicube", "beauty-of-joseon", "anua", "laneige", "isntree",
  "numbuzin", "skin1004", "round-lab", "torriden", "banila-co",
  "innisfree", "missha", "tocobo", "iunik", "purito", "mizon",
  "dalba", "heimish", "etude", "mary-may", "marymay", "axis-y",
  "derma-b", "centellian24", "beplain", "bring-green", "mixsoon",
  "scinic", "vt-cica", "some-by-mi", "sulwhasoo",
  "kbeauty", "k-beauty", "coreen", "coréen", "skincare-coreen",
  // Marques bio FR
  "lea-nature", "léa-nature", "so-bio-etic", "so'bio", "sobio",
  "jonzac", "bioregena", "belle-au-naturel", "huygens", "baija",
  "patyka", "algologie", "acorelle", "arista", "garancia", "nubiance",
  "ixage", "marilou-bio", "florame", "solinotes", "aroma-zone",
  "loccitane", "l-occitane", "rituals", "phyt-s", "phyts", "endro",
  "centifolia", "dr-hauschka", "hauschka", "pranarom",
  // Actifs / concepts K-beauty
  "pdrn", "snail-mucin", "snail", "centella", "cica", "hanbang", "riz-fermente",
  "niacinamide", "retinol", "rétinol", "peptides", "collagene", "collagène",
  "acide-hyaluronique", "acide-salicylique", "acide-glycolique",
  "acide-tranexamique", "bakuchiol",
  "toner", "essence-visage", "essence-coreenne", "sheet-mask",
  // Cheveux / kératine
  "keratine", "argan", "shampoing", "apres-shampoing", "masque-cheveux",
  // Coiffure / hair styling
  "seche-cheveux", "sèche-cheveux", "lisseur", "boucleur",
  "brosse-chauffante", "brushing", "dyson", "dyson-airwrap",
  "dyson-corrale", "ghd", "ukliss", "cecotec-bamba", "aowoka",
  "haokoo", "bopcal",
  // Autres
  "rouge-a-levres", "fond-de-teint", "fards-paupieres", "mascara",
  "vernis-ongles", "soin-solaire", "auto-bronzant",
  // Hygiène / dentifrice / dépilation
  "dentifrice", "dentifrice-solide", "hygiene-dentaire",
  "deodorant", "déodorant", "deodorant-naturel",
  "epilation", "épilation", "coloration", "teinture-cheveux",
  "manucure", "pedicure", "nail-art", "vernis-gel",
  "colgate", "signal", "oral-b", "veet",
  // Formes / types produit
  "eau-micellaire", "eau-thermale", "eau-de-rose", "brume-parfumee",
  "fluide-visage", "lait-corps", "lait-demaquillant",
  "demaquillant", "démaquillant", "tonique", "peeling",
  "creme-solaire", "cremes-solaires", "protection-solaire",
  "aftersun", "after-sun", "spf",
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
  // Enseignes / parapharmacies
  "beauty-success-", "beautysuccess-", "lookfantastic-", "notino-",
  "perfumes-club-", "perfumesclub-", "origines-parfums-", "originesparfums-",
  "parfums-moins-chers-", "greenweez-", "mademoiselle-bio-",
  "cocooncenter-", "easypara-", "easyparapharmacie-",
  // Plateformes K-beauty
  "yesstyle-", "-yesstyle-", "stylevana-",
  "loreal-", "garnier-", "-nivea-", "nivea-", "revlon-", "maybelline-", "lancome-",
  "clarins", "yves-saint-laurent", "dior-parfum", "chanel-parfum", "guerlain",
  "armani-parfum", "hugo-boss-parfum", "paco-rabanne",
  // Marques classiques additionnelles
  "cerave-", "-cerave-", "biotherm-", "-biotherm-", "clinique-", "-clinique-",
  "dove-", "-dove-", "nuxe-", "-nuxe-", "erborian-", "-erborian-",
  "kerastase-", "-kerastase-", "olaplex-", "mixa-", "-mixa-",
  "kiehls-", "kiehl-s-", "elizabeth-arden-", "kiko-", "lierac-",
  "topicrem-", "the-ordinary-", "-ordinary-", "aveda-",
  "schwarzkopf-", "gliss-", "herbal-essences-", "head-shoulders-",
  "franck-provost-", "mugler-", "thierry-mugler-", "terre-hermes-",
  "oulac-", "nyx-", "makeup-revolution-", "revitalash-", "poderm-",
  "coco-eve-", "cocunat-", "melvita-", "-melvita-",
  "jeanne-en-provence-", "bioderma-", "-bioderma-", "avene-", "-avene-",
  "eucerin-", "uriage-", "sanoflore-", "cattier-",
  "sisley-", "filorga-", "sanogyl-",
  // Marques K-beauty
  "cosrx-", "-cosrx-", "medicube-", "-medicube-",
  "beauty-of-joseon-", "anua-", "-anua-", "laneige-", "-laneige-",
  "isntree-", "-isntree-", "numbuzin-", "skin1004-",
  "round-lab-", "torriden-", "banila-co-", "innisfree-", "missha-",
  "tocobo-", "iunik-", "purito-", "mizon-", "dalba-", "heimish-",
  "etude-", "mary-may-", "marymay-", "axis-y-", "derma-b-", "centellian24-",
  "beplain-", "bring-green-", "mixsoon-", "scinic-", "vt-cica-", "some-by-mi-",
  "sulwhasoo-",
  "-kbeauty-", "kbeauty-", "-k-beauty-",
  // Marques bio FR
  "lea-nature-", "so-bio-etic-", "sobio-", "jonzac-", "-jonzac-",
  "bioregena-", "belle-au-naturel-", "huygens-", "baija-", "-baija-", "patyka-",
  "algologie-", "acorelle-", "arista-", "garancia-", "nubiance-", "ixage-",
  "marilou-bio-", "florame-", "solinotes-", "aroma-zone-",
  "loccitane-", "l-occitane-", "rituals-",
  "endro-", "centifolia-", "dr-hauschka-", "hauschka-", "pranarom-",
  // Actifs / concepts K-beauty
  "-pdrn-", "pdrn-", "-snail-", "snail-", "-centella-", "centella-",
  "-cica-", "cica-", "hanbang-",
  "-niacinamide-", "-retinol-", "retinol-",
  "-peptides-", "-collagene-", "collagene-",
  "-acide-hyaluronique-", "acide-hyaluronique-",
  "-acide-salicylique-", "acide-salicylique-",
  "-bakuchiol-", "bakuchiol-",
  "-toner-", "toner-", "-essence-visage-", "-sheet-mask-",
  "keratine", "argan-", "shampoing", "apres-shampoing", "masque-cheveux",
  // Coiffure / hair styling
  "-seche-cheveux-", "seche-cheveux-", "-lisseur-", "lisseur-",
  "-boucleur-", "boucleur-", "-brosse-chauffante-", "-brushing-",
  "dyson-", "-dyson-", "-airwrap-", "dyson-airwrap-",
  "dyson-corrale-", "ghd-", "-ghd-", "ukliss-",
  "cecotec-bamba-", "aowoka-", "haokoo-", "bopcal-",
  "rouge-a-levres", "fond-de-teint", "fards-paupieres", "mascara-",
  "vernis-ongles", "auto-bronzant",
  // Hygiène / dentifrice / dépilation
  "-dentifrice-", "dentifrice-", "-deodorant-", "deodorant-",
  "-epilation-", "-coloration-", "coloration-", "-teinture-",
  "-manucure-", "manucure-", "-nail-art-", "vernis-gel-",
  "colgate-", "signal-", "oral-b-", "veet-",
  // Formes / types produit
  "eau-micellaire-", "eau-thermale-", "eau-de-rose-",
  "brume-parfumee-", "-fluide-", "lait-corps-", "lait-demaquillant-",
  "demaquillant-", "-tonique-", "-peeling-",
  "creme-solaire-", "-cremes-solaires-", "protection-solaire-",
  "-aftersun-", "after-sun-", "-spf-", "spf-",
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

// Slugs à exclure : catégories qui matchent par erreur des tokens beauté
// - isotoner matche "toner-" (K-beauty toner)
// - calor-easygliss matche "gliss-" (marque cheveux Gliss)
// - jouets Barbie/Monster High/Rainbow High : univers jouet, pas beauté
// - électroménager (fer à repasser, aspirateur, etc.)
const NON_BEAUTE_TOKENS = [
  // Accessoires plage/jardin
  "isotoner", "parasol-plage", "-parasol-", "parasol-jardin",
  "tente-plage", "tente-jardin", "-hamac-", "hamac-",
  // Jouets
  "-barbie-", "barbie-", "monster-high-", "rainbow-high-",
  "-poupee-", "poupee-", "-jouet-", "jouet-",
  // Électroménager
  "fer-repasser", "fer-a-repasser", "easygliss", "aspirateur",
  "lave-linge", "lave-vaisselle", "refrigerateur", "congelateur",
  "micro-ondes", "cuisiniere", "hotte-", "-hotte-",
  "climatiseur", "ventilateur-",
  // Déco maison (parfum d'ambiance ≠ parfum beauté)
  "diffuseur-parfum", "diffuseur-de-parfum", "parfum-ambiance", "parfum-d-ambiance",
];

// Policy 2026-07 : le Coin Beauté agrège les bons plans purs.
// On exclut toutes les catégories qui ont leur propre page dédiée
// (test-gratuit → /categorie/test-gratuit, concours → /categorie/concours,
// box-beaute → /categorie/box-beaute, test-avis → /categorie/test-avis,
// calendrier-avent → /categorie/calendrier-avent, code-promo → /categorie/code-promo).
// Restent : bon-plan (cœur), beaute (conseils/tests), selection (hubs).
const EXCLUDED_CATEGORIES = new Set<string>([
  "test-gratuit", "concours", "box-beaute", "test-avis",
  "calendrier-avent", "code-promo",
]);

function isBeauteArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const slug = (meta.slug || "").toLowerCase();
  // Exclure d'office si c'est un article bébé/puériculture
  if (BEBE_TOKENS.some((k) => slug.includes(k))) return false;
  // Exclure les accessoires plage/jardin (faux positifs comme isotoner→toner)
  if (NON_BEAUTE_TOKENS.some((k) => slug.includes(k))) return false;

  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXACT_TAGS.has(t))) return true;
  return SLUG_TOKENS.some((k) => slug.includes(k));
}

export default async function BonsPlansBeautePage() {
  const all = getAllArticles();
  const articles = all.filter(
    (a) => !isEffectivelyExpired(a.meta) && isBeauteArticle(a.meta)
  );

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
          name: "Coin Beauté — Bons Plans Beauté 2026",
          description: "Les bons plans beauté publiés sur Bons Plans Mania : soins, maquillage, parfums et cheveux.",
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
              Retrouvez les <strong>bons plans beauté publiés sur Bons Plans Mania</strong> :
              soins du visage, maquillage, parfums, cheveux et appareils beauté.
              Les offres terminées sont retirées de cette sélection. {articles.length} articles sont actuellement référencés.
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
              Les prix varient souvent selon la teinte, le format, le vendeur et la durée de la promotion.
              Chaque article indique la date de vérification disponible ; vérifiez toujours le montant final
              et les conditions de livraison sur le site marchand avant de commander.
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
              Box beauté : comparez avant de vous abonner
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Le contenu, le prix et l&apos;engagement diffèrent selon les box. Consultez notre
              {" "}<a href="/categorie/box-beaute">catégorie Box Beauté</a> pour comparer les sélections
              publiées, puis contrôlez les conditions d&apos;abonnement et de résiliation sur le site de la marque.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Gift size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Tests gratuits beauté à saisir
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Des marques et communautés recrutent ponctuellement des testeurs. La sélection n&apos;est
              jamais garantie et les modalités varient selon chaque campagne. Retrouvez uniquement les
              campagnes publiées dans la <a href="/categorie/test-gratuit">catégorie Tests produits gratuits</a>.
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
              <BrandFilter articles={cards} brands={BEAUTE_BRANDS} sortBrandsBy="alpha" />
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
