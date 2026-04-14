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

      // Google AdSense
      const adsenseScript = document.createElement("script");
      adsenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5064203547863113";
      adsenseScript.async = true;
      adsenseScript.crossOrigin = "anonymous";
      document.head.appendChild(adsenseScript);
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
