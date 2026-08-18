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
            <p>Le site BonsPlansMania.fr est édité par :<br />
            Nathalie Lebrun — Entrepreneur individuel (EI)<br />
            524 rue de la Tourrache<br />
            83600 Fréjus — France<br />
            SIREN : 101 331 585<br />
            SIRET : 101 331 585 00014<br />
            Contact : <a href="mailto:bonsplansmania@gmail.com" style={{ color: "var(--primary)" }}>bonsplansmania@gmail.com</a></p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Direction de la publication</h2>
            <p>Directrice de la publication : Nathalie Lebrun.</p>
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
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Nature des informations publiées</h2>
            <p>
              Bons Plans Mania est un site d&apos;information et de sélection d&apos;offres. Il n&apos;est ni le vendeur des produits
              présentés, ni l&apos;organisateur des concours et tests de produits relayés. Les achats, inscriptions et participations
              sont réalisés directement sur les sites des marchands, marques ou organisateurs concernés, selon leurs propres
              conditions.
            </p>
            <p style={{ marginTop: "12px" }}>
              Malgré le soin apporté aux vérifications, les prix, stocks, codes promotionnels, dates et conditions peuvent évoluer
              à tout moment. Le visiteur doit vérifier les informations affichées sur le site partenaire avant tout achat ou toute
              participation.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Propriété intellectuelle</h2>
            <p>
              Les textes, la structure, la sélection éditoriale et les éléments graphiques créés spécifiquement pour
              BonsPlansMania.fr sont protégés par le droit de la propriété intellectuelle. Toute reproduction non autorisée est
              interdite.
            </p>
            <p style={{ marginTop: "12px" }}>
              Les marques, logos, photographies de produits et visuels appartenant à des tiers restent la propriété de leurs
              titulaires respectifs. Ils sont utilisés à des fins d&apos;information, d&apos;illustration ou dans le cadre des programmes
              partenaires concernés.
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
