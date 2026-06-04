"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// Initialise les blocs AdSense in-article injectés via dangerouslySetInnerHTML
// dans le contenu Markdown. Les <script> inclus dans innerHTML ne s'exécutent
// jamais (sécurité navigateur) — il faut donc pousser chaque <ins> en JS côté client.
export default function InContentAdsInit() {
  useEffect(() => {
    const insBlocks = document.querySelectorAll<HTMLElement>(
      ".article-content ins.adsbygoogle:not([data-bpm-pushed])"
    );
    insBlocks.forEach((block) => {
      block.setAttribute("data-bpm-pushed", "true");
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense pas encore prêt, sera tenté au prochain mount
      }
    });
  }, []);

  return null;
}
