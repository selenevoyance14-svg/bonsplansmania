"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ADVENT_CALENDARS_2026 } from "@/lib/advent-calendars-2026";
import styles from "./page.module.css";

export default function BrandCalendarFilter() {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const brands = useMemo(
    () => [...new Set(ADVENT_CALENDARS_2026.map((calendar) => calendar.brand))]
      .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })),
    [],
  );
  const calendars = selectedBrand === "all"
    ? ADVENT_CALENDARS_2026
    : ADVENT_CALENDARS_2026.filter((calendar) => calendar.brand === selectedBrand);

  return (
    <>
      <div className={styles.brandFilter}>
        <label htmlFor="advent-brand">Choisir une marque</label>
        <select
          id="advent-brand"
          value={selectedBrand}
          onChange={(event) => setSelectedBrand(event.target.value)}
        >
          <option value="all">Toutes les marques</option>
          {brands.map((brand) => <option value={brand} key={brand}>{brand}</option>)}
        </select>
        <span>{calendars.length} calendrier{calendars.length > 1 ? "s" : ""}</span>
      </div>

      <div className={styles.grid}>{calendars.map((calendar) => (
        <article className={styles.card} key={`${calendar.brand}-${calendar.name}`}>
          <Link href={calendar.articleHref} className={styles.imageLink}>
            <img src={calendar.image} alt={calendar.imageAlt} loading="lazy" />
            {calendar.imageIsEditorial ? <span className={styles.imageNote}>Illustration éditoriale</span> : null}
          </Link>
          <div className={styles.cardBody}>
            <p className={styles.brand}>{calendar.brand}</p><h3>{calendar.name}</h3>
            <p className={styles.price}>{calendar.price}</p>
            {calendar.value ? <p className={styles.value}>{calendar.value}</p> : null}
            <p>{calendar.contents}</p><p className={styles.status}>{calendar.status}</p>
            <p className={styles.checked}>Prix constaté le {calendar.checkedAt}</p>
            <div className={styles.actions}>
              <Link href={calendar.articleHref}>Voir la fiche</Link>
              <a href={calendar.merchantHref} target="_blank" rel="nofollow sponsored noopener">Voir chez le marchand</a>
            </div>
          </div>
        </article>
      ))}</div>
    </>
  );
}
