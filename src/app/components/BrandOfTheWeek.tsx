import { BRAND_OF_THE_WEEK } from "@/lib/highlight-brand";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BrandOfTheWeek() {
  const brand = BRAND_OF_THE_WEEK;

  const bg = brand.bg ?? "#FDF2F8";
  const color = brand.color ?? "#DB2777";

  return (
    <section
      className="section-sm brand-hero-section"
      style={{
        paddingTop: "56px",
        paddingBottom: "8px",
      }}
    >
      <div className="container">
        {/* Bandeau hero de la marque : gros visuel + texte + CTA */}
        <div
          className="brand-hero"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "24px",
            background: `linear-gradient(135deg, ${bg} 0%, #FFFFFF 65%, ${bg} 100%)`,
            border: `1px solid ${color}22`,
            padding: "44px 40px",
            boxShadow: `0 6px 24px -12px ${color}55, 0 2px 8px -4px rgba(0,0,0,0.08)`,
          }}
        >
          {/* Emoji géant en watermark */}
          {brand.emoji && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                right: "-30px",
                bottom: "-40px",
                fontSize: "260px",
                opacity: 0.09,
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {brand.emoji}
            </div>
          )}

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: "24px",
              alignItems: "center",
            }}
            className="brand-hero-grid"
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: color,
                  color: "#fff",
                  padding: "5px 13px",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                  boxShadow: `0 4px 12px -2px ${color}66`,
                }}
              >
                <Sparkles size={12} aria-hidden /> Marque du moment
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  fontWeight: 900,
                  color: color,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                {brand.emoji && <span aria-hidden style={{ marginRight: "12px" }}>{brand.emoji}</span>}
                {brand.name}
              </h2>
              <p
                style={{
                  marginTop: "14px",
                  fontSize: "1.05rem",
                  lineHeight: 1.55,
                  color: "#4b5563",
                  maxWidth: "620px",
                }}
              >
                {brand.tagline}
              </p>
            </div>

            <a
              href={brand.hubUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="brand-hero-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: color,
                color: "#fff",
                padding: "14px 22px",
                borderRadius: "12px",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
                boxShadow: `0 8px 18px -6px ${color}88`,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              {brand.ctaLabel ?? `Découvrir ${brand.name}`} <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        </div>

      </div>

      <style>{`
        .brand-hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px -6px ${color}aa;
        }
        @media (max-width: 720px) {
          .brand-hero {
            padding: 28px 22px !important;
          }
          .brand-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .brand-hero-cta {
            justify-self: start;
          }
        }
      `}</style>
    </section>
  );
}
