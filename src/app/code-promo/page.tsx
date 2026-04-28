import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Header from "@/app/components/Header";
import { CODE_PROMO_BRANDS } from "@/lib/code-promo-data";
import AdBlock from "@/app/components/AdBlock";

export const metadata: Metadata = {
  title: "Codes promo et bons plans : toutes les marques — BonsPlansMania",
  description: "Tous les codes promo, bons plans et réductions des grandes marques beauté, mode et lifestyle : Sephora, Yves Rocher, Lookfantastic, YesStyle, Blissim et plus.",
  alternates: { canonical: "https://bonsplansmania.fr/code-promo" },
};

export default function CodePromoIndexPage() {
  return (
    <>
      <Header />
      <main>
        <section style={{ background: "linear-gradient(135deg, #FFF0F0 0%, #FFF8F0 100%)", padding: "40px 0 28px", borderBottom: "2px solid #FECDD3" }}>
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Codes promo</span>
            </nav>
            <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.3rem)", fontWeight: 800, marginBottom: "10px" }}>
              Codes promo et bons plans toutes marques
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem", maxWidth: "780px" }}>
              Sélection de codes promo actualisés, ventes privées et bons plans des grandes marques beauté, mode et lifestyle. Mis à jour régulièrement.
            </p>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        <section className="section">
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {CODE_PROMO_BRANDS.map((brand) => (
                <a key={brand.slug} href={`/code-promo/${brand.slug}`} style={{ textDecoration: "none", background: "white", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", transition: "transform 0.15s, box-shadow 0.15s", display: "block" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: brand.color, marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "1.3rem" }}>
                    {brand.name.charAt(0)}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "6px", color: "var(--foreground)" }}>
                    Code promo {brand.name}
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "12px", lineHeight: 1.5 }}>
                    {brand.tagline}
                  </div>
                  <span style={{ color: brand.color, fontWeight: 700, fontSize: "0.85rem" }}>
                    Voir les offres →
                  </span>
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
