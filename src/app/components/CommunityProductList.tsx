"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Store } from "lucide-react";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";
import ProductReviewStat from "@/app/components/ProductReviewStat";

const ALL = "__all__";

/**
 * Liste des fiches produits de /avis-prix-beaute, avec filtre par marque.
 *
 * Le filtre s'applique aux deux affichages de la page (grille compacte et
 * cartes détaillées) pour éviter qu'une moitié de page réagisse et pas l'autre.
 * Les marques sont déduites du registre, il n'y a rien à tenir à jour ici.
 */
type SortKey = "recent" | "ancien";

export default function CommunityProductList() {
  const [brand, setBrand] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("recent");

  const brands = useMemo(
    () =>
      Array.from(new Set(COMMUNITY_PRODUCTS.map((p) => p.brand))).sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [],
  );

  const products = useMemo(() => {
    const filtered =
      brand === ALL
        ? [...COMMUNITY_PRODUCTS]
        : COMMUNITY_PRODUCTS.filter((p) => p.brand === brand);
    return filtered.sort((a, b) => {
      const diff =
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      // À date égale, on garde un ordre stable par nom plutôt qu'aléatoire.
      if (diff !== 0) return sort === "recent" ? diff : -diff;
      return a.name.localeCompare(b.name, "fr");
    });
  }, [brand, sort]);

  const countByBrand = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of COMMUNITY_PRODUCTS) {
      map.set(p.brand, (map.get(p.brand) || 0) + 1);
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
          <option value={ALL}>
            Toutes les marques ({COMMUNITY_PRODUCTS.length})
          </option>
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

        {(brand !== ALL || sort !== "recent") && (
          <button
            type="button"
            onClick={() => {
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

      <div className="beauty-community-products">
        {products.map((product) => (
          <Link
            className="beauty-community-product-link"
            href={`/produit/${product.slug}`}
            key={product.slug}
          >
            <span>{product.brand}</span>
            <strong>{product.name}</strong>
            <small>
              Prix et avis <ChevronRight size={14} />
            </small>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gap: "16px", marginTop: "28px" }}>
        {products.map((product) => (
          <Link
            key={`detail-${product.slug}`}
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
                <span>dès {product.fromPrice}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Store size={13} /> {product.merchantCount} marchands comparés
                </span>
                <ProductReviewStat productSlug={product.slug} />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
