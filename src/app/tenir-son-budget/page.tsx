import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import BudgetCalculator from "./BudgetCalculator";
import PrintButton from "./PrintButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Tenir son budget : calculateur et méthode simple 2026",
  description: "Calculez votre reste à vivre, préparez votre budget mensuel et suivez un plan simple sur 4 semaines. Outils gratuits et conseils sans promesse irréaliste.",
  alternates: { canonical: "https://bonsplansmania.fr/tenir-son-budget" },
  openGraph: { title: "Tenir son budget : la méthode simple de Bons Plans Mania", description: "Un calculateur gratuit, une fiche à imprimer et un plan concret pour reprendre son budget en main.", url: "https://bonsplansmania.fr/tenir-son-budget", type: "website", locale: "fr_FR" },
};

const guides = [
  ["Réduire le budget courses", "30 actions à tester sans dégrader les repas", "/article/guide-economiser-200-euros-mois-courses-astuces-2026"],
  ["Préparer des menus petit budget", "Des repas simples avant de faire la liste", "/article/manger-pour-pas-cher-2026-menus-semaine-petit-budget"],
  ["Cuisiner en avance", "La méthode batch cooking pour débuter", "/article/guide-batch-cooking-debutante-economies-temps-recettes-2026"],
  ["Vérifier les aides", "Les démarches officielles à faire selon sa situation", "/article/aides-pouvoir-achat-2026-cheques-primes-bons-plans-etat"],
  ["Réduire les factures", "Les gestes et contrats à contrôler en priorité", "/article/baisser-facture-electricite-2026-astuces-economies"],
  ["Compléter ponctuellement ses revenus", "Revente, services et précautions", "/article/bon-plan-30-moyens-arrondir-fins-de-mois-2026"],
] as const;

export default function BudgetHubPage() {
  const schema = { "@context": "https://schema.org", "@type": "HowTo", name: "Comment tenir son budget mensuel", description: "Une méthode simple en quatre étapes pour calculer son reste à vivre et organiser ses dépenses.", step: ["Rassembler ses revenus et dépenses", "Calculer son reste à vivre", "Fixer un plafond hebdomadaire", "Faire un point de dix minutes chaque semaine"].map((name) => ({ "@type": "HowToStep", name })) };
  return <><Header activePage="/tenir-son-budget" /><main className={styles.main}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className={styles.hero}><div className="container"><p className={styles.eyebrow}>Outil gratuit · aucun compte nécessaire</p><h1>Tenir son budget, sans se sentir jugé</h1><p>Vous n’avez pas besoin d’un tableau compliqué. Commencez par savoir ce qu’il reste réellement après les dépenses, puis choisissez une seule action utile cette semaine.</p><a href="#calculateur" className={styles.primary}>Faire mon point budget maintenant</a></div></section>

    <section className={`container ${styles.section}`} id="calculateur"><p className={styles.step}>Étape 1 · 10 minutes</p><h2>Calculez ce qu’il vous reste vraiment</h2><p className={styles.lead}>Prenez votre dernier relevé bancaire. Saisissez les montants mensuels, même approximatifs : le but est d’obtenir une première photographie, pas d’être parfait au centime près.</p><BudgetCalculator /></section>

    <section className={styles.soft}><div className={`container ${styles.section}`}><p className={styles.step}>Étape 2 · décider sans tout supprimer</p><h2>Choisissez votre situation</h2><div className={styles.threeCols}>
      <article><h3>Il reste de l’argent</h3><p>Mettez d’abord une petite somme de côté pour l’imprévu. Répartissez le reste entre courses, transport et plaisir, puis donnez-vous un plafond par semaine.</p></article>
      <article><h3>Le budget est juste</h3><p>Ne cherchez pas trente économies. Contrôlez un abonnement, une assurance et une semaine de courses. Mesurez le gain réel avant de changer autre chose.</p></article>
      <article><h3>Le compte est dans le rouge</h3><p>Priorisez logement, énergie, alimentation et transport indispensable. Contactez rapidement les créanciers avant l’impayé et demandez un accompagnement gratuit.</p></article>
    </div></div></section>

    <section className={`container ${styles.section}`}><p className={styles.step}>Étape 3 · un mois pour installer l’habitude</p><h2>Votre plan simple sur 4 semaines</h2><ol className={styles.timeline}>
      <li><b>Semaine 1</b><span>Notez les revenus, prélèvements et dépenses annuelles. Supprimez seulement les abonnements réellement inutilisés.</span></li>
      <li><b>Semaine 2</b><span>Fixez un plafond hebdomadaire pour les courses et le quotidien. Vérifiez le solde une seule fois au milieu de la semaine.</span></li>
      <li><b>Semaine 3</b><span>Préparez quatre repas avant les courses, comparez au prix au kilo et prévoyez un repas « restes ».</span></li>
      <li><b>Semaine 4</b><span>Comparez prévu et réel sans culpabiliser. Ajustez une catégorie et programmez votre prochain point budget.</span></li>
    </ol></section>

    <section className={styles.printSection}><div className="container"><div className={styles.printHead}><div><p className={styles.step}>Fiche mensuelle</p><h2>Le tableau à garder sous la main</h2></div><PrintButton /></div><div className={styles.sheet}>
      <div><span>Revenus du mois</span><i>________ €</i></div><div><span>Charges fixes</span><i>________ €</i></div><div><span>Courses</span><i>________ €</i></div><div><span>Transport</span><i>________ €</i></div><div><span>Autres dépenses</span><i>________ €</i></div><div><span>Épargne / imprévus</span><i>________ €</i></div><div className={styles.total}><span>Reste en fin de mois</span><i>________ €</i></div>
    </div><div className={styles.weekGrid}>{[1,2,3,4].map(n => <div key={n}><b>Semaine {n}</b><span>Plafond : ______ €</span><span>Dépensé : ______ €</span></div>)}</div></div></section>

    <section className={`container ${styles.section}`}><p className={styles.step}>Selon votre priorité</p><h2>Les guides qui peuvent vous aider ensuite</h2><div className={styles.guides}>{guides.map(([title, desc, href]) => <Link href={href} key={href}><strong>{title}</strong><span>{desc}</span><b>Ouvrir le guide →</b></Link>)}</div></section>

    <section className={`container ${styles.help}`}><h2>Si vous n’arrivez plus à payer l’essentiel</h2><p>Un budget ne règle pas à lui seul une baisse de revenus ou des dettes. Les <strong>Points conseil budget</strong> proposent un accompagnement confidentiel et gratuit. Le simulateur officiel Mes droits sociaux permet aussi de vérifier plusieurs aides nationales et locales.</p><div><a href="https://www.banque-france.fr/fr/a-votre-service/particuliers/faire-face-difficultes-financieres-ou-dettes" rel="noopener noreferrer">Trouver de l’aide via la Banque de France</a><a href="https://www.mesdroitssociaux.gouv.fr/simulateurs" rel="noopener noreferrer">Simuler mes aides sur le site officiel</a></div><small>Ces liens mènent vers des services publics. Bons Plans Mania ne reçoit aucune commission.</small></section>
  </main></>;
}
