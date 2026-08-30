// Seuil relevé de 3 à 30 le 03/08/2026. À 3 articles, on générait 2082 pages dont
// 2050 n'avaient jamais reçu un seul clic en 12 mois (export Search Console : la
// 1000e page listée est déjà à 1 clic, donc les absentes sont bien à zéro).
// Ces pages quasi vides absorbaient du crawl et du jus interne pour rien.
export const MIN_ARTICLES_FOR_STATIC_TAG_PAGE = 30;

export const CURATED_TAG_SLUGS = new Set([
  // 1. Marques qui rapportent des clics ou des impressions selon Search Console,
  //    même avec peu d'articles. Relevé du 31/07/2026, à réviser tous les 6 mois.
  "pampers",           // 25 clics, 2644 impressions — la meilleure page /marque/ du site
  "cdiscount",
  "la-fournee-doree",
  "steampod",
  "tefal",
  "laneige",
  "adopt",
  "moulinex",
  "soignon",
  "envie-de-plus",
  "dash",
  "kindle",
  "segway",
  "maped",
  "aubert",
  "tennis",
  "echantillon",
  "ventilateur-colonne",
  "routines-beaute",
  "jeu-gratuit",
  "concours-avec-obligation-achat",
  // 2. Marques partenaires, gardées pour des raisons éditoriales même sans trafic.
  "nyx",
  "maybelline",
  "loreal",
  "garnier",
  "cerave",
  "la-roche-posay",
  "neutrogena",
  "kerastase",
  "moroccanoil",
  "nuxe",
  "weleda",
  "bioderma",
  "rimmel",
  "catrice",
  "nivea",
  "glowria",
  "prescription-lab",
  "biotyfull",
  "blissim",
  "igraal",
  "ebuyclub",
  "poulpeo",
  "sephora",
  "yves-rocher",
  "amazon",
  "bebeboutik",
  "braun",
  "cattier",
  "carte-noire",
  "wonderbox",
  "my-little-box",
  "melvita",
  "the-ordinary",
  "uriage",
  "audible",
  "garancia",
  "stabilo",
  "christophe-robin",
  "lefant",
  "lancome",
  "solcotton",
  "marie-claire",
  "king-c-gillette",
  "dr-pierre-ricaud",
  "mustela",
  "loreal-professionnel",
  "make-up-for-ever",
  "signal",
  "lancaster",
  "institut-esthederm",
  "baija",
  "loccitane",
  "cosmopolitan",
  "nuk",
  "beaba",
  "algologie",
  "maxi-mag",
  "eclae",
  "peggy-sage",
  "famille-mary",
  "topicrem",
  "dr-hauschka",
  "kerargan",
  "wella-professionals",
  "chloe",
  "playmobil",
  "zigbuy",
  "blancheporte",
  "beauty-of-joseon",
  "carolina-herrera",
  "coupon-network",
  "conquerant",
  "beauty-success",
  "bayard-jeunesse",
  "bose",
  "waterpik",
  "revitabrow",
  "etude",
  "sobio-etic",
  "acorelle",
  "aldi",
  "omum",
  "smeg",
  "roomba",
  "micromania",
  "alga-maris",
  "mixa",
  "apple",
  "fisura",
  "bledina",
  "nescafe",
  "san-marco",
  "powerbar",
  "insta360",
  "lagrange",
]);

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Les pages /marque/ ne doivent contenir QUE des marques. Sans ce filtre, des tags
// génériques ou datés ("2026", "bon plan", "juillet 2026", "promo") génèrent des pages
// de plusieurs centaines d'articles qui cannibalisent /categorie/* et diluent le crawl.
// Mesuré au 03/08/2026 : 48 pages de ce type, 4 clics et 53 impressions cumulés.

