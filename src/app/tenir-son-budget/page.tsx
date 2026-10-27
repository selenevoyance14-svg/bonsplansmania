import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/app/components/Header";
import BudgetCalculator from "./BudgetCalculator";
import PrintButton from "./PrintButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Budget familial : calculateur gratuit et tableau mensuel",
  description: "Calculez le solde de votre budget familial, imprimez un tableau mensuel et organisez vos dépenses avec une méthode simple sur quatre semaines, sans compte.",
  alternates: { canonical: "https://bonsplansmania.fr/tenir-son-budget" },
  openGraph: { title: "Budget familial : calculateur et tableau gratuits", description: "Revenus, dépenses et solde mensuel : faites le point, puis préparez votre plan sur quatre semaines.", url: "https://bonsplansmania.fr/tenir-son-budget", type: "website", locale: "fr_FR", images: [{ url: "https://bonsplansmania.fr/images/articles/comment-gerer-budget-familial-guide-complet-outils-2026.jpg", alt: "Carnet et calculatrice pour organiser un budget familial" }] },
  twitter: { card: "summary_large_image", title: "Budget familial : calculateur gratuit", description: "Un tableau mensuel et une méthode accessible pour suivre vos dépenses.", images: ["https://bonsplansmania.fr/images/articles/comment-gerer-budget-familial-guide-complet-outils-2026.jpg"] },
};

const guides = [
  ["Réduire le budget courses", "30 actions à tester sans dégrader les repas", "/article/guide-economiser-200-euros-mois-courses-astuces-2026"],
  ["Préparer des menus petit budget", "Des repas simples avant de faire la liste", "/article/manger-pour-pas-cher-2026-menus-semaine-petit-budget"],
  ["Cuisiner en avance", "La méthode batch cooking pour débuter", "/article/guide-batch-cooking-debutante-economies-temps-recettes-2026"],
  ["Vérifier les aides", "Les démarches officielles à faire selon sa situation", "/article/aides-pouvoir-achat-2026-cheques-primes-bons-plans-etat"],
  ["Réduire les factures", "Les gestes et contrats à contrôler en priorité", "/article/baisser-facture-electricite-2026-astuces-economies"],
  ["Construire son budget familial", "Tableaux, enveloppes et exemple chiffré", "/article/comment-gerer-budget-familial-guide-complet-outils-2026"],
] as const;

