"use client";

import { FormEvent, useState } from "react";

const API = "https://bonsplansmania-newsletter.selenevoyance14.workers.dev";
type Comment = { id: string; articleTitle: string; articleSlug: string; nickname: string; email?: string; comment: string; submittedAt: string };
type Tip = { id: string; kind: string; title: string; url: string; details: string; nickname: string; email?: string; submittedAt: string };

export default function CommunityModeration() {
  const [token, setToken] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");

  async function load(event?: FormEvent) {
    event?.preventDefault();
    setMessage("");
    const response = await fetch(`${API}/community/pending`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) { setMessage("Clé incorrecte ou service indisponible."); return; }
    const data = (await response.json()) as { comments: Comment[]; tips: Tip[] };
    setComments(data.comments); setTips(data.tips); setUnlocked(true);
  }

  async function moderate(id: string, type: "comment" | "tip", action: "publish" | "reject" | "done") {
    const response = await fetch(`${API}/community/moderate`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ id, type, action }) });
    if (!response.ok) { setMessage("La modération n’a pas fonctionné."); return; }
    if (type === "comment") setComments((items) => items.filter((item) => item.id !== id));
    else setTips((items) => items.filter((item) => item.id !== id));
    setMessage(action === "publish" ? "Commentaire publié." : action === "done" ? "Bon plan marqué comme traité." : "Contribution supprimée.");
  }

  if (!unlocked) return <main className="review-admin"><form className="review-admin-login" onSubmit={load}><span className="community-section-kicker">Bons Plans Mania</span><h1>Modération de la communauté</h1><p>Entre ta clé privée pour consulter les commentaires et bons plans en attente.</p><label>Clé de modération<input type="password" value={token} onChange={(event) => setToken(event.target.value)} required /></label><button className="btn btn-primary" type="submit">Ouvrir</button>{message && <p className="review-form-message is-error">{message}</p>}</form></main>;

  const date = (value: string) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  return <main className="review-admin"><div className="review-admin-panel"><div className="review-admin-header"><div><span className="community-section-kicker">Espace privé</span><h1>Communauté ({comments.length + tips.length})</h1></div><button className="btn btn-secondary" onClick={() => load()} type="button">Actualiser</button></div>{message && <p className="review-admin-message">{message}</p>}
    <h2>Commentaires en attente ({comments.length})</h2>{!comments.length ? <p className="community-empty-state">Aucun commentaire à modérer.</p> : <div className="review-admin-list">{comments.map((item) => <article className="review-admin-card" key={item.id}><div className="review-admin-card-head"><h3>{item.articleTitle}</h3><a href={`/article/${item.articleSlug}`} target="_blank">Voir l’article</a></div><p>{item.comment}</p><small>{item.nickname}{item.email ? ` — ${item.email}` : " — aucun e-mail"} — {date(item.submittedAt)}</small><div className="review-admin-actions"><button className="btn btn-primary" onClick={() => moderate(item.id, "comment", "publish")}>Publier</button><button className="btn btn-secondary" onClick={() => moderate(item.id, "comment", "reject")}>Refuser</button></div></article>)}</div>}
    <h2 className="community-admin-subtitle">Bons plans proposés ({tips.length})</h2>{!tips.length ? <p className="community-empty-state">Aucun bon plan à traiter.</p> : <div className="review-admin-list">{tips.map((item) => <article className="review-admin-card" key={item.id}><div className="review-admin-card-head"><div><span className="community-section-kicker">{item.kind}</span><h3>{item.title}</h3></div>{item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">Ouvrir le lien</a>}</div><p>{item.details}</p><small>{item.nickname}{item.email ? ` — ${item.email}` : " — aucun e-mail"} — {date(item.submittedAt)}</small><div className="review-admin-actions"><button className="btn btn-primary" onClick={() => moderate(item.id, "tip", "done")}>Marquer traité</button><button className="btn btn-secondary" onClick={() => moderate(item.id, "tip", "reject")}>Supprimer</button></div></article>)}</div>}
  </div></main>;
}
