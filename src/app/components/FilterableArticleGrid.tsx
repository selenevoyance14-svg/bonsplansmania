"use client";

import { Fragment, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Filter, X } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";
import { parsePrice } from "@/lib/price";

interface ArticleListItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  imageAlt: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  readingTime: string;
  expired?: boolean;
  featured?: boolean;
  tags?: string[];
  price?: string;
  affiliateUrl?: string;
}

const PER_PAGE = 24;

const CTA_BY_COLOR: Record<string, string> = {
  "bon-plan": "Voir l'offre",
  "bon-plan-beaute": "Voir l'offre",
  "test-gratuit": "Postuler",
  "test-avis": "Lire le test",
  "comparatif": "Lire le comparatif",
  "concours": "Participer",
  "box-beaute": "Voir la box",
  "code-promo": "Voir le code",
  "beaute": "Lire l'article",
  "calendrier-avent": "Découvrir",
  "calendrier": "Découvrir",
};

const BADGE_BY_COLOR: Record<string, string> = {
  "code-promo": "Code",
};

// Tags génériques à exclure de la détection de marque
const EXCLUDED_TAG_SLUGS = new Set([
  // Catégories / types d'article
  "bon-plan", "bon-plan-beaute", "test-gratuit", "test-gratuit-beaute", "test-avis", "test-produit",
  "concours", "concours-beaute", "box-beaute", "code-promo", "calendrier-avent",
  "selection", "beaute", "beautet", "beaut",
  "guide", "guide-achat", "comparatif", "avis", "test",
  // Mécaniques concours
  "instant-gagnant", "tirage", "tirage-au-sort", "ambassadrice", "ambassadeur",
  "testeur", "testeuse", "echantillon", "jeu", "jeux", "jeu-concours", "jeux-concours",
  "jeu-gratuit", "jeux-gratuits", "lots", "lot-a-gagner", "carte-cadeau", "bon-d-achat",
  "bons-d-achat", "bon-cadeau",
  // Promo / commerce
  "promo", "promos", "soldes", "ventes-flash", "vente-flash", "deal", "deal-du-jour",
  "vente-privee", "ventes-privees", "offre", "offres", "offre-limitee", "offres-limitees",
  "bons-plans", "nouveaute", "nouveautes", "bestseller", "best-seller",
  "french-days", "french-week", "black-friday", "cyber-monday", "choice-day",
  "shopping-days", "soldes-ete", "soldes-hiver",
  "code", "remise", "reduction", "reductions", "gratuit",
  "pas-cher", "moins-cher", "petit-budget", "format-voyage", "idee-cadeau", "idees-cadeaux",
  // Qualité produit
  "bio", "vegan", "cruelty-free", "made-in-france", "fabrique-france", "francais",
  "naturel", "naturelle", "100-naturel", "100-pourcent-naturel",
  "yuka", "yuka-excellent", "ecocert", "cosmos-organic", "cosmebio",
  "sans-parfum", "sans-paraben", "hypoallergenique", "dermatologique", "dermatologie",
  "sans-engagement",
  // Saisons / périodes
  "ete", "ete-2026", "hiver", "hiver-2026", "printemps", "printemps-2026", "automne",
  "automne-2026", "rentree", "rentree-2026", "rentree-des-classes",
  "fete-des-meres", "fete-des-peres", "fete-des-grands-meres", "fete-des-grands-peres",
  "saint-valentin", "paques", "paque", "noel", "halloween",
  // Sous-catégories produits trop génériques (beauté)
  "cosmetique", "cosmetiques", "skincare", "routine-beaute", "routine",
  "maquillage", "soin", "soin-visage", "soin-corps", "soin-cheveux", "soin-pieds",
  "soin-peau", "soins-marins", "soin-marin",
  "creme", "creme-hydratante", "serum", "parfum", "parfums", "parfum-femme", "parfum-homme",
  "parfum-pas-cher", "parfum-ete", "eau-de-parfum", "brume-corps", "brume-corporelle",
  "brume-cheveux", "fragrance",
  "shampoing", "shampoo", "shampooing", "deodorant", "cheveux", "seche-cheveux", "coiffure",
  "anti-chute", "anti-taches", "anti-age", "vitamine-c", "ceramides",
  "solaire", "protection-solaire", "creme-solaire", "spf-50", "spf50",
  "autobronzant", "demaquillant",
  "huile-essentielle", "huiles-essentielles", "aromatherapie",
  "complement-alimentaire", "complement", "complements", "sante", "bien-etre",
  "energie", "detox", "sommeil",
  // Catégories produits hors beauté
  "high-tech", "hightech", "tech", "multimedia", "electromenager",
  "maison", "cuisine", "patisserie", "recette", "recettes", "yaourt-maison",
  "jardin", "mobilier-jardin", "mobilier", "exterieur", "piscine", "camping",
  "decoration", "deco",
  "mode", "vetement", "vetements", "chaussures", "chaussure", "accessoire", "accessoires",
  "bebe", "enfant", "famille", "femme", "homme", "ado", "adultes",
  "literie", "matelas", "oreiller", "couette", "surmatelas",
  "voyage", "vacances", "sejour",
  "sport", "fitness",
  "smartphone", "iphone", "smartphone-reconditionne", "iphone-reconditionne",
  "reconditionne", "montre-connectee",
  "alimentaire", "alimentation", "epicerie", "epicerie-solidaire", "courses",
  "supermarche", "supermarches", "vin", "chocolat", "whisky", "biere", "spiritueux",
  "ski", "savoie",
  // Aides / finances / SEO long-tail
  "aides-caf", "aide-etat", "aides-etat", "allocation-familiale", "allocation-rentree-scolaire",
  "asf", "paje", "aide-vacances", "prime-demenagement", "prime-activite",
  "pouvoir-achat", "pouvoir-d-achat", "indemnite-carburant", "cheque-energie",
  "ars", "caf", "ccas", "colis-alimentaire", "aide-alimentaire", "aide-famille",
  "inflation", "economies", "economie", "fournitures-scolaires",
  "secours-populaire", "croix-rouge", "restos-du-coeur",
  // Réseaux / canaux
  "tiktok", "instagram", "facebook", "twitter", "youtube",
  // Mois / années
  "2023", "2024", "2025", "2026", "2027",
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre",
  // Génériques
  "shopping", "cadeau", "cadeaux", "originale", "originaux", "limite", "limitee",
  "exclusive", "exclusivite", "exclusif", "premium", "luxe", "deluxe", "edition-limitee",
  "lot", "pack", "coffret", "trousse", "box", "abonnement",
]);

