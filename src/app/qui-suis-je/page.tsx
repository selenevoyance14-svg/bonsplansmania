import Header from "@/app/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qui suis-je — Nathalie, fondatrice de BonsPlansMania",
  description:
    "Je suis Nathalie, fondatrice de Bons Plans Mania en 2020. Depuis 2024, je travaille à plein temps pour vérifier bons plans, concours et tests gratuits.",
  alternates: { canonical: "https://bonsplansmania.fr/qui-suis-je" },
  openGraph: {
    title: "Qui suis-je — Nathalie, fondatrice de BonsPlansMania",
    description:
      "Découvrez Nathalie, fondatrice de Bons Plans Mania en 2020 et à plein temps sur le site depuis 2024.",
    url: "https://bonsplansmania.fr/qui-suis-je",
    type: "profile",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nathalie",
  jobTitle: "Fondatrice & rédactrice",
  url: "https://bonsplansmania.fr/qui-suis-je",
  worksFor: {
    "@type": "Organization",
    name: "BonsPlansMania",
    url: "https://bonsplansmania.fr",
  },
  description:
    "Fondatrice de Bons Plans Mania en 2020, Nathalie travaille à temps plein sur le site depuis 2024.",
  knowsAbout: [
    "Jeux concours",
    "Instants gagnants",
    "Bons plans",
    "Codes promo",
    "Tests gratuits",
    "Box beauté",
  ],
};

export default function QuiSuisJe() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Header />
      <main style={{ padding: "64px 0", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>
            Qui suis-je ?
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--muted-foreground)", marginBottom: "40px" }}>
            Je suis Nathalie, fondatrice de Bons Plans Mania en 2020 et à plein temps sur le site depuis 2024.
          </p>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "14px" }}>
              👋 Salut, moi c&apos;est Nathalie
            </h2>
            <p style={{ lineHeight: 1.75, fontSize: "1rem" }}>
              Je suis la créatrice et la rédactrice de <strong>Bons Plans Mania</strong>.
              J&apos;ai lancé le site en <strong>2020</strong> pour partager plus facilement
              les bons plans, les jeux concours et les possibilités de tester gratuitement
              des produits que je trouvais au quotidien.
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "14px" }}>
              🌱 De 2020 à aujourd&apos;hui
            </h2>
            <p style={{ lineHeight: 1.75, fontSize: "1rem", marginBottom: "12px" }}>
              Au départ, Bons Plans Mania était un projet que je développais en parallèle
              de mes autres activités. Le site a grandi progressivement avec de nouvelles
              catégories, davantage d&apos;articles et une communauté de lecteurs à la
              recherche d&apos;économies et d&apos;opportunités fiables.
            </p>
            <p style={{ lineHeight: 1.75, fontSize: "1rem" }}>
              Depuis <strong>2024</strong>, j&apos;y travaille à <strong>plein temps</strong>.
              Je peux ainsi consacrer mes journées à rechercher de nouvelles offres, vérifier
              les informations publiées, actualiser les anciens contenus et améliorer le site.
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "14px" }}>
              🔎 Mon travail au quotidien
            </h2>
            <p style={{ lineHeight: 1.75, fontSize: "1rem", marginBottom: "16px" }}>
              Bons Plans Mania ne se limite pas à recopier des promotions. Je consulte les
              pages officielles, les règlements et les conditions des offres afin de présenter
              les informations les plus utiles possible :
            </p>
            <ul style={{ paddingLeft: "22px", lineHeight: 1.9, fontSize: "1rem", marginBottom: "16px" }}>
              <li>les dates et les conditions des jeux concours ;</li>
              <li>les prix, les codes et les limites des promotions ;</li>
              <li>les modalités de candidature aux tests de produits gratuits ;</li>
              <li>des comparatifs et des guides pour aider à faire un choix.</li>
            </ul>
            <p style={{ lineHeight: 1.75, fontSize: "1rem" }}>
              Les concours restent une partie importante du site, mais mon objectif est plus
              large : aider chaque lecteur à <strong>gagner du temps</strong>, à éviter les
              offres périmées et à repérer les opportunités réellement adaptées à ses besoins.
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "14px" }}>
              🤝 Ma promesse sur BonsPlansMania
            </h2>
            <ul style={{ paddingLeft: 0, listStyle: "none", lineHeight: 1.9, fontSize: "1rem" }}>
              <li>🔍 <strong>Vérifier</strong> les informations auprès des sources disponibles</li>
              <li>📅 <strong>Actualiser</strong> les offres et signaler clairement celles qui sont terminées</li>
              <li>🎯 <strong>Expliquer</strong> les conditions sans masquer les exclusions importantes</li>
              <li>🆓 <strong>Maintenir un accès gratuit</strong> aux articles et aux sélections</li>
              <li>🤝 <strong>Identifier clairement</strong> les liens affiliés et les collaborations commerciales</li>
            </ul>
          </section>

          <section
            style={{
              background: "var(--primary)",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
              color: "white",
              marginTop: "48px",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "10px" }}>
              Merci d&apos;être là 💛
            </h2>
            <p style={{ fontSize: "1rem", opacity: 0.95, marginBottom: "20px" }}>
              Tu peux me contacter à tout moment pour me poser une question, signaler une
              offre ou simplement me dire bonjour.
            </p>
            <a
              href="mailto:bonsplansmania@gmail.com?subject=Bonjour%20Nathalie"
              style={{
                display: "inline-block",
                background: "white",
                color: "var(--primary)",
                padding: "12px 26px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              bonsplansmania@gmail.com
            </a>
            <p style={{ fontSize: "0.85rem", opacity: 0.85, marginTop: "20px", fontStyle: "italic" }}>
              — Nathalie
            </p>
          </section>
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania</p>
          </div>
        </div>
      </footer>
    </>
  );
}
