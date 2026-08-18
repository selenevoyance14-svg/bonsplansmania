import type { Metadata } from "next";
import Header from "@/app/components/Header";
import { AFFILIATE_PARTNERS } from "@/lib/affiliate-partners";
import PartnerDirectory from "./PartnerDirectory";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Marques partenaires : boutiques, offres et bons plans",
  description: "Retrouvez par ordre alphabétique les marques partenaires de Bons Plans Mania, leurs offres et leurs boutiques officielles.",
  alternates: { canonical: "https://bonsplansmania.fr/marques-partenaires" },
  openGraph: { title: "Les marques partenaires de Bons Plans Mania", description: "Un répertoire clair des boutiques partenaires et de leurs bons plans.", url: "https://bonsplansmania.fr/marques-partenaires", type: "website" },
};

export default function AffiliatePartnersPage() {
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: "Marques partenaires de Bons Plans Mania", numberOfItems: AFFILIATE_PARTNERS.length, itemListElement: AFFILIATE_PARTNERS.map((partner, index) => ({ "@type": "ListItem", position: index + 1, name: partner.name, url: `https://bonsplansmania.fr/code-promo/${partner.slug}` })) };
  return <><Header activePage="/marques-partenaires" /><main className={styles.main}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    <section className={styles.hero}><div className="container"><p className={styles.eyebrow}>Les enseignes que nous suivons</p><h1>Nos marques partenaires</h1><p>Beauté, mode, maison, famille ou voyages : trouvez rapidement une marque, consultez ses bons plans et rejoignez sa boutique.</p><p className={styles.disclosure}>Certains liens sont affiliés : Bons Plans Mania peut recevoir une commission, sans coût supplémentaire pour vous. Les offres restent sélectionnées indépendamment.</p></div></section>
    <section className={`container ${styles.directory}`}><PartnerDirectory /></section>
  </main></>;
}

