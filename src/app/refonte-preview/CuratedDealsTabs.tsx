"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Pause, Play } from "lucide-react";
import AmazonProductImage from "@/app/components/AmazonProductImage";
import { formatCardTitle } from "@/lib/display-title";
import { parsePrice } from "@/lib/price";
import styles from "./refonte.module.css";

export type CuratedDealItem = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  amazonAsin?: string;
  price?: string;
  updated: string;
  badge: string;
};

export type CuratedDealGroup = {
  id: "partner" | "coupons" | "refund" | "small";
  label: string;
  title: string;
  description: string;
  href: string;
  allLabel: string;
  items: CuratedDealItem[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(
    new Date(`${date}T12:00:00`),
  );
}

export default function CuratedDealsTabs({ groups }: { groups: CuratedDealGroup[] }) {
  const availableGroups = useMemo(
    () => groups.filter((group) => group.items.length > 0),
    [groups],
  );
  const [activeId, setActiveId] = useState(availableGroups[0]?.id ?? "partner");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const activeGroup = availableGroups.find((group) => group.id === activeId) ?? availableGroups[0];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!autoRotate || isPaused || reduceMotion || availableGroups.length < 2) return;

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setActiveId((currentId) => {
        const currentIndex = availableGroups.findIndex((group) => group.id === currentId);
        return availableGroups[(currentIndex + 1) % availableGroups.length].id;
      });
    }, 7_000);

    return () => window.clearInterval(interval);
  }, [autoRotate, availableGroups, isPaused, reduceMotion]);

  if (!activeGroup) return null;

  const selectGroup = (groupId: CuratedDealGroup["id"]) => {
    setActiveId(groupId);
    setAutoRotate(false);
  };

  return (
    <section
      className={styles.dealsHub}
      aria-labelledby="deals-hub-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onTouchStart={() => setAutoRotate(false)}
    >
      <div className={styles.dealsHubTopline}>
        <div>
          <h2 id="deals-hub-title">À ne pas manquer aujourd’hui</h2>
        </div>
        <Link href={activeGroup.href} aria-label={activeGroup.allLabel}>Voir toutes les offres <ArrowUpRight size={15} /></Link>
      </div>

      <div className={styles.dealsTabs} role="tablist" aria-label="Sélections de bons plans">
        {availableGroups.map((group) => (
          <button
            key={group.id}
            id={`deals-tab-${group.id}`}
            type="button"
            role="tab"
            aria-selected={group.id === activeGroup.id}
            aria-controls={`deals-panel-${group.id}`}
            className={group.id === activeGroup.id ? styles.dealsTabActive : styles.dealsTab}
            onClick={() => selectGroup(group.id)}
          >
            {group.label}
          </button>
        ))}
        <button
          type="button"
          className={styles.dealsRotationToggle}
          aria-label={autoRotate ? "Mettre la rotation des sélections en pause" : "Relancer la rotation des sélections"}
          onClick={() => setAutoRotate((current) => !current)}
        >
          {autoRotate ? <Pause size={12} aria-hidden /> : <Play size={12} aria-hidden />}
          {autoRotate ? "Pause" : "Relancer"}
        </button>
      </div>

      <div
        key={activeGroup.id}
        id={`deals-panel-${activeGroup.id}`}
        role="tabpanel"
        aria-labelledby={`deals-tab-${activeGroup.id}`}
        className={styles.dealsPanel}
      >
        <div className={styles.dealsPanelHeading}>
          <h3>{activeGroup.title}</h3>
          <p>{activeGroup.description}</p>
        </div>

        <div className={styles.dealsHubGrid}>
          {activeGroup.items.map((article) => {
            const { now, was, savings } = parsePrice(article.price);
            return (
              <article className={`${styles.dealsHubCard} ${styles[`dealsHubCard_${activeGroup.id}`]}`} key={article.slug}>
                <Link href={`/article/${article.slug}`} className={styles.dealsHubImage}>
                  <AmazonProductImage
                    asin={article.amazonAsin}
                    fallbackSrc={article.image}
                    alt={article.imageAlt}
                    sizes="(max-width: 760px) 34vw, 140px"
                    objectFit="contain"
                    padding="12px"
                  />
                  <span>{activeGroup.id === "coupons" && <Check size={11} />} {article.badge}</span>
                </Link>
                <div className={styles.dealsHubCopy}>
                  <small>Vérifié le {formatDate(article.updated)}</small>
                  <h4><Link href={`/article/${article.slug}`}>{formatCardTitle(article.title)}</Link></h4>
                  <div className={styles.dealsHubPrice}>
                    <strong>{now || article.price || "Voir l’offre"}</strong>
                    {activeGroup.id === "coupons" && was && <del>{was}</del>}
                    {activeGroup.id === "coupons" && savings && <b>{savings}</b>}
                  </div>
                  <div className={styles.dealsHubFooter}>
                    <span>Voir le détail</span>
                    <Link href={`/article/${article.slug}`} aria-label={`Découvrir ${article.title}`}><ArrowUpRight size={15} /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {activeGroup.id === "coupons" && (
          <p className={styles.dealsHubNotice}>Pensez à cocher le coupon sur Amazon. Il peut être réservé à certains comptes ou disparaître rapidement ; le prix du panier fait foi.</p>
        )}
      </div>
    </section>
  );
}
