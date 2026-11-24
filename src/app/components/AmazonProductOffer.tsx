"use client";

import { ExternalLink } from "lucide-react";
import { useAmazonOffer } from "@/lib/amazon-offer-client";

const parsePrice = (value?: string | null) => {
  if (!value) return null;
  const amount = Number(value.replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

export default function AmazonProductOffer({ asin, href }: { asin: string; href: string }) {
  const offer = useAmazonOffer(asin);
  const timestamp = offer?.checkedAt ? Date.parse(offer.checkedAt) : NaN;
  const age = (offer?.receivedAt ?? NaN) - timestamp;
  const fresh = Number.isFinite(age) && age >= -60_000 && age <= 6 * 60 * 60_000 && offer?.asin === asin;
  const price = fresh ? parsePrice(offer?.price) : null;
  const reference = fresh ? parsePrice(offer?.oldPrice) : null;
  const discount = price && reference && reference > price ? Math.round((1 - price / reference) * 100) : null;
  const rating = fresh && typeof offer?.rating === "number" && offer.rating > 0 && offer.rating <= 5 ? offer.rating : null;
  const count = fresh && Number.isInteger(offer?.reviewCount) && (offer?.reviewCount ?? 0) > 0 ? offer?.reviewCount : null;
  const availability = fresh ? offer?.availability : null;
  const unavailable = /indisponible|rupture|pas en stock/i.test(availability || "");

  return (
    <div className="beauty-product-buybox">
      <p className="beauty-product-buybox-label">Offre Amazon</p>
      <div className="beauty-product-price-row" aria-live="polite">
        <strong className={price ? "beauty-product-price" : "beauty-product-price-fallback"}>{price ? offer?.price : "Prix actuel à consulter sur Amazon"}</strong>
        {discount ? <><del title="Prix de référence fourni par Amazon">{offer?.oldPrice}</del><span className="beauty-product-discount">−{discount} %</span></> : null}
      </div>
      {price && <p className="beauty-product-updated">Prix actualisé automatiquement · {new Date(timestamp).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}</p>}
      {availability ? <p className="beauty-product-stock">{availability}</p> : fresh && offer?.inStock ? <p className="beauty-product-stock">En stock</p> : <p className="beauty-product-stock">Disponibilité à consulter sur Amazon</p>}
      <a className="btn btn-primary beauty-product-cta" href={href} target="_blank" rel="nofollow sponsored noopener">{unavailable ? "Vérifier sur Amazon" : "Voir sur Amazon"} <ExternalLink size={18} aria-hidden /></a>
      <p className="beauty-product-fine-print">Prix et disponibilité susceptibles de changer. Le tarif affiché sur Amazon au moment de l’achat fait foi. {discount ? "La réduction est calculée par rapport au prix de référence fourni par Amazon." : ""}</p>
      <div className="beauty-product-amazon-reviews">
        <strong>Avis clients Amazon</strong>
        {rating && count ? <p><b>{new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(rating)} / 5</b> · {new Intl.NumberFormat("fr-FR").format(count)} avis</p> : null}
        <a href={`${href}#customerReviews`} target="_blank" rel="nofollow sponsored noopener">Lire les avis sur Amazon <ExternalLink size={13} aria-hidden /></a>
        <small>Distincts des avis de la communauté Bons Plans Mania.</small>
      </div>
      <p className="beauty-product-fine-print">Lien affilié : Bons Plans Mania peut percevoir une commission sur les achats effectués via ce lien.</p>
    </div>
  );
}
