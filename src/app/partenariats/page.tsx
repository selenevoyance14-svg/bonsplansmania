import Header from "@/app/components/Header";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Partenariats marques | Bons Plans Mania",
  description:
    "Bons Plans Mania accompagne les marques avec des contenus utiles, des mises en avant, des codes promo et des campagnes d’affiliation.",
  alternates: { canonical: "https://bonsplansmania.fr/partenariats" },
};

const topics = [
  "Beauté",
  "Mode",
  "Maison",
  "High-tech",
  "Budget familial",
  "Famille",
];

const benefits = [
  {
    title: "Articles et tests produits",
    text: "Articles, sélections éditoriales et tests produits clairement identifiés.",
  },
  {
    title: "Carrousel premium",
    text: "Une mise en avant visible sur la page d’accueil pour présenter votre campagne.",
  },
  {
    title: "Codes promo et affiliation",
    text: "Des campagnes commerciales avec appels à l’action et liens de suivi officiels.",
  },
];

type PartnershipFormat = {
  label: string;
  title: string;
  text: string;
};

const formats: PartnershipFormat[] = [
  {
    label: "Visibilité",
    title: "Partenaire à la une",
    text: "Une mise en avant premium sur la page d’accueil avec votre visuel, une présentation dédiée et un bouton vers votre offre ou votre lien de suivi officiel.",
  },
  {
    label: "Contenu sur mesure",
    title: "Article dédié",
    text: "Un contenu éditorial optimisé pour le SEO et intégré au maillage interne du site.",
  },
  {
    label: "Performance",
    title: "Code promo, affiliation ou test produit",
    text: "Des formats axés sur l’expérience réelle, la clarté de l’offre et la performance.",
  },
];

const steps = [
  {
    number: "01",
    title: "Présentation de la campagne",
    text: "Vous partagez vos objectifs, l’offre, les dates, les visuels et le lien de suivi.",
  },
  {
    number: "02",
    title: "Choix du format",
    text: "Nous retenons ensemble le dispositif le plus adapté à votre campagne.",
  },
  {
    number: "03",
    title: "Validation et publication",
    text: "Les informations sont contrôlées, puis le contenu est publié après validation.",
  },
];

const contactHref =
  "mailto:bonsplansmania@gmail.com?subject=Partenariat%20Bons%20Plans%20Mania";

export default function Partenariats() {
  return (
    <>
      <Header activePage="/partenariats" />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Marques · agences · affiliation</p>
            <h1>Propulsez votre marque auprès d’une audience qualifiée et engagée</h1>
            <p className={styles.lead}>
              Bons Plans Mania accompagne les marques avec des contenus utiles pour
              guider les lecteurs vers vos offres.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href={contactHref}>
                Proposer un partenariat
              </a>
              <a className={styles.secondaryButton} href="#formats">
                Découvrir les formats
              </a>
            </div>
          </div>
          <aside className={styles.heroCard} aria-label="Collaborations proposées">
            <p className={styles.heroCardLabel}>Collaborations possibles</p>
            <ul>
              <li>Articles, sélections éditoriales et tests produits</li>
              <li>Mise en avant en page d’accueil</li>
              <li>Codes promo et campagnes d’affiliation</li>
            </ul>
          </aside>
        </section>

        <div className={styles.container}>
          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>Collaborations et avantages</p>
              <h2>Des dispositifs pensés pour rendre votre offre visible</h2>
            </div>
            <div className={styles.benefitGrid}>
              {benefits.map((benefit) => (
                <article className={styles.benefitCard} key={benefit.title}>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.topicSection}>
            <div>
              <p className={styles.kicker}>Thématiques principales</p>
              <h2>Des univers proches du quotidien des lecteurs</h2>
            </div>
            <div className={styles.chips}>
              {topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </section>

          <section className={styles.section} id="formats">
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>Formats et mise en place</p>
              <h2>Un format adapté à votre objectif</h2>
            </div>
            <div className={styles.formatGrid}>
              {formats.map((format) => (
                <article className={styles.formatCard} key={format.title}>
                  <div>
                    <p className={styles.formatLabel}>{format.label}</p>
                    <h3>{format.title}</h3>
                    <p>{format.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.processSection}>
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>Mise en place</p>
              <h2>Trois étapes simples</h2>
            </div>
            <div className={styles.steps}>
              {steps.map((step) => (
                <article className={styles.step} key={step.number}>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.commitmentSection}>
            <div>
              <p className={styles.kicker}>Transparence</p>
              <h2>Une ligne éditoriale indépendante</h2>
            </div>
            <div className={styles.commitmentText}>
              <p>
                Les contenus rémunérés sont clairement signalés et les liens de suivi
                officiels sont utilisés. Les informations commerciales sont vérifiées
                avant publication.
              </p>
              <p>
                Chaque collaboration doit rester utile aux lecteurs et cohérente avec
                l’univers de Bons Plans Mania.
              </p>
            </div>
          </section>

          <section className={styles.cta}>
            <p className={styles.ctaEyebrow}>Contact</p>
            <h2>Parlons de votre collaboration</h2>
            <p>
              Présentez vos objectifs et les détails de votre offre pour recevoir une
              réponse adaptée à votre campagne.
            </p>
            <a href={contactHref}>bonsplansmania@gmail.com</a>
          </section>
        </div>
      </main>
    </>
  );
}
