"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

// Placeholder qui tourne toutes les 3 s pour suggérer des termes de recherche populaires.
const SUGGESTIONS = [
  "cerave",
  "yesstyle",
  "cashback iGraal",
  "code promo Sarenza",
  "box beauté",
  "clarins soldes",
  "amazon prime day",
  "nuxe -30 %",
  "concours affilié",
  "nyx maquillage",
];

export default function HeroSearchBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const placeholder = `Une marque, un produit… ex: ${SUGGESTIONS[index]}`;

  return (
    <form action="/recherche" method="get" className="bpm-hero-search" role="search">
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        aria-label="Rechercher un bon plan, un test, un concours"
      />
      <button type="submit">
        <Search size={16} aria-hidden /> Chercher
      </button>
    </form>
  );
}
