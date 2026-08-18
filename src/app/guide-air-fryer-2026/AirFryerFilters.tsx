"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AIR_FRYER_GUIDE_2026 } from "@/lib/air-fryer-guide-2026";
import styles from "./page.module.css";

export default function AirFryerFilters() {
  const [brand, setBrand] = useState("all"); const [type, setType] = useState("all");
  const sort = (items: string[]) => [...new Set(items)].sort((a,b)=>a.localeCompare(b,"fr"));
  const brands = useMemo(()=>sort(AIR_FRYER_GUIDE_2026.map(item=>item.brand)),[]);
  const types = useMemo(()=>sort(AIR_FRYER_GUIDE_2026.flatMap(item=>item.types)),[]);
  const products = AIR_FRYER_GUIDE_2026.filter(item=>(brand==="all"||item.brand===brand)&&(type==="all"||item.types.includes(type)));
  return <><div className={styles.filters}><div><label htmlFor="air-brand">Marque</label><select id="air-brand" value={brand} onChange={e=>setBrand(e.target.value)}><option value="all">Toutes les marques</option>{brands.map(item=><option key={item}>{item}</option>)}</select></div><div><label htmlFor="air-type">Format</label><select id="air-type" value={type} onChange={e=>setType(e.target.value)}><option value="all">Tous les formats</option>{types.map(item=><option key={item}>{item}</option>)}</select></div><span>{products.length} modèle{products.length>1?"s":""}</span></div>
  <div className={styles.grid}>{products.map(item=><article className={styles.card} key={`${item.brand}-${item.name}`}><Link href={item.articleHref} className={styles.imageLink}><img src={item.image} alt={item.imageAlt} loading="lazy" /></Link><div className={styles.cardBody}><p className={styles.brand}>{item.brand}</p><h3>{item.name}</h3><div className={styles.badges}><span>{item.capacity}</span>{item.types.map(value=><span key={value}>{value}</span>)}</div><p className={styles.price}>{item.price}</p><p>{item.household} · {item.programs}</p><p className={styles.checked}>Prix constaté le {item.checkedAt}</p><div className={styles.actions}><Link href={item.articleHref}>Lire la fiche</Link><a href={item.merchantHref} target="_blank" rel="nofollow sponsored noopener">Voir l’offre</a></div></div></article>)}</div></>;
}
