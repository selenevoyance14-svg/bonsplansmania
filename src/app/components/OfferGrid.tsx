"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { CodePromoOffer, OfferType } from "@/lib/code-promo-offers";
import { getBrandBySlug } from "@/lib/code-promo-data";
import OfferCard from "./OfferCard";

type Filter = "all" | OfferType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "code", label: "Codes promo" },
  { key: "offre", label: "Offres" },
  { key: "soldes", label: "Soldes" },
  { key: "newsletter", label: "Newsletter" },
  { key: "cashback", label: "Cashback" },
  { key: "livraison", label: "Livraison" },
];

interface Props {
  offers: CodePromoOffer[];
}

export default function OfferGrid({ offers }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [brandSlug, setBrandSlug] = useState<string>("");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: offers.length,
      code: 0,
      offre: 0,
      soldes: 0,
      cashback: 0,
      livraison: 0,
      newsletter: 0,
    };
    offers.forEach((o) => { c[o.type]++; });
    return c;
  }, [offers]);

  // Marques présentes (avec compte), triées alpha
  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    offers.forEach((o) => {
      counts.set(o.brandSlug, (counts.get(o.brandSlug) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([slug, count]) => {
        const brand = getBrandBySlug(slug);
        return { slug, name: brand?.name ?? slug, count };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [offers]);

  const filtered = useMemo(() => {
    let list = offers;
    if (filter !== "all") list = list.filter((o) => o.type === filter);
    if (brandSlug) list = list.filter((o) => o.brandSlug === brandSlug);
    // Featured en premier, puis expires proches, puis permanents à la fin.
    return [...list].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (!a.expires && b.expires) return 1;
      if (a.expires && !b.expires) return -1;
      if (a.expires && b.expires) return a.expires.localeCompare(b.expires);
      return 0;
    });
  }, [offers, filter, brandSlug]);

  const hasActiveFilters = filter !== "all" || brandSlug !== "";
  const reset = () => { setFilter("all"); setBrandSlug(""); };

  return (
    <>
      <div className="offer-toolbar">
        <div className="offer-filters">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count = counts[f.key];
            if (count === 0 && f.key !== "all") return null;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`offer-filter ${active ? "offer-filter-active" : ""}`}
                aria-pressed={active}
              >
                {f.label} <span className="offer-filter-count">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="offer-toolbar-right">
          <select
            value={brandSlug}
            onChange={(e) => setBrandSlug(e.target.value)}
            className={`offer-brand-select ${brandSlug ? "offer-brand-select-active" : ""}`}
            aria-label="Filtrer par marque"
          >
            <option value="">🏷️ Toutes les marques ({availableBrands.length})</option>
            {availableBrands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name} ({b.count})
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button type="button" onClick={reset} className="offer-reset">
              <X size={14} /> Effacer
            </button>
          )}
        </div>
      </div>

      <div className="offer-count-line">
        <strong>{filtered.length}</strong> offre{filtered.length > 1 ? "s" : ""}
        {brandSlug && ` pour ${getBrandBySlug(brandSlug)?.name}`}
      </div>

      <div className="offer-list">
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px 0", color: "var(--muted-foreground)" }}>
            Aucune offre pour ce filtre. <button type="button" onClick={reset} style={{ background: "none", border: "none", color: "#7D293D", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}>Réinitialiser</button>
          </p>
        ) : (
          filtered.map((offer) => <OfferCard key={offer.id} offer={offer} />)
        )}
      </div>

      <style>{`
        .offer-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 14px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 2px;
        }
        .offer-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .offer-toolbar-right {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-left: auto;
        }
        .offer-filter {
          border: 1.5px solid var(--border);
          background: white;
          color: var(--foreground);
          padding: 8px 16px;
          border-radius: 2px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }
        .offer-filter:hover:not(.offer-filter-active) {
          border-color: #94A3B8;
        }
        .offer-filter-active {
          background: #7D293D;
          border-color: #7D293D;
          color: white;
        }
        .offer-filter-count {
          opacity: 0.75;
          font-weight: 600;
          font-size: 0.8rem;
        }
        .offer-brand-select {
          padding: 9px 34px 9px 14px;
          border: 1.5px solid var(--border);
          border-radius: 2px;
          background: white;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--foreground);
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
          background-repeat: no-repeat;
          background-position: right 12px center;
          max-width: 260px;
        }
        .offer-brand-select-active {
          border-color: #7D293D;
          background-color: #F7EBED;
          color: #7D293D;
        }
        .offer-reset {
          padding: 8px 12px;
          background: transparent;
          color: #DC2626;
          border: 1.5px solid #DC262633;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .offer-reset:hover {
          background: #DC262611;
        }
        .offer-count-line {
          margin: 0 0 16px;
          padding: 0 4px;
          color: var(--muted-foreground);
          font-size: 0.9rem;
        }
        .offer-count-line strong {
          color: var(--foreground);
        }
        .offer-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        @media (max-width: 720px) {
          .offer-toolbar-right {
            margin-left: 0;
            width: 100%;
          }
          .offer-brand-select {
            flex: 1;
            max-width: none;
          }
        }
      `}</style>
    </>
  );
}
