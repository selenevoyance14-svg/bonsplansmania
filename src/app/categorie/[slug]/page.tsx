import { getArticlesByCategory, isEffectivelyExpired, expiresSoon } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import BrandFilter from "@/app/components/BrandFilter";
import { ALL_DEAL_BRANDS, BOX_BEAUTE_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { Archive, ChevronRight, Tag, Gift, Trophy, ShoppingBag, Calendar, TreePine, FlaskConical, Ticket, Sparkles, type LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan":         { label: "Bon Plan",              color: "bon-plan" },
  "bon-plan-beaute":  { label: "Bon Plan",              color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           color: "test-avis" },
  "comparatif":       { label: "Comparatif",             color: "test-avis" },
  "concours":         { label: "Concours",              color: "concours" },
  "box-beaute":       { label: "Box Beauté",            color: "box-beaute" },
  "beaute":           { label: "Beauté",                color: "beaute" },
  "selection":        { label: "Beauté",                color: "beaute" },
  "calendrier-avent": { label: "Calendrier de l'Avent", color: "calendrier-avent" },
  "code-promo":       { label: "Code Promo",            color: "code-promo" },
};


export async function generateStaticParams() {
  return ["bon-plan", "test-gratuit", "test-avis", "test-produit", "comparatif", "beaute", "selection", "concours", "box-beaute", "calendrier", "calendrier-avent", "code-promo"].map((slug) => ({ slug }));
}

interface PageProps { params: Promise<{ slug: string }>; }

const categoryConfig: Record<string, { label: string; Icon: LucideIcon; desc: string; seoTitle: string; seoDesc: string; color: string }> = {
  // seoTitle : raccourcis < 60 chars (suppression du suffixe "— Bons Plans Mania" déjà présent dans le siteName)
  // Cette page rassemble TOUS les bons plans, tous univers confondus (2 900+
  // articles : beauté, bébé, maison, tech, mode, papeterie…). Son seoTitle
  // annonçait « Bons Plans Beauté », ce qui la mettait en concurrence avec
  // /bons-plans-beaute tout en affichant des cahiers et des sacs à dos.
  // Elle se présente désormais pour ce qu'elle est : le sommaire général.
  "bon-plan":         { label: "Bons Plans",             Icon: Tag,          desc: "Toutes les réductions et promos du moment, tous univers confondus", seoTitle: "Tous nos bons plans : beauté, maison, bébé et tech", seoDesc: "Toutes nos réductions et promos du moment, tous univers confondus : beauté, bébé, maison, tech et mode. Chaque offre indique son prix et sa date de vérification.", color: "bon-plan" },
  "test-produit":     { label: "Tests Produits",           Icon: FlaskConical, desc: "Tests produits gratuits et avis détaillés", seoTitle: "Tests produits : tests gratuits et avis détaillés", seoDesc: "Tous nos tests produits : les tests gratuits ouverts (Trustt, Sampleo, ConsoBaby, Blissim) et nos avis détaillés. Beauté, bébé, maison, alimentaire.", color: "test-gratuit" },
  "test-gratuit":     { label: "Tests Gratuits",          Icon: Gift,         desc: "Les campagnes en cours pour candidater à des tests de produits", seoTitle: "Tests produits gratuits : campagnes et candidatures", seoDesc: "Découvrez les campagnes de tests produits : dates limites, profils recherchés, conditions de participation et lien pour candidater gratuitement.", color: "test-gratuit" },
  "test-avis":        { label: "Tests & Avis",            Icon: FlaskConical, desc: "Tests réellement effectués et analyses détaillées de produits", seoTitle: "Tests et avis produits : essais et analyses détaillées", seoDesc: "Découvrez nos tests réellement effectués et nos analyses de produits : utilisation, composition, avantages, limites et conseils avant achat.", color: "test-avis" },
  "comparatif":       { label: "Comparatifs",             Icon: FlaskConical, desc: "Des comparatifs et guides d'achat pour choisir selon tes besoins", seoTitle: "Comparatifs produits et guides d'achat 2026", seoDesc: "Comparez les produits selon leurs caractéristiques, usages, prix constatés, avantages et limites : beauté, maison, bébé, high-tech et loisirs.", color: "test-avis" },
  "concours":         { label: "Concours",                Icon: Trophy,       desc: "Jeux concours, instants gagnants et tirages au sort", seoTitle: "Jeux concours, instants gagnants et tirages au sort", seoDesc: "Tous les jeux concours gratuits du moment : instants gagnants, tirages au sort et concours créatifs. Dates limites, nombre de lots et règlement vérifiés.", color: "concours" },
  "box-beaute":       { label: "Box Beauté",              Icon: ShoppingBag,  desc: "Offres, contenus et conditions des box beauté du moment", seoTitle: "Box beauté 2026 : offres, prix et comparatif", seoDesc: "Comparez les box beauté 2026 : prix datés, contenu, valeur annoncée, abonnement et conditions de résiliation. Offres Glowria, Blissim et Prescription Lab.", color: "box-beaute" },
  "beaute":           { label: "Guides & Tests Beauté",    Icon: Sparkles,     desc: "Tutos, guides, avis et tests sur les produits beauté, soins et bien-être", seoTitle: "Beauté : guides, avis et tests produits", seoDesc: "Tutos maquillage, routines skincare, guides huiles essentielles, tests de marques (Nuxe, Weleda, Clarins, Foreo) et avis produits. Toute la beauté en un seul hub.", color: "beaute" },
  "selection":        { label: "Sélection",               Icon: Calendar,     desc: "Nos coups de cœur et sélections du moment", seoTitle: "Sélections Beauté : Nos Coups de Cœur", seoDesc: "Nos sélections et coups de cœur beauté du moment. Les meilleurs produits testés et approuvés par la rédaction, à prix doux.", color: "selection" },
  "calendrier":       { label: "Calendrier",              Icon: Calendar,     desc: "Calendriers beauté et coffrets à saisir", seoTitle: "Calendriers Beauté : Offres et Coffrets", seoDesc: "Calendriers beauté et coffrets à saisir. Les meilleures offres sur les calendriers des grandes marques beauté.", color: "calendrier" },
  "calendrier-avent": { label: "Calendrier de l'Avent",  Icon: TreePine,     desc: "Les meilleurs calendriers de l'Avent du moment", seoTitle: "Calendriers de l'Avent : comparatif, prix et contenu", seoDesc: "Les meilleurs calendriers de l'Avent : beauté, gourmandise, enfants. Comparatif, prix, contenu détaillé et codes promo pour les acheter moins cher.", color: "calendrier-avent" },
  "code-promo":       { label: "Codes Promo",             Icon: Ticket,       desc: "Les codes promo et réductions du moment, toutes marques", seoTitle: "Codes promo et réductions du moment, toutes marques", seoDesc: "Tous les codes promo du moment, toutes marques et tous univers : beauté, mode, maison, alimentaire. Validité et conditions indiquées sur chaque code.", color: "code-promo" },
};

/**
 * Intros SEO 200-300 mots sur les pages catégorie.
 * Sans ces blocs, Google voyait les pages catégorie comme des pages "thin content"
 * (aucun texte propre, uniquement une grille de liens vers les articles).
 */
const categoryIntros: Record<string, string> = {
  // Le texte promettait « vérifiés un par un par notre équipe » et « capture
  // d'écran de la promo pour preuve ». Ces deux affirmations ne sont pas
  // tenables sur 2 900 articles et exposaient le site : on décrit désormais ce
  // qui est réellement fait sur chaque fiche.
  "bon-plan": `<p>Voici <strong>tous nos bons plans</strong>, tous univers confondus : beauté (Sephora, Yves Rocher, Nuxe, Caudalie), bébé et puériculture (Pampers, Béaba, Tidoo), électroménager (Bosch, Philips, Rowenta), high-tech (Amazon, Cdiscount, Fnac), mode (Showroomprivé, Gémo, Petit Bateau), papeterie et rentrée.</p><p>Sur chaque offre, on indique le <strong>prix constaté</strong>, le prix avant réduction quand il existe, le pourcentage de remise et la <strong>date à laquelle le prix a été vérifié</strong>. Les conditions (code promo, minimum d'achat, expéditeur) sont précisées quand elles s'appliquent. Une offre terminée n'est pas supprimée : elle est signalée comme terminée et rangée dans les <a href="/archives/bons-plans">archives des bons plans</a>, pour que vous ne tombiez pas sur un prix qui n'existe plus.</p><p>Pour aller plus vite, chaque univers a sa propre page : <a href="/bons-plans-beaute">beauté</a>, <a href="/bons-plans-bebe">bébé</a>, <a href="/bons-plans-maison">maison</a>, <a href="/bons-plans-tech">tech</a>, <a href="/bons-plans-mode">mode</a>, <a href="/bons-plans-jardin">jardin et animaux</a>, <a href="/bons-plans-jouets">jouets</a> et <a href="/bons-plans-rentree">rentrée</a>. Vous pouvez aussi explorer par marque via <a href="/marques">notre annuaire</a>, ou consulter les <a href="/codes-promo-permanents">codes promo valables toute l'année</a>.</p>`,

  "test-produit": `<p>Les <strong>tests produits</strong> regroupent à la fois les <a href="/categorie/test-gratuit">tests gratuits</a> (échantillons offerts contre un avis) et les <a href="/categorie/test-avis">avis détaillés</a> sur les produits qu'on a réellement utilisés.</p><p>Pour les tests gratuits, nous référençons les missions Trustt, Konbini, Sampleo, ConsoBaby, Mamadvisor, BeautéTest, Cosmétique-testing et les missions TikTok / Instagram des marques (Marilou Bio, ACM, Tout Petit Marseillais, etc.). L'inscription est toujours gratuite, et le produit est envoyé chez toi en échange d'un avis honnête.</p><p>Côté tests & avis, nous publions des comparatifs (lisseurs, robots aspirateurs, parfums, planchas) et des avis individuels sur les produits phares (Babycook, Foreo Bear, Yuka, Tiger Balm…). On indique systématiquement les avantages ET les inconvénients, parce qu'on est avant tout consommateurs nous aussi.</p>`,

  "test-gratuit": `<p>Cette catégorie réunit les <strong>campagnes de tests produits ouvertes aux candidatures</strong> : beauté, hygiène, bébé, maison, alimentation, animaux et autres univers. Elles peuvent être organisées par des plateformes spécialisées, des communautés de marques ou des panels de consommateurs.</p><p>Pour chaque campagne, nous indiquons lorsque l'information est disponible la <strong>date limite</strong>, le produit proposé, le nombre de testeurs recherchés, les critères de sélection et ce qui est demandé après réception : questionnaire, avis écrit, photo, vidéo ou publication sur les réseaux sociaux. Candidater ne garantit pas d'être sélectionné, et certaines opérations sont réservées à un pays, un âge ou un profil précis.</p><p>La candidature est normalement sans frais, mais lis toujours les conditions avant de transmettre tes données ou de publier du contenu. Vérifie aussi si l'opération concerne un produit en format vente, un échantillon ou un remboursement après achat. Les campagnes terminées sont signalées sur le site afin de distinguer rapidement les tests encore accessibles.</p>`,

  "test-avis": `<p>Cette catégorie rassemble deux formats complémentaires : nos <strong>tests réellement effectués</strong> et nos <strong>analyses détaillées</strong> de produits ou de marques. Lorsqu'un produit a été reçu et utilisé par Nathalie, l'article le précise clairement et décrit son expérience personnelle. Les autres contenus sont présentés comme des analyses documentées de la formule, de l'usage annoncé, des précautions et des critères utiles avant l'achat.</p><p>Tu y trouveras principalement des avis sur les <strong>soins visage et cheveux, parfums, appareils beauté et produits K-beauty</strong>, ainsi que des guides pour comprendre les différences entre plusieurs références. Nous distinguons les promesses des marques, les caractéristiques vérifiables et les impressions ressenties lors d'un véritable test.</p><p>Les prix et disponibilités peuvent évoluer : vérifie toujours les informations affichées par le marchand avant de commander. Certains liens vers Amazon, YesStyle, Awin ou d'autres partenaires sont affiliés. Ils peuvent nous rapporter une commission, <strong>sans coût supplémentaire pour toi</strong>, et n'influencent pas la présentation des limites ou précautions d'un produit.</p>`,

  "comparatif": `<p>Nos <strong>comparatifs et guides d'achat</strong> sont conçus pour t'aider à distinguer plusieurs produits, marques ou modèles selon ton besoin et ton budget. Les critères étudiés varient selon la catégorie : caractéristiques techniques, dimensions, capacité, composition, facilité d'utilisation, entretien, garanties, accessoires inclus ou compatibilité.</p><p>Tu trouveras des sélections de plusieurs références, des comparaisons directes entre deux modèles et des guides consacrés à un usage précis. Les prix mentionnés correspondent à un constat effectué à une date donnée et peuvent changer. Les notes et avis de clients, lorsqu'ils sont cités, apportent un éclairage complémentaire mais ne remplacent pas l'analyse des caractéristiques ni l'expérience personnelle.</p><p>Nous présentons les <strong>avantages, les limites et les profils auxquels chaque produit peut convenir</strong>, sans promettre un choix universel. Certains liens vers Amazon ou d'autres marchands sont affiliés : ils peuvent nous rapporter une commission, sans coût supplémentaire pour toi. Vérifie toujours le prix, le vendeur, la livraison et la garantie affichés avant de commander.</p>`,

  "concours": `<p>Les <strong>jeux concours gratuits</strong> sont notre marque de fabrique : 15 ans d'expérience en tant que concouriste, ça forme un œil ! Nous référençons quotidiennement les meilleurs concours du moment, avec des lots à gagner pour tous les goûts : coffrets beauté (Magnifaïk, Biotyfull, Adopt), voyages (Europa-Park, Center Parcs, MS Vacances), high-tech (smartphones, électroménager), bons d'achat (Sephora, Yves Rocher, Amazon), et même de l'argent en cash.</p><p>Chaque concours indique : la date limite de participation, les lots à gagner précisément, les conditions (achat obligatoire ou non, âge, résidence), et le lien direct pour participer. Nous filtrons les <strong>fake concours</strong> et les arnaques pour ne te proposer que des concours sérieux organisés par des marques réelles ou des plateformes reconnues (La Belle Adresse, MesInstantsVico, MaFamilleZen…).</p><p>Astuce : inscris-toi aussi à notre newsletter — on envoie chaque semaine la sélection des concours qu'on garde "à part" (ceux avec peu de participants donc plus de chances de gagner).</p>`,

  "box-beaute": `<p>Les <strong>box beauté</strong> permettent de découvrir des soins, du maquillage et des produits capillaires à prix réduit. Cette rubrique rassemble les offres de <strong>Glowria, Prescription Lab, Biotyfull Box, Blissim, LOOKFANTASTIC</strong> et d’autres marques, avec un prix et une date de vérification.</p><p>Pour chaque offre, nous détaillons le contenu annoncé, la valeur communiquée par la marque, les frais de livraison et surtout le type de formule : <strong>achat ponctuel, abonnement sans engagement ou engagement sur plusieurs mois</strong>. Ces conditions sont essentielles pour comparer correctement deux prix d’appel.</p><p>Pour une vue plus rapide, consultez aussi notre <a href="/meilleures-box-beaute">comparatif des meilleures box beauté 2026</a>, classé par marque, budget et formule.</p>`,

  "beaute": `<p>Cette catégorie rassemble nos <strong>guides et conseils beauté</strong> consacrés aux soins du visage, aux cheveux, au maquillage, aux parfums et aux appareils beauté. Tu y trouveras des explications pour construire une routine, comprendre les différences entre plusieurs produits et repérer les critères importants avant un achat.</p><p>Selon le sujet, nous examinons la <strong>composition annoncée, le mode d'utilisation, le format, les précautions, le prix constaté ainsi que les avantages et les limites</strong> de chaque référence. Lorsqu'un produit a réellement été reçu et utilisé par Nathalie, l'article le précise. Les autres contenus sont présentés comme des guides ou des analyses, sans inventer de test ni de résultat personnel.</p><p>Pour poursuivre ta recherche, consulte aussi nos <a href="/categorie/test-avis">tests et avis beauté</a>, nos <a href="/categorie/comparatif">comparatifs produits</a> et les <a href="/bons-plans-beaute">bons plans beauté en cours</a>. Les prix et disponibilités peuvent évoluer : vérifie toujours les informations affichées par le marchand avant de commander.</p>`,

  "selection": `<p>Nos <strong>sélections beauté</strong> sont nos coups de cœur du moment, testés et approuvés par la rédaction. À la différence des bons plans (qui priorisent le prix) ou des tests avis (qui détaillent un produit), les sélections sont des regroupements éditoriaux pour des occasions précises : "Top 5 produits pour la peau sèche", "Notre routine anti-âge à moins de 50€", "Les meilleurs cadeaux beauté pour la Fête des Mères", "Notre sélection bio pour les peaux sensibles"…</p><p>Chaque sélection mélange grandes marques (Caudalie, Nuxe, La Roche-Posay) et marques indé (Endro, Centifolia, Marilou Bio) pour t'offrir le meilleur de chaque univers. Les prix vont du très accessible (~10€) au premium (~100€) pour s'adapter à tous les budgets.</p>`,

  "calendrier": `<p>Les <strong>calendriers beauté</strong> regroupent les coffrets et boîtes éphémères qui rythment l'année : calendrier de l'Avent (novembre-décembre), coffrets Saint-Valentin, coffrets Fête des Mères, coffrets Fête des Pères, coffrets Noël… Bref, toutes les occasions où les marques sortent des produits ou packs limités à valeur ajoutée.</p><p>On référence les calendriers de toutes les grandes marques (Sephora, Dior, Yves Rocher, Nuxe, Caudalie, Rituals, Lookfantastic) et on indique : le prix de lancement, la valeur réelle des produits inclus (souvent +200% du prix payé), le contenu détaillé, les meilleurs codes promo pour les acheter moins cher.</p>`,

  "calendrier-avent": `<p>Le <strong>calendrier de l'Avent beauté</strong> est devenu un incontournable de fin d'année. Nous comparons chaque année les meilleurs calendriers du marché : <strong>Sephora</strong> (le plus généreux en valeur), <strong>Lookfantastic</strong> (marques internationales premium), <strong>Dior</strong> (le luxe), <strong>Rituals</strong> (le meilleur rapport contenu/prix), <strong>Yves Rocher</strong> (le plus accessible), <strong>Birchbox</strong>, <strong>Glossybox</strong>…</p><p>Pour chaque calendrier, on indique : le prix, la valeur des produits inclus (souvent 2-3 fois le prix), le nombre de cases (24-25), la répartition skincare / maquillage / parfum / corps, les marques présentes, et notre note finale. Le top achat se fait début octobre — les meilleurs partent vite.</p><p>Conseil : pour économiser, surveille les <strong>codes promo de pré-commande</strong> (souvent -10 à -20% en septembre-octobre).</p>`,

  "code-promo": `<p>Tous les <strong>codes promo</strong> vérifiés et à jour pour économiser sur tes achats en ligne. Beauté (Sephora, Yves Rocher, Adopt, Caudalie, Nuxe, Dr Pierre Ricaud), mode (Blanche Porte, Petit Bateau, Gémo, Showroomprivé), animaux (Zooplus), alimentaire bio (Greenweez, Léa Nature), high-tech (Cdiscount, Boulanger), grandes marketplaces…</p><p>Chaque code est <strong>testé et daté</strong> : on indique la réduction (%, €, livraison offerte), les conditions (minimum d'achat, exclusions), la durée de validité, et la marche à suivre exacte pour l'appliquer. Si un code expire, on le retire ou on le grise immédiatement pour ne pas te faire perdre de temps.</p><p>Astuce : combine toujours un code promo avec un <strong>cashback iGraal</strong> (1-20% remboursés) pour maximiser tes économies. On en parle dans <a href="/codes-promo-permanents">notre page codes promo permanents</a> qui liste toutes les marques avec des codes valables toute l'année.</p>`,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryConfig[slug];
  if (!cat) return {};
  return {
    title: cat.seoTitle,
    description: cat.seoDesc,
    alternates: { canonical: `https://bonsplansmania.fr/categorie/${slug}` },
    openGraph: {
      title: cat.seoTitle,
      description: cat.seoDesc,
      url: `https://bonsplansmania.fr/categorie/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: cat.seoTitle,
      description: cat.seoDesc,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = categoryConfig[slug];
  if (!cat) notFound();

  // Pages parentes : elles n'ont pas d'article à elles, elles agrègent leurs
  // sous-catégories. Sans ça, /categorie/calendrier s'affichait « 0 article »
  // alors que calendrier-avent en compte plusieurs (constaté le 02/08/2026).
  const PARENT_CATEGORIES: Record<string, string[]> = {
    "test-produit": ["test-gratuit", "test-avis"],
    "calendrier": ["calendrier-avent"],
  };
  const children = PARENT_CATEGORIES[slug];
  const articles = children
    ? children
        .flatMap((c) => getArticlesByCategory(c))
        .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    : getArticlesByCategory(slug);

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
      expired: isEffectivelyExpired(a.meta),
      expiresSoon: expiresSoon(a.meta),
      endDate: a.meta.endDate,
      featured: a.meta.featured,
      tags: a.meta.tags,
      price: a.meta.price,
      amazonAsin: a.meta.amazonAsin,
      affiliateUrl: a.meta.affiliateUrl,
    };
  });

  // Catégories où les filtres sont utiles (avec prix / marques / remises)
  // Filtres : liste blanche dédiée par catégorie (box-beaute, bon-plan)
  const useBoxFilter = slug === "box-beaute";
  const useBonPlanFilter = slug === "bon-plan";
  // Tri seul (sans dropdown marques) pour faciliter le nettoyage des vieilles entrées
  const useSortOnlyFilter = ["concours", "test-produit", "test-gratuit", "test-avis"].includes(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: cat.label,
          description: cat.desc,
          url: `https://bonsplansmania.fr/categorie/${slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 10).map((a, i) => ({
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
            { "@type": "ListItem", position: 2, name: cat.label },
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
              <span><cat.Icon size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />{cat.label}</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <cat.Icon size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />{cat.label}
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              {cat.desc} — {articles.length} article{articles.length > 1 ? "s" : ""}
            </p>
            {slug === "bon-plan" && (
              <a
                href="/archives/bons-plans"
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginTop: "16px", padding: "10px 18px", borderRadius: "2px", background: "#7F1D1D", color: "white", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}
              >
                <Archive size={15} /> Consulter les bons plans terminés
              </a>
            )}
            {slug === "concours" && (
              <a
                href="/calendriers-de-l-avent-concours-2026"
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginTop: "16px", padding: "10px 18px", borderRadius: "2px", background: "#991B1B", color: "white", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}
              >
                <TreePine size={15} /> Calendriers de l’Avent concours 2026
              </a>
            )}
            {slug === "test-produit" && (
              <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
                <a href="/categorie/test-gratuit" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "2px", background: "#E4EFEA", color: "#1F6D58", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", border: "1px solid #BFD6CC" }}>
                  <Gift size={14} /> Tests Gratuits
                </a>
                <a href="/categorie/test-avis" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "2px", background: "#ECE6F0", color: "#5E416F", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", border: "1px solid #D4C7DB" }}>
                  <FlaskConical size={14} /> Tests & Avis
                </a>
              </div>
            )}
          </div>
        </section>

        {categoryIntros[slug] && (
          <section className="container" style={{ paddingTop: "20px", paddingBottom: "0" }}>
            <div
              style={{ background: "white", border: "1px solid var(--border, #e5e7eb)", borderRadius: "16px", padding: "24px 28px", fontSize: "0.97rem", lineHeight: 1.65, color: "#1f2937" }}
              dangerouslySetInnerHTML={{ __html: categoryIntros[slug] }}
            />
          </section>
        )}

        <section className="section">
          <div className="container">
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Aucun article dans cette catégorie pour le moment.
              </p>
            ) : useBoxFilter ? (
              <BrandFilter articles={cards} brands={BOX_BEAUTE_BRANDS} />
            ) : useBonPlanFilter ? (
              <BrandFilter articles={cards} brands={ALL_DEAL_BRANDS} sortBrandsBy="alpha" />
            ) : useSortOnlyFilter ? (
              <BrandFilter articles={cards} brands={[]} />
            ) : (
              <LoadMoreGrid articles={cards} />
            )}

            {/* Pagination statique : lien vers les pages paginées pour que Google découvre tous les articles
                (le LoadMoreGrid charge en JS donc les articles 25+ sont invisibles dans le HTML statique) */}
            {articles.length > 24 && (
              <nav aria-label="Pagination" style={{ marginTop: "40px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ padding: "10px 16px", fontWeight: 600 }}>Page 1 sur {Math.ceil(articles.length / 24)}</span>
                <a href={`/categorie/${slug}/page/2`} rel="next" style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border, #e5e7eb)", textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Suivante <ChevronRight size={16} />
                </a>
              </nav>
            )}
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "24px" }}>
          <AdBlock format="in-article" />
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
      <StickyAdMobile />
    </>
  );
}
