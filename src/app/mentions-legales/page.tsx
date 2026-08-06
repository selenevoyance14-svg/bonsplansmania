import Header from "@/app/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Bons Plans Mania",
  description: "Mentions légales du site BonsPlansMania.fr",
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main style={{ padding: "64px 0", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "32px" }}>Mentions légales</h1>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Éditeur du site</h2>
            <p>Site : BonsPlansMania.fr<br />
            SIRET : 10133158500014<br />
            Contact : <a href="mailto:bonsplansmania@gmail.com" style={{ color: "var(--primary)" }}>bonsplansmania@gmail.com</a></p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Hébergement</h2>
            <p>Cloudflare, Inc.<br />101 Townsend St, San Francisco, CA 94107, USA</p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Liens affiliés</h2>
            <p>
              Certains liens présents sur ce site sont des liens affiliés. En cliquant dessus et en effectuant un achat,
              nous pouvons percevoir une commission, sans aucun surcoût pour vous. Cela nous permet de maintenir
              le site gratuitement et de continuer à dénicher les meilleures offres.
            </p>
            <p style={{ marginTop: "12px" }}>
              En tant que Partenaire Amazon, Bons Plans Mania réalise un bénéfice sur les achats remplissant les conditions requises.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, visuels) est la propriété de BonsPlansMania.fr.
              Toute reproduction sans autorisation est interdite.
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
