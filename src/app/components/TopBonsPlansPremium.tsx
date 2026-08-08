import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { getTopPremiumDeals } from "@/lib/articles";
import { formatCardTitle } from "@/lib/display-title";

/**
 * Bloc "Top bons plans" affiché en haut des articles freebies (concours, test-gratuit)
 * pour rediriger le trafic SEO non-rémunérateur vers les bons plans à forte commission
 * (Awin, Igraal, Rakuten...).
 *
 * Le visiteur arrive sur un concours qui ne paie pas, il voit immédiatement nos vrais
 * bons plans rémunérateurs avant de cliquer "Participer" et quitter le site.
 */
export default function TopBonsPlansPremium({ currentSlug }: { currentSlug: string }) {
  const articles = getTopPremiumDeals(currentSlug, 6);

  if (articles.length === 0) return null;

  return (
    <section
      className="monetization-bridge"
      data-monetization-bridge="contextual-premium-deals"
      aria-labelledby="monetization-bridge-title"
      style={{
        margin: "20px 0 28px",
        padding: "18px 18px 20px",
        background: "linear-gradient(135deg, #FFF7ED 0%, #ECFEFF 100%)",
        borderRadius: "14px",
        border: "1px solid #FED7AA",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
          justifyContent: "center",
        }}
      >
        <Flame size={20} style={{ color: "#EA580C" }} />
        <h2
          id="monetization-bridge-title"
          style={{
            fontSize: "1.15rem",
            fontWeight: 800,
            margin: 0,
            color: "var(--foreground)",
            textAlign: "center",
          }}
        >
          Des bons plans liés à votre recherche
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}
      >
        {articles.map((a) => (
          <a
            key={a.meta.slug}
            href={`/article/${a.meta.slug}`}
            data-commercial-destination={a.meta.slug}
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              border: "1px solid #FED7AA",
              borderRadius: "10px",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                background: "#fff",
                overflow: "hidden",
              }}
            >
              <Image
                src={a.meta.image}
                alt={a.meta.imageAlt}
                fill
                style={{ objectFit: "contain", padding: "4px" }}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div
              style={{
                padding: "10px 12px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                flex: 1,
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  margin: 0,
                  color: "#1f2937",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {formatCardTitle(a.meta.title)}
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "6px",
                  marginTop: "auto",
                }}
              >
                {a.meta.price ? (
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      color: "#DC2626",
                    }}
                  >
                    {a.meta.price.length > 22 ? a.meta.price.slice(0, 20) + "…" : a.meta.price}
                  </span>
                ) : (
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Bon plan</span>
                )}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    background: "#EA580C",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    padding: "4px 9px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Voir <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
