import { FEATURED_PERMANENT_CODES } from "@/lib/permanent-codes-featured";
import { InfinityIcon, ArrowRight } from "lucide-react";

export default function PermanentCodesTeaser() {
  const codes = FEATURED_PERMANENT_CODES;
  if (codes.length === 0) return null;

  return (
    <section className="section-sm" style={{ paddingTop: "40px", paddingBottom: "8px" }}>
      <div className="container">
        <div
          className="section-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
              <InfinityIcon size={22} color="#7C3AED" aria-hidden />
              Codes promo valables toute l&apos;année
            </h2>
            <p style={{ marginTop: "6px" }}>
              Parrainages, programmes fidélité, cashback : les réductions qui ne bougent pas.
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
            gap: "14px",
            marginTop: "18px",
          }}
        >
          {codes.map((code) => (
            <a
              key={code.slug}
              href={`/go/permanent-${code.slug}`}
              target="_blank"
              rel="nofollow noopener sponsored"
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "18px",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              className="permanent-code-card"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: code.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                  }}
                  aria-hidden
                >
                  {code.brand.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.15 }}>{code.brand}</div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {code.category}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.5, color: "#1f2937", margin: 0 }}>{code.offer}</p>
              <div
                style={{
                  marginTop: "12px",
                  color: code.color,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                J&apos;en profite <ArrowRight size={14} aria-hidden />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
