import Header from "@/app/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Bons Plans Mania",
  description: "Politique de confidentialité du site BonsPlansMania.fr",
  robots: { index: false },
};

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Header />
      <main style={{ padding: "64px 0", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "32px" }}>Politique de confidentialité</h1>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Responsable du traitement</h2>
            <p>Site : BonsPlansMania.fr<br />
            SIRET : 10133158500014<br />
            Contact : <a href="mailto:bonsplansmania@gmail.com" style={{ color: "var(--primary)" }}>bonsplansmania@gmail.com</a></p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Données collectées</h2>
            <p>
              Nous collectons uniquement les données nécessaires au bon fonctionnement du site :
            </p>
            <ul style={{ paddingLeft: "20px", marginTop: "8px", lineHeight: 1.8 }}>
              <li>Adresse e-mail (si inscription à la newsletter ou à une alerte personnalisée)</li>
              <li>Mot-clé, type et fréquence choisis pour chaque alerte</li>
              <li>Pseudo, commentaire ou bon plan proposé et e-mail facultatif, pour permettre la modération</li>
              <li>Données de navigation anonymisées (via Google Analytics)</li>
              <li>Cookies publicitaires (via Google AdSense)</li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Finalité du traitement</h2>
            <ul style={{ paddingLeft: "20px", lineHeight: 1.8 }}>
              <li>Envoi de la newsletter (si vous vous êtes inscrite)</li>
              <li>Envoi des alertes personnalisées confirmées par e-mail</li>
              <li>Vérification et publication éventuelle des contributions de la communauté</li>
              <li>Analyse du trafic pour améliorer le contenu</li>
              <li>Affichage de publicités personnalisées</li>
            </ul>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Cookies et technologies publicitaires</h2>
            <p>
              Ce site utilise des cookies pour améliorer votre expérience et afficher des publicités pertinentes.
              Notre partenaire publicitaire Google AdSense peut utiliser des cookies pour diffuser
              des annonces basées sur vos visites précédentes sur ce site et sur d&apos;autres sites.
            </p>
            <p style={{ marginTop: "12px" }}>
              Vous pouvez gérer vos préférences de cookies à tout moment via le bandeau de consentement
              affiché lors de votre première visite, ou en effaçant les cookies de votre navigateur.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression
              et d&apos;opposition concernant vos données personnelles. Pour exercer ces droits, contactez-nous
              à <a href="mailto:bonsplansmania@gmail.com" style={{ color: "var(--primary)" }}>bonsplansmania@gmail.com</a>.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Newsletter</h2>
            <p>
              Si vous vous inscrivez à notre newsletter, votre adresse e-mail est stockée de manière sécurisée.
              Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque e-mail.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Alertes personnalisées</h2>
            <p>
              Les alertes produit, marque ou catégorie sont indépendantes de la newsletter et ne sont activées qu&apos;après confirmation par e-mail.
              Les données sont stockées dans Cloudflare KV et les messages sont envoyés par Resend. Chaque alerte peut être supprimée à tout moment
              grâce au lien de désinscription inclus dans les e-mails.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Hébergement</h2>
            <p>Cloudflare, Inc.<br />101 Townsend St, San Francisco, CA 94107, USA</p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Mise à jour</h2>
            <p>Cette politique peut être mise à jour à tout moment. Dernière mise à jour : août 2026.</p>
          </section>
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} BonsPlansMania</p>
          </div>
        </div>
      </footer>
    </>
  );
}
