"use client";

import { useEffect } from "react";

export default function ThirdPartyScripts() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    let loaded = false;
    function load() {
      if (loaded) return;
      loaded = true;

      // Google Analytics
      const gaScript = document.createElement("script");
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-HH3TT98TED";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      window.gtag("js", new Date());
      window.gtag("config", "G-HH3TT98TED");

      // AdSense is loaded via layout.tsx head
    }

    function getClickLocation(anchor: HTMLAnchorElement): string {
      if (anchor.closest(".bpm-card")) return "article_card";
      if (anchor.closest(".article-rating-bar")) return "article_header";
      if (anchor.closest(".cta-inline")) return "article_inline";
      if (anchor.closest(".related-articles")) return "related_articles";
      if (anchor.closest("nav")) return "navigation";
      if (anchor.closest("footer")) return "footer";
      return "other";
    }

    function isKnownAffiliateHost(hostname: string): boolean {
      return [
        "amazon.fr",
        "amzn.to",
        "awin1.com",
        "tidd.ly",
        "ystyle.co",
        "affilae.com",
        "effiliation.com",
        "tradedoubler.com",
        "publicidees.com",
        "fnty.co",
        "c3po.link",
        "lk.gt",
      ].some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
    }

    function trackClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const url = new URL(anchor.href, window.location.origin);

      const commonParams = {
        page_path: window.location.pathname,
        link_text: anchor.textContent?.trim().slice(0, 100) || "",
        click_location: getClickLocation(anchor),
      };

      if (url.pathname.startsWith("/go/")) {
        load();
        window.gtag("event", "affiliate_click", {
          ...commonParams,
          affiliate_slug: decodeURIComponent(url.pathname.slice(4)),
        });
        return;
      }

      if (url.origin !== window.location.origin) {
        load();
        const eventName = isKnownAffiliateHost(url.hostname)
          ? "affiliate_click"
          : "outbound_click";
        window.gtag("event", eventName, {
          ...commonParams,
          destination_hostname: url.hostname,
          source_slug: window.location.pathname.startsWith("/article/")
            ? decodeURIComponent(window.location.pathname.slice(9))
            : "",
        });
        return;
      }

      if (
        window.location.pathname.startsWith("/article/") &&
        url.pathname.startsWith("/article/")
      ) {
        load();
        window.gtag("event", "internal_article_click", {
          ...commonParams,
          destination_slug: decodeURIComponent(url.pathname.slice(9)),
        });
      }
    }

    // Load on first user interaction or after 5s max
    const events = ["scroll", "click", "touchstart", "keydown"];
    const handler = () => {
      load();
      events.forEach((e) => window.removeEventListener(e, handler));
    };
    events.forEach((e) => window.addEventListener(e, handler, { once: true, passive: true }));
    document.addEventListener("click", trackClick, { capture: true });

    const timer = setTimeout(() => {
      load();
      events.forEach((e) => window.removeEventListener(e, handler));
    }, 5000);

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, handler));
      document.removeEventListener("click", trackClick, { capture: true });
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
