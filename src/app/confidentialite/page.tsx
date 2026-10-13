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
              BonsPlansMania.fr peut traiter ton adresse email lorsque tu t&apos;inscris volontairement à la newsletter ou à une alerte personnalisée.
              Pour une alerte, le mot-clé, le type (produit, marque ou catégorie) et la fréquence choisis sont également enregistrés. Lors de la
              navigation, des données techniques et des identifiants en ligne peuvent également être traités, notamment l&apos;adresse
              IP, le type d&apos;appareil, le navigateur, les pages consultées et les interactions avec le site, selon tes choix en
              matière de cookies. Lorsque tu déposes un commentaire ou proposes un bon plan, le pseudo, le contenu transmis et,
              si tu le renseignes, ton email sont également enregistrés afin de permettre la modération.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Finalités et bases légales</h2>
            <p>
              Ton email est utilisé pour envoyer la newsletter ou les alertes demandées, sur la base de ton consentement. Les alertes sont
              activées uniquement après confirmation par email et restent indépendantes de la newsletter. Les données techniques strictement
              nécessaires servent au fonctionnement et à la sécurité du site. Les mesures d&apos;audience et les publicités sont
              utilisées selon les choix exprimés dans le gestionnaire de consentement. Bons Plans Mania ne vend pas les adresses
              email de ses abonnés.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Hébergement &amp; durée</h2>
            <p>
              Les données d&apos;abonnement sont conservées tant que tu restes inscrit·e à la newsletter ou à l&apos;alerte concernée, puis supprimées lors de la
              désinscription. Les alertes sont hébergées dans Cloudflare KV et les emails sont envoyés par Resend. Les durées applicables aux cookies sont indiquées
              dans le gestionnaire de consentement accessible sur le site. Les commentaires et propositions sont stockés dans Cloudflare KV ;
              les contributions refusées ou traitées sont supprimées de la file de modération.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Désinscription</h2>
            <p>
              Tu peux te désinscrire à tout moment via le lien présent en bas de chaque newsletter ou email d&apos;alerte.
              Chaque alerte peut ainsi être supprimée séparément.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Tes droits RGPD</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD),
              tu disposes notamment d&apos;un droit d&apos;accès, de rectification, de suppression,
              d&apos;opposition, de limitation et de retrait de ton consentement. Pour les exercer, contacte Nathalie Lebrun à{" "}
              <a href="mailto:bonsplansmania@gmail.com" style={{ color: "var(--primary)" }}>bonsplansmania@gmail.com</a>.
              Tu peux également adresser une réclamation à la CNIL sur <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>cnil.fr</a>.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Services tiers &amp; cookies</h2>
            <p>
              Le site utilise Google Analytics (statistiques anonymisées) et Google AdSense
              (publicités personnalisées). Ces services peuvent déposer des cookies analytiques
              et publicitaires uniquement selon les choix exprimés dans le gestionnaire de consentement. Certains liens affiliés
              peuvent également comporter des paramètres de suivi permettant d&apos;attribuer une vente ou une visite au site. Tu peux
              refuser les cookies non essentiels ou modifier tes choix via le gestionnaire de consentement.
            </p>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>Responsable du traitement</h2>
            <p>
              Nathalie Lebrun — Entrepreneur individuel<br />
              524 rue de la Tourrache<br />
              83600 Fréjus — France
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
