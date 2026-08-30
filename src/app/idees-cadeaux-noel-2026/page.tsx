import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import { getAllArticles } from "@/lib/articles";
import { AFFILIATE_PARTNERS } from "@/lib/affiliate-partners";
import styles from "./page.module.css";
import giftStyles from "./monsieur-tshirt.module.css";

export const metadata: Metadata = {
  title: "Idées cadeaux Noël 2026 : sélections par budget et destinataire",
  description: "Trouvez une idée cadeau de Noël 2026 pour femme, homme, enfant ou bébé : beauté, high-tech, maison et jouets classés par budget.",
  alternates: { canonical: "https://bonsplansmania.fr/idees-cadeaux-noel-2026" },
  openGraph: {
    title: "Idées cadeaux de Noël 2026 : le guide par budget",
    description: "Des cadeaux pour tous les budgets, classés par destinataire et univers, avec des offres mises à jour.",
    url: "https://bonsplansmania.fr/idees-cadeaux-noel-2026",
    type: "website",
  },
};

const universes = [
  { icon: "✨", title: "Pour elle", text: "Parfums, soins, bijoux, box beauté et accessoires.", href: "/bons-plans-beaute" },
  { icon: "⌚", title: "Pour lui", text: "T-shirts, sweats et cadeaux personnalisés fabriqués en France.", href: "https://monsieurtshirt.com/idee-cadeau-homme?ae=619" },
  { icon: "🧸", title: "Pour les enfants", text: "LEGO, poupées, loisirs créatifs et jeux éducatifs.", href: "/bons-plans-jouets" },
  { icon: "👶", title: "Pour bébé", text: "Coffrets naissance, éveil et cadeaux pour jeunes parents.", href: "/bons-plans-bebe" },
  { icon: "🎧", title: "High-tech", text: "Audio, objets connectés, gaming et accessoires utiles.", href: "/bons-plans-tech" },
  { icon: "🏠", title: "Maison & cuisine", text: "Cuisine, décoration et appareils pour le quotidien.", href: "/bons-plans-maison" },
];

const budgets = [
  { label: "Moins de 20 €", query: "cadeau moins de 20 euros" },
  { label: "De 20 à 50 €", query: "cadeau 20 50 euros" },
  { label: "De 50 à 100 €", query: "cadeau 50 100 euros" },
  { label: "Plus de 100 €", query: "cadeau premium" },
];

const monsieurTshirtIdeas = [
  { title: "T-shirt homme personnalisé", text: "Ajoutez votre texte ou votre visuel pour créer un cadeau vraiment personnel.", price: "33,06 € constatés", href: "https://monsieurtshirt.com/personnalisation/t-shirt-homme/6826-imprime-personnalise?ae=619" },
  { title: "Sacoche de pétanque personnalisée", text: "Une idée originale pour un papa, un grand-père ou un amateur de pétanque.", price: "28,40 € constatés", href: "https://monsieurtshirt.com/sacoche-boules-de-petanque/41416-la-triplette-de-papy-personnalise?ae=619" },
  { title: "Sweatshirt Cool Papa brodé", text: "Un sweatshirt personnalisable à offrir à un papa pour Noël.", price: "62,91 € constatés", href: "https://monsieurtshirt.com/sweatshirt-homme/42009-cool-papa-club-brode?ae=619" },
  { title: "Affiche de couple personnalisée", text: "Une affiche créée avec les prénoms ou les détails du couple.", price: "33,67 € constatés", href: "https://monsieurtshirt.com/affiche/15648-couple-en-scooter-personnalise?ae=619" },
];

const faqs = [
  ["Quand commencer ses achats de Noël 2026 ?", "Pour les jouets recherchés et les éditions limitées, commencez à surveiller les prix dès septembre ou octobre. Le Black Friday du 27 novembre 2026 peut être intéressant, mais les stocks ne sont pas garantis."],
  ["Quel budget prévoir pour un cadeau de Noël ?", "Fixez d'abord un budget par personne, puis comparez le prix réellement payé, les frais de livraison et les conditions de retour. Une idée utile et bien choisie compte davantage qu'un prix élevé."],
  ["Comment éviter les fausses promotions ?", "Comparez le prix final chez plusieurs marchands et ne vous fiez pas uniquement au pourcentage barré. Nous indiquons la date de mise à jour et renvoyons vers le marchand pour vérifier le tarif avant l'achat."],
];

