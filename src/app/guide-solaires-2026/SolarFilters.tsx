"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SOLAR_GUIDE_2026 } from "@/lib/solar-guide-2026";
import styles from "./page.module.css";

export default function SolarFilters() {
  const [brand, setBrand] = useState("all");
  const [usage, setUsage] = useState("all");
  const [skin, setSkin] = useState("all");
  const sorted = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  const brands = useMemo(() => sorted(SOLAR_GUIDE_2026.map((item) => item.brand)), []);
  const usages = useMemo(() => sorted(SOLAR_GUIDE_2026.flatMap((item) => item.usages)), []);
  const skins = useMemo(() => sorted(SOLAR_GUIDE_2026.flatMap((item) => item.skinTypes)), []);
  const products = SOLAR_GUIDE_2026.filter((item) => (brand === "all" || item.brand === brand) && (usage === "all" || item.usages.includes(usage)) && (skin === "all" || item.skinTypes.includes(skin)));

  return <>
    <div className={styles.filters}>
      <div><label htmlFor="solar-brand">Marque</label><select id="solar-brand" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">Toutes les marques</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div><label htmlFor="solar-usage">Usage</label><select id="solar-usage" value={usage} onChange={(event) => setUsage(event.target.value)}><option value="all">Tous les usages</option>{usages.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div><label htmlFor="solar-skin">Type de peau</label><select id="solar-skin" value={skin} onChange={(event) => setSkin(event.target.value)}><option value="all">Tous les types de peau</option>{skins.map((item) => <option key={item}>{item}</option>)}</select></div>
      <span>{products.length} produit{products.length > 1 ? "s" : ""}</span>
    </div>
    {products.length ? <div className={styles.grid}>{products.map((item) => <article className={styles.card} key={`${item.brand}-${item.name}`}>
      <Link href={item.articleHref} className={styles.imageLink}><img src={item.image} alt={item.imageAlt} loading="lazy" /></Link>
      <div className={styles.cardBody}><p className={styles.brand}>{item.brand}</p><h3>{item.name}</h3><div className={styles.badges}><span>{item.spf}</span><span>{item.format}</span></div><p className={styles.price}>{item.price}</p><p className={styles.forWho}>{item.usages.join(" · ")}<br />{item.skinTypes.join(" · ")}</p><p className={styles.checked}>Prix constaté le {item.checkedAt}</p><div className={styles.actions}><Link href={item.articleHref}>Lire la fiche</Link><a href={item.merchantHref} target="_blank" rel="nofollow sponsored noopener">Voir l’offre</a></div></div>
    </article>)}</div> : <p className={styles.empty}>Aucun solaire ne correspond à ces critères. Modifiez un filtre pour élargir la sélection.</p>}
  </>;
}
