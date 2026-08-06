"use client";

import { useEffect, useState } from "react";
import { ExternalLink, LoaderCircle } from "lucide-react";

type AmazonOffer = {
  asin: string;
  title: string | null;
  image: string | null;
  price: string | null;
  oldPrice: string | null;
  savingsPercent: number | null;
  availability: string | null;
  inStock: boolean;
  checkedAt: string;
};

export default function AmazonLiveOffer({ asin, affiliateUrl }: { asin: string; affiliateUrl: string }) {
  const [offer, setOffer] = useState<AmazonOffer | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/amazon/${encodeURIComponent(asin)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Amazon price unavailable");
        return (await response.json()) as AmazonOffer;
      })
      .then(setOffer)
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });
    return () => controller.abort();
  }, [asin]);

  if (!offer && !failed) {
    return (
      <div className="amazon-live-offer amazon-live-offer-loading" aria-live="polite">
        <LoaderCircle size={18} className="amazon-live-spinner" aria-hidden />
        Vérification du prix actuel sur Amazon…
      </div>
    );
  }

  if (!offer?.price) {
    return (
      <div className="amazon-live-offer amazon-live-offer-fallback">
        <strong>Prix actuel à consulter sur Amazon</strong>
        <a href={affiliateUrl} target="_blank" rel="nofollow sponsored noopener">
          Voir le prix <ExternalLink size={14} aria-hidden />
        </a>
      </div>
    );
  }

  const checkedAt = new Date(offer.checkedAt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });

  return (
    <aside className="amazon-live-offer" aria-label="Prix actuel sur Amazon">
      {offer.image && (
        <a href={affiliateUrl} target="_blank" rel="nofollow sponsored noopener" className="amazon-live-image-link">
          {/* Cette URL vient directement de Creators API et n'est pas stockée sur le site. */}
          <img src={offer.image} alt={offer.title || "Produit disponible sur Amazon"} className="amazon-live-image" />
        </a>
      )}
      <div className="amazon-live-copy">
        <span className="amazon-live-label">Prix Amazon actualisé</span>
        <div className="amazon-live-prices">
          <strong>{offer.price}</strong>
          {offer.oldPrice && <del>{offer.oldPrice}</del>}
          {offer.savingsPercent ? <span>-{offer.savingsPercent}%</span> : null}
        </div>
        <small>{offer.availability || (offer.inStock ? "En stock" : "Disponibilité à vérifier")} · vérifié le {checkedAt}</small>
        <a href={affiliateUrl} className="btn btn-primary btn-sm" target="_blank" rel="nofollow sponsored noopener">
          Voir sur Amazon <ExternalLink size={13} aria-hidden />
        </a>
      </div>
    </aside>
  );
}
