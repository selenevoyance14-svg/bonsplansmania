"use client";

import { FormEvent, useState } from "react";

const API = "https://bonsplansmania-newsletter.selenevoyance14.workers.dev/tip";

export default function DealTipForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "L’envoi n’a pas fonctionné.");
      formElement.reset();
      setStatus("success");
      setMessage("Merci ! Le bon plan a bien été transmis à l’équipe pour vérification.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "L’envoi n’a pas fonctionné.");
    }
  }

  return (
    <form className="community-form deal-tip-form" onSubmit={submit}>
      <div className="community-form-grid">
        <label>Type de bon plan *<select name="kind" required defaultValue="Bon plan"><option>Bon plan</option><option>Code promo</option><option>Jeu concours</option><option>Test produit</option><option>Produit gratuit</option><option>Autre</option></select></label>
        <label>Votre prénom ou pseudo *<input name="nickname" required minLength={2} maxLength={40} /></label>
      </div>
      <label>Titre du bon plan *<input name="title" required minLength={5} maxLength={160} placeholder="Ex. 30 % sur les soins visage…" /></label>
      <label>Lien vers l’offre (facultatif)<input name="url" type="url" maxLength={500} placeholder="https://…" /></label>
      <label>Détails et conditions *<textarea name="details" required minLength={15} maxLength={2000} rows={7} placeholder="Prix, code, date de fin, conditions et tout ce qui permet de vérifier l’offre…" /></label>
      <label>E-mail (facultatif, jamais publié)<input name="email" type="email" maxLength={120} /></label>
      <label className="review-honeypot" aria-hidden="true">Site internet<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="review-consent"><input type="checkbox" required /><span>J’accepte que ces informations soient utilisées pour vérifier et éventuellement publier ce bon plan.</span></label>
      <button className="btn btn-primary" disabled={status === "sending"} type="submit">{status === "sending" ? "Envoi…" : "Envoyer mon bon plan"}</button>
      {message && <p className={`review-form-message ${status === "success" ? "is-success" : "is-error"}`} role="status">{message}</p>}
    </form>
  );
}
