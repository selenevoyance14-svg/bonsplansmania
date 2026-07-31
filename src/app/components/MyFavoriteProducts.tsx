"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";

const STORAGE_KEY = "bpm-product-favorites";

/**
 * Section "Mes favoris" de la page /avis-prix-beaute.
 *
 * Les favoris sont posés par ProductFavoriteButton dans le localStorage du
 * navigateur (liste de slugs). Ils n'étaient lus nulle part : on pouvait
 * ajouter un produit sans jamais pouvoir le retrouver. Cette section comble
 * ce trou.
 *
 * Limite assumée : le localStorage est propre à un navigateur et à un
 * appareil. Sans compte utilisateur, les favoris ne suivent pas la personne
 * d'un téléphone à un ordinateur.
 */
export default function MyFavoriteProducts() {
  const [slugs, setSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    function read() {
      try {
        const stored = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]",
        ) as string[];
        setSlugs(Array.isArray(stored) ? stored : []);
      } catch {
        setSlugs([]);
      }
    }
    read();
    // Se met à jour si un favori est modifié depuis un autre onglet.
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  if (slugs === null) return null;

  const favorites = COMMUNITY_PRODUCTS.filter((p) => slugs.includes(p.slug));
  if (!favorites.length) return null;

  return (
    <section className="section" style={{ paddingBottom: "0" }}>
      <div className="container">
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            marginBottom: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Heart size={18} fill="currentColor" style={{ color: "#EC4899" }} />
          Mes favoris
        </h2>
        <p
          style={{
            color: "var(--muted-foreground)",
            fontSize: "0.9rem",
            marginBottom: "16px",
          }}
        >
          {favorites.length} produit{favorites.length > 1 ? "s" : ""} enregistré
          {favorites.length > 1 ? "s" : ""} sur cet appareil
        </p>

        <div className="beauty-community-products">
          {favorites.map((product) => (
            <Link
              className="beauty-community-product-link"
              href={`/produit/${product.slug}`}
              key={`fav-${product.slug}`}
            >
              <span>{product.brand}</span>
              <strong>{product.name}</strong>
              <small>
                Prix et avis <ChevronRight size={14} />
              </small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
