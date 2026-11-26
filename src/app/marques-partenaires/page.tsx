import type { Metadata } from "next";
import Header from "@/app/components/Header";
import { AFFILIATE_PARTNERS } from "@/lib/affiliate-partners";
import { getAllArticles } from "@/lib/articles";
import { BRAND_DEFINITIONS, getNormalizedBrandTags, normalizeBrandTag } from "@/lib/brand-directory";
import PartnerDirectory from "./PartnerDirectory";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Marques partenaires : boutiques, offres et bons plans",
  description: "Retrouvez par ordre alphabétique les marques partenaires de Bons Plans Mania, leurs offres et leurs boutiques officielles.",
  alternates: { canonical: "https://bonsplansmania.fr/marques-partenaires" },
  openGraph: { title: "Les marques partenaires de Bons Plans Mania", description: "Un répertoire clair des boutiques partenaires et de leurs bons plans.", url: "https://bonsplansmania.fr/marques-partenaires", type: "website" },
};

export default function AffiliatePartnersPage() {
  const articles = getAllArticles();
  const existingSlugs = new Set(AFFILIATE_PARTNERS.map((partner) => partner.slug));
  const existingNames = new Set(AFFILIATE_PARTNERS.map((partner) => normalizeBrandTag(partner.name)));
  const additions = BRAND_DEFINITIONS.filter((brand) => {
    if (existingSlugs.has(brand.slug) || existingNames.has(normalizeBrandTag(brand.name))) return false;
    const tags = getNormalizedBrandTags(brand);
    return articles.some((article) => article.meta.tags.some((tag) => tags.has(normalizeBrandTag(tag))));
  }).map((brand) => ({ slug: brand.slug, name: brand.name, category: "Autres marques et enseignes", color: "#6f2037", href: `/marque/${brand.slug}` }));
  const entries = [
    ...AFFILIATE_PARTNERS.map((partner) => ({ slug: partner.slug, name: partner.name, category: partner.category as string, color: partner.color, href: `/code-promo/${partner.slug}`, shopHref: `/go/annuaire-partenaire-${partner.slug}` })),
    ...additions,
  ].sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: "Marques partenaires de Bons Plans Mania", numberOfItems: entries.length, itemListElement: entries.map((partner, index) => ({ "@type": "ListItem", position: index + 1, name: partner.name, url: `https://bonsplansmania.fr${partner.href}` })) };
  return <><Header activePage="/marques-partenaires" /><main className={styles.main}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    <section className={styles.hero}><div className="container"><p className={styles.eyebrow}>Les enseignes que nous suivons</p><h1>Nos marques partenaires</h1><p>Beauté, mode, maison, famille ou voyages : retrouvez nos partenaires et les autres marques présentes dans nos articles. Consultez leurs bons plans et, lorsqu’un lien est disponible, leur boutique.</p><p className={styles.disclosure}>Certains liens sont affiliés : Bons Plans Mania peut recevoir une commission, sans coût supplémentaire pour vous. Les offres restent sélectionnées indépendamment.</p></div></section>
    <section className={`container ${styles.directory}`}><PartnerDirectory entries={entries} /></section>
  </main></>;
}

