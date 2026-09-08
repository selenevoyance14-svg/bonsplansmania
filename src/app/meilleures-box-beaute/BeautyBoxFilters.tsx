"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BEAUTY_BOXES_2026, type BeautyBox2026 } from "@/lib/beauty-boxes-2026";
import styles from "./page.module.css";

export default function BeautyBoxFilters({ catalog }: { catalog: BeautyBox2026[] }) {
  const [brand, setBrand] = useState("all");
  const [formula, setFormula] = useState("all");
  const brands = useMemo(() => [...new Set(catalog.map((box) => box.brand))].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })), [catalog]);
  const formulas = useMemo(() => [...new Set(catalog.flatMap((box) => box.formulas))].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })), [catalog]);
  const featuredHrefs = useMemo(() => new Set(BEAUTY_BOXES_2026.map((box) => box.articleHref)), []);
  const source = brand === "all" && formula === "all"
    ? catalog.filter((box) => featuredHrefs.has(box.articleHref))
    : catalog;
  const boxes = source.filter((box) => (brand === "all" || box.brand === brand) && (formula === "all" || box.formulas.includes(formula)));

  return <>
    <div className={styles.filters}>
      <div><label htmlFor="box-brand">Choisir une marque</label><select id="box-brand" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">Toutes les marques</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div><label htmlFor="box-formula">Choisir une formule</label><select id="box-formula" value={formula} onChange={(event) => setFormula(event.target.value)}><option value="all">Toutes les formules</option>{formulas.map((item) => <option key={item}>{item}</option>)}</select></div>
      <span>{boxes.length} box affichée{boxes.length > 1 ? "s" : ""}</span>
    </div>
    {boxes.length ? <div className={styles.grid}>{boxes.map((box) => <article className={styles.card} key={box.brand}>
      <Link href={box.articleHref} className={styles.imageLink}><img src={box.image} alt={box.imageAlt} loading="lazy" /></Link>
      <div className={styles.cardBody}><p className={styles.brand}>{box.brand}</p><h3>{box.name}</h3><p className={styles.price}>{box.price}</p>{box.value ? <p className={styles.value}>{box.value}</p> : null}<p>{box.contents}</p><p className={styles.commitment}>{box.commitment}</p><p className={styles.checked}>Prix constaté le {box.checkedAt}</p><div className={styles.actions}><Link href={box.articleHref}>Voir la fiche</Link><a href={box.merchantHref} target="_blank" rel="nofollow sponsored noopener">Voir l’offre</a></div></div>
    </article>)}</div> : <p className={styles.empty}>Aucune box ne correspond à ces deux critères. Essayez une autre formule.</p>}
  </>;
}
