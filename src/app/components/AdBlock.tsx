"use client";

import { useEffect, useRef, useState } from "react";

type AdFormat = "display" | "in-article" | "multiplex";

interface AdBlockProps {
  className?: string;
  format?: AdFormat;
  slot?: string; // override optionnel
  compactMultiplex?: boolean;
  collapseWhenEmpty?: boolean;
}

type AdState = "loading" | "filled" | "empty";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// Slots AdSense dédiés (créés depuis le compte AdSense de Yann)
const SLOTS: Record<AdFormat, string> = {
  "display": "5683891928",       // BPM Display
  "in-article": "9104262184",    // BPM In-article (fluid)
  "multiplex": "4554643083",     // BPM Multiplex (autorelaxed)
};

export default function AdBlock({
  className = "",
  format = "display",
  slot,
  compactMultiplex = false,
  collapseWhenEmpty = false,
}: AdBlockProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [adState, setAdState] = useState<AdState>("loading");
  const slotId = slot ?? SLOTS[format];

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense pas encore chargé, le push se fera au prochain montage
    }
  }, []);

  useEffect(() => {
    if (!collapseWhenEmpty) return;

    const ad = adRef.current;
    if (!ad) return;
    const isLocalPreview = window.location.hostname === "localhost";

    const updateState = () => {
      if (isLocalPreview) return;
      const status = ad.dataset.adStatus;
      if (status === "filled") setAdState("filled");
      if (status === "unfilled") setAdState("empty");
    };

    updateState();
    const observer = new MutationObserver(updateState);
    observer.observe(ad, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
      childList: true,
      subtree: true,
    });

    // Si AdSense est bloqué ou ne répond pas, on évite de conserver un grand
    // emplacement vide. En local, le délai est raccourci pour la prévisualisation.
    const timeout = window.setTimeout(() => {
      const status = ad.dataset.adStatus;
      if (isLocalPreview) {
        setAdState("empty");
        return;
      }
      // En production, la présence de l’iframe confirme également qu’une
      // création publicitaire a été injectée, même si le statut tarde à arriver.
      const hasCreative = Boolean(ad.querySelector("iframe"));
      setAdState(status === "filled" || hasCreative ? "filled" : "empty");
    }, isLocalPreview ? 300 : 6000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [collapseWhenEmpty, slotId]);

  const hidden = collapseWhenEmpty && adState === "empty";
  const adStateProps = collapseWhenEmpty
    ? { "data-ad-state": adState, "aria-hidden": hidden || undefined }
    : {};

  if (format === "in-article") {
    return (
      <div
        className={`ad-container ad-in-article ${className}`}
        style={{ textAlign: "center", margin: hidden ? 0 : "32px 0", maxHeight: hidden ? 0 : undefined, overflow: "hidden" }}
        {...adStateProps}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-5064203547863113"
          data-ad-slot={slotId}
          ref={adRef}
        />
      </div>
    );
  }

  if (format === "multiplex") {
    return (
      <div
        className={`ad-container ad-multiplex ${className}`}
        style={{ margin: hidden ? 0 : "40px 0", maxHeight: hidden ? 0 : undefined, overflow: "hidden" }}
        {...adStateProps}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-5064203547863113"
          data-ad-slot={slotId}
          {...(compactMultiplex ? {
            "data-matched-content-ui-type": "image_stacked,image_stacked",
            "data-matched-content-rows-num": "1,1",
            "data-matched-content-columns-num": "2,4",
          } : {})}
          ref={adRef}
        />
      </div>
    );
  }

  return (
    <div
      className={`ad-container ${className}`}
      style={{
        textAlign: "center",
        margin: hidden ? 0 : "24px 0",
        minHeight: collapseWhenEmpty ? undefined : "250px",
        maxHeight: hidden ? 0 : undefined,
        overflow: "hidden",
      }}
      {...adStateProps}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5064203547863113"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
}
