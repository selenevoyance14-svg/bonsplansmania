"use client";

import { useEffect, useState } from "react";

export default function ThirdPartyScripts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    function load() {
      if (loaded) return;
      setLoaded(true);

      // Google Analytics
      const gaScript = document.createElement("script");
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-HH3TT98TED";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      gaScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: unknown[]) {
          window.dataLayer.push(args);
        }
        gtag("js", new Date());
        gtag("config", "G-HH3TT98TED");
      };

      // Ezoic CMP (consentement RGPD)
      const ezoicCmp1 = document.createElement("script");
      ezoicCmp1.src = "https://cmp.gatekeeperconsent.com/min.js";
      ezoicCmp1.setAttribute("data-cfasync", "false");
      document.head.appendChild(ezoicCmp1);

      const ezoicCmp2 = document.createElement("script");
      ezoicCmp2.src = "https://the.gatekeeperconsent.com/cmp.min.js";
      ezoicCmp2.setAttribute("data-cfasync", "false");
      document.head.appendChild(ezoicCmp2);

      // Ezoic principal
      const ezoicScript = document.createElement("script");
      ezoicScript.src = "//www.ezojs.com/ezoic/sa.min.js";
      ezoicScript.async = true;
      document.head.appendChild(ezoicScript);

      // Ezoic standalone init
      const ezoicInit = document.createElement("script");
      ezoicInit.textContent = `
        window.ezstandalone = window.ezstandalone || {};
        ezstandalone.cmd = ezstandalone.cmd || [];
      `;
      document.head.appendChild(ezoicInit);

      // Ezoic Analytics
      const ezoicAnalytics = document.createElement("script");
      ezoicAnalytics.src = "//ezoicanalytics.com/analytics.js";
      document.head.appendChild(ezoicAnalytics);
    }

    // Load on first user interaction or after 5s max
    const events = ["scroll", "click", "touchstart", "keydown"];
    const handler = () => {
      load();
      events.forEach((e) => window.removeEventListener(e, handler));
    };
    events.forEach((e) => window.addEventListener(e, handler, { once: true, passive: true }));

    const timer = setTimeout(() => {
      load();
      events.forEach((e) => window.removeEventListener(e, handler));
    }, 5000);

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [loaded]);

  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
