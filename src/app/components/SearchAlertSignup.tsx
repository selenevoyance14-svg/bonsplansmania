"use client";

import { Bell, Check, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import styles from "./SearchAlertSignup.module.css";

type AlertKind = "product" | "brand" | "category";
type Frequency = "instant" | "daily";

const ALERTS_ENDPOINT = process.env.NEXT_PUBLIC_ALERTS_ENDPOINT || "https://bonsplansmania-alerts.selenevoyance14.workers.dev";

const kindLabels: Record<AlertKind, string> = {
  product: "Produit",
  brand: "Marque",
  category: "Catégorie",
};

export default function SearchAlertSignup({ initialQuery, compact = false }: { initialQuery: string; compact?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState<AlertKind>("product");
  const [frequency, setFrequency] = useState<Frequency>("instant");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setQuery(initialQuery);
    setStatus("idle");
  }, [initialQuery]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim() || !email.trim()) return;
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${ALERTS_ENDPOINT}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          query: query.trim(),
          kind,
          frequency,
          source: typeof window === "undefined" ? "/recherche" : window.location.pathname + window.location.search,
          website: "",
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Impossible de créer l’alerte pour le moment.");
      setStatus("done");
      window.gtag?.("event", "deal_alert_signup", { alert_kind: kind, alert_frequency: frequency, page_path: window.location.pathname });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Réessayez dans un instant.");
    }
  }

  if (status === "done") {
    return (
      <aside className={`${styles.card} ${compact ? styles.compact : ""}`} aria-live="polite">
        <span className={styles.successIcon}><Check size={24} /></span>
        <div>
          <p className={styles.eyebrow}>Dernière étape</p>
          <h2>Confirmez l’alerte dans votre boîte mail</h2>
          <p>Nous surveillerons les nouvelles offres correspondant à <strong>« {query} »</strong> dès que vous aurez cliqué sur le lien de confirmation.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.card} ${compact ? styles.compact : ""}`} aria-labelledby="deal-alert-title">
      <div className={styles.heading}>
        <span className={styles.icon}><Bell size={23} /></span>
        <div><p className={styles.eyebrow}>Alerte gratuite</p><h2 id="deal-alert-title">Prévenez-moi dès qu’un bon plan paraît</h2></div>
      </div>
      <p className={styles.lead}>Choisissez ce que vous souhaitez surveiller. Ce service est indépendant de la newsletter générale.</p>

      <form onSubmit={submit}>
        <div className={styles.kindGroup} role="group" aria-label="Type d’alerte">
          {(Object.keys(kindLabels) as AlertKind[]).map((value) => (
            <button type="button" key={value} className={kind === value ? styles.activeKind : ""} onClick={() => setKind(value)} aria-pressed={kind === value}>{kindLabels[value]}</button>
          ))}
        </div>
        <label htmlFor="alert-query">{kindLabels[kind]} à surveiller</label>
        <input id="alert-query" className={styles.queryInput} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={kind === "brand" ? "Ex. Clarins" : kind === "category" ? "Ex. Couches bébé" : "Ex. Ninja Creami"} required />

        <label htmlFor="alert-signup-email">Votre adresse e-mail</label>
        <div className={styles.emailField}><Mail size={18} /><input id="alert-signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.fr" required /></div>

        <div className={styles.frequency}>
          <label><input type="radio" name="alert-frequency" value="instant" checked={frequency === "instant"} onChange={() => setFrequency("instant")} /> Dès qu’une offre paraît</label>
          <label><input type="radio" name="alert-frequency" value="daily" checked={frequency === "daily"} onChange={() => setFrequency("daily")} /> Résumé quotidien</label>
        </div>
        <input className={styles.honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className={styles.submit} type="submit" disabled={status === "loading"}>{status === "loading" ? "Création…" : "Créer mon alerte"}</button>
        {status === "error" && <p className={styles.error} role="alert">{message}</p>}
      </form>
      <p className={styles.privacy}><ShieldCheck size={15} /> Confirmation obligatoire · désinscription en un clic · aucun spam</p>
    </aside>
  );
}
