"use client";

import { Fragment, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Filter, X, SlidersHorizontal } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";

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
}

const PER_PAGE = 24;

const CTA_BY_COLOR: Record<string, string> = {
  "bon-plan": "Voir l'offre",
  "bon-plan-beaute": "Voir l'offre",
  "test-gratuit": "Postuler",
  "test-avis": "Lire le test",
  "concours": "Participer",
  "box-beaute": "Voir la box",
  "code-promo": "Voir le code",
  "beaute": "Lire l'article",
  "calendrier-avent": "Découvrir",
  "calendrier": "Découvrir",
};

const BADGE_BY_COLOR: Record<string, string> = {
  "test-gratuit": "Gratuit",
  "concours": "À gagner",
  "box-beaute": "Box",
  "code-promo": "Code",
};

// Tags génériques à exclure de la détection de marque
const EXCLUDED_TAG_SLUGS = new Set([
  // Catégories / types d'article
  "bon-plan", "bon-plan-beaute", "test-gratuit", "test-gratuit-beaute", "test-avis", "test-produit",
  "concours", "concours-beaute", "box-beaute", "code-promo", "calendrier-avent",
  "selection", "beaute", "beautet",
  "guide", "guide-achat", "comparatif", "avis", "test",
  // Mécaniques concours
  "instant-gagnant", "tirage", "tirage-au-sort", "ambassadrice", "ambassadeur",
  "testeur", "testeuse", "echantillon",
  // Promo / commerce
  "promo", "promos", "soldes", "ventes-flash", "deal", "deal-du-jour", "vente-privee",
  "french-days", "french-week", "black-friday", "cyber-monday",
  "code", "remise", "reduction", "gratuit",
  // Qualité produit
  "bio", "vegan", "cruelty-free", "made-in-france", "fabrique-france", "francais",
  "naturel", "naturelle", "100-naturel", "100-pourcent-naturel",
  "yuka-excellent", "ecocert", "cosmos-organic", "cosmebio",
  "sans-parfum", "sans-paraben", "hypoallergenique",
  // Saisons / périodes
  "ete", "ete-2026", "hiver", "hiver-2026", "printemps", "automne", "rentree",
  "fete-des-meres", "fete-des-peres", "fete-des-grands-meres", "saint-valentin",
  "paques", "noel", "halloween", "rentree-des-classes",
  "fin-15-juin-2026", "fin-16-juin-2026", "fin-21-juin-2026", "fin-30-juin-2026",
  // Sous-catégories produits trop génériques
  "cosmetique", "cosmetiques", "skincare", "maquillage", "soin", "soin-visage",
  "soin-corps", "creme", "serum", "parfum", "shampoing", "shampooing", "deodorant",
  "huile-essentielle", "huiles-essentielles", "aromatherapie",
  "high-tech", "hightech", "maison", "cuisine", "jardin", "mode", "bebe", "enfant",
  "famille", "femme", "homme", "ado",
  // Mois / années
  "2023", "2024", "2025", "2026", "2027",
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre",
  // Génériques
  "shopping", "cadeau", "cadeaux", "originale", "limite", "limitee", "exclusive",
  "exclusivite", "premium", "luxe", "deluxe", "edition-limitee",
  "lot", "pack", "coffret", "trousse", "box", "abonnement",
]);

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

/**
 * Liste les tags de l'article candidats à être une marque (mot propre, ni générique, ni date).
 */
function getBrandCandidates(article: ArticleListItem): string[] {
  const candidates: string[] = [];
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
    // Patterns "fin-XX-mois"
    if (/^fin-/.test(slug)) continue;
    candidates.push(slug);
  }
  return candidates;
}

function getBrandLabel(slug: string): string {
  return BRAND_DISPLAY[slug] || prettifyBrandSlug(slug);
}