// Préfixes à exclure (tags qui commencent par ces mots → pas une marque)
const EXCLUDED_PREFIX_REGEX = [
  /^fin-/,            // "fin-15-juin-2026" (date de fin de promo)
  /^moins-/,          // "moins-de-20-euros", "moins-44-pourcent"
  /^plus-de-/,        // "plus-de-50-euros"
  /^a-partir-de-/,    // "a-partir-de-100-euros"
  /^jusqu-a-/,        // "jusqu-a-50"
  /^-/,               // tags qui commencent par "-" (ex: "-50%")
  /-euros?$/,         // "20-euros", "moins-de-30-euros"
  /-pourcent$/,       // "44-pourcent"
];

// Labels de marque normalisés (pour affichage propre)
const BRAND_DISPLAY: Record<string, string> = {
  "amazon": "Amazon",
  "cdiscount": "Cdiscount",
  "sephora": "Sephora",
  "yves-rocher": "Yves Rocher",
  "lookfantastic": "Lookfantastic",
  "biotyfull": "Biotyfull Box",
  "biotyfull-box": "Biotyfull Box",
  "blissim": "Blissim",
  "baija": "BAÏJA",
  "loccitane": "L'Occitane",
  "occitane": "L'Occitane",
  "dr-pierre-ricaud": "Dr Pierre Ricaud",
  "pierre-ricaud": "Dr Pierre Ricaud",
  "showroom-prive": "Showroom Privé",
  "showroomprive": "Showroom Privé",
  "yesstyle": "YesStyle",
  "beauty-success": "Beauty Success",
  "adopt": "Adopt'",
  "adopt-parfums": "Adopt'",
  "lea-nature": "Léa Nature",
  "atelier-du-sourcil": "L'Atelier du Sourcil",
  "miin": "MiiN Cosmetics",
  "miin-cosmetics": "MiiN Cosmetics",
  "marionnaud": "Marionnaud",
  "nocibe": "Nocibé",
  "yves-saint-laurent": "Yves Saint Laurent",
  "ysl": "Yves Saint Laurent",
  "acm": "ACM",
  "la-roche-posay": "La Roche-Posay",
  "tectake": "tectake",
  "loreal": "L'Oréal",
  "loreal-paris": "L'Oréal Paris",
  "cashback": "Cashback",
  "kbeauty": "K-Beauty",
  "k-beauty": "K-Beauty",
  "puericulture": "Puériculture",
};

