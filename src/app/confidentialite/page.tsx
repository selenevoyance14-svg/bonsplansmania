import Header from "@/app/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Bons Plans Mania",
  robots: { index: false },
};

export default function Confidentialite() {
  return (
    <>
      <Header />
      <main style={{ padding: "64px 0", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "32px" }}>Politique de confidentialité</h1>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Données collectées</h2>
            <p>
              BonsPlansMania.fr ne collecte aucune donnée personnelle directement.
              Le site utilise Google Analytics (données anonymisées) et Google AdSense
              (publicités personnalisées). Ces services peuvent déposer des cookies.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Cookies</h2>
            <p>
              Des cookies analytiques et publicitaires peuvent être déposés par Google.
              Vous pouvez les désactiver dans les paramètres de votre navigateur.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Contact</h2>
            <p>
              Pour toute question : <a href="mailto:bonsplansmania@gmail.com" style={{ color: "var(--primary)" }}>bonsplansmania@gmail.com</a>
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
