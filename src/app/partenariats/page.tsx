import Header from "@/app/components/Header";
import { getAllArticles } from "@/lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partenariats — Bons Plans Mania",
  description:
    "Vous etes une marque ou une agence ? Decouvrez comment collaborer avec BonsPlansMania.fr : articles dedies, codes promo exclusifs, affiliation.",
};

export default function Partenariats() {
  const totalArticles = getAllArticles().length;

  return (
    <>
      <Header />
      <main style={{ padding: "64px 0", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            Partenariats et collaborations
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#6B7280",
              marginBottom: "48px",
              lineHeight: 1.6,
            }}
          >
            Vous representez une marque, une agence ou une plateforme
            d'affiliation ? Decouvrez comment travailler avec Bons Plans Mania.
          </p>

          {/* Stats */}
          <section style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              Le site en quelques chiffres
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
              }}
            >
              {[
                { value: `${totalArticles}+`, label: "articles publies" },
                { value: "SEO", label: "1ere page Google sur plusieurs requetes" },
                { value: "Quotidien", label: "nouveau contenu chaque jour" },
                { value: "6+", label: "categories couvertes" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#F9FAFB",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginTop: "4px" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Thematiques */}
          <section style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Nos thematiques
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {[
                "Beaute et cosmetiques",
                "Soins visage et corps",
                "K-beauty",
                "Bio et naturel",
                "Box beaute",
                "Mode et accessoires",
                "Maison et bien-etre",
                "Epicerie et alimentation",
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    background: "#F3F4F6",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    color: "#374151",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Formats */}
          <section style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              Formats de collaboration
            </h2>
            <div style={{ display: "grid", gap: "20px" }}>
              {[
                {
                  title: "Article dedie",
                  desc: "Un article complet et optimise SEO autour de votre marque, vos produits ou votre offre en cours. Redige avec un ton authentique et publie dans la categorie adaptee.",
                },
                {
                  title: "Code promo exclusif",
                  desc: "Un code promo reserve a notre audience, mis en avant dans un article dedie et reference sur Google. Ideal pour generer du trafic qualifie et mesurer les conversions.",
                },
                {
                  title: "Affiliation",
                  desc: "Integration de vos produits dans nos selections, comparatifs et bons plans avec un suivi des performances via votre programme d'affiliation.",
                },
                {
                  title: "Test produit",
                  desc: "Presentation detaillee d'un produit avec un avis honnete, des photos et un lien direct vers votre site. Un format qui genere de la confiance aupres des lecteurs.",
                },
              ].map((format) => (
                <div
                  key={format.title}
                  style={{
                    background: "#F9FAFB",
                    borderRadius: "12px",
                    padding: "24px",
                    borderLeft: "4px solid var(--primary)",
                  }}
                >
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "8px" }}>
                    {format.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
                    {format.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Marques */}
          <section style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Ils nous font deja confiance
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                "L'Oreal",
                "Weleda",
                "Nuxe",
                "Garnier",
                "CeraVe",
                "NYX",
                "Maybelline",
                "Bioderma",
                "La Roche-Posay",
                "Glowria",
                "Blissim",
                "Biotyfull",
                "Greenweez",
                "YesStyle",
                "Showroomprivee",
              ].map((m) => (
                <span
                  key={m}
                  style={{
                    background: "white",
                    border: "1px solid #E5E7EB",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    color: "#374151",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section
            style={{
              background: "var(--primary)",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center",
              color: "white",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "12px" }}>
              Travaillons ensemble
            </h2>
            <p style={{ fontSize: "1rem", marginBottom: "24px", opacity: 0.9 }}>
              Contactez-nous pour discuter d'un partenariat adapte a vos objectifs.
            </p>
            <a
              href="mailto:bonsplansmania@gmail.com?subject=Partenariat%20BonsPlansMania"
              style={{
                display: "inline-block",
                background: "white",
                color: "var(--primary)",
                padding: "14px 32px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
              }}
            >
              bonsplansmania@gmail.com
            </a>
          </section>
        </div>
      </main>
    </>
  );
}
