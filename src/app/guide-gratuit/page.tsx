"use client";

import { useState, FormEvent } from "react";
import { Download, Mail, CheckCircle, Lock, Gift, Star, Users, BookOpen } from "lucide-react";
import Header from "@/app/components/Header";

export default function GuideGratuit() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("https://bonsplansmania-newsletter.selenevoyance14.workers.dev/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setDownloadUrl(data.downloadUrl);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Veuillez réessayer.");
    }
  }

  return (
    <>
      <Header activePage="" />
      <main style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container" style={{ maxWidth: "800px" }}>

          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "linear-gradient(135deg, #10B981, #059669)", color: "white",
              padding: "8px 20px", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: 700,
              marginBottom: "20px", letterSpacing: "1px"
            }}>
              <Gift size={16} /> GUIDE GRATUIT
            </span>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "16px" }}>
              100+ sites pour tester des produits gratuits
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", maxWidth: "600px", margin: "0 auto" }}>
              Le guide le plus complet pour recevoir des <strong>produits gratuits</strong> chez vous.
              Plateformes, programmes de marques, astuces pour être sélectionnée.
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px",
            marginBottom: "48px"
          }}>
            {[
              { icon: <BookOpen size={22} />, value: "100+", label: "Plateformes listées" },
              { icon: <Star size={22} />, value: "50+", label: "Marques beauté" },
              { icon: <Users size={22} />, value: "10", label: "Astuces testées" },
              { icon: <Gift size={22} />, value: "13", label: "Pages de guide" },
            ].map((stat, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "20px 16px",
                background: "var(--surface)", borderRadius: "var(--radius)",
                boxShadow: "var(--shadow-card)"
              }}>
                <div style={{ color: "var(--primary)", marginBottom: "8px", display: "flex", justifyContent: "center" }}>{stat.icon}</div>
                <div style={{ fontWeight: 800, fontSize: "1.4rem" }}>{stat.value}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* What's inside */}
          <div style={{
            background: "var(--surface)", borderRadius: "var(--radius-lg)",
            padding: "32px", boxShadow: "var(--shadow-soft)", marginBottom: "40px"
          }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px" }}>
              Ce que contient le guide :
            </h2>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "26 grandes plateformes de test (Sampleo, TRND, Mon Vanity Idéal...)",
                "50+ programmes directs de marques beauté, bio, santé",
                "7 marques grandes surfaces (L'Oréal, Nivea, Yves Rocher...)",
                "19 marques bio et naturelles (Weleda, Cattier, Melvita...)",
                "28 marques soins visage et corps",
                "10 astuces pour être sélectionnée à chaque fois",
                "Calendrier d'organisation et checklist du profil idéal",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle size={18} style={{ color: "var(--success)", flexShrink: 0, marginTop: "3px" }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Download form */}
          <div style={{
            background: "linear-gradient(135deg, #E63946, #C1121F)",
            borderRadius: "var(--radius-lg)", padding: "40px 32px",
            color: "white", textAlign: "center"
          }}>
            {status === "success" ? (
              <div>
                <CheckCircle size={48} style={{ marginBottom: "16px" }} />
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px" }}>
                  {message}
                </h2>
                <p style={{ marginBottom: "24px", opacity: 0.9 }}>
                  Cliquez sur le bouton ci-dessous pour télécharger votre guide PDF.
                </p>
                <a
                  href={downloadUrl}
                  download
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    background: "white", color: "var(--primary)", padding: "16px 32px",
                    borderRadius: "var(--radius-pill)", fontWeight: 700, fontSize: "1.1rem",
                    textDecoration: "none", transition: "transform 0.2s"
                  }}
                >
                  <Download size={20} /> Télécharger le guide PDF
                </a>
                <p style={{ marginTop: "16px", fontSize: "0.85rem", opacity: 0.8 }}>
                  Vous recevrez aussi nos meilleurs bons plans par email.
                </p>
              </div>
            ) : (
              <div>
                <Mail size={36} style={{ marginBottom: "12px" }} />
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>
                  Téléchargez le guide gratuitement
                </h2>
                <p style={{ marginBottom: "24px", opacity: 0.9 }}>
                  Entrez votre email pour recevoir le guide complet en PDF (13 pages).
                </p>
                <form onSubmit={handleSubmit} style={{ maxWidth: "440px", margin: "0 auto" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === "loading"}
                      style={{
                        flex: 1, padding: "14px 18px", borderRadius: "var(--radius)",
                        border: "none", fontSize: "1rem", outline: "none"
                      }}
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      style={{
                        padding: "14px 24px", borderRadius: "var(--radius)",
                        background: "white", color: "var(--primary)", border: "none",
                        fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px",
                        opacity: status === "loading" ? 0.7 : 1
                      }}
                    >
                      {status === "loading" ? "..." : <><Download size={16} /> Recevoir</>}
                    </button>
                  </div>
                  {status === "error" && (
                    <p style={{ color: "#FCA5A5", fontSize: "0.85rem" }}>{message}</p>
                  )}
                  <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                    <Lock size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    Pas de spam. Désinscription en un clic.
                  </p>
                </form>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
