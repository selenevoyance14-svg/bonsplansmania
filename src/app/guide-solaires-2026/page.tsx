import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import { SOLAR_GUIDE_2026 } from "@/lib/solar-guide-2026";
import { getSolarCatalog } from "@/lib/solar-catalog";
import SolarFilters from "./SolarFilters";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Guide d’achat solaires 2026 : SPF par usage et peau",
  description: "Trouvez une protection solaire 2026 par marque, usage et type de peau. Prix datés, images réelles et liens marchands vérifiés.",
  alternates: { canonical: "https://bonsplansmania.fr/guide-solaires-2026" },
  openGraph: { title: "Guide d’achat solaires 2026", description: "Comparez les protections SPF 50 par usage, peau et budget.", url: "https://bonsplansmania.fr/guide-solaires-2026", type: "website" },
};

export default function SolarGuidePage() {
  const solarCatalog = getSolarCatalog();
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: "Guide d’achat solaires 2026", numberOfItems: SOLAR_GUIDE_2026.length, itemListElement: SOLAR_GUIDE_2026.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: `${item.brand} ${item.name}`, url: `https://bonsplansmania.fr${item.articleHref}` })) };
  return <><Header activePage="/guide-solaires-2026" /><main className={styles.main}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    <section className={styles.hero}><div className="container"><p className={styles.eyebrow}>Prix datés · sélection vérifiée</p><h1>Guide d’achat solaires 2026</h1><p className={styles.intro}>Visage, corps, enfant, peau sensible ou K-Beauty : filtrez la sélection pour trouver le solaire qui correspond à votre usage et à votre budget.</p><p className={styles.updated}>{SOLAR_GUIDE_2026.length} protections référencées · sélection revue le 26 novembre 2026</p></div></section>
    <section className={`container ${styles.section}`}><h2>Comparer rapidement les solaires</h2><p>Petits budgets : Corine de Farme 50 ml à 5,54 € et Nivea Kids 200 ml à 8,50 €. Les formats diffèrent : comparez aussi le volume et l’usage. Prix hors frais de livraison, relevés le 26 novembre 2026 ; aucun achat ni test en panier effectué.</p><div className={styles.tableWrap}><table><thead><tr><th>Produit</th><th>Protection</th><th>Usage</th><th>Prix constaté</th><th>Offre</th></tr></thead><tbody>{SOLAR_GUIDE_2026.map((item) => <tr key={`${item.brand}-${item.name}`}><td><Link href={item.articleHref}><strong>{item.brand}</strong><br />{item.name}</Link></td><td>{item.spf}<small>{item.format}</small></td><td>{item.usages.join(" · ")}</td><td><strong>{item.price}</strong>{item.referencePrice && <small>Référence : {item.referencePrice}<br />{item.savings}</small>}<small>Relevé le {item.checkedAt}</small><small>{item.conditions}</small></td><td><a className={styles.tableOffer} href={item.merchantHref} target="_blank" rel="nofollow sponsored noopener" aria-label={`Voir l’offre ${item.brand} ${item.name} sur le site marchand (nouvel onglet)`}>Voir l’offre</a></td></tr>)}</tbody></table></div></section>
    <section className={`container ${styles.section}`}><h2>Trouver un solaire par marque et besoin</h2><SolarFilters catalog={solarCatalog} /></section>
    <section className={`container ${styles.guide}`}><p>Lien affilié : Bons Plans Mania peut percevoir une commission sur les achats effectués via les liens de ce guide.</p><h2>Comment utiliser ce guide ?</h2><p>Commencez par l’usage : visage, corps ou enfant. Affinez ensuite selon le type de peau. Les six prix Amazon de la sélection principale proviennent du relevé de l’API du 26 novembre 2026. Les prix de référence sont ceux communiqués par cette API, sans historique indépendant vérifié. Pour les autres références, consultez le tarif chez le marchand. La livraison, le vendeur et les conditions propres au panier restent à vérifier.</p><h2>Besoin d’un comparatif plus détaillé ?</h2><p>Notre dossier éditorial explique les textures, les formats et les critères à regarder avant l’achat.</p><p><Link href="/article/hub-solaires-ete-2026-meilleurs-spf50-visage-corps-bebe">Lire le comparatif des meilleures crèmes solaires 2026</Link></p></section>
  </main></>;
}
