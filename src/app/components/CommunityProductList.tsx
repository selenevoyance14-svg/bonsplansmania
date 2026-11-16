"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";
import ProductReviewStat from "@/app/components/ProductReviewStat";
import styles from "./CommunityProductList.module.css";

const ALL = "__all__";
const INITIAL_VISIBLE = 24;

type SortKey = "recent" | "ancien" | "nom";
type Gender = typeof ALL | "femme" | "homme";
type ProductCategory = typeof ALL | "parfums" | "maquillage" | "soins-visage" | "soins-corps" | "soins-cheveux" | "k-beauty" | "solaires" | "coffrets" | "box-beaute" | "bebe-maman";

const CATEGORIES: { key: ProductCategory; label: string }[] = [
  { key: ALL, label: "Tous les produits" },
  { key: "parfums", label: "Parfums" },
  { key: "soins-visage", label: "Soins visage" },
  { key: "soins-cheveux", label: "Soins cheveux" },
  { key: "maquillage", label: "Maquillage" },
  { key: "soins-corps", label: "Soins corps" },
  { key: "k-beauty", label: "K-Beauty" },
  { key: "solaires", label: "Solaires" },
  { key: "coffrets", label: "Coffrets" },
  { key: "box-beaute", label: "Box beauté" },
  { key: "bebe-maman", label: "Bébé & maman" },
];

const GENDERS: { key: Gender; label: string }[] = [
  { key: ALL, label: "Tous" },
  { key: "femme", label: "Femme" },
  { key: "homme", label: "Homme" },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

function evergreenTeaser(teaser: string, name: string) {
  const withoutPrices = teaser
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !/\d[\d\s.,]*\s*€/.test(sentence))
    .join(" ")
    .trim();
  return withoutPrices || `Découvrez les caractéristiques, les avis disponibles et les offres marchands pour ${name}.`;
}

