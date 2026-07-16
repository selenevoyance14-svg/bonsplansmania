import { FEATURED_PERMANENT_CODES } from "@/lib/permanent-codes-featured";
import { InfinityIcon, ArrowRight } from "lucide-react";

// Assombrit une couleur hex de ~15 % pour créer un dégradé propre.
function shade(hex: string, amount = -22) {
  const clean = hex.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(clean.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(clean.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(clean.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Extrait un montant/pourcentage saillant du texte "offer" pour en faire un badge visible.
function extractHighlight(offer: string): string | null {
  const m = offer.match(/(-\s?\d{1,2}\s?%|\d{1,3}\s?€|jusqu['’]à\s?[-\s]?\d{1,3}\s?%|-?\d{1,3}\s?€)/i);
  return m ? m[0].replace(/\s+/g, " ").trim() : null;
}

export default function PermanentCodesTeaser() {
  const codes = FEATURED_PERMANENT_CODES;
  if (codes.length === 0) return null;

  return (
    <section
      className="section-sm permanent-codes-section"
      style={{
        paddingTop: "56px",
        paddingBottom: "12px",
        background: "linear-gradient(180deg, #FAFAFF 0%, #FFFFFF 100%)",
      }}
    >
      <div className="container">
        <div
          className="section-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "22px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#7C3AED",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "12px",
                boxShadow: "0 4px 12px -2px rgba(124,58,237,0.35)",
              }}
            >
              <InfinityIcon size={12} aria-hidden /> Valables toute l&apos;année
            </div>
            <h2 style={{ margin: 0, fontSize: "clamp(1.6rem, 3.5vw, 2rem)", fontWeight: 800 }}>
              Codes promo & cashback permanents
            </h2>
            <p style={{ marginTop: "6px", color: "#4b5563" }}>
              Parrainages, programmes fidélité, cashback — les réductions qui ne bougent pas.
            </p>
          </div>
          <a href="/codes-promo-permanents" className="btn btn-secondary btn-sm">
            Tous les codes <ArrowRight size={14} aria-hidden style={{ verticalAlign: "middle", marginLeft: "4px" }} />
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {codes.map((code) => {
            const dark = shade(code.color, -30);
            const highlight = extractHighlight(code.offer);
            return (
              <a
                key={code.slug}
                href={`/go/permanent-${code.slug}`}
                target="_blank"
                rel="nofollow noopener sponsored"
                className="permanent-code-card"
                aria-label={`${code.brand} — ${code.offer}`}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  background: `linear-gradient(155deg, ${code.color} 0%, ${dark} 100%)`,
                  borderRadius: "18px",
                  padding: "22px 20px 20px",
                  textDecoration: "none",
                  color: "#fff",
                  minHeight: "195px",
                  boxShadow: `0 4px 18px -6px ${code.color}80, 0 2px 6px -2px rgba(0,0,0,0.12)`,
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}
              >
                {/* Cercle décoratif en arrière-plan */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-40px",
                    width: "140px",
                    height: "140px",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    bottom: "-30px",
                    left: "-30px",
                    width: "110px",
                    height: "110px",
                    background: "rgba(0,0,0,0.06)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                />

                {/* En-tête */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "18px" }}>
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.95)",
                      color: dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "1.35rem",
                      letterSpacing: "-0.02em",
                      boxShadow: "0 4px 10px -2px rgba(0,0,0,0.15)",
                    }}
                    aria-hidden
                  >
                    {code.brand.charAt(0)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.66rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      background: "rgba(255,255,255,0.18)",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      color: "#fff",
                    }}
                  >
                    {code.category}
                  </div>
                </div>

                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: "1.2rem", lineHeight: 1.15, marginBottom: "6px", letterSpacing: "-0.01em" }}>
                    {code.brand}
                  </div>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.45, color: "rgba(255,255,255,0.93)", margin: 0 }}>
                    {code.offer}
                  </p>
                </div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    J&apos;en profite <ArrowRight size={14} aria-hidden />
                  </span>
                  {highlight && (
                    <span
                      style={{
                        background: "#fff",
                        color: dark,
                        fontWeight: 900,
                        fontSize: "0.78rem",
                        padding: "3px 9px",
                        borderRadius: "8px",
                        letterSpacing: "0.02em",
                        boxShadow: "0 2px 6px -1px rgba(0,0,0,0.15)",
                      }}
                    >
                      {highlight}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        .permanent-code-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 26px -6px rgba(0,0,0,0.22), 0 4px 10px -2px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </section>
  );
}
