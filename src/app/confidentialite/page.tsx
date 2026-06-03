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
              BonsPlansMania.fr collecte ton adresse email uniquement si tu t&apos;inscris
              volontairement à la newsletter via les formulaires du site. Aucune autre
              donnée personnelle n&apos;est collectée directement.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Utilisation de ton email</h2>
            <p>
              Ton email est utilisé exclusivement pour t&apos;envoyer la sélection des
              meilleurs bons plans, concours et tests gratuits. Aucun envoi commercial
              tiers, aucune revente ou partage de l&apos;adresse.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Hébergement &amp; durée</h2>
            <p>
              Les emails sont stockés de manière sécurisée sur Cloudflare (Europe).
              Ils sont conservés tant que tu restes inscrit·e à la newsletter.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Désinscription</h2>
            <p>
              Tu peux te désinscrire à tout moment via le lien présent en bas de chaque
              newsletter. La suppression est immédiate et définitive.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Tes droits RGPD</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD),
              tu disposes d&apos;un droit d&apos;accès, de rectification, de suppression
              et d&apos;opposition. Pour les exercer, contacte-nous à{" "}
              <a href="mailto:bonsplansmania@gmail.com" style={{ color: "var(--primary)" }}>bonsplansmania@gmail.com</a>.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Services tiers &amp; cookies</h2>
            <p>
              Le site utilise Google Analytics (statistiques anonymisées) et Google AdSense
              (publicités personnalisées). Ces services peuvent déposer des cookies analytiques
              et publicitaires. Tu peux les désactiver dans les paramètres de ton navigateur
              ou refuser leur dépôt via le bandeau cookies.
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
