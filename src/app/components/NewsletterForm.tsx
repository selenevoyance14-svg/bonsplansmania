"use client";

import { useState } from "react";
import { Mail, Flame, Lock } from "lucide-react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        localStorage.setItem("bpm_newsletter_email", email);
        localStorage.setItem("bpm_subscribed", "true");
        setSubscribed(true);
        setEmail("");
    }

    if (subscribed) {
        return (
            <div style={{ textAlign: "center", padding: "2rem", background: "var(--surface, #f9fafb)", borderRadius: "16px" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>Merci pour votre inscription !</p>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Vous recevrez nos meilleurs bons plans prochainement.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <Flame size={20} style={{ color: "var(--primary)" }} />
                <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Ne ratez aucun bon plan</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border, #e5e7eb)", fontSize: "0.95rem" }}
                />
                <button type="submit" style={{ padding: "10px 20px", borderRadius: "8px", background: "var(--primary)", color: "white", fontWeight: 600, border: "none", cursor: "pointer", fontSize: "0.95rem" }}>
                    <Mail size={16} />
                </button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Lock size={11} /> Pas de spam. Desinscription en un clic.
            </p>
        </form>
    );
}
