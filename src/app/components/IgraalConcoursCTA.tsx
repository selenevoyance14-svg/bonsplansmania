import { ExternalLink, Coins } from "lucide-react";

const IGRAAL_PARRAINAGE_URL = "https://fr.igraal.com/parrainage?parrain=AG_66d33e65091a1&utm_medium=raf&utm_source=refer_premium";

// CTA auto-injecté en bas des articles concours.
// Profil concouriste = profil cashback parfait → on cross-sell iGraal en parrainage.
export default function IgraalConcoursCTA() {
  return (
    <div
      style={{
        margin: "32px 0",
        padding: "28px 24px",
        background: "linear-gradient(135deg, #FEF3E0 0%, #FEEBC2 100%)",
        border: "2px solid #F59E0B",
        borderRadius: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <Coins size={24} color="#D97706" />
        <strong style={{ fontSize: "1.1rem", color: "#92400E" }}>
          En attendant les résultats du concours…
        </strong>
      </div>
      <p style={{ marginBottom: "16px", color: "#78350F", lineHeight: 1.6 }}>
        Tu participes déjà à des concours, autant gagner aussi sur tes achats du quotidien.
        Avec <strong>iGraal</strong>, tu récupères du cashback sur 1 500+ sites
        (Sephora, SHEIN, Amazon, Cdiscount, Fnac…) à chaque commande. C'est 100% gratuit
        et un bonus de parrainage est offert à l'inscription.
      </p>
      <a
        href={IGRAAL_PARRAINAGE_URL}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="btn btn-primary"
        style={{
          background: "#D97706",
          padding: "12px 24px",
          fontSize: "0.95rem",
        }}
      >
        Activer mon cashback iGraal <ExternalLink size={14} />
      </a>
    </div>
  );
}
