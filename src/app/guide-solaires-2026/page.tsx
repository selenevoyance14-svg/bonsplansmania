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
    <section className={styles.hero}><div className="container"><p className={styles.eyebrow}>Prix datés · sélection vérifiée</p><h1>Guide d’achat solaires 2026</h1><p className={styles.intro}>Visage, corps, enfant, peau sensible ou K-Beauty : filtrez la sélection pour trouver le solaire qui correspond à votre usage et à votre budget.</p><p className={styles.updated}>{SOLAR_GUIDE_2026.length} protections référencées · prix mis à jour au fil des vérifications</p></div></section>
    <section className={`container ${styles.section}`}><h2>Comparer rapidement les solaires</h2><div className={styles.tableWrap}><table><thead><tr><th>Produit</th><th>Protection</th><th>Usage</th><th>Prix constaté</th><th>Offre</th></tr></thead><tbody>{SOLAR_GUIDE_2026.map((item) => <tr key={`${item.brand}-${item.name}`}><td><Link href={item.articleHref}><strong>{item.brand}</strong><br />{item.name}</Link></td><td>{item.spf}<small>{item.format}</small></td><td>{item.usages.join(" · ")}</td><td><strong>{item.price}</strong><small>le {item.checkedAt}</small></td><td><a className={styles.tableOffer} href={item.merchantHref} target="_blank" rel="nofollow sponsored noopener" aria-label={`Voir l’offre ${item.brand} ${item.name} sur le site marchand (nouvel onglet)`}>Voir l’offre</a></td></tr>)}</tbody></table></div></section>
    <section className={`container ${styles.section}`}><h2>Trouver un solaire par marque et besoin</h2><SolarFilters catalog={solarCatalog} /></section>
    <section className={`container ${styles.guide}`}><h2>Comment utiliser ce guide ?</h2><p>Commencez par l’usage : visage, corps ou enfant. Affinez ensuite selon le type de peau. Les prix affichés correspondent à une vérification datée et peuvent évoluer chez le marchand.</p><h2>Besoin d’un comparatif plus détaillé ?</h2><p>Notre dossier éditorial explique les textures, les formats et les critères à regarder avant l’achat.</p><p><Link href="/article/hub-solaires-ete-2026-meilleurs-spf50-visage-corps-bebe">Lire le comparatif des meilleures crèmes solaires 2026</Link></p></section>
  </main></>;
}
