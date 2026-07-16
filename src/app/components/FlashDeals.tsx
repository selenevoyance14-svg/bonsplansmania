import { ExternalLink } from "lucide-react";
import { getFlashDealsForSlug, decodeTitle } from "@/lib/flash-deals";

const PARTNER_TAG = "lebrunnathali-21";

function formatPrice(p: number) {
  return `${p.toFixed(2).replace(".", ",")} €`;
}

export default function FlashDeals({ slug }: { slug: string }) {
  const products = getFlashDealsForSlug(slug, 4);

  if (products.length === 0) return null;

  return (
    <section
      style={{
        margin: "32px 0",
        padding: "20px 18px 22px",
        background: "linear-gradient(135deg, #FFF5F5 0%, #FFFAF5 100%)",
        borderRadius: "14px",
        border: "1px solid #A5F3FC",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.15rem",
          fontWeight: 800,
          margin: "0 0 16px",
          color: "var(--foreground)",
        }}
      >
        💸 Bons plans flash à shopper
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "10px",
        }}
      >
        {products.map((p) => (
          <a
            key={p.asin}
            href={p.affiliate_url || `https://www.amazon.fr/dp/${p.asin}?tag=${PARTNER_TAG}`}
            target="_blank"
            rel="nofollow sponsored noopener"
            style={{
              display: "flex",
              alignItems: "stretch",
              background: "#fff",
              border: "1px solid #F3D5D5",
              borderRadius: "10px",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "80px",
                minWidth: "80px",
                height: "80px",
                background: "#fff",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={decodeTitle(p.title)}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                loading="lazy"
              />
            </div>
            <div style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
              <h3
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {decodeTitle(p.title)}
              </h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px", marginTop: "4px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#DC2626" }}>{formatPrice(p.price)}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    background: "#DC2626",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    padding: "4px 9px",
                    borderRadius: "6px",
                  }}
                >
                  Voir <ExternalLink size={10} />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
