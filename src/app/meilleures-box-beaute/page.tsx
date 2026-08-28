import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import { BEAUTY_BOXES_2026 } from "@/lib/beauty-boxes-2026";
import { getBeautyBoxCatalog } from "@/lib/beauty-box-catalog";
import BeautyBoxFilters from "./BeautyBoxFilters";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Meilleures box beauté 2026 : prix, avis et comparatif",
  description: "Comparez les box beauté 2026 par marque et formule : prix datés, contenu, engagement, valeur annoncée et offres vérifiées.",
  alternates: { canonical: "https://bonsplansmania.fr/meilleures-box-beaute" },
  openGraph: { title: "Box beauté 2026 : le comparatif mis à jour", description: "Prix, contenu, engagement et offres des principales box beauté.", url: "https://bonsplansmania.fr/meilleures-box-beaute", type: "website" },
};

export default function BeautyBoxesHub() {
  const beautyBoxCatalog = getBeautyBoxCatalog();
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: "Meilleures box beauté 2026", numberOfItems: BEAUTY_BOXES_2026.length, itemListElement: BEAUTY_BOXES_2026.map((box, index) => ({ "@type": "ListItem", position: index + 1, name: `${box.brand} ${box.name}`, url: `https://bonsplansmania.fr${box.articleHref}` })) };
  return <><Header activePage="/meilleures-box-beaute" /><main className={styles.main}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    <section className={styles.hero}><div className="container"><p className={styles.eyebrow}>Guide pratique et offres vérifiées</p><h1>Box beauté 2026 : prix, avis et comparatif</h1><p className={styles.intro}>Comparez les box par budget, univers et type de formule. Les prix sont datés et les conditions d’abonnement sont affichées clairement.</p><p className={styles.updated}>{BEAUTY_BOXES_2026.length} box référencées · offres ajoutées au fil des nouveautés</p></div></section>
    <section className={`container ${styles.section}`}><h2>Comparatif rapide des box beauté</h2><div className={styles.tableWrap}><table><thead><tr><th>Box</th><th>Prix constaté</th><th>Contenu</th><th>Formule</th><th>Offre</th></tr></thead><tbody>{BEAUTY_BOXES_2026.map((box) => <tr key={box.brand}><td><Link href={box.articleHref}><strong>{box.brand}</strong><br />{box.name}</Link></td><td><strong>{box.price}</strong>{box.value ? <small>{box.value}</small> : null}</td><td>{box.contents}</td><td>{box.commitment}</td><td><a className={styles.tableOffer} href={box.merchantHref} target="_blank" rel="nofollow sponsored noopener" aria-label={`Voir l’offre ${box.brand} sur le site marchand (nouvel onglet)`}>Voir l’offre</a></td></tr>)}</tbody></table></div></section>
    <section className={`container ${styles.section}`}><h2>Les box beauté disponibles</h2><BeautyBoxFilters catalog={beautyBoxCatalog} /></section>
    <section className={`container ${styles.guide}`}><h2>Quelle box beauté choisir en 2026 ?</h2><p>Pour une découverte mensuelle, comparez le prix récurrent, les formats et surtout les conditions de résiliation. Une offre de bienvenue très généreuse peut déclencher un abonnement : vérifiez toujours le récapitulatif avant le paiement.</p><h2>Box mensuelle ou édition limitée ?</h2><p>Une box mensuelle convient pour recevoir régulièrement des nouveautés. Une édition limitée est un achat ponctuel, souvent plus simple si vous cherchez un cadeau ou si vous ne voulez aucun renouvellement automatique.</p><p><Link href="/categorie/box-beaute">Voir aussi tous nos articles consacrés aux box beauté</Link></p></section>
  </main></>;
}
