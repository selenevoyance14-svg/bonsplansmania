"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import AmazonCardPrice from "@/app/components/AmazonCardPrice";
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
};

export default function DealCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setCurrent((value) => (value + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [slides.length, paused]);

  if (!slides.length) return null;
  const slide = slides[current];
  const move = (direction: number) => setCurrent((value) => (value + direction + slides.length) % slides.length);

  return (
    <article className={styles.lead} aria-roledescription="carrousel" aria-label="Les choix du jour" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <Image key={`backdrop-${slide.image}`} className={styles.leadBackdrop} src={slide.image} alt="" fill priority sizes="(max-width: 800px) 90vw, 46vw" aria-hidden />
      <Image key={`main-${slide.image}`} className={styles.leadProduct} src={slide.image} alt={slide.imageAlt} fill priority sizes="(max-width: 800px) 90vw, 46vw" />
      <div className={styles.leadShade} />
      <div className={styles.leadContent}>
        <span className={styles.leadBadge}>À voir maintenant</span>
        <small>{slide.label} · {slide.date}</small>
        <h2>{slide.title}</h2>
        <div className={styles.leadBottom}>
          <Link href={`/article/${slide.slug}`}><AmazonCardPrice asin={slide.amazonAsin} fallback={slide.price || "Découvrir l’offre"} /> <ArrowUpRight size={16} /></Link>
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
