import Header from "@/app/components/Header";
import { getAllArticles } from "@/lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partenariats — Bons Plans Mania",
  description:
    "Marques et agences : découvrez les formats de collaboration proposés par Bons Plans Mania, du contenu éditorial à la mise en avant sur l'accueil.",
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
            Vous représentez une marque, une agence ou une plateforme
            d&apos;affiliation ? Je propose des collaborations adaptées à votre
            campagne, à votre offre et aux centres d&apos;intérêt des lecteurs de
            Bons Plans Mania.
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
                { value: `${totalArticles}+`, label: "articles publiés" },
                { value: "Depuis 2020", label: "un site consacré aux économies" },
                { value: "Depuis 2024", label: "une activité à plein temps" },
                { value: "Accès gratuit", label: "pour tous les lecteurs" },
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

          {/* Thématiques */}
          <section style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Les principales thématiques
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {[
                "Beauté et cosmétiques",
                "Soins visage et corps",
                "K-beauty",
                "Bio et naturel",
                "Box beauté",
                "Mode et accessoires",
                "Maison et bien-être",
                "Épicerie et alimentation",
                "Courses et budget familial",
                "Jeux concours et tests gratuits",
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
                  title: "Partenaire à la une",
                  desc: "Un emplacement temporaire et visible sur la page d'accueil, avec votre visuel, une présentation validée et un bouton intégrant votre lien de suivi officiel.",
                },
                {
                  title: "Article dédié",
                  desc: "Un contenu éditorial consacré à votre marque, à un service ou à une offre vérifiée, publié dans la catégorie adaptée. Aucun positionnement dans les moteurs de recherche ou les assistants IA ne peut être garanti.",
                },
                {
                  title: "Code promo exclusif",
                  desc: "Un code réservé aux lecteurs de Bons Plans Mania, accompagné de ses dates, conditions et exclusions, avec un lien de suivi fourni par la marque ou son réseau.",
                },
                {
                  title: "Affiliation",
                  desc: "Intégration pertinente dans des bons plans, guides ou comparatifs, avec un suivi des clics et des conversions selon les données disponibles dans votre programme.",
                },
                {
                  title: "Test produit",
                  desc: "Lorsqu'un produit est réellement reçu et testé, publication d'un retour d'expérience identifié comme tel, avec des photos et un avis éditorial indépendant.",
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
              Quelques marques citées sur le site
            </h2>
            <p style={{ color: "#6B7280", lineHeight: 1.6, marginBottom: "16px" }}>
              La présence d&apos;une marque dans un article ne signifie pas nécessairement
              qu&apos;une collaboration commerciale existe avec elle.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                "L'Oréal",
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
                "Showroomprivé",
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

          <section style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Une collaboration clairement identifiée
            </h2>
            <p style={{ color: "#4B5563", lineHeight: 1.7, marginBottom: "12px" }}>
              Les contenus rémunérés sont signalés comme collaborations commerciales.
              Les liens affiliés utilisent les paramètres de suivi officiels et les
              informations commerciales sont publiées uniquement après vérification.
            </p>
            <p style={{ color: "#4B5563", lineHeight: 1.7, margin: 0 }}>
              Je conserve ma liberté éditoriale : aucun faux témoignage, faux test,
              prix inventé ou promesse de résultat SEO ne sera publié.
            </p>
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
              Contactez-moi pour discuter d&apos;un partenariat adapté à vos objectifs.
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
