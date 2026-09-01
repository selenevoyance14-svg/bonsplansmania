"use client";

import { FormEvent, useState } from "react";

const API = "https://bonsplansmania-newsletter.selenevoyance14.workers.dev";

type ArticleComment = {
  id: string;
  nickname: string;
  comment: string;
  submittedAt: string;
};

export default function ArticleComments({ articleSlug, articleTitle }: { articleSlug: string; articleTitle: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [visible, setVisible] = useState(3);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function toggleComments() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (!nextOpen || loaded) return;
    setLoading(true);
    try {
      const response = await fetch(`${API}/comments/public?articleSlug=${encodeURIComponent(articleSlug)}`);
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { comments: ArticleComment[] };
      setComments(data.comments);
      setLoaded(true);
    } catch {
      setMessage("Les commentaires sont momentanément indisponibles.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(`${API}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleSlug,
          articleTitle,
          nickname: form.get("nickname"),
          email: form.get("email"),
          comment: form.get("comment"),
          website: form.get("website"),
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "L’envoi n’a pas fonctionné.");
      formElement.reset();
      setStatus("success");
      setMessage("Merci ! Votre commentaire sera visible après vérification.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "L’envoi n’a pas fonctionné.");
    }
  }

  return (
    <section className="article-comments" aria-labelledby="comments-title">
      <div className="article-comments-heading">
        <div>
          <span className="community-section-kicker">La communauté</span>
          <h2 id="comments-title">Vos commentaires et bons plans</h2>
          <p>Une précision, une expérience ou une meilleure offre à partager ?</p>
        </div>
        <a className="community-tip-link" href="/proposer-un-bon-plan">Proposer un bon plan</a>
      </div>

      <button className="comments-toggle" type="button" aria-expanded={open} onClick={toggleComments}>
        <span>{open ? "Masquer les commentaires" : `Lire les commentaires${loaded ? ` (${comments.length})` : ""}`}</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="comments-panel">
          {loading && <p>Chargement des commentaires…</p>}
          {!loading && loaded && comments.length === 0 && <p className="community-empty-state">Aucun commentaire pour le moment. Soyez la première personne à participer.</p>}
          {comments.slice(0, visible).map((item) => (
            <article className="article-comment" key={item.id}>
              <div><strong>{item.nickname}</strong><time dateTime={item.submittedAt}>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(item.submittedAt))}</time></div>
              <p>{item.comment}</p>
            </article>
          ))}
          {visible < comments.length && <button className="comments-more" type="button" onClick={() => setVisible((value) => value + 5)}>Voir plus de commentaires</button>}

          <details className="comment-form-details">
            <summary>Laisser un commentaire</summary>
            <form className="community-form" onSubmit={submit}>
              <div className="community-form-grid">
                <label>Prénom ou pseudo *<input name="nickname" required minLength={2} maxLength={40} /></label>
                <label>E-mail (facultatif, jamais publié)<input name="email" type="email" maxLength={120} /></label>
              </div>
              <label>Votre commentaire *<textarea name="comment" required minLength={10} maxLength={1200} rows={5} placeholder="Votre retour, une précision utile ou la date de fin du bon plan…" /></label>
              <label className="review-honeypot" aria-hidden="true">Site internet<input name="website" tabIndex={-1} autoComplete="off" /></label>
              <label className="review-consent"><input type="checkbox" required /><span>J’accepte que mon pseudo et mon commentaire soient publiés après modération.</span></label>
              <button className="btn btn-primary" disabled={status === "sending"} type="submit">{status === "sending" ? "Envoi…" : "Envoyer mon commentaire"}</button>
              {message && <p className={`review-form-message ${status === "success" ? "is-success" : status === "error" ? "is-error" : ""}`} role="status">{message}</p>}
            </form>
          </details>
        </div>
      )}
    </section>
  );
}
