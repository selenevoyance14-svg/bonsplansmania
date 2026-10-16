import Header from "@/app/components/Header";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Partenariats marques et affiliation | Bons Plans Mania",
  description:
    "Marques, agences et plateformes d’affiliation : découvrez les collaborations éditoriales proposées par Bons Plans Mania pour valoriser une offre utile.",
  alternates: { canonical: "https://bonsplansmania.fr/partenariats" },
};

const topics = [
  "Beauté et cosmétiques",
  "K-beauty",
  "Bio et naturel",
  "Mode et accessoires",
  "Maison et bien-être",
  "High-tech",
  "Courses et budget familial",
  "Enfance et famille",
  "Jeux concours",
  "Tests produits",
];

const benefits = [
  {
    title: "Un contenu réellement utile",
    text: "Chaque publication répond à une intention claire : découvrir une offre, comparer des produits ou comprendre les conditions d’un bon plan.",
  },
  {
    title: "Une visibilité bien intégrée",
    text: "Votre campagne prend place dans l’univers éditorial le plus pertinent, avec des liens internes et des appels à l’action pensés pour faciliter le passage à l’offre.",
  },
  {
    title: "Des liens suivis et protégés",
    text: "Les liens commerciaux fournis par la marque ou son réseau sont intégrés via les redirections internes de Bons Plans Mania.",
  },
];

const formats = [
  {
    label: "Mise en avant",
    title: "Partenaire à la une",
    text: "Un emplacement temporaire et visible sur la page d’accueil, avec votre visuel, une présentation validée et un bouton intégrant votre lien de suivi officiel.",
  },
  {
    label: "Contenu durable",
    title: "Article dédié",
    text: "Un article sur mesure pour présenter votre marque, votre service ou votre offre. Le contenu est optimisé pour le référencement et enrichi d’un maillage interne adapté afin de développer sa visibilité dans la durée.",
  },
  {
    label: "Activation commerciale",
    title: "Code promo exclusif",
    text: "Un code réservé aux lecteurs de Bons Plans Mania, accompagné de ses dates, conditions et exclusions, avec un accès direct à l’offre.",
  },
  {
    label: "Performance",
    title: "Affiliation",
    text: "Une intégration pertinente dans des bons plans, sélections, guides ou comparatifs, avec les liens de suivi officiels de votre programme.",
  },
  {
    label: "Expérience réelle",
    title: "Test produit",
    text: "Lorsqu’un produit est réellement reçu et testé, publication d’un retour d’expérience clairement identifié, illustré par des photos et rédigé en toute indépendance.",
  },
];

const steps = [
  {
    number: "01",
    title: "Vous présentez votre campagne",
    text: "Objectif, offre, dates, public visé, visuels disponibles et lien de suivi.",
  },
  {
    number: "02",
    title: "Je propose le format adapté",
    text: "Le dispositif est choisi selon l’intérêt de l’offre et sa cohérence avec les lecteurs du site.",
  },
  {
    number: "03",
    title: "Le contenu est préparé et publié",
    text: "Les informations sont vérifiées, la collaboration est identifiée et les liens officiels sont intégrés.",
  },
];

export default function Partenariats() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Marques · agences · affiliation</p>
            <h1>Faisons connaître une offre qui mérite vraiment d’être vue</h1>
            <p className={styles.lead}>
              Bons Plans Mania accompagne les marques et leurs partenaires avec des
              contenus clairs, utiles et pensés pour guider les lecteurs jusqu’à
              l’offre.
            </p>
            <div className={styles.heroActions}>
              <a
                className={styles.primaryButton}
                href="mailto:bonsplansmania@gmail.com?subject=Partenariat%20Bons%20Plans%20Mania"
              >
                Proposer un partenariat
              </a>
              <a className={styles.secondaryButton} href="#formats">
                Découvrir les formats
              </a>
            </div>
          </div>
          <aside className={styles.heroCard} aria-label="Types de collaborations">
            <p className={styles.heroCardLabel}>Collaborations possibles</p>
            <ul>
              <li>Article et sélection éditoriale</li>
              <li>Mise en avant sur la page d’accueil</li>
              <li>Code promo et campagne d’affiliation</li>
              <li>Test produit clairement identifié</li>
            </ul>
          </aside>
        </section>

        <div className={styles.container}>
          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>Pourquoi collaborer ?</p>
              <h2>Une présence éditoriale pensée pour convertir sans perdre la confiance</h2>
              <p>
                L’objectif n’est pas de publier une publicité de plus, mais de donner
                au lecteur les bonnes informations pour comprendre l’offre et agir.
              </p>
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
              <p className={styles.kicker}>Univers éditoriaux</p>
              <h2>Des campagnes en affinité avec les lecteurs</h2>
            </div>
            <div className={styles.chips}>
              {topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </section>

          <section className={styles.section} id="formats">
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>Formats de collaboration</p>
              <h2>Un dispositif adapté à chaque objectif</h2>
              <p>
                Lancement, promotion ponctuelle, acquisition ou visibilité durable :
                le format est défini selon la campagne et la valeur apportée aux lecteurs.
              </p>
            </div>
            <div className={styles.formatGrid}>
              {formats.map((format) => (
                <article className={styles.formatCard} key={format.title}>
                  <p className={styles.formatLabel}>{format.label}</p>
                  <h3>{format.title}</h3>
                  <p>{format.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.processSection}>
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>Fonctionnement</p>
              <h2>Une collaboration simple, en trois étapes</h2>
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
              <p className={styles.kicker}>Confiance et transparence</p>
              <h2>Une collaboration clairement identifiée</h2>
            </div>
            <div className={styles.commitmentText}>
              <p>
                Les contenus rémunérés sont signalés comme collaborations commerciales.
                Les liens affiliés utilisent les paramètres de suivi officiels et les
                informations commerciales sont contrôlées avant publication.
              </p>
              <p>
                La ligne éditoriale reste indépendante : pas de faux témoignage, de faux
                test, de prix inventé ni d’information susceptible d’induire le lecteur en erreur.
              </p>
            </div>
          </section>

          <section className={styles.cta}>
            <p className={styles.ctaEyebrow}>Votre offre correspond à l’univers du site ?</p>
            <h2>Parlons de votre prochaine campagne</h2>
            <p>
              Présentez votre marque, vos objectifs, les dates de l’opération et le
              format envisagé. Je vous répondrai avec une proposition adaptée.
            </p>
            <a href="mailto:bonsplansmania@gmail.com?subject=Partenariat%20Bons%20Plans%20Mania">
              bonsplansmania@gmail.com
            </a>
          </section>
        </div>
      </main>
    </>
  );
}
