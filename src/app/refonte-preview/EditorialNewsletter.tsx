"use client";

import { hasNewsletterSubscription, subscribeNewsletter } from "@/lib/newsletter-client";

import { Mail } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const getServerSubscription = () => false;
import styles from "./refonte.module.css";

export default function EditorialNewsletter() {
  const [email, setEmail] = useState("");
  const hidden = useSyncExternalStore(subscribeToStorage, hasNewsletterSubscription, getServerSubscription);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");


  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await subscribeNewsletter(email);
      window.gtag?.("event", "newsletter_signup", { form_location: "homepage_newsletter", page_path: window.location.pathname });
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
        <h2 id="newsletter-title">Ne rate plus aucun bon plan</h2>
        <p>Reçois 2 fois par semaine les meilleures offres, le mardi et le samedi.</p>
      </div>
      {status === "done" ? (
        <p className={styles.newsletterThanks}>Merci, votre inscription est enregistrée pour les prochaines newsletters du mardi et du samedi.</p>
      ) : (
        <form onSubmit={subscribe} className={styles.newsletterForm}>
          <label htmlFor="homepage-deals-email">Votre adresse e-mail</label>
          <div><input id="homepage-deals-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.fr" required disabled={status === "loading"} /><button type="submit" aria-label="S’inscrire à la newsletter" disabled={status === "loading"}>{status === "loading" ? "…" : "Je m’inscris"}</button></div>
          {status === "error" && <span role="alert">{message}</span>}
          <small>Inscription gratuite · désinscription en un clic</small>
        </form>
      )}
    </section>
  );
}