export default function CommunityProductList() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState<ProductCategory>(ALL);
  const [gender, setGender] = useState<Gender>(ALL);
  const [brand, setBrand] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("recent");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const countByCategory = useMemo(() => {
    const counts = new Map<ProductCategory, number>([[ALL, COMMUNITY_PRODUCTS.length]]);
    for (const product of COMMUNITY_PRODUCTS) counts.set(product.category, (counts.get(product.category) || 0) + 1);
    return counts;
  }, []);

  const countByGender = useMemo(() => {
    const counts = new Map<Gender, number>([[ALL, COMMUNITY_PRODUCTS.length]]);
    for (const product of COMMUNITY_PRODUCTS) {
      if (product.gender) counts.set(product.gender, (counts.get(product.gender) || 0) + 1);
    }
    return counts;
  }, []);

  const scoped = useMemo(() => COMMUNITY_PRODUCTS.filter((product) => {
    if (category !== ALL && product.category !== category) return false;
    if (gender !== ALL && product.gender !== gender) return false;
    return true;
  }), [category, gender]);

  const brands = useMemo(
    () => Array.from(new Set(scoped.map((product) => product.brand))).sort((a, b) => a.localeCompare(b, "fr")),
    [scoped],
  );

  const products = useMemo(() => {
    const search = normalize(deferredQuery.trim());
    const filtered = scoped.filter((product) => {
      if (brand !== ALL && product.brand !== brand) return false;
      return !search || normalize(`${product.brand} ${product.name} ${product.teaser}`).includes(search);
    });

    return filtered.toSorted((a, b) => {
      if (sort === "nom") return a.name.localeCompare(b.name, "fr");
      const difference = new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      if (difference !== 0) return sort === "recent" ? difference : -difference;
      return a.name.localeCompare(b.name, "fr");
    });
  }, [brand, deferredQuery, scoped, sort]);

  const visibleProducts = products.slice(0, visibleCount);
  const hasFilters = Boolean(query || category !== ALL || gender !== ALL || brand !== ALL || sort !== "recent");
  const resetVisible = () => setVisibleCount(INITIAL_VISIBLE);
  const resetAll = () => {
    setQuery("");
    setCategory(ALL);
    setGender(ALL);
    setBrand(ALL);
    setSort("recent");
    resetVisible();
  };

  return (
    <>
      <section className={styles.categorySection} aria-labelledby="beauty-universes">
        <h2 id="beauty-universes" className={styles.categoryTitle}>Explorer par univers</h2>
        <div className={styles.categories}>
          {CATEGORIES.map(({ key, label }) => {
            const count = countByCategory.get(key) || 0;
            const active = category === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                className={`${styles.categoryButton} ${active ? styles.categoryButtonActive : ""}`}
                onClick={() => {
                  setCategory(key);
                  setGender(ALL);
                  setBrand(ALL);
                  resetVisible();
                }}
              >
                <strong>{label}</strong>
                <span>{count} fiche{count > 1 ? "s" : ""}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className={styles.toolbar} aria-label="Rechercher et trier les produits">
        <div className={styles.field}>
          <label htmlFor="product-search">Rechercher</label>
          <input
            id="product-search"
            type="search"
            className={styles.input}
            value={query}
            placeholder="Produit, marque, parfum…"
            onChange={(event) => {
              setQuery(event.target.value);
              resetVisible();
            }}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="brand-filter">Marque</label>
          <select id="brand-filter" className={styles.select} value={brand} onChange={(event) => {
            setBrand(event.target.value);
            resetVisible();
          }}>
            <option value={ALL}>Toutes ({scoped.length})</option>
            {brands.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="sort-filter">Trier</label>
          <select id="sort-filter" className={styles.select} value={sort} onChange={(event) => {
            setSort(event.target.value as SortKey);
            resetVisible();
          }}>
            <option value="recent">Nouveautés</option>
            <option value="ancien">Plus anciens</option>
            <option value="nom">Nom A–Z</option>
          </select>
        </div>
      </div>

      {category === ALL || category === "parfums" ? (
        <div className={styles.subfilters} aria-label="Filtrer les parfums par rayon">
          {GENDERS.map(({ key, label }) => (
            <button key={key} type="button" aria-pressed={gender === key} className={`${styles.pill} ${gender === key ? styles.pillActive : ""}`} onClick={() => {
              setGender(key);
              setBrand(ALL);
              resetVisible();
            }}>
              {label} ({countByGender.get(key) || 0})
            </button>
          ))}
          {hasFilters ? <button type="button" className={styles.reset} onClick={resetAll}>Tout réinitialiser</button> : null}
        </div>
      ) : hasFilters ? (
        <div className={styles.subfilters}>
          <button type="button" className={styles.reset} onClick={resetAll}>Tout réinitialiser</button>
        </div>
      ) : null}

      <div className={styles.resultHeader} aria-live="polite">
        <h2>Les fiches produits</h2>
        <span>{products.length} résultat{products.length > 1 ? "s" : ""}</span>
      </div>

      <div className={styles.grid}>
        {visibleProducts.length === 0 ? (
          <div className={styles.empty}>Aucun produit ne correspond à cette recherche. Essayez une autre marque ou réinitialisez les filtres.</div>
        ) : visibleProducts.map((product) => (
          <Link key={product.slug} href={`/produit/${product.slug}`} className={styles.card}>
            <span className={styles.imageWrap}>
              <Image src={product.image} alt={product.imageAlt} width={112} height={112} loading="lazy" sizes="(max-width: 640px) 84px, 112px" className={styles.image} />
            </span>
            <span>
              <span className={styles.brand}>{product.brand}</span>
              <strong className={styles.name}>{product.name}</strong>
              <span className={styles.teaser}>{evergreenTeaser(product.teaser, product.name)}</span>
              <span className={styles.cardFooter}>
                <ProductReviewStat productSlug={product.slug} />
                <span>Voir la fiche <ChevronRight size={15} aria-hidden="true" /></span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      {visibleCount < products.length ? (
        <div className={styles.loadMoreWrap}>
          <button type="button" className={styles.loadMore} onClick={() => setVisibleCount((current) => current + INITIAL_VISIBLE)}>
            Afficher 24 produits supplémentaires
          </button>
        </div>
      ) : null}
    </>
  );
}
