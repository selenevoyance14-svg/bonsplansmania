"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type BeautyBox2026 } from "@/lib/beauty-boxes-2026";
import styles from "./page.module.css";

export default function BeautyBoxFilters({ catalog }: { catalog: BeautyBox2026[] }) {
  const [brand, setBrand] = useState("all");
  const [formula, setFormula] = useState("all");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const brands = useMemo(() => [...new Set(catalog.map((box) => box.brand))].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })), [catalog]);
  const formulas = useMemo(() => [...new Set(catalog.flatMap((box) => box.formulas))].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })), [catalog]);
  const priceValue = (price: string) => {
    const match = price.match(/\d+(?:[.,]\d+)?/);
    return match ? Number.parseFloat(match[0].replace(",", ".")) : Number.POSITIVE_INFINITY;
  };
  const dateValue = (date: string) => {
    const months: Record<string, number> = { janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5, juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11 };
    const match = date.toLowerCase().match(/(\d{1,2})(?:er)?\s+([a-zéû]+)\s+(\d{4})/);
    return match ? new Date(Number(match[3]), months[match[2]] ?? 0, Number(match[1])).getTime() : 0;
  };
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const boxes = catalog
    .filter((box) => (brand === "all" || box.brand === brand) && (formula === "all" || box.formulas.includes(formula)))
    .filter((box) => !normalizedQuery || `${box.brand} ${box.name} ${box.contents}`.toLocaleLowerCase("fr").includes(normalizedQuery))
    .sort((a, b) => {
      if (sort === "price-asc") return priceValue(a.price) - priceValue(b.price);
      if (sort === "price-desc") return priceValue(b.price) - priceValue(a.price);
      if (sort === "brand") return a.brand.localeCompare(b.brand, "fr", { sensitivity: "base" });
      if (sort === "recent") return dateValue(b.checkedAt) - dateValue(a.checkedAt);
      return 0;
    });

  return <>
    <div className={styles.filters}>
      <div><label htmlFor="box-search">Rechercher une box</label><input id="box-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. bio, Blissim, homme…" style={{ width: "100%", padding: "13px 14px", border: "1px solid #9c8f84", background: "#fff", color: "#231f20", font: "inherit" }} /></div>
      <div><label htmlFor="box-brand">Choisir une marque</label><select id="box-brand" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">Toutes les marques</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div><label htmlFor="box-formula">Choisir une formule</label><select id="box-formula" value={formula} onChange={(event) => setFormula(event.target.value)}><option value="all">Toutes les formules</option>{formulas.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div><label htmlFor="box-sort">Trier les offres</label><select id="box-sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Notre sélection</option><option value="price-asc">Prix : moins cher</option><option value="price-desc">Prix : plus cher</option><option value="brand">Marque : A à Z</option><option value="recent">Vérification récente</option></select></div>
      <span>{boxes.length} box affichée{boxes.length > 1 ? "s" : ""}</span>
    </div>
    {boxes.length ? <div className={styles.grid}>{boxes.map((box) => <article className={styles.card} key={box.articleHref}>
      <Link href={box.articleHref} className={styles.imageLink}><img src={box.image} alt={box.imageAlt} loading="lazy" /></Link>
      <div className={styles.cardBody}><p className={styles.brand}>{box.brand}</p><h3>{box.name}</h3><p className={styles.price}>{box.price}</p>{box.value ? <p className={styles.value}>{box.value}</p> : null}<p>{box.contents}</p><p className={styles.commitment}>{box.commitment}</p><p className={styles.checked}>Prix constaté le {box.checkedAt}</p><div className={styles.actions}><Link href={box.articleHref}>Voir la fiche</Link><a href={box.merchantHref} target="_blank" rel="nofollow sponsored noopener">Voir l’offre</a></div></div>
    </article>)}</div> : <p className={styles.empty}>Aucune box ne correspond à ces deux critères. Essayez une autre formule.</p>}
  </>;
}
