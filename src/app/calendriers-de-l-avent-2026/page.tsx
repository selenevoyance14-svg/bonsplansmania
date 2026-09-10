import type { Metadata } from "next";
import Header from "@/app/components/Header";
import { ADVENT_CALENDARS_2026 } from "@/lib/advent-calendars-2026";
import { getAdventCalendarCatalog } from "@/lib/advent-calendar-catalog";
import BrandCalendarFilter from "./BrandCalendarFilter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Calendriers de l'Avent 2026 : prix, contenu et comparatif",
  description: "Comparez les calendriers de l'Avent 2026 : prix vérifiés, valeur annoncée, contenu, date de sortie et liens pour les acheter.",
  alternates: { canonical: "https://bonsplansmania.fr/calendriers-de-l-avent-2026" },
  openGraph: {
    title: "Calendriers de l'Avent 2026 : le comparatif mis à jour",
    description: "Tous les calendriers de l'Avent 2026 vérifiés, avec leurs prix, contenus et dates de disponibilité.",
    url: "https://bonsplansmania.fr/calendriers-de-l-avent-2026",
    type: "website",
  },
};

export default function AdventCalendarsHub() {
  const updatedAt = "10 septembre 2026";
  const catalog = getAdventCalendarCatalog();
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Calendriers de l'Avent 2026",
    numberOfItems: catalog.length,
    itemListElement: catalog.map((calendar, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${calendar.brand} ${calendar.name}`,
      url: `https://bonsplansmania.fr${calendar.articleHref}`,
    })),
  };

  return (
    <>
      <Header activePage="/calendriers-de-l-avent-2026" />
      <main className={styles.main}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Comparateur et agrégateur de calendriers</p>
            <h1>Calendriers de l’Avent 2026 : prix, contenu et comparatif</h1>
            <p className={styles.intro}>Beauté, parfums et soins : nous ajoutons uniquement les calendriers dont le prix et la disponibilité ont été vérifiés. Aucun faux prix, aucun contenu supposé.</p>
            <div className={styles.stats}><span><strong>{catalog.length}</strong> calendriers référencés</span><span><strong>{new Set(catalog.map((item) => item.brand)).size}</strong> marques comparées</span><span><strong>Prix datés</strong> et disponibilités indiquées</span></div>
            <p className={styles.updated}>Dernière vérification : {updatedAt}</p>
          </div>
        </section>

        <section className={`container ${styles.section}`}>
          <h2>Comparatif rapide des calendriers de l’Avent 2026</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Calendrier</th><th>Prix constaté</th><th>Contenu</th><th>Disponibilité</th></tr></thead>
              <tbody>{ADVENT_CALENDARS_2026.map((calendar) => (
                <tr key={`${calendar.brand}-${calendar.name}`}>
                  <td>
                    <a
                      href={calendar.merchantHref}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                    >
                      <strong>{calendar.brand}</strong><br />{calendar.name}
                    </a>
                  </td>
                  <td><strong>{calendar.price}</strong>{calendar.value ? <small>{calendar.value}</small> : null}</td>
                  <td>{calendar.contents}</td><td>{calendar.status}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <section className={`container ${styles.section}`}>
          <h2>Tous les calendriers disponibles et annoncés</h2>
          <p className={styles.sectionIntro}>Recherchez un calendrier puis filtrez par marque, univers, destinataire ou disponibilité. Les calendriers de bières restent volontairement dans leur hub dédié et ne sont pas intégrés à ce comparatif.</p>
          <BrandCalendarFilter catalog={catalog} />
        </section>

        <section className={`container ${styles.guide}`}>
          <h2>Comment choisir son calendrier de l’Avent 2026 ?</h2>
          <p>Comparez le prix payé, la valeur annoncée par la marque, le nombre de grands formats et surtout le type de produits. Un calendrier moins cher mais adapté à vos habitudes peut être plus intéressant qu’un coffret premium rempli de produits que vous n’utiliserez pas.</p>
          <h2>Quand acheter son calendrier de l’Avent ?</h2>
          <p>Les premières sorties commencent en août et septembre. Les éditions limitées les plus recherchées peuvent partir avant décembre. Nous mettons cette page à jour à chaque annonce et retirons les offres terminées.</p>
        </section>
      </main>
    </>
  );
}
