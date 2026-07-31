"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

const ENDPOINT =
  "https://bonsplansmania-newsletter.selenevoyance14.workers.dev/reviews/public";

type Review = { rating: number };

/**
 * Note et nombre d'avis affichés en ligne sur une carte produit
 * (page /avis-prix-beaute).
 *
 * Même source que ProductRatingSummary : le site étant en export statique,
 * les avis sont récupérés côté client. Tant que la réponse n'est pas arrivée
 * on n'affiche rien, pour éviter que la carte saute.
 */
export default function ProductReviewStat({
  productSlug,
}: {
  productSlug: string;
}) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    fetch(`${ENDPOINT}?productSlug=${encodeURIComponent(productSlug)}`)
      .then((response) => (response.ok ? response.json() : { reviews: [] }))
      .then((data: { reviews?: Review[] }) => setReviews(data.reviews || []))
      .catch(() => setReviews([]));
  }, [productSlug]);

  if (reviews === null) return null;

  const ratings = reviews.map((r) => r.rating).filter((r) => r >= 1 && r <= 5);

  if (!ratings.length) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          color: "var(--muted-foreground)",
          fontWeight: 500,
        }}
      >
        <MessageSquare size={13} /> Aucun avis pour le moment
      </span>
    );
  }

  const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  const filled = Math.round(average);
  const formatted = average.toFixed(1).replace(".", ",");

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
      aria-label={`Note moyenne ${formatted} sur 5, ${ratings.length} avis`}
    >
      <MessageSquare size={13} aria-hidden="true" />
      <span style={{ color: "#F59E0B", letterSpacing: "1px" }} aria-hidden="true">
        {"★".repeat(filled)}
        {"☆".repeat(5 - filled)}
      </span>
      <span>
        {formatted}/5 · {ratings.length} avis
      </span>
    </span>
  );
}
