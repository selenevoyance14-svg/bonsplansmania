"use client";

import { Fragment, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { CodePromoOffer } from "@/lib/code-promo-offers";
import { CODE_PROMO_BRANDS, getBrandBySlug } from "@/lib/code-promo-data";
import OfferCard from "./OfferCard";
import ListAd from "./ListAd";

interface Props {
  offers: CodePromoOffer[];
  referenceDate: string;
}

export default function OfferGrid({ offers, referenceDate }: Props) {
  const [brandSlug, setBrandSlug] = useState<string>("");

  // Registre complet des marques affichées en bas de /code-promo.
  // Le compteur reste limité aux offres actives du mur, mais une marque sans
  // offre du jour ne disparaît plus du menu déroulant.
  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    offers.forEach((o) => {
      counts.set(o.brandSlug, (counts.get(o.brandSlug) || 0) + 1);
    });
    return CODE_PROMO_BRANDS
      .map((brand) => ({
        slug: brand.slug,
        name: brand.name,
        count: counts.get(brand.slug) || 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
  }, [offers]);

  const filtered = useMemo(() => {
    const list = brandSlug
      ? offers.filter((offer) => offer.brandSlug === brandSlug)
      : offers;
    // Featured en premier, puis expires proches, puis permanents à la fin.
    return [...list].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (!a.expires && b.expires) return 1;
      if (a.expires && !b.expires) return -1;
      if (a.expires && b.expires) return a.expires.localeCompare(b.expires);
      return 0;
    });
  }, [offers, brandSlug]);

  const hasActiveFilters = brandSlug !== "";
  const reset = () => setBrandSlug("");

  return (
    <>
      <div className="offer-toolbar">
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
                {b.name}{b.count > 0 ? ` (${b.count})` : ""}
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
            Aucune offre active dans le mur pour cette marque.{" "}
            {brandSlug ? (
              <a href={`/code-promo/${brandSlug}`} style={{ color: "#7D293D", textDecoration: "underline", fontWeight: 700 }}>
                Voir sa page et ses bons plans
              </a>
            ) : (
              <button type="button" onClick={reset} style={{ background: "none", border: "none", color: "#7D293D", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}>Réinitialiser</button>
            )}
          </p>
        ) : (
          filtered.map((offer, index) => (
            <Fragment key={`${offer.brandSlug}:${offer.id}`}>
              <OfferCard offer={offer} referenceDate={referenceDate} />
              <ListAd afterCard={index + 1} />
            </Fragment>
          ))
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
        .offer-toolbar-right {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-left: auto;
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