function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['"]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function prettifyBrandSlug(slug: string): string {
  // ex: "dr-pierre-ricaud" → "Dr Pierre Ricaud"
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Garde les accents du tag original (ex: "Léa Nature", "L'Oréal Paris")
function prettifyOriginal(text: string): string {
  return text
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => {
      // "AMAZON" → "Amazon" (évite les noms en majuscules)
      if (part === part.toUpperCase() && part.length > 1) {
        return part[0] + part.slice(1).toLowerCase();
      }
      return part[0].toUpperCase() + part.slice(1);
    })
    .join(" ");
}

/**
 * Liste les tags de l'article candidats à être une marque (mot propre, ni générique, ni date).
 */
function getBrandCandidates(article: ArticleListItem): { slug: string; original: string }[] {
  const candidates: { slug: string; original: string }[] = [];
  for (const tag of article.tags || []) {
    const slug = slugifyTag(tag);
    if (!slug) continue;
    if (slug.length < 3 || slug.length > 40) continue;
    if (EXCLUDED_TAG_SLUGS.has(slug)) continue;
    if (/^\d/.test(slug)) continue;
    // Patterns mois-année
    if (/^(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)(-\d{4})?$/.test(slug)) continue;
    // Patterns purement numériques
    if (/^[0-9-]+$/.test(slug)) continue;
    // Préfixes/suffixes génériques (fin-, moins-, X-euros, X-pourcent…)
    if (EXCLUDED_PREFIX_REGEX.some((re) => re.test(slug))) continue;
    candidates.push({ slug, original: tag });
  }
  return candidates;
}

function getBrandLabel(slug: string, original?: string): string {
  if (BRAND_DISPLAY[slug]) return BRAND_DISPLAY[slug];
  if (original) return prettifyOriginal(original);
  return prettifyBrandSlug(slug);
}

type PriceRange = "all" | "lt30" | "30to100" | "gt100";
type DiscountFilter = "all" | "20" | "50" | "70";
type SortBy = "recent" | "oldest" | "discount" | "price-asc" | "price-desc";
type ConcoursType = "all" | "instant-gagnant" | "tirage" | "test-creatif";

// Détecte le type de concours à partir du titre / tags
function detectConcoursType(article: ArticleListItem): ConcoursType | null {
  const haystack = [article.title.toLowerCase(), ...(article.tags || []).map((t) => t.toLowerCase())].join(" ");
  if (haystack.includes("instant gagnant") || haystack.includes("instant-gagnant") || haystack.includes("100% gagnant") || haystack.includes("100 pourcent gagnant")) {
    return "instant-gagnant";
  }
  if (haystack.includes("tirage au sort") || haystack.includes("tirage")) {
    return "tirage";
  }
  if (haystack.includes("concours photo") || haystack.includes("concours createur") || haystack.includes("creatif")) {
    return "test-creatif";
  }
  return null;
}

