"use client";

import { useState, useEffect, FormEvent } from "react";
import { Mail, Flame, Lock, CheckCircle, X } from "lucide-react";

const STORAGE_KEY = "bpm_popup_dismissed";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Ne pas afficher si déjà fermé ou déjà inscrit
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (localStorage.getItem("bpm_subscribed")) return;

    const timer = setTimeout(() => setShow(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("https://bonsplansmania-newsletter.selenevoyance14.workers.dev/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        const isAlready = data.already === true;
        setStatus("success");
        setMessage(isAlready ? "Vous etes deja inscrit !" : "Vous etes inscrit !");
        localStorage.setItem("bpm_subscribed", "true");
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        window.gtag?.("event", "newsletter_signup", {
          form_location: "popup",
          page_path: window.location.pathname,
          subscriber_status: isAlready ? "existing" : "new",
        });
        setTimeout(() => setShow(false), 2500);
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion.");
    }
  }

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 9998,
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 32px)",
          maxWidth: "440px",
          background: "white",
          borderRadius: "20px",
          padding: "28px 24px",
          zIndex: 9999,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.4s ease",
        }}
      >
        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#6b7280",
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            {status === "success" ? <CheckCircle size={22} color="white" /> : <Mail size={22} color="white" />}
          </div>

          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "6px", color: "#1a1a1a" }}>
            {status === "success" ? "Merci !" : "Ne ratez plus aucun bon plan"}
          </h3>

          <p style={{ fontSize: "0.88rem", color: "#4b5563", marginBottom: "16px", lineHeight: 1.4 }}>
            {status === "success"
              ? message
              : "Recevez les meilleurs concours, tests gratuits et bons plans chaque semaine."}
          </p>

          {status !== "success" && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  style={{
                    flex: "1 1 180px",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #e5e7eb",
                    fontSize: "0.92rem",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    padding: "11px 20px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #ef4444, #f97316)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    cursor: status === "loading" ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    opacity: status === "loading" ? 0.7 : 1,
                  }}
                >
                  {status === "loading" ? "..." : <>Je m'inscris <Flame size={14} /></>}
                </button>
              </div>

              {status === "error" && (
                <p style={{ color: "#ef4444", fontSize: "0.82rem", marginTop: "8px" }}>{message}</p>
              )}

              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "10px" }}>
                <Lock size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                Gratuit, sans spam. Desinscription en un clic.
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(40px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
