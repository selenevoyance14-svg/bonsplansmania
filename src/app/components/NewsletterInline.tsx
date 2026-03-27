"use client";

import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

export default function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [hidden, setHidden] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (localStorage.getItem("bpm_subscribed")) setHidden(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      await fetch("https://bonsplansmania-newsletter.selenevoyance14.workers.dev/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Meme en cas d'erreur reseau, on enregistre localement
    }

    localStorage.setItem("bpm_newsletter_email", email);
    localStorage.setItem("bpm_subscribed", "true");
    setStatus("done");
  }

  if (hidden) return null;

  if (status === "done") {
    return (
      <div style={{ background: "var(--surface, #f0fdf4)", padding: "1rem", borderRadius: "12px", textAlign: "center", margin: "2rem 0" }}>
        <p style={{ fontWeight: 600 }}>Merci pour votre inscription !</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--surface, #fefce8)", padding: "1.25rem", borderRadius: "12px", margin: "2rem 0" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <Flame size={18} style={{ color: "var(--primary)" }} />
        <span style={{ fontWeight: 600, fontSize: "0.9rem", marginRight: "8px" }}>Recevez les bons plans par email</span>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          style={{ flex: 1, minWidth: "180px", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border, #e5e7eb)", fontSize: "0.9rem" }}
        />
        <button type="submit" disabled={status === "loading"} style={{ padding: "8px 16px", borderRadius: "8px", background: "var(--primary)", color: "white", fontWeight: 600, border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
          {status === "loading" ? "..." : "OK"}
        </button>
      </form>
    </div>
  );
}