export default function FilterableArticleGrid({ articles, category, brandsOnly }: { articles: ArticleListItem[]; category?: string; brandsOnly?: boolean }) {
  const [visible, setVisible] = useState(PER_PAGE);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [discountFilter, setDiscountFilter] = useState<DiscountFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [concoursType, setConcoursType] = useState<ConcoursType>("all");

  // Visibilité des filtres selon la catégorie
  // Seul bon-plan a des prix structurés exploitables (now + au lieu de + remise)
  // Code-promo, concours, tests : pas de prix/remise (codes variables, gratuit, ou pas de structure prix)
  const isBonPlan = category === "bon-plan" || category === "bon-plan-beaute";
  const isConcours = category === "concours";
  // Mode "brandsOnly" : seul le filtre marque est affiché (ex: /bons-plans-en-cours)
  const showPriceFilter = !brandsOnly && isBonPlan;
  const showDiscountFilter = !brandsOnly && isBonPlan;
  const showConcoursTypeFilter = !brandsOnly && isConcours;
  const showFeaturedFilter = !brandsOnly;

  // Pré-calcule les métadonnées de chaque article
  // brandCandidates : tags candidats marque avec leur version originale (pour garder les accents)
  const enriched = useMemo(() => {
    return articles.map((a) => {
      const brandCandidates = getBrandCandidates(a);
      const brandSlugs = brandCandidates.map((c) => c.slug);
      const parsed = parsePrice(a.price);
      return { article: a, brandCandidates, brandSlugs, ...parsed, nowNum: parsed.nowAmount };
    });
  }, [articles]);

  // Liste des marques présentes : seulement celles avec >= 2 articles dans cette catégorie
  // pour éviter de proposer un filtre sur une marque qui n'a qu'un seul article
  // (cas Pierre Ricaud sur /test-gratuit : pas de vrais tests gratuits chez eux)
  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    // On garde la version originale (avec accents) la plus longue pour chaque slug
    // Ex : pour slug "lea-nature", on préfère "Léa Nature" à "lea nature"
    const originals = new Map<string, string>();
    for (const e of enriched) {
      const seen = new Set<string>();
      for (const { slug, original } of e.brandCandidates) {
        if (seen.has(slug)) continue;
        seen.add(slug);
        counts.set(slug, (counts.get(slug) || 0) + 1);
        // On garde la version avec des accents si on en trouve une
        const existing = originals.get(slug);
        if (!existing || (original.length >= existing.length && /[éèêëàâäùûüôöîïçÉÈÊËÀÂÄÙÛÜÔÖÎÏÇ]/.test(original))) {
          originals.set(slug, original);
        }
      }
    }
    const MIN_ARTICLES_PER_BRAND = 2;
    const result = Array.from(counts.entries())
      .filter(([, n]) => n >= MIN_ARTICLES_PER_BRAND)
      .map(([slug, n]) => ({ slug, label: getBrandLabel(slug, originals.get(slug)), count: n }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    return result.slice(0, 60);
  }, [enriched]);

  // Vérifie quels filtres sont disponibles
  const hasPriceData = useMemo(() => enriched.some((e) => e.nowNum !== undefined), [enriched]);
  const hasDiscountData = useMemo(() => enriched.some((e) => e.discountPct !== undefined), [enriched]);
  // Coups de cœur : on n'affiche le filtre que s'il y a au moins 3 articles featured,
  // sinon le filtre est peu utile (renvoyait souvent vide ou très peu d'articles)
  const featuredCount = useMemo(() => articles.filter((a) => a.featured).length, [articles]);
  const hasFeatured = showFeaturedFilter && featuredCount >= 3;

  // Filtre + tri
  const filtered = useMemo(() => {
    let list = enriched;

    if (selectedBrand) {
      list = list.filter((e) => e.brandSlugs.includes(selectedBrand));
    }
    if (showPriceFilter && priceRange !== "all" && hasPriceData) {
      list = list.filter((e) => {
        if (e.nowNum === undefined) return false;
        if (priceRange === "lt30") return e.nowNum < 30;
        if (priceRange === "30to100") return e.nowNum >= 30 && e.nowNum <= 100;
        if (priceRange === "gt100") return e.nowNum > 100;
        return true;
      });
    }
    if (showDiscountFilter && discountFilter !== "all" && hasDiscountData) {
      const threshold = parseInt(discountFilter, 10);
      list = list.filter((e) => e.discountPct !== undefined && e.discountPct >= threshold);
    }
    if (showConcoursTypeFilter && concoursType !== "all") {
      list = list.filter((e) => detectConcoursType(e.article) === concoursType);
    }
    if (featuredOnly) {
      list = list.filter((e) => e.article.featured);
    }

    // Tri
    const sorted = [...list];
    if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.article.date).getTime() - new Date(a.article.date).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.article.date).getTime() - new Date(b.article.date).getTime());
    } else if (sortBy === "discount") {
      sorted.sort((a, b) => (b.discountPct || 0) - (a.discountPct || 0));
    } else if (sortBy === "price-asc") {
      sorted.sort((a, b) => (a.nowNum || Infinity) - (b.nowNum || Infinity));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => (b.nowNum || -Infinity) - (a.nowNum || -Infinity));
    }

    return sorted.map((e) => e.article);
  }, [enriched, selectedBrand, priceRange, discountFilter, sortBy, featuredOnly, hasPriceData, hasDiscountData, concoursType, showPriceFilter, showDiscountFilter, showConcoursTypeFilter]);

  const activeFilters =
    (selectedBrand ? 1 : 0) +
    (showPriceFilter && priceRange !== "all" ? 1 : 0) +
    (showDiscountFilter && discountFilter !== "all" ? 1 : 0) +
    (showConcoursTypeFilter && concoursType !== "all" ? 1 : 0) +
    (featuredOnly ? 1 : 0);

  const resetFilters = () => {
    setSelectedBrand(null);
    setPriceRange("all");
    setDiscountFilter("all");
    setSortBy("recent");
    setFeaturedOnly(false);
    setConcoursType("all");
    setVisible(PER_PAGE);
  };

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  // Style commun pour tous les selects inline (compact, lisible)
  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    paddingRight: "32px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "white",
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "#1f2937",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  };
  const activeSelectStyle: React.CSSProperties = {
    ...selectStyle,
    borderColor: "#1f2937",
    background: "#1f2937",
    color: "white",
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  };

  return (
    <>
      {/* Barre de filtres compacte (inline) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Marque */}
        {availableBrands.length > 0 && (
          <select
            value={selectedBrand ?? ""}
            onChange={(e) => setSelectedBrand(e.target.value || null)}
            style={selectedBrand ? activeSelectStyle : selectStyle}
            aria-label="Filtrer par marque"
          >
            <option value="">Toutes les marques</option>
            {availableBrands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.label} ({brand.count})
              </option>
            ))}
          </select>
        )}

        {/* Prix */}
        {showPriceFilter && hasPriceData && (
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as PriceRange)}
            style={priceRange !== "all" ? activeSelectStyle : selectStyle}
            aria-label="Filtrer par prix"
          >
            <option value="all">Tous les prix</option>
            <option value="lt30">Moins de 30€</option>
            <option value="30to100">30€ – 100€</option>
            <option value="gt100">Plus de 100€</option>
          </select>
        )}

        {/* Remise */}
        {showDiscountFilter && hasDiscountData && (
          <select
            value={discountFilter}
            onChange={(e) => setDiscountFilter(e.target.value as DiscountFilter)}
            style={discountFilter !== "all" ? activeSelectStyle : selectStyle}
            aria-label="Filtrer par niveau de remise"
          >
            <option value="all">Toutes remises</option>
            <option value="20">-20% et +</option>
            <option value="50">-50% et +</option>
            <option value="70">-70% et +</option>
          </select>
        )}

        {/* Type concours */}
        {showConcoursTypeFilter && (
          <select
            value={concoursType}
            onChange={(e) => setConcoursType(e.target.value as ConcoursType)}
            style={concoursType !== "all" ? activeSelectStyle : selectStyle}
            aria-label="Type de concours"
          >
            <option value="all">Tous les concours</option>
            <option value="instant-gagnant">Instant gagnant</option>
            <option value="tirage">Tirage au sort</option>
            <option value="test-creatif">Créatif / photo</option>
          </select>
        )}

        {/* Tri */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          style={sortBy !== "recent" ? activeSelectStyle : selectStyle}
          aria-label="Trier par"
        >
          <option value="recent">Plus récent</option>
          <option value="oldest">Plus ancien</option>
          {showDiscountFilter && hasDiscountData && <option value="discount">Plus grosse remise</option>}
          {hasPriceData && <option value="price-asc">Prix croissant</option>}
          {hasPriceData && <option value="price-desc">Prix décroissant</option>}
        </select>

        {/* Coups de cœur (toggle) */}
        {hasFeatured && (
          <button
            onClick={() => setFeaturedOnly((v) => !v)}
            style={{
              padding: "8px 14px",
              background: featuredOnly ? "#EC4899" : "white",
              color: featuredOnly ? "white" : "#1f2937",
              border: "1px solid",
              borderColor: featuredOnly ? "#EC4899" : "#e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.88rem",
              fontWeight: 600,
            }}
            aria-pressed={featuredOnly}
          >
            ❤ Coups de cœur
          </button>
        )}

        {/* Espace + compteur + reset */}
        <span style={{ marginLeft: "auto", color: "#6b7280", fontSize: "0.88rem" }}>
          {filtered.length} article{filtered.length > 1 ? "s" : ""}
        </span>
        {activeFilters > 0 && (
          <button
            onClick={resetFilters}
            style={{
              padding: "8px 12px",
              background: "transparent",
              color: "#DC2626",
              border: "1px solid #DC262644",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <X size={14} /> Effacer
          </button>
        )}
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted-foreground, #6b7280)" }}>
          <Filter size={36} style={{ opacity: 0.4, marginBottom: "12px" }} />
          <p style={{ marginBottom: "16px" }}>Aucun article ne correspond à tes filtres.</p>
          <button
            onClick={resetFilters}
            style={{
              padding: "10px 20px",
              background: "#1f2937",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <div className="bpm-card-h-grid">
            {shown.map((article, index) => {
              const cta = CTA_BY_COLOR[article.categoryColor] ?? "Lire l'article";
              const badge = BADGE_BY_COLOR[article.categoryColor];
              const { now, was, savings } = parsePrice(article.price);
              const isFree = !!now && /gratuit/i.test(now);
              const showAdAfter = index === 7 || index === 15;
              const hasExternalAffiliate = !!article.affiliateUrl && /^https?:\/\//.test(article.affiliateUrl) && !article.expired;
              return (
                <Fragment key={article.slug}>
                  <article
                    className={`bpm-card-h bpm-card-h-${article.categoryColor} ${article.expired ? "bpm-card-h-expired" : ""}`}
                  >
                    <a
                      href={`/article/${article.slug}`}
                      className="bpm-card-h-main-link"
                      aria-label={article.title}
                    />
                    <div className="bpm-card-h-image">
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 120px, 200px"
                        loading="lazy"
                      />
                      {savings ? (
                        <span className="bpm-card-h-discount">{savings}</span>
                      ) : badge ? (
                        <span className={`bpm-card-h-badge bpm-badge-${article.categoryColor}`}>{badge}</span>
                      ) : null}
                      {article.expired && <span className="bpm-card-h-expired-badge">Terminé</span>}
                    </div>

                    <div className="bpm-card-h-body">
                      <div className="bpm-card-h-meta">
                        <span className={`bpm-card-h-pill bpm-pill-${article.categoryColor}`}>{article.categoryLabel}</span>
                        <span className="bpm-card-h-sep" aria-hidden>·</span>
                        <time className="bpm-card-h-date">
                          {new Date(article.date + "T12:00:00").toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            timeZone: "Europe/Paris",
                          })}
                        </time>
                      </div>

                      <h2 className="bpm-card-h-title">{article.title}</h2>
                      <p className="bpm-card-h-excerpt">{article.description}</p>

                      <div className="bpm-card-h-footer">
                        <div className="bpm-card-h-price">
                          {now && (
                            <>
                              <span className={`bpm-card-h-price-now ${isFree ? "bpm-card-h-price-free" : ""}`}>{now}</span>
                              {was && <span className="bpm-card-h-price-was">{was}</span>}
                              {savings && <span className="bpm-card-h-chip">{savings}</span>}
                            </>
                          )}
                        </div>
                        {hasExternalAffiliate ? (
                          <a
                            href={article.affiliateUrl!}
                            target="_blank"
                            rel="nofollow noopener sponsored"
                            className={`bpm-card-h-cta bpm-cta-${article.categoryColor}`}
                            aria-label={`${cta} — ${article.title}`}
                          >
                            {cta} <ArrowRight size={14} aria-hidden />
                          </a>
                        ) : (
                          <span className={`bpm-card-h-cta bpm-cta-${article.categoryColor}`}>
                            {cta} <ArrowRight size={14} aria-hidden />
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                  {showAdAfter && (
                    <AdBlock format={index === 7 ? "in-article" : "display"} />
                  )}
                </Fragment>
              );
            })}
          </div>
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button
                onClick={() => setVisible((v) => v + PER_PAGE)}
                className="btn btn-primary"
                style={{ cursor: "pointer" }}
              >
                Voir plus d&apos;articles ({filtered.length - visible} restants)
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
