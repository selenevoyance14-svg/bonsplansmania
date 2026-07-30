"use client";

import { useEffect, useState } from "react";
import HelpfulButton from "@/app/components/HelpfulButton";

const ENDPOINT =
  "https://bonsplansmania-newsletter.selenevoyance14.workers.dev/reviews/public";

type Review = {
  id: string;
  rating: number;
  nickname: string;
  title: string;
  comment: string;
  submittedAt: string;
};

export default function ProductPublishedReviews({
  productSlug,
}: {
  productSlug: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${ENDPOINT}?productSlug=${encodeURIComponent(productSlug)}`)
      .then((response) => (response.ok ? response.json() : { reviews: [] }))
      .then((data: { reviews?: Review[] }) => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoaded(true));
  }, [productSlug]);

  if (!loaded) return <p className="reviews-loading">Chargement des avis…</p>;
  if (!reviews.length) {
    return (
      <div className="community-empty-state">
        <span className="empty-stars" aria-hidden="true">☆☆☆☆☆</span>
        <div>
          <h3>Aucun avis publié pour le moment</h3>
          <p>Soyez parmi les premières personnes à partager votre expérience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="published-reviews">
      {reviews.map((review) => (
        <article className="published-review" key={review.id}>
          <div className="published-review-head">
            <div>
              <span className="published-review-stars" aria-label={`${review.rating} sur 5`}>
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </span>
              <h3>{review.title}</h3>
            </div>
            <strong>{review.nickname}</strong>
          </div>
          <p>{review.comment}</p>
          <div className="published-review-footer">
            <time dateTime={review.submittedAt}>
              {new Intl.DateTimeFormat("fr-FR").format(new Date(review.submittedAt))}
            </time>
            <HelpfulButton id={`review:${review.id}`} />
          </div>
        </article>
      ))}
    </div>
  );
}
