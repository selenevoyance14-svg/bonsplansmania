"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

const GENDERS: { key: Gender; label: string }[] = [
  { key: ALL, label: "Tout" },
  { key: "femme", label: "Femme" },
  { key: "homme", label: "Homme" },
];

export default function CommunityProductList() {
  const [gender, setGender] = useState<Gender>(ALL);
  const [brand, setBrand] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("recent");

  // Le rayon commande la suite : la liste des marques et leurs compteurs ne
  // portent que sur le rayon affiché, sinon on proposerait « Chloé (1) » dans
  // le rayon homme et le filtre renverrait une page vide.
  const scoped = useMemo(
    () =>
      gender === ALL
        ? COMMUNITY_PRODUCTS
        : COMMUNITY_PRODUCTS.filter((p) => p.gender === gender),
    [gender],
  );

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
      map.set(p.gender, (map.get(p.gender) || 0) + 1);
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
        <div
          role="group"
          aria-label="Filtrer par rayon"
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
                  // La marque choisie peut ne pas exister dans le nouveau
                  // rayon : on repart de « toutes les marques ».
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

        {(gender !== ALL || brand !== ALL || sort !== "recent") && (
          <button
            type="button"
            onClick={() => {
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.imageAlt}
              width={96}
              height={96}
              loading="lazy"
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
