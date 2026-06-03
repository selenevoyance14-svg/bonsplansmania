import Header from "@/app/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qui suis-je — Nathalie, fondatrice de BonsPlansMania",
  description:
    "Concouriste depuis 15 ans, à plein temps sur BonsPlansMania depuis 2 ans : je déniche chaque jour bons plans, concours et tests gratuits pour les familles.",
  alternates: { canonical: "https://bonsplansmania.fr/qui-suis-je" },
  openGraph: {
    title: "Qui suis-je — Nathalie, fondatrice de BonsPlansMania",
    description:
      "Concouriste depuis 15 ans, je partage chaque jour les meilleurs bons plans, concours et tests gratuits sur BonsPlansMania.fr.",
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
    "Concouriste depuis plus de 15 ans, fondatrice de BonsPlansMania.fr depuis 2021, à temps plein depuis 2024.",
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
            La personne derrière BonsPlansMania, à plein temps depuis 2 ans.
          </p>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "14px" }}>
              👋 Salut, moi c&apos;est Nathalie
            </h2>
            <p style={{ lineHeight: 1.75, fontSize: "1rem" }}>
              Je suis <strong>concouriste depuis plus de 15 ans</strong>. Ça veut dire que je
              participe à des jeux concours et déniche des bons plans presque tous les jours
              depuis 2009. J&apos;ai gagné <strong>de très nombreux lots</strong> au fil des
              années — instant gagnants, tirages au sort, mécaniques créatives — bref,
              <strong> tout ce qui se gagne gratuitement, je l&apos;ai testé</strong>.
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "14px" }}>
              🌱 Pourquoi BonsPlansMania
            </h2>
            <p style={{ lineHeight: 1.75, fontSize: "1rem", marginBottom: "12px" }}>
              Pendant <strong>des années</strong>, j&apos;ai voulu créer un site pour
              <strong> partager mes découvertes </strong>avec d&apos;autres familles, mais
              entre le boulot et la vie perso, je ne trouvais jamais le temps de m&apos;y
              mettre vraiment.
            </p>
            <p style={{ lineHeight: 1.75, fontSize: "1rem" }}>
              <strong>En 2024, j&apos;ai sauté le pas.</strong> Depuis <strong>2 ans</strong>
              {" "}je m&apos;occupe à <strong>temps plein</strong> de bonsplansmania.fr : mes
              journées passent à dénicher des offres, vérifier les codes promo, tester les
              missions de produits gratuits et repérer les concours qui valent vraiment le coup.
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "14px" }}>
              🎁 Ma vraie passion : les concours
            </h2>
            <p style={{ lineHeight: 1.75, fontSize: "1rem", marginBottom: "16px" }}>
              Ce que je préfère par-dessus tout, ce sont les <strong>jeux concours</strong>,
              et particulièrement les <strong>instants gagnants</strong> — ces mécaniques où
              tu sais tout de suite si tu as gagné. C&apos;est rapide, c&apos;est gratuit, et
              contrairement à ce que beaucoup de gens pensent :
            </p>
            <blockquote
              style={{
                borderLeft: "4px solid var(--primary)",
                background: "var(--muted, #FFF8F0)",
                padding: "14px 20px",
                borderRadius: "8px",
                fontSize: "1.05rem",
                fontWeight: 600,
                margin: "16px 0",
              }}
            >
              Les jeux concours ne sont pas une arnaque.
            </blockquote>
            <p style={{ lineHeight: 1.75, fontSize: "1rem" }}>
              J&apos;ai reçu <strong>de vrais cadeaux, de vrais colis</strong> au fil des
              années. Si je consacre autant de temps à les recenser sur le site, c&apos;est
              parce que <strong>je sais qu&apos;ils fonctionnent</strong>.
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "14px" }}>
              🤝 Ma promesse sur BonsPlansMania
            </h2>
            <ul style={{ paddingLeft: 0, listStyle: "none", lineHeight: 1.9, fontSize: "1rem" }}>
              <li>🔍 <strong>Aucun fake</strong> : chaque concours est vérifié, chaque promo testée avant publication</li>
              <li>🎯 <strong>Du tri</strong> : je te montre seulement ce qui vaut la peine, pas tout et n&apos;importe quoi</li>
              <li>📅 <strong>Tous les jours</strong> : nouvelles offres, nouveaux concours, nouvelles missions de test</li>
              <li>🆓 <strong>100 % gratuit</strong> : pas d&apos;abonnement, pas de paywall, accès libre</li>
              <li>💬 <strong>Honnête</strong> : si je n&apos;y crois pas, je n&apos;en parle pas</li>
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
