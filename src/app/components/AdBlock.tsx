"use client";

import { useEffect, useRef } from "react";

type AdFormat = "display" | "in-article" | "multiplex";

interface AdBlockProps {
  className?: string;
  format?: AdFormat;
  slot?: string;
  compactMultiplex?: boolean;
  collapseWhenEmpty?: boolean;
  moneytizerFormat?: "2" | "4" | "6" | "15" | "19";
}

const MONEYTIZER_SITE_ID = "143369";
const activeMoneytizerContainers = new Map<string, HTMLDivElement>();

export default function AdBlock({ className = "", moneytizerFormat = "2" }: AdBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeContainer = activeMoneytizerContainers.get(moneytizerFormat);
    if (activeContainer && activeContainer !== container) {
      container.style.display = "none";
      return;
    }

    activeMoneytizerContainers.set(moneytizerFormat, container);
    container.id = `${MONEYTIZER_SITE_ID}-${moneytizerFormat}`;
    container.removeAttribute("aria-hidden");

    if (container.childNodes.length === 0) {
      const generator = document.createElement("script");
      generator.src = `https://ads.themoneytizer.com/s/gen.js?type=${moneytizerFormat}`;
      generator.async = false;

      const request = document.createElement("script");
      request.src = `https://ads.themoneytizer.com/s/requestform.js?siteId=${MONEYTIZER_SITE_ID}&formatId=${moneytizerFormat}`;
      request.async = false;

      generator.addEventListener("load", () => container.appendChild(request), { once: true });
      container.appendChild(generator);
    }

    return () => {
      if (activeMoneytizerContainers.get(moneytizerFormat) === container) {
        activeMoneytizerContainers.delete(moneytizerFormat);
      }
    };
  }, [moneytizerFormat]);

  return (
    <div
      ref={containerRef}
      className={`ad-container moneytizer-ad ${className}`.trim()}
      aria-label="Publicité"
      aria-hidden="true"
    />
  );
}
