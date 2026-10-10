"use client";

import { useEffect, useRef } from "react";

type AdFormat = "display" | "in-article" | "multiplex";

interface AdBlockProps {
  className?: string;
  format?: AdFormat;
  slot?: string;
  compactMultiplex?: boolean;
  collapseWhenEmpty?: boolean;
  moneytizerFormat?: "1" | "2" | "4" | "6" | "15" | "19";
  eager?: boolean;
}

const MONEYTIZER_SITE_ID = "143369";
const activeMoneytizerContainers = new Map<string, HTMLDivElement>();

const IMMEDIATE_FORMATS = new Set(["6", "15"]);

export default function AdBlock({ className = "", moneytizerFormat = "2", eager = false }: AdBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let observer: IntersectionObserver | undefined;
    let ownsFormat = false;

    const requestAd = () => {
      if (ownsFormat) return;

      const activeContainer = activeMoneytizerContainers.get(moneytizerFormat);
      if (activeContainer && activeContainer !== container) {
        container.style.display = "none";
        return;
      }

      ownsFormat = true;
      activeMoneytizerContainers.set(moneytizerFormat, container);
      container.id = `${MONEYTIZER_SITE_ID}-${moneytizerFormat}`;
      container.dataset.adState = "requested";
      container.removeAttribute("aria-hidden");

      if (container.childNodes.length > 0) return;

      const generator = document.createElement("script");
      generator.src = `https://ads.themoneytizer.com/s/gen.js?type=${moneytizerFormat}`;
      generator.async = false;

      const request = document.createElement("script");
      request.src = `https://ads.themoneytizer.com/s/requestform.js?siteId=${MONEYTIZER_SITE_ID}&formatId=${moneytizerFormat}`;
      request.async = false;

      generator.addEventListener("load", () => container.appendChild(request), { once: true });
      container.appendChild(generator);
    };

    // Les formats ancrés et interstitiels doivent être disponibles dès
    // l'ouverture. Les encarts intégrés ne sont demandés que lorsque le
    // lecteur s'en approche : cela évite de comptabiliser des impressions
    // situées loin sous la ligne de flottaison et améliore leur visibilité.
    if (eager || IMMEDIATE_FORMATS.has(moneytizerFormat) || !("IntersectionObserver" in window)) {
      requestAd();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          requestAd();
        },
        { rootMargin: "300px 0px", threshold: 0.01 },
      );
      observer.observe(container);
    }

    return () => {
      observer?.disconnect();
      if (ownsFormat && activeMoneytizerContainers.get(moneytizerFormat) === container) {
        activeMoneytizerContainers.delete(moneytizerFormat);
      }
    };
  }, [eager, moneytizerFormat]);

  return (
    <div
      ref={containerRef}
      className={`ad-container moneytizer-ad ${className}`.trim()}
      aria-label="Publicité"
      aria-hidden="true"
    />
  );
}
