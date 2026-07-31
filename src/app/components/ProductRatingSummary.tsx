"use client";

import { useEffect, useState } from "react";

const ENDPOINT =
  "https://bonsplansmania-newsletter.selenevoyance14.workers.dev/reviews/public";

type Review = { rating: number };

/**
 * Note moyenne affichée en haut d'une fiche produit.
 *
 * Le site étant en export statique, la moyenne ne peut pas être calculée au
 * build : elle est récupérée côté client depuis le même endpoint que la liste
 * des avis publiés, puis moyennée. Tant qu'aucun avis n'est publié, le bloc
 * n'affiche rien du tout.
 */
export default function ProductRatingSummary({
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

  const ratings = (reviews || []).map((r) => r.rating).filter((r) => r >= 1 && r <= 5);

  // Sans avis publié, on n'affiche rien : cinq étoiles vides en haut de fiche
  // ne renseignent personne. L'invitation à donner son avis reste portée par le
  // bouton juste en dessous et par la section des avis en bas de page.
  if (!ratings.length) return null;

  const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  const filled = Math.round(average);
  const formatted = average.toFixed(1).replace(".", ",");

  return (
    <div className="empty-community-rating">
      <span
        className="published-review-stars"
        aria-label={`Note moyenne : ${formatted} sur 5`}
      >
        {"★".repeat(filled)}
        {"☆".repeat(5 - filled)}
      </span>
      <strong>
        {formatted}/5 sur {ratings.length} avis
      </strong>
      <small>
        {ratings.length === 1
          ? "Un premier avis déposé par la communauté."
          : "Moyenne des avis publiés par la communauté."}
      </small>
    </div>
  );
}
