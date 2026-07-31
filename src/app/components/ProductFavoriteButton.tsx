"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const STORAGE_KEY = "bpm-product-favorites";

export default function ProductFavoriteButton({
  productSlug,
}: {
  productSlug: string;
}) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
      setFavorite(stored.includes(productSlug));
    } catch {
      setFavorite(false);
    }
  }, [productSlug]);

  function toggleFavorite() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
      const next = stored.includes(productSlug)
        ? stored.filter((slug) => slug !== productSlug)
        : [...stored, productSlug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setFavorite(next.includes(productSlug));
    } catch {
      setFavorite((current) => !current);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`product-favorite-button${favorite ? " is-favorite" : ""}`}
        aria-pressed={favorite}
        onClick={toggleFavorite}
      >
        <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        {favorite ? "Dans mes favoris" : "Ajouter aux favoris"}
      </button>
      {/* Sans ce lien, on pouvait mettre un produit en favori sans jamais
          pouvoir le retrouver : rien n'indiquait où la liste est consultable. */}
      {favorite && (
        <a
          href="/avis-prix-beaute"
          style={{
            fontSize: "0.85rem",
            color: "#6D28D9",
            fontWeight: 600,
            textDecoration: "underline",
            alignSelf: "center",
          }}
        >
          Voir mes favoris
        </a>
      )}
    </>
  );
}
