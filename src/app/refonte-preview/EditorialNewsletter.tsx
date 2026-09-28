"use client";

import { ArrowRight, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./refonte.module.css";

export default function EditorialNewsletter() {
  const [email, setEmail] = useState("");
  const [hidden, setHidden] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => setHidden(localStorage.getItem("bpm_subscribed") === "true"), []);

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const response = await fetch("https://bonsplansmania-newsletter.selenevoyance14.workers.dev/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "L’inscription a échoué.");
      localStorage.setItem("bpm_newsletter_email", email);
      localStorage.setItem("bpm_subscribed", "true");
      window.gtag?.("event", "newsletter_signup", { form_location: "homepage_deals_inline", page_path: window.location.pathname });
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Réessayez dans un instant.");
    }
  }

  if (hidden) return null;

  return (
    <section className={styles.newsletter} aria-labelledby="newsletter-title">
      <div className={styles.newsletterIcon}><Mail size={23} /></div>
      <div className={styles.newsletterCopy}>
        <small>Deux rendez-vous par semaine</small>
        <h2 id="newsletter-title">Les bons plans à ne pas manquer, dans votre boîte mail.</h2>
        <p>Notre sélection du mardi et du samedi, courte et utile.</p>
      </div>
      {status === "done" ? (
        <p className={styles.newsletterThanks}>Merci, vous êtes bien inscrit(e) !</p>
      ) : (
        <form onSubmit={subscribe} className={styles.newsletterForm}>
          <label htmlFor="homepage-deals-email">Votre adresse e-mail</label>
          <div><input id="homepage-deals-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.fr" required disabled={status === "loading"} /><button type="submit" aria-label="S’inscrire à la newsletter" disabled={status === "loading"}>{status === "loading" ? "…" : <ArrowRight size={18} />}</button></div>
          {status === "error" && <span role="alert">{message}</span>}
          <small>Inscription gratuite · désinscription en un clic</small>
        </form>
      )}
    </section>
  );
}
