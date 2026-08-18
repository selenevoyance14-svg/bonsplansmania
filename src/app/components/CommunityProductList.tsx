"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";
import ProductReviewStat from "@/app/components/ProductReviewStat";

const ALL = "__all__";

/**
 * Liste des fiches produits de /avis-prix-beaute, avec filtres rayon et marque.
 *
 * Les marques et les compteurs sont déduits du registre : rien à tenir à jour
 * ici quand une fiche est ajoutée.
 */
type SortKey = "recent" | "ancien";
type Gender = typeof ALL | "femme" | "homme";
type ProductCategory = typeof ALL | "parfums" | "soins-visage" | "soins-corps" | "soins-cheveux" | "k-beauty" | "solaires" | "coffrets" | "box-beaute";

const CATEGORIES: { key: ProductCategory; label: string }[] = [
  { key: ALL, label: "Tous les rayons" },
  { key: "parfums", label: "Parfums" },
  { key: "soins-visage", label: "Soins visage" },
  { key: "soins-corps", label: "Soins corps" },
  { key: "soins-cheveux", label: "Soins cheveux" },
  { key: "k-beauty", label: "K-Beauty" },
  { key: "solaires", label: "Solaires" },
  { key: "coffrets", label: "Coffrets" },
  { key: "box-beaute", label: "Box beauté" },
];

const GENDERS: { key: Gender; label: string }[] = [
  { key: ALL, label: "Tout" },
  { key: "femme", label: "Femme" },
  { key: "homme", label: "Homme" },
];

