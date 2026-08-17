"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./refonte.module.css";

type Slide = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  label: string;
  date: string;
  price?: string;
  amazonAsin?: string;
  directOffer?: boolean;
  merchantHref?: string;
};

export default function DealCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval: number | undefined;
    const startRotation = () => {
      if (document.visibilityState !== "visible") return;
      setCurrent((value) => (value + 1) % slides.length);
      interval = window.setInterval(() => {
        if (document.visibilityState === "visible") {
          setCurrent((value) => (value + 1) % slides.length);
        }
      }, 6000);
    };

    // Laisse l'image initiale stable le temps du chargement et de la mesure LCP,
    // puis conserve la rotation automatique appréciée par les visiteurs.
    const initialDelay = window.setTimeout(startRotation, 10000);
    return () => {
      window.clearTimeout(initialDelay);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [slides.length, paused]);

  if (!slides.length) return null;
  const slide = slides[current];
  const move = (direction: number) => setCurrent((value) => (value + direction + slides.length) % slides.length);

  return (
    <article className={styles.lead} aria-roledescription="carrousel" aria-label="Les choix du jour" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <Image key={`backdrop-${slide.image}`} className={styles.leadBackdrop} src={slide.image} alt="" fill priority={current === 0} loading={current === 0 ? undefined : "lazy"} sizes="(max-width: 800px) 90vw, 46vw" aria-hidden />
      <Image key={`main-${slide.image}`} className={styles.leadProduct} src={slide.image} alt={slide.imageAlt} fill priority={current === 0} loading={current === 0 ? undefined : "lazy"} sizes="(max-width: 800px) 90vw, 46vw" />
      <div className={styles.leadShade} />
      <div className={styles.leadContent}>
        <span className={styles.leadBadge}>À voir maintenant</span>
        <small>{slide.label} · {slide.date}</small>
        <h2>{slide.title}</h2>
        <div className={styles.leadBottom}>
          {slide.directOffer ? (
            <a href={slide.merchantHref ?? `/go/${slide.slug}`} target="_blank" rel="nofollow sponsored noopener"><span>Voir l’offre</span> <ArrowUpRight size={16} /></a>
          ) : (
            <Link href={`/article/${slide.slug}`}><span>Lire l’article</span> <ArrowUpRight size={16} /></Link>
          )}
          <div className={styles.carouselControls}>
            <button type="button" onClick={() => move(-1)} aria-label="Offre précédente"><ArrowLeft size={15} /></button>
            <span>{current + 1} / {slides.length}</span>
            <button type="button" onClick={() => move(1)} aria-label="Offre suivante"><ArrowRight size={15} /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