export default function BudgetHubPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": "https://bonsplansmania.fr/tenir-son-budget#page", url: "https://bonsplansmania.fr/tenir-son-budget", name: "Budget familial : calculateur gratuit et tableau mensuel", description: metadata.description, inLanguage: "fr-FR", breadcrumb: { "@id": "https://bonsplansmania.fr/tenir-son-budget#breadcrumb" } },
      { "@type": "BreadcrumbList", "@id": "https://bonsplansmania.fr/tenir-son-budget#breadcrumb", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://bonsplansmania.fr/" },
        { "@type": "ListItem", position: 2, name: "Tenir son budget", item: "https://bonsplansmania.fr/tenir-son-budget" },
      ] },
    ],
  };
  return <><Header activePage="/tenir-son-budget" /><main className={styles.main}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className={styles.hero}><div className="container"><p className={styles.eyebrow}>Outil gratuit · aucun compte nécessaire</p><h1>Tenir son budget familial : calculateur gratuit et méthode simple</h1><p>Notez vos revenus et vos dépenses mensuelles pour estimer le solde disponible. Vous trouverez ici un calculateur sans inscription, une fiche à imprimer et un plan sur quatre semaines, à adapter à votre situation.</p><a href="#calculateur" className={styles.primary}>Faire mon point budget maintenant</a></div></section>

    <section className={`container ${styles.section}`} id="calculateur"><p className={styles.step}>Étape 1 · 10 minutes</p><h2>Calculez le solde de votre budget mensuel</h2><p className={styles.lead}>Prenez votre dernier relevé bancaire. Saisissez les montants mensuels, même approximatifs : le but est d’obtenir une première photographie, pas d’être parfait au centime près.</p><BudgetCalculator /><p className={styles.lead}>Le solde correspond aux revenus moins toutes les dépenses saisies. Il diffère du reste à vivre calculé après les seules charges fixes. Pensez aux factures annuelles divisées par douze et aux paiements encore à venir ; ne comptez pas deux fois le même crédit dans logement et dettes.</p></section>

    <section className={styles.soft}><div className={`container ${styles.section}`}><p className={styles.step}>Étape 2 · décider sans tout supprimer</p><h2>Choisissez votre situation</h2><div className={styles.threeCols}>
      <article><h3>Il reste de l’argent</h3><p>Vérifiez que les dépenses essentielles et les factures à venir sont bien incluses. Le solde peut ensuite être réparti entre réserve, projet ou dépenses facultatives. Ne retranchez pas une seconde fois les courses et transports déjà saisis.</p></article>
      <article><h3>Le budget est juste</h3><p>Ne cherchez pas trente économies. Contrôlez un abonnement, une assurance et une semaine de courses. Mesurez le gain réel avant de changer autre chose.</p></article>
      <article><h3>Le compte est dans le rouge</h3><p>Priorisez logement, énergie, alimentation et transport indispensable. Contactez rapidement les créanciers avant l’impayé et demandez un accompagnement gratuit.</p></article>
    </div></div></section>

    <section className={`container ${styles.section}`}><p className={styles.step}>Étape 3 · un mois pour installer l’habitude</p><h2>Votre plan simple sur 4 semaines</h2><ol className={styles.timeline}>
      <li><b>Semaine 1</b><span>Notez les revenus, prélèvements et dépenses annuelles. Supprimez seulement les abonnements réellement inutilisés.</span></li>
      <li><b>Semaine 2</b><span>Fixez un plafond hebdomadaire pour les courses et le quotidien. Prévoyez aussi les jours au-delà de quatre semaines : un mois ne se limite pas à 28 jours.</span></li>
      <li><b>Semaine 3</b><span>Préparez quatre repas avant les courses, comparez au prix au kilo et prévoyez un repas « restes ».</span></li>
      <li><b>Semaine 4</b><span>Comparez prévu et réel sans culpabiliser. Ajustez une catégorie et programmez votre prochain point budget.</span></li>
    </ol></section>

    <section className={styles.printSection}><div className="container"><div className={styles.printHead}><div><p className={styles.step}>Fiche mensuelle</p><h2>Le tableau à garder sous la main</h2></div><PrintButton /></div><div className={styles.sheet}>
      <div><span>Revenus du mois</span><i>________ €</i></div><div><span>Charges fixes</span><i>________ €</i></div><div><span>Courses</span><i>________ €</i></div><div><span>Transport</span><i>________ €</i></div><div><span>Autres dépenses</span><i>________ €</i></div><div><span>Provision pour dépenses annuelles</span><i>________ €</i></div><div><span>Épargne / imprévus</span><i>________ €</i></div><div className={styles.total}><span>Reste en fin de mois</span><i>________ €</i></div>
    </div><div className={styles.weekGrid}>{[1,2,3,4].map(n => <div key={n}><b>Semaine {n}</b><span>Plafond : ______ €</span><span>Dépensé : ______ €</span></div>)}</div></div></section>

    <section className={`container ${styles.section}`}><p className={styles.step}>Selon votre priorité</p><h2>Les guides qui peuvent vous aider ensuite</h2><div className={styles.guides}>{guides.map(([title, desc, href]) => <Link href={href} key={href}><strong>{title}</strong><span>{desc}</span><b>Ouvrir le guide →</b></Link>)}</div></section>

    <section className={`container ${styles.section}`}><div className={styles.explainer}><div><h2>Une méthode qui s’adapte à votre foyer</h2><p>Un carnet, un tableur ou la fiche ci-dessus suffisent pour commencer. Il n’est pas nécessaire d’acheter un classeur ou de connecter votre banque.</p><p>La règle 50-30-20 est un repère, pas une obligation : logement, santé et alimentation peuvent occuper une part plus importante. Épargner ne doit pas créer un découvert.</p><Link href="/article/comment-gerer-budget-familial-guide-complet-outils-2026">Lire le guide complet du budget familial →</Link></div><Image src="/images/articles/comment-gerer-budget-familial-guide-complet-outils-2026.jpg" alt="Carnet, enveloppes et calculatrice pour préparer un budget mensuel" width={720} height={480} className={styles.illustration} /></div></section>

    <section className={`container ${styles.section}`}><h2>Questions fréquentes sur le budget familial</h2><div className={styles.faq}>
      <details><summary>Les montants saisis sont-ils conservés ?</summary><p>Ce calculateur traite les montants dans votre navigateur, sans les enregistrer ni les envoyer. Ils disparaissent lorsque la page est rechargée.</p></details>
      <details><summary>Comment intégrer une assurance annuelle ?</summary><p>Divisez son montant annuel par douze pour prévoir une réserve mensuelle. Ne la comptez pas à nouveau parmi les dépenses courantes si cette réserve est déjà intégrée au calcul.</p></details>
      <details><summary>Le repère hebdomadaire est-il mon budget courses ?</summary><p>Non. Les courses sont déjà déduites si vous avez rempli ce champ. Le repère répartit seulement le solde restant sur une semaine moyenne, avant les réserves que vous souhaitez conserver.</p></details>
      <details><summary>Comment faire avec des revenus variables ?</summary><p>Partez des sommes réellement disponibles et d’une estimation prudente. Ne transformez pas une prime exceptionnelle en revenu mensuel certain. Ajustez à chaque rentrée d’argent.</p></details>
      <details><summary>Que faire si le résultat est négatif ?</summary><p>Revérifiez les montants et les doubles comptes, puis protégez les dépenses essentielles. Un Point conseil budget peut vous accompagner gratuitement et confidentiellement.</p></details>
    </div><p>Ressources : <a href="https://www.mesquestionsdargent.fr/budget">Mes questions d’argent : organiser son budget</a> · <a href="https://www.inc-conso.fr/content/banque/la-methode-des-enveloppes-avec-la-banque-de-france">La méthode des enveloppes avec la Banque de France</a>.</p></section>

    <section className={`container ${styles.help}`}><h2 id="aide-budget">Si vous n’arrivez plus à payer l’essentiel</h2><p>Un budget ne règle pas à lui seul une baisse de revenus ou des dettes. Les <strong>Points conseil budget</strong> proposent un accompagnement confidentiel et gratuit. Le simulateur officiel Mes droits sociaux permet aussi de vérifier plusieurs aides nationales et locales.</p><div><a href="https://www.banque-france.fr/fr/a-votre-service/particuliers/faire-face-difficultes-financieres-ou-dettes" rel="noopener noreferrer">Trouver de l’aide via la Banque de France</a><a href="https://www.mesdroitssociaux.gouv.fr/simulateurs" rel="noopener noreferrer">Simuler mes aides sur le site officiel</a></div><small>Ces liens mènent vers des services publics. Bons Plans Mania ne reçoit aucune commission.</small></section>
  </main></>;
}