// Mots génériques : ce sont des catégories ou des arguments de vente, pas des marques.
const GENERIC_TAG_SLUGS = new Set([
  "bon-plan", "bons-plans", "promo", "promos", "promotion", "promotions",
  "code-promo", "codes-promo", "reduction", "reductions", "remise", "remises",
  "soldes", "offre", "offres", "deal", "deals", "vente-privee", "ventes-privees",
  "pas-cher", "moins-cher", "gratuit", "cadeau", "cadeaux", "concours",
  "choix-amazon",
  "beaute", "maison", "maison-connectee", "maison-entretien", "mode", "jardin",
  "skincare-homme", "bb-cream-solaire", "parfum-homme", "serum-cheveux",
  "brosse-soufflante", "contour-yeux", "chaussures-enfant", "chaussures-enfants",
  "rasage", "rasoir-homme", "tracteur-tondeuse", "complements-alimentaires",
  "baume-a-levres", "cadeau-beaute", "humidificateur", "box-beaute-bio",
  "smartphone", "tonique", "routine-coreenne", "deal-du-jour", "jeux",
  "aspirateur-robot", "double-serum", "pouvoir-achat", "ordinateur",
  "lait-de-chevre", "yuka-excellent", "soins-naturels", "mode-homme",
  "lifestyle", "ongles", "abonnement-beaute", "huile-prodigieuse",
  "satisfait-ou-rembourse",
  "philips-oneblade",
  "beaute-francaise", "beaute-premium",
  "machine-a-glace",
  "tire-lait",
  "parfumerie-francaise",
  "chauffe-biberon",
  "gel-douche", "masque-cheveux",
  "offre-flash",
  "cadeau-homme", "routine-complete", "deodorant", "rasoir",
  "capsules",
  "fabrique-en-france",
  "ninja-foodi", "sous-vetement", "cadeau-naissance",
  "dermo-cosmtique", "beaute-homme", "maquillage-levres",
  "beaute-bio", "calendrier-beaute",
  "wet-and-dry", "keratine",
  "creme-depilatoire", "soins-solaires",
  "creme-de-nuit", "premieres-rides",
  "articulee", "tondeuse-intime", "musique", "no-frost",
  "hypoallergenique", "tas113e",
  "daim", "aosu", "lip-tint", "hyalu-plump", "ventes-privees-mode",
  "chelsea", "swim-center",
  "concours-mariage", "snktio", "manche-bois", "epilateur-electrique",
  "vintage-gino", "apramo", "normal", "appli-gratuite",
  "rafraichisseur", "dessin", "sac-a-dos-robot", "supergoop",
  "boissons", "simulation-conduite", "warda",
  "gedtech", "halita", "kelo-cote", "ass", "sjour-gratuit",
  "gommage-levres", "tote-bag", "creme-cicatrisante",
  "chemise", "couverture", "feutres", "compensees", "palette",
  "cheirosa-62", "cosmetique-marine",
  "eye-care-cosmetics", "geometrie", "vacances-bebe", "savon-visage",
  "peau-metissee", "drap-housse", "some-by-mi", "four-pizza", "tribu-crinex",
  "crme", "luna-4", "crayon-sourcils", "transformation",
  "activateur-bronzage", "hydratation-24h",
  "parfum-ete", "moins-50-pourcent", "maternelle", "dashcam",
  "curly-girl", "vendee",
  "diffuseur", "peau-reactive", "coffret-gourmand", "soin-yeux",
  "coup-d-envoi-du-style", "aspirateur-balai",
  "lycee", "beaut-gratuit", "fleurs-de-cerisier", "100-gagnant",
  "powerbeats-pro-2", "85-cm", "repulpant", "arnica", "humour",
  "eau-cellulaire",
  "chques-cadeaux", "aquaria", "cuisson", "fast-food", "eau-thermale",
  "aspi-laveur", "tk-gruppe",
  "poils-de-sanglier", "burger", "pierre-naturelle", "rasoir-lectrique",
  "bille", "routine-corenne", "40-ans",
  "revix", "guide-tondeuse", "360", "levis", "biofresh",
  "amazon-basics", "antipelliculaire", "gelato",
  "brosse-dents-electrique", "sans-sac", "vacances-haute-savoie",
  "sstrene-grene", "baume-corps", "very-rose", "sangle", "hartmann",
  "barbier", "coup-de-chaleur",
  "jeu-de-douilles", "spf-15", "galaxy-tab-a11-plus", "mural",
  "batterie-supplementaire", "vaseline", "secateur", "gomme",
  "comparateur-assurance",
  "yuzonc", "morosil", "cristiano-ronaldo-lego", "ple-emploi",
  "jupe-plissee", "vanlife", "ce", "anti-uv-50",
  "zen-air", "rparation-cutane", "lucibel", "sid-nutrition",
  "roomba-plus-415", "routine-hydratation-jour", "active-max",
  "belle-au-naturel-box", "duo-solaire", "artisan",
  "mjamjam", "tltravail", "bluetooth-v54", "dessin-croquis",
  "anastore", "real-techniques", "rozana", "all-star",
  "salomon", "climatiseur-3-en-1", "des-la-naissance", "intel-core-i3",
  "table-manger", "selsey", "offre-ete",
  "voltman", "galaxy-buds3-pro", "produit-menager",
  "dissolvant-autobronzant", "embellisseur-pinceau", "concours-seb",
  "babycook", "total-eye-lift", "aspire-go-15",
  "ryzen-5", "3-batteries", "produit", "bons-plans-darty",
  "sweetswirl", "mon-bento", "box-juillet-2026", "elgydium",
  "haute-couvrance",
  "piscine-enterre", "radiateur", "anti-age-preventif",
  "centella-asiatica", "crayons-effacables", "marvel", "vacances-mer",
  "cuisine", "high-tech", "tech", "bebe", "enfant", "homme", "femme",
  "maillot", "mains-libres", "test", "tests", "avis", "comparatif",
  // Doublons exacts d'une /categorie/ : même contenu, même requête, deux URL.
  "test-gratuit", "tests-gratuits", "test-produit", "test-produit-gratuit",
  "produits-gratuits", "brume-parfumee", "alimentation-bebe",
  "test-avis", "box-beaute", "coffret-beaute", "calendrier-avent", "calendrier", "selection",
  "bon-plan-beaute", "instant-gagnant", "instants-gagnants", "jeu-concours",
  "jeux-concours", "tirage-au-sort", "echantillon-gratuit", "echantillons-gratuits",
  "archive", "archives", "france",
]);

