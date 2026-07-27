"use client";

import { useEffect } from "react";

export default function ThirdPartyScripts() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    function getClickLocation(anchor: HTMLAnchorElement): string {
      if (anchor.closest(".bpm-card")) return "article_card";
      if (anchor.closest(".article-rating-bar")) return "article_header";
      if (anchor.closest(".cta-inline")) return "article_inline";
      if (anchor.closest(".related-articles")) return "related_articles";
      if (anchor.closest("nav")) return "navigation";
      if (anchor.closest("footer")) return "footer";
      return "other";
    }

    function getAffiliateNetwork(url: URL): string {
      const hostname = url.hostname.replace(/^www\./, "");
      if (hostname === "amazon.fr" || hostname.endsWith(".amazon.fr") || hostname === "amzn.to") {
        return "amazon";
      }
      if (hostname === "awin1.com" || hostname.endsWith(".awin1.com") || hostname === "tidd.ly") {
        return "awin";
      }
      if (hostname === "lb.affilae.com" || hostname === "c3po.link" || url.searchParams.has("ae") || url.searchParams.has("aecid")) {
        return "affilae";
      }
      if (hostname === "track.effiliation.com") return "effiliation";
      if (hostname === "clk.tradedoubler.com") return "tradedoubler";
      if (hostname === "tracking.publicidees.com" || hostname === "a.time1.me") return "timeone";
      if (hostname === "ystyle.co" || hostname === "yesstyle.com") return "yesstyle";
      if (hostname === "fnty.co") return "financeads";
      if (hostname === "lk.gt") return "linkgains";
      return "direct";
    }

    function isKnownAffiliateUrl(url: URL): boolean {
      const hostname = url.hostname;
      const knownHost = [
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
      return knownHost || [
        "tag",
        "ae",
        "aecid",
        "awin",
        "awc",
        "aff",
        "affiliate",
        "parrain",
        "parrain_id",
      ].some((parameter) => url.searchParams.has(parameter));
    }

    function trackClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const url = new URL(anchor.href, window.location.origin);
      const sourceSlug = window.location.pathname.startsWith("/article/")
        ? decodeURIComponent(window.location.pathname.slice(9))
        : "";

      const commonParams = {
        page_path: window.location.pathname,
        link_text: anchor.textContent?.trim().slice(0, 100) || "",
        click_location: getClickLocation(anchor),
      };

      if (url.pathname.startsWith("/go/")) {
        window.gtag("event", "affiliate_click", {
          ...commonParams,
          affiliate_slug: decodeURIComponent(url.pathname.slice(4)),
          source_slug: sourceSlug,
          affiliate_network: "redirect",
          destination_hostname: "bonsplansmania.fr",
        });
        return;
      }

      if (url.origin !== window.location.origin) {
        const isAffiliate = isKnownAffiliateUrl(url);
        const eventName = isAffiliate
          ? "affiliate_click"
          : "outbound_click";
        window.gtag("event", eventName, {
          ...commonParams,
          affiliate_slug: isAffiliate ? sourceSlug : "",
          affiliate_network: isAffiliate ? getAffiliateNetwork(url) : "",
          destination_hostname: url.hostname,
          source_slug: sourceSlug,
        });
        return;
      }

      if (
        window.location.pathname.startsWith("/article/") &&
        url.pathname.startsWith("/article/")
      ) {
        window.gtag("event", "internal_article_click", {
          ...commonParams,
          destination_slug: decodeURIComponent(url.pathname.slice(9)),
        });
      }
    }

    document.addEventListener("click", trackClick, { capture: true });

    return () => {
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
