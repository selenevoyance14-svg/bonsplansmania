import type { Metadata } from "next";
import { ChevronRight, Tag } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import OfferGrid from "@/app/components/OfferGrid";
import { CODE_PROMO_BRANDS } from "@/lib/code-promo-data";
import { getActiveOffers } from "@/lib/code-promo-offers";

export const metadata: Metadata = {
  title: "Codes promo du moment vérifiés | BonsPlansMania",
  description: "Tous les codes promo, offres, ventes privées et cashback des grandes marques beauté, mode et lifestyle. Mis à jour chaque jour.",
  alternates: { canonical: "https://bonsplansmania.fr/code-promo" },
};

export default function CodePromoIndexPage() {
  const activeOffers = getActiveOffers();

  return (
    <>
      <Header activePage="/code-promo" />
      <main>
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(135deg, #F4F0E8 0%, #F7EBED 100%)",
            padding: "48px 0 34px",
            color: "#1F1B19",
            borderBottom: "1px solid #D9D2C8",
          }}
        >
          <div className="container">
            <nav className="breadcrumbs" style={{ color: "#635C56" }}>
              <a href="/" style={{ color: "#635C56" }}>Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Codes promo du moment</span>
            </nav>
            <h1 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)", fontWeight: 900, marginBottom: "10px", letterSpacing: "-0.02em" }}>
              Codes promo du moment
            </h1>
            <p style={{ color: "#635C56", fontSize: "1.05rem", maxWidth: "780px", lineHeight: 1.6 }}>
              <strong>{activeOffers.length} offres actives</strong> triées et vérifiées : soldes, codes promo, cashback, livraison offerte, ventes privées.
              Mis à jour chaque jour par notre équipe.
            </p>
          </div>
        </section>

        {/* Mur d'offres */}
        <section className="section" style={{ paddingTop: "32px" }}>
          <div className="container">
            <OfferGrid offers={activeOffers} />
          </div>
        </section>

        <section className="container" style={{ padding: "0" }}>
          <AdBlock />
        </section>

        {/* Grid marques : découvrir toutes les marques */}
        <section id="marques" className="section-sm" style={{ background: "#F4F0E8", borderTop: "1px solid #D9D2C8", marginTop: "20px", scrollMarginTop: "90px" }}>
          <div className="container">
            <div style={{ marginBottom: "22px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#EFE8D8", color: "#735A24", padding: "6px 12px", borderRadius: "2px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                <Tag size={12} aria-hidden /> Trouver une marque
              </div>
              <h2 style={{ margin: 0, fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)", fontWeight: 800, letterSpacing: "-0.01em" }}>
                Trouver un code promo par marque
              </h2>
              <p style={{ margin: "6px 0 0", color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
                Choisis parmi {CODE_PROMO_BRANDS.length} marques pour voir ses codes, ses offres et leurs conditions.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
              {CODE_PROMO_BRANDS.map((brand) => (
                <a
                  key={brand.slug}
                  href={`/code-promo/${brand.slug}`}
                  style={{
                    textDecoration: "none",
                    background: "#FBFAF6",
                    border: "1px solid #D9D2C8",
                    borderRadius: "2px",
                    padding: "14px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "border-color 0.15s, transform 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      background: brand.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    {brand.name.charAt(0)}
                  </span>
                  <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: "0.92rem" }}>{brand.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
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