export default function ChristmasGiftHub() {
  const giftCategories = new Set(["bon-plan", "box-beaute", "calendrier-avent"]);
  const giftKeywords = /cadeau|coffret|parfum|jouet|lego|barbie|poupée|peluche|doudou|livre|ninja|air.?fryer|airpods|casque|écouteurs|montre|bijou|bougie|diffuseur|jeu de société|console/i;
  const excludedKeywords = /concours|jeu concours|code promo|test gratuit|échantillon|candidature|à gagner/i;
  const offers = getAllArticles()
    .filter(({ meta }) => {
      const searchableText = `${meta.title} ${meta.tags.join(" ")}`;
      return giftCategories.has(meta.category)
        && giftKeywords.test(searchableText)
        && !excludedKeywords.test(searchableText);
    })
    .slice(0, 12);
  const giftPartners = AFFILIATE_PARTNERS.filter((partner) => ["Cadeaux & alimentation", "Beauté & bien-être", "Bébé, famille & loisirs", "Maison, courses & high-tech"].includes(partner.category));
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Idées cadeaux de Noël 2026",
    numberOfItems: offers.length,
    itemListElement: offers.map(({ meta }, index) => ({ "@type": "ListItem", position: index + 1, name: meta.title, url: `https://bonsplansmania.fr/article/${meta.slug}` })),
  };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };

  return <>
    <Header activePage="/idees-cadeaux-noel-2026" />
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className={styles.hero}><div className="container">
        <p className={styles.eyebrow}>Guide préparé dès août · enrichi jusqu’à Noël</p>
        <h1>Idées cadeaux de Noël 2026</h1>
        <p className={styles.intro}>Des idées pour chaque personne et chaque budget, avec des prix à vérifier chez le marchand et uniquement des offres que nous pouvons réellement suivre.</p>
        <div className={styles.heroLinks}><a href="#destinataires">Choisir un destinataire</a><a href="#offres">Voir les premières idées</a></div>
        <p className={styles.updated}>Dernière mise à jour : 30 août 2026 · nouvelles idées ajoutées au fil des offres</p>
      </div></section>

      <section id="destinataires" className={`container ${styles.section}`}>
        <p className={styles.kicker}>Trouver rapidement</p><h2>Une idée selon la personne</h2>
        <div className={styles.universeGrid}>{universes.map((item) => <Link href={item.href} className={styles.universe} key={item.title}><span>{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p><b>Découvrir →</b></Link>)}</div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={giftStyles.partnerIntro}>
          <div><p className={styles.kicker}>Cadeaux personnalisés</p><h2>Quelques idées chez Monsieur TSHIRT</h2><p>Des cadeaux personnalisés pour lui, pour un couple ou pour toute la famille, fabriqués à la demande dans l'atelier bordelais de la marque.</p></div>
          <a href="https://monsieurtshirt.com/?ae=619" target="_blank" rel="sponsored noopener">Voir tous les cadeaux →</a>
        </div>
        <div className={giftStyles.partnerIdeas}>
          {monsieurTshirtIdeas.map((idea) => <a key={idea.title} href={idea.href} target="_blank" rel="sponsored noopener"><span>Idée cadeau</span><h3>{idea.title}</h3><p>{idea.text}</p><strong>{idea.price}</strong><b>Personnaliser →</b></a>)}
        </div>
        <p className={giftStyles.priceNote}>Prix relevés le 30 août 2026, susceptibles d'évoluer. Vérifiez le tarif final avant de commander.</p>
      </section>

      <section className={styles.budgetSection}><div className="container"><p className={styles.kicker}>Sans dépasser son budget</p><h2>Idées cadeaux par prix</h2><div className={styles.budgets}>{budgets.map((budget) => <Link key={budget.label} href={`/recherche?q=${encodeURIComponent(budget.query)}`}>{budget.label}<span>Voir les idées →</span></Link>)}</div></div></section>

      <section id="offres" className={`container ${styles.section}`}>
        <p className={styles.kicker}>Bons plans cadeaux</p><h2>Nos idées cadeaux du moment</h2>
        <p className={styles.sectionIntro}>Cette sélection contient uniquement des produits et coffrets pouvant être offerts. Les concours, tests gratuits et simples codes promo en sont exclus.</p>
        <div className={styles.offerGrid}>{offers.map(({ meta }) => <article className={styles.card} key={meta.slug}><Link href={`/article/${meta.slug}`} className={styles.image}><Image src={meta.image} alt={meta.imageAlt} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 25vw" /></Link><div><p>Idée cadeau</p><h3><Link href={`/article/${meta.slug}`}>{meta.title}</Link></h3>{meta.price ? <strong>{meta.price}</strong> : <span>Tarif sur la fiche</span>}<Link className={styles.offerLink} href={`/article/${meta.slug}`}>Voir le bon plan</Link></div></article>)}</div>
      </section>

      <section className={styles.crossLinks}><div className="container"><div><p className={styles.kicker}>À préparer aussi</p><h2>Calendriers de l’Avent 2026</h2><p>Beauté, parfums et soins : comparez les prix, le contenu et les dates de sortie des calendriers déjà annoncés.</p><Link href="/calendriers-de-l-avent-2026">Voir le comparatif des calendriers →</Link></div><div><p className={styles.kicker}>Le grand rendez-vous</p><h2>Black Friday 2026</h2><p>Le vendredi 27 novembre 2026. Les meilleures offres seront reliées à ce guide dès leur annonce.</p><Link href="/bons-plans-en-cours">Voir les offres en cours →</Link></div></div></section>

      <section className={`container ${styles.section}`}><p className={styles.kicker}>Nos partenaires suivis</p><h2>Marques et marchands cadeaux</h2><p className={styles.sectionIntro}>Cette liste ne contient que des partenaires affiliés. Elle sera enrichie avec leurs offres de Noël vérifiées.</p><div className={styles.brands}>{giftPartners.map((partner) => <Link key={partner.slug} href={`/code-promo/${partner.slug}`}>{partner.name}</Link>)}</div></section>

      <section className={`container ${styles.faq}`}><p className={styles.kicker}>Conseils pratiques</p><h2>Questions fréquentes sur les cadeaux de Noël</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
    </main>
  </>;
}