// Mois : un tag "avril" ou "juin 2026" est une date, jamais une marque.
// "mars" est volontairement absent — c'est aussi une vraie marque.
const MONTH_SLUGS = new Set([
  "janvier", "fevrier", "avril", "mai", "juin", "juillet",
  "aout", "septembre", "octobre", "novembre", "decembre",
]);

// Variantes de marques redirigées vers une page canonique unique.
const BRAND_ALIAS_SLUGS = new Set(["loreal-paris", "l-oreal", "blanche-porte", "adopt-parfum", "nescaf"]);

export function isNonBrandTagSlug(slug: string): boolean {
  if (GENERIC_TAG_SLUGS.has(slug) || MONTH_SLUGS.has(slug) || BRAND_ALIAS_SLUGS.has(slug)) return true;
  // Contient une année : "2026", "juillet-2026", "soldes-ete-2026", "fin-31-juillet-2026"
  if (/(?:^|-)(?:19|20)\d{2}(?:$|-)/.test(slug)) return true;
  // Caractéristique technique : "9000-btu", "2200w", "1000-euros"
  if (/^\d/.test(slug)) return true;
  return false;
}

export function shouldGenerateTagPage(slug: string, count: number): boolean {
  if (isNonBrandTagSlug(slug)) return false;
  return CURATED_TAG_SLUGS.has(slug) || count >= MIN_ARTICLES_FOR_STATIC_TAG_PAGE;
}

export function getStaticTagSlugs(
  articleTagGroups: Iterable<Iterable<string>>
): Set<string> {
  const counts = new Map<string, number>();

  for (const tags of articleTagGroups) {
    const seen = new Set<string>();
    for (const tag of tags) {
      const slug = slugifyTag(tag);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
  }

  return new Set(
    [...counts.entries()]
      .filter(([slug, count]) => shouldGenerateTagPage(slug, count))
      .map(([slug]) => slug)
  );
}
