"use client";

import { FormEvent, useState } from "react";

const REVIEW_ENDPOINT =
  "https://bonsplansmania-newsletter.selenevoyance14.workers.dev/review";

export default function ProductReviewForm({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(REVIEW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productName,
          rating,
          nickname: form.get("nickname"),
          email: form.get("email"),
          title: form.get("title"),
          comment: form.get("comment"),
          website: form.get("website"),
        }),
      });

      if (!response.ok) throw new Error("review");
      event.currentTarget.reset();
      setRating(0);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="product-review-form" id="donner-avis" onSubmit={submitReview}>
      <div className="review-form-heading">
        <div>
          <h3>Donner mon avis</h3>
          <p>Pas besoin de créer un compte. Votre avis sera vérifié avant publication.</p>
        </div>
      </div>

      <fieldset className="review-rating">
        <legend>Votre note *</legend>
        <div className="review-stars" aria-label={`${rating} étoile${rating > 1 ? "s" : ""} sur 5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
              className={star <= rating ? "is-selected" : ""}
              key={star}
              onClick={() => setRating(star)}
              type="button"
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <div className="review-form-grid">
        <label>
          Prénom ou pseudo *
          <input name="nickname" required minLength={2} maxLength={40} />
        </label>
        <label>
          E-mail (jamais publié) *
          <input name="email" type="email" required maxLength={120} />
        </label>
      </div>

      <label>
        Le titre de votre avis *
        <input
          name="title"
          required
          minLength={3}
          maxLength={80}
          placeholder="Ex. Un parfum intense qui tient longtemps"
        />
      </label>

      <label>
        Votre expérience *
        <textarea
          name="comment"
          required
          minLength={30}
          maxLength={1500}
          rows={6}
          placeholder="Ce que vous avez aimé, la tenue, le parfum sur votre peau…"
        />
      </label>

      <label className="review-honeypot" aria-hidden="true">
        Site internet
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="review-consent">
        <input type="checkbox" required />
        <span>J’accepte que mon pseudo et mon avis soient publiés sur Bons Plans Mania.</span>
      </label>

      <button className="btn btn-primary" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Envoi…" : "Envoyer mon avis"}
      </button>

      {status === "success" && (
        <p className="review-form-message is-success" role="status">
          Merci ! Votre avis a bien été envoyé et sera publié après vérification.
        </p>
      )}
      {status === "error" && (
        <p className="review-form-message is-error" role="alert">
          {rating
            ? "L’envoi n’a pas fonctionné. Réessayez dans un instant."
            : "Choisissez une note de 1 à 5 étoiles."}
        </p>
      )}
    </form>
  );
}
