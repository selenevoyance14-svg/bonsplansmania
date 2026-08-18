"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AFFILIATE_PARTNERS, AFFILIATE_PARTNER_GROUPS } from "@/lib/affiliate-partners";
import styles from "./page.module.css";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function PartnerDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [letter, setLetter] = useState("all");

  const partners = useMemo(() => AFFILIATE_PARTNERS.filter((partner) => {
    const matchesQuery = partner.name.toLocaleLowerCase("fr").includes(query.trim().toLocaleLowerCase("fr"));
    const matchesCategory = category === "all" || partner.category === category;
    const matchesLetter = letter === "all" || partner.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(letter);
    return matchesQuery && matchesCategory && matchesLetter;
  }), [query, category, letter]);

  return <>
    <div className={styles.controls}>
      <div><label htmlFor="partner-search">Rechercher une marque</label><input id="partner-search" type="search" placeholder="Ex. Clarins, Carrefour, YesStyle…" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      <div><label htmlFor="partner-category">Choisir un univers</label><select id="partner-category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Tous les univers</option>{Object.keys(AFFILIATE_PARTNER_GROUPS).map((item) => <option key={item}>{item}</option>)}</select></div>
      <p>{partners.length} marque{partners.length > 1 ? "s" : ""} affichée{partners.length > 1 ? "s" : ""}</p>
    </div>
    <div className={styles.alphabet} aria-label="Filtrer par initiale"><button className={letter === "all" ? styles.selected : ""} onClick={() => setLetter("all")}>Toutes</button>{alphabet.map((item) => <button key={item} className={letter === item ? styles.selected : ""} onClick={() => setLetter(item)}>{item}</button>)}</div>
    {partners.length ? <div className={styles.grid}>{partners.map((partner) => <article className={styles.card} key={partner.slug}>
      <div className={styles.monogram} style={{ backgroundColor: partner.color }} aria-hidden="true">{partner.name.charAt(0)}</div>
      <div className={styles.cardBody}><p className={styles.category}>{partner.category}</p><h2>{partner.name}</h2><p>Retrouvez les offres publiées sur Bons Plans Mania ou accédez directement à la boutique partenaire.</p><div className={styles.actions}><Link href={`/code-promo/${partner.slug}`}>Voir les bons plans</Link><a href={partner.affiliateUrl} target="_blank" rel="nofollow sponsored noopener">Visiter la boutique ↗</a></div></div>
    </article>)}</div> : <p className={styles.empty}>Aucune marque ne correspond à cette recherche.</p>}
  </>;
}