export default function CommunityProductList() {
  const [category, setCategory] = useState<ProductCategory>(ALL);
  const [gender, setGender] = useState<Gender>(ALL);
  const [brand, setBrand] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("recent");

  // Le rayon commande la suite : la liste des marques et leurs compteurs ne
  // portent que sur le rayon affiché, sinon on proposerait « Chloé (1) » dans
  // le rayon homme et le filtre renverrait une page vide.
  const scoped = useMemo(() => COMMUNITY_PRODUCTS.filter((product) => {
    if (category !== ALL && product.category !== category) return false;
    if (gender !== ALL && product.gender !== gender) return false;
    return true;
  }), [category, gender]);

  const brands = useMemo(
    () =>
      Array.from(new Set(scoped.map((p) => p.brand))).sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [scoped],
  );

  const products = useMemo(() => {
    const filtered =
      brand === ALL ? [...scoped] : scoped.filter((p) => p.brand === brand);
    return filtered.sort((a, b) => {
      const diff =
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      // À date égale, on garde un ordre stable par nom plutôt qu'aléatoire.
      if (diff !== 0) return sort === "recent" ? diff : -diff;
      return a.name.localeCompare(b.name, "fr");
    });
  }, [scoped, brand, sort]);

  const countByBrand = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of scoped) {
      map.set(p.brand, (map.get(p.brand) || 0) + 1);
    }
    return map;
  }, [scoped]);

  const countByGender = useMemo(() => {
    const map = new Map<Gender, number>([[ALL, COMMUNITY_PRODUCTS.length]]);
    for (const p of COMMUNITY_PRODUCTS) {
      if (!p.gender) continue;
      map.set(p.gender, (map.get(p.gender) || 0) + 1);
    }
    return map;
  }, []);

  const countByCategory = useMemo(() => {
    const map = new Map<ProductCategory, number>([[ALL, COMMUNITY_PRODUCTS.length]]);
    for (const product of COMMUNITY_PRODUCTS) {
      map.set(product.category, (map.get(product.category) || 0) + 1);
    }
    return map;
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <label htmlFor="category-filter" style={{ fontWeight: 600, fontSize: "0.92rem" }}>
          Rayon
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as ProductCategory);
            setGender(ALL);
            setBrand(ALL);
          }}
          style={{ padding: "9px 14px", borderRadius: "10px", border: "1.5px solid var(--border, #e5e7eb)", background: "white", fontSize: "0.92rem", fontWeight: 600, color: "#1f2937", cursor: "pointer" }}
        >
          {CATEGORIES.map(({ key, label }) => (
            <option key={key} value={key}>{label} ({countByCategory.get(key) || 0})</option>
          ))}
        </select>
        {(category === ALL || category === "parfums") && (
          <div
            role="group"
            aria-label="Filtrer les parfums"
            style={{ display: "flex", gap: "6px", marginRight: "6px" }}
          >
            {GENDERS.map(({ key, label }) => {
              const active = gender === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setGender(key);
                    setBrand(ALL);
                  }}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "999px",
                    border: `1.5px solid ${active ? "#6D28D9" : "var(--border, #e5e7eb)"}`,
                    background: active ? "#6D28D9" : "white",
                    color: active ? "white" : "#1f2937",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {label} ({countByGender.get(key) || 0})
                </button>
              );
            })}
          </div>
        )}

        <label
          htmlFor="brand-filter"
          style={{ fontWeight: 600, fontSize: "0.92rem" }}
        >
          Filtrer par marque
        </label>
        <select
          id="brand-filter"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          style={{
            padding: "9px 14px",
            borderRadius: "10px",
            border: "1.5px solid var(--border, #e5e7eb)",
            background: "white",
            fontSize: "0.92rem",
            fontWeight: 600,
            color: "#1f2937",
            cursor: "pointer",
            minWidth: "220px",
          }}
        >
          <option value={ALL}>Toutes les marques ({scoped.length})</option>
          {brands.map((name) => (
            <option key={name} value={name}>
              {name} ({countByBrand.get(name)})
            </option>
          ))}
        </select>
        <label
          htmlFor="sort-filter"
          style={{ fontWeight: 600, fontSize: "0.92rem", marginLeft: "6px" }}
        >
          Trier
        </label>
        <select
          id="sort-filter"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          style={{
            padding: "9px 14px",
            borderRadius: "10px",
            border: "1.5px solid var(--border, #e5e7eb)",
            background: "white",
            fontSize: "0.92rem",
            fontWeight: 600,
            color: "#1f2937",
            cursor: "pointer",
          }}
        >
          <option value="recent">Plus récent d&apos;abord</option>
          <option value="ancien">Plus ancien d&apos;abord</option>
        </select>

        {(category !== ALL || gender !== ALL || brand !== ALL || sort !== "recent") && (
          <button
            type="button"
            onClick={() => {
              setCategory(ALL);
              setGender(ALL);
              setBrand(ALL);
              setSort("recent");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#6D28D9",
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/*
        La page n'affiche plus qu'UNE liste.
        Elle en montrait deux : une grille de petites vignettes sans image,
        puis les mêmes fiches en cartes détaillées juste en dessous. Passé une
        dizaine de fiches, la grille devenait un mur de liens qui répétait la
        suite de la page sans rien apporter (31/07/2026).
      */}
      <div style={{ display: "grid", gap: "16px" }}>
        {products.length === 0 && (
          <p style={{ padding: "24px", textAlign: "center", color: "#4b5563" }}>
            Les premières fiches de ce rayon arrivent bientôt.
          </p>
        )}
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/produit/${product.slug}`}
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
              background: "white",
              border: "1px solid var(--border, #e5e7eb)",
              borderRadius: "16px",
              padding: "16px 18px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Image
              src={product.image}
              alt={product.imageAlt}
              width={96}
              height={96}
              loading="lazy"
              sizes="96px"
              style={{ width: "96px", height: "96px", objectFit: "contain", flexShrink: 0 }}
            />
            <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
                {product.brand}
              </span>
              <strong style={{ fontSize: "1.05rem" }}>{product.name}</strong>
              <span style={{ fontSize: "0.92rem", color: "#4b5563" }}>{product.teaser}</span>
              <span
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  fontSize: "0.85rem",
                  color: "#6D28D9",
                  fontWeight: 600,
                  marginTop: "2px",
                }}
              >
                <ProductReviewStat productSlug={product.slug} />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
