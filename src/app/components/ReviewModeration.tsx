"use client";

import { FormEvent, useState } from "react";

const API =
  "https://bonsplansmania-newsletter.selenevoyance14.workers.dev";

type Review = {
  id: string;
  productName: string;
  rating: number;
  nickname: string;
  email?: string;
  title: string;
  comment: string;
  submittedAt: string;
};

export default function ReviewModeration() {
  const [token, setToken] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<"locked" | "loading" | "ready" | "error">("locked");
  const [message, setMessage] = useState("");

  async function loadReviews(event?: FormEvent) {
    event?.preventDefault();
    setStatus("loading");
    setMessage("");
    const response = await fetch(`${API}/reviews/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setStatus("error");
      setMessage("Clé incorrecte ou service indisponible.");
      return;
    }
    const data = (await response.json()) as { reviews: Review[] };
    setReviews(data.reviews);
    setStatus("ready");
  }

  async function moderate(id: string, action: "publish" | "reject") {
    const response = await fetch(`${API}/reviews/moderate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, action }),
    });
    if (!response.ok) {
      setMessage("La modération n’a pas fonctionné.");
      return;
    }
    setReviews((current) => current.filter((review) => review.id !== id));
    setMessage(action === "publish" ? "Avis publié." : "Avis refusé et supprimé.");
  }

  if (status === "locked" || status === "loading" || status === "error") {
    return (
      <main className="review-admin">
        <form className="review-admin-login" onSubmit={loadReviews}>
          <span className="community-section-kicker">Bons Plans Mania</span>
          <h1>Modération des avis</h1>
          <p>Entre ta clé privée pour consulter les avis en attente.</p>
          <label>
            Clé de modération
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button className="btn btn-primary" disabled={status === "loading"} type="submit">
            {status === "loading" ? "Connexion…" : "Voir les avis"}
          </button>
          {message && <p className="review-form-message is-error">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="review-admin">
      <div className="review-admin-panel">
        <div className="review-admin-header">
          <div>
            <span className="community-section-kicker">Espace privé</span>
            <h1>Avis en attente ({reviews.length})</h1>
          </div>
          <button className="btn btn-secondary" onClick={() => loadReviews()} type="button">
            Actualiser
          </button>
        </div>
        {message && <p className="review-admin-message">{message}</p>}
        {!reviews.length ? (
          <div className="community-empty-state">
            <p>Aucun avis à modérer pour le moment.</p>
          </div>
        ) : (
          <div className="review-admin-list">
            {reviews.map((review) => (
              <article className="review-admin-card" key={review.id}>
                <div className="review-admin-card-head">
                  <div>
                    <span className="published-review-stars">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </span>
                    <h2>{review.title}</h2>
                  </div>
                  <strong>{review.productName}</strong>
                </div>
                <p>{review.comment}</p>
                <small>
                  {review.nickname}
                  {review.email ? ` — ${review.email}` : " — aucun e-mail"}
                  {" — "}
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(review.submittedAt))}
                </small>
                <div className="review-admin-actions">
                  <button className="btn btn-primary" onClick={() => moderate(review.id, "publish")} type="button">
                    Publier
                  </button>
                  <button className="btn btn-secondary" onClick={() => moderate(review.id, "reject")} type="button">
                    Refuser
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
