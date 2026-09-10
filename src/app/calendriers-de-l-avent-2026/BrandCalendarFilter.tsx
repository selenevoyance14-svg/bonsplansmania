"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type AdventCalendar2026 } from "@/lib/advent-calendars-2026";
import styles from "./page.module.css";

export default function BrandCalendarFilter({ catalog }: { catalog: AdventCalendar2026[] }) {
  const [brand, setBrand] = useState("all");
  const [universe, setUniverse] = useState("all");
  const [audience, setAudience] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const brands = useMemo(() => [...new Set(catalog.map((item) => item.brand))].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })), [catalog]);
  const universes = useMemo(() => [...new Set(catalog.flatMap((item) => item.universes || []))].sort((a, b) => a.localeCompare(b, "fr")), [catalog]);
  const audiences = useMemo(() => [...new Set(catalog.flatMap((item) => item.audiences || []))].sort((a, b) => a.localeCompare(b, "fr")), [catalog]);
  const priceValue = (price: string) => Number.parseFloat(price.match(/\d+(?:[.,]\d+)?/)?.[0].replace(",", ".") || "999999");
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const calendars = catalog
    .filter((item) => brand === "all" || item.brand === brand)
    .filter((item) => universe === "all" || item.universes?.includes(universe))
    .filter((item) => audience === "all" || item.audiences?.includes(audience))
    .filter((item) => availability === "all" || item.status.toLocaleLowerCase("fr").includes(availability))
    .filter((item) => !normalizedQuery || `${item.brand} ${item.name} ${item.contents}`.toLocaleLowerCase("fr").includes(normalizedQuery))
    .sort((a, b) => sort === "price-asc" ? priceValue(a.price) - priceValue(b.price) : sort === "price-desc" ? priceValue(b.price) - priceValue(a.price) : sort === "brand" ? a.brand.localeCompare(b.brand, "fr") : 0);

  return <>
    <div className={styles.filters}>
      <div><label htmlFor="advent-search">Rechercher</label><input id="advent-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. parfum, homme, Adopt…" /></div>
      <div><label htmlFor="advent-brand">Marque</label><select id="advent-brand" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">Toutes les marques</option>{brands.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
      <div><label htmlFor="advent-universe">Univers</label><select id="advent-universe" value={universe} onChange={(event) => setUniverse(event.target.value)}><option value="all">Tous les univers</option>{universes.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
      <div><label htmlFor="advent-audience">Pour qui ?</label><select id="advent-audience" value={audience} onChange={(event) => setAudience(event.target.value)}><option value="all">Pour tout le monde</option>{audiences.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
      <div><label htmlFor="advent-availability">Disponibilité</label><select id="advent-availability" value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="all">Tous les statuts</option><option value="disponible">Disponible</option><option value="précommande">Précommande</option><option value="à venir">À venir</option></select></div>
      <div><label htmlFor="advent-sort">Trier</label><select id="advent-sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Notre sélection</option><option value="price-asc">Prix : moins cher</option><option value="price-desc">Prix : plus cher</option><option value="brand">Marque : A à Z</option></select></div>
      <span>{calendars.length} calendrier{calendars.length > 1 ? "s" : ""} affiché{calendars.length > 1 ? "s" : ""}</span>
    </div>
    {calendars.length ? <div className={styles.grid}>{calendars.map((calendar) => <article className={styles.card} key={`${calendar.articleHref}-${calendar.name}`}>
      <Link href={calendar.articleHref} className={styles.imageLink}><img src={calendar.image} alt={calendar.imageAlt} loading="lazy" />{calendar.imageIsEditorial ? <span className={styles.imageNote}>Illustration éditoriale</span> : null}</Link>
      <div className={styles.cardBody}><p className={styles.brand}>{calendar.brand}</p><h3>{calendar.name}</h3><p className={styles.price}>{calendar.price}</p>{calendar.value ? <p className={styles.value}>{calendar.value}</p> : null}<p>{calendar.contents}</p><p className={styles.status}>{calendar.status}</p><p className={styles.checked}>Prix constaté le {calendar.checkedAt}</p><div className={styles.actions}><Link href={calendar.articleHref}>Voir la fiche</Link><a href={calendar.merchantHref} target="_blank" rel="nofollow sponsored noopener">Voir chez le marchand</a></div></div>
    </article>)}</div> : <p className={styles.empty}>Aucun calendrier ne correspond à ces critères. Modifiez un filtre pour élargir la sélection.</p>}
  </>;
}