function parseAmount(text: string): number | undefined {
  // Capture le PREMIER nombre (avec espaces internes "1 800") en évitant les pourcentages.
  // Stratégie : trouver une séquence "[chiffres et espaces]+ (,|.)? [chiffres]+" suivie d'un €.
  const cleaned = text.replace(/\s+/g, "");
  // Match: optional minus, digits, optional decimal (, or .), digits — collé à un € (pour ignorer les "-5%")
  const m = cleaned.match(/(\d+(?:[.,]\d+)?)\s*€/);
  if (m) {
    const n = parseFloat(m[1].replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }
  // Fallback : premier nombre trouvé
  const m2 = cleaned.match(/(\d+(?:[.,]\d+)?)/);
  if (m2) {
    const n = parseFloat(m2[1].replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function parsePrice(raw?: string): { now?: string; was?: string; savings?: string; nowNum?: number; discountPct?: number } {
  if (!raw) return {};

  // 1) Lecture du pourcentage explicite si présent : "-X%" ou "(-X %)" — priorité aux info fournies par l'auteur
  const explicitPctMatch = raw.match(/-\s*(\d{1,2})\s*%/);
  let explicitPct: number | undefined;
  if (explicitPctMatch) {
    const n = parseInt(explicitPctMatch[1], 10);
    if (n > 0 && n < 100) explicitPct = n;
  }

  const m = raw.match(/^(.+?)\s*au lieu de\s*(.+?)$/i);
  if (m) {
    const now = m[1].trim();
    const was = m[2].trim();
    const nowNum = parseAmount(now);
    const wasNum = parseAmount(was);

    let savings: string | undefined;
    let discountPct: number | undefined;

    if (explicitPct !== undefined) {
      discountPct = explicitPct;
      savings = `−${discountPct}%`;
    } else if (
      Number.isFinite(nowNum) &&
      Number.isFinite(wasNum) &&
      wasNum! > nowNum! &&
      nowNum! > 0
    ) {
      const pct = Math.round(((wasNum! - nowNum!) / wasNum!) * 100);
      // Garde-fous : refuse les pourcentages aberrants (>= 95% sur des prix consommateur, c'est suspect)
      if (pct > 0 && pct < 95) {
        discountPct = pct;
        savings = `−${pct}%`;
      }
    }

    return { now, was, savings, nowNum, discountPct };
  }

  // Pas de "au lieu de" : on essaie quand même de lire le prix actuel pour le filtrage
  const nowNum = parseAmount(raw);
  // Si le prix contient un "-X%" explicite mais pas "au lieu de", on peut quand même afficher la remise
  let savings: string | undefined;
  let discountPct: number | undefined;
  if (explicitPct !== undefined) {
    discountPct = explicitPct;
    savings = `−${explicitPct}%`;
  }
  return { now: raw.trim(), nowNum, discountPct, savings };
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

export default function FilterableArticleGrid({ articles, category }: { articles: ArticleListItem[]; category?: string }) {
  const [visible, setVisible] = useState(PER_PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
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
  const showPriceFilter = isBonPlan;
  const showDiscountFilter = isBonPlan;
  const showConcoursTypeFilter = isConcours;

  // Pré-calcule les métadonnées de chaque article
  // brandSlugs : tags candidats marque (un article peut avoir plusieurs marques pertinentes)
  const enriched = useMemo(() => {
    return articles.map((a) => {
      const brandSlugs = getBrandCandidates(a);
      const parsed = parsePrice(a.price);
      return { article: a, brandSlugs, ...parsed };
    });
  }, [articles]);

  // Liste des marques présentes : seulement celles avec >= 2 articles dans cette catégorie
  // pour éviter de proposer un filtre sur une marque qui n'a qu'un seul article
  // (cas Pierre Ricaud sur /test-gratuit : pas de vrais tests gratuits chez eux)
  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of enriched) {
      // On compte chaque slug une seule fois par article même s'il apparaît plusieurs fois
      const seen = new Set<string>();
      for (const slug of e.brandSlugs) {
        if (seen.has(slug)) continue;
        seen.add(slug);
        counts.set(slug, (counts.get(slug) || 0) + 1);
      }
    }
    // Filtre : marques avec >= 2 articles dans cette catégorie
    const MIN_ARTICLES_PER_BRAND = 2;
    const result = Array.from(counts.entries())
      .filter(([, n]) => n >= MIN_ARTICLES_PER_BRAND)
      .map(([slug, n]) => ({ slug, label: getBrandLabel(slug), count: n }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    // Limite aux 24 marques principales pour ne pas surcharger l'UI
    return result.slice(0, 24);
  }, [enriched]);

  // Vérifie quels filtres sont disponibles
  const hasPriceData = useMemo(() => enriched.some((e) => e.nowNum !== undefined), [enriched]);
  const hasDiscountData = useMemo(() => enriched.some((e) => e.discountPct !== undefined), [enriched]);
  const hasFeatured = useMemo(() => articles.some((a) => a.featured), [articles]);

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

  return (
    <>
      {/* Toolbar filtres */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "24px",
          padding: "12px 16px",
          background: "white",
          border: "1px solid var(--border, #e5e7eb)",
          borderRadius: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: filtersOpen || activeFilters > 0 ? "#1f2937" : "white",
              color: filtersOpen || activeFilters > 0 ? "white" : "#1f2937",
              border: "1px solid #1f2937",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            <SlidersHorizontal size={16} />
            Filtres
            {activeFilters > 0 && (
              <span
                style={{
                  background: filtersOpen ? "white" : "#DC2626",
                  color: filtersOpen ? "#1f2937" : "white",
                  borderRadius: "999px",
                  padding: "1px 8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  marginLeft: "4px",
                }}
              >
                {activeFilters}
              </span>
            )}
          </button>
          {activeFilters > 0 && (
            <button
              onClick={resetFilters}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px 12px",
                background: "transparent",
                color: "#DC2626",
                border: "1px solid #DC262644",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              <X size={14} /> Réinitialiser
            </button>
          )}
          <span style={{ color: "var(--muted-foreground, #6b7280)", fontSize: "0.9rem" }}>
            {filtered.length} article{filtered.length > 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="sort-by" style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            Trier par :
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            style={{
              padding: "8px 12px",
              border: "1px solid var(--border, #e5e7eb)",
              borderRadius: "8px",
              background: "white",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="recent">📅 Plus récent</option>
            <option value="oldest">⏳ Plus ancien</option>
            {showDiscountFilter && hasDiscountData && <option value="discount">🔥 Plus grosse remise</option>}
            {showPriceFilter && hasPriceData && <option value="price-asc">💰 Prix croissant</option>}
            {showPriceFilter && hasPriceData && <option value="price-desc">💎 Prix décroissant</option>}
          </select>
        </div>
      </div>

      {/* Panneau filtres dépliable */}
      {filtersOpen && (
        <div
          style={{
            background: "var(--muted, #f9fafb)",
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Marque */}
          {availableBrands.length > 0 && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                🏷️ Marque
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {availableBrands.map((brand) => (
                  <button
                    key={brand.slug}
                    onClick={() => setSelectedBrand(selectedBrand === brand.slug ? null : brand.slug)}
                    style={{
                      padding: "6px 12px",
                      background: selectedBrand === brand.slug ? "#1f2937" : "white",
                      color: selectedBrand === brand.slug ? "white" : "#1f2937",
                      border: "1px solid",
                      borderColor: selectedBrand === brand.slug ? "#1f2937" : "#e5e7eb",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                    title={`${brand.count} article${brand.count > 1 ? "s" : ""}`}
                  >
                    {brand.label}
                    <span style={{ opacity: 0.6, marginLeft: "4px", fontSize: "0.72rem" }}>({brand.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prix */}
          {showPriceFilter && hasPriceData && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                💰 Prix
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[
                  { value: "all", label: "Tous" },
                  { value: "lt30", label: "Moins de 30€" },
                  { value: "30to100", label: "30€ - 100€" },
                  { value: "gt100", label: "Plus de 100€" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPriceRange(opt.value as PriceRange)}
                    style={{
                      padding: "6px 12px",
                      background: priceRange === opt.value ? "#16A34A" : "white",
                      color: priceRange === opt.value ? "white" : "#1f2937",
                      border: "1px solid",
                      borderColor: priceRange === opt.value ? "#16A34A" : "#e5e7eb",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Remise */}
          {showDiscountFilter && hasDiscountData && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                🔥 Niveau de remise
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[
                  { value: "all", label: "Toutes" },
                  { value: "20", label: "-20% et +" },
                  { value: "50", label: "-50% et +" },
                  { value: "70", label: "-70% et +" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDiscountFilter(opt.value as DiscountFilter)}
                    style={{
                      padding: "6px 12px",
                      background: discountFilter === opt.value ? "#DC2626" : "white",
                      color: discountFilter === opt.value ? "white" : "#1f2937",
                      border: "1px solid",
                      borderColor: discountFilter === opt.value ? "#DC2626" : "#e5e7eb",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type concours (uniquement sur /categorie/concours) */}
          {showConcoursTypeFilter && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                🎯 Type de concours
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[
                  { value: "all", label: "Tous" },
                  { value: "instant-gagnant", label: "⚡ Instant gagnant" },
                  { value: "tirage", label: "🎲 Tirage au sort" },
                  { value: "test-creatif", label: "🎨 Créatif / photo" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setConcoursType(opt.value as ConcoursType)}
                    style={{
                      padding: "6px 12px",
                      background: concoursType === opt.value ? "#7C3AED" : "white",
                      color: concoursType === opt.value ? "white" : "#1f2937",
                      border: "1px solid",
                      borderColor: concoursType === opt.value ? "#7C3AED" : "#e5e7eb",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coups de coeur */}
          {hasFeatured && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                ❤️ Sélection
              </div>
              <button
                onClick={() => setFeaturedOnly((v) => !v)}
                style={{
                  padding: "6px 12px",
                  background: featuredOnly ? "#EC4899" : "white",
                  color: featuredOnly ? "white" : "#1f2937",
                  border: "1px solid",
                  borderColor: featuredOnly ? "#EC4899" : "#e5e7eb",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                {featuredOnly ? "✓ Coups de cœur" : "Coups de cœur uniquement"}
              </button>
            </div>
          )}
        </div>
      )}

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
          <div className="articles-grid">
            {shown.map((article, index) => {
              const cta = CTA_BY_COLOR[article.categoryColor] ?? "Lire l'article";
              const badge = BADGE_BY_COLOR[article.categoryColor];
              const { now, was, savings } = parsePrice(article.price);
              const showAdAfter = index === 7 || index === 15;
              return (
                <Fragment key={article.slug}>
                  <a
                    href={`/article/${article.slug}`}
                    className={`bpm-card bpm-card-${article.categoryColor} ${article.expired ? "bpm-card-expired" : ""}`}
                  >
                    <div className="bpm-card-image">
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                      />
                      <span className={`bpm-card-pill bpm-pill-${article.categoryColor}`}>{article.categoryLabel}</span>
                      {savings ? (
                        <span className="bpm-card-discount">{savings}</span>
                      ) : badge ? (
                        <span className={`bpm-card-badge bpm-badge-${article.categoryColor}`}>{badge}</span>
                      ) : null}
                      {article.expired && <span className="bpm-card-expired-badge">Terminé</span>}
                    </div>

                    <div className="bpm-card-body">
                      <h2 className="bpm-card-title">{article.title}</h2>
                      <p className="bpm-card-excerpt">{article.description}</p>
                      {now && (
                        <div className="bpm-card-price">
                          <span className="bpm-card-price-now">{now}</span>
                          {was && <span className="bpm-card-price-was">{was}</span>}
                        </div>
                      )}
                    </div>

                    <div className={`bpm-card-footer bpm-footer-${article.categoryColor}`}>
                      <time className="bpm-card-date">
                        {new Date(article.date + "T12:00:00").toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          timeZone: "Europe/Paris",
                        })}
                      </time>
                      <span className="bpm-card-cta">
                        {cta} <ArrowRight size={14} aria-hidden />
                      </span>
                    </div>
                  </a>
                  {showAdAfter && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <AdBlock format={index === 7 ? "in-article" : "display"} />
                    </div>
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
