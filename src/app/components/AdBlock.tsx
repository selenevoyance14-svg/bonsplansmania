"use client";

import { useEffect, useRef } from "react";

type AdFormat = "display" | "in-article" | "multiplex";

interface AdBlockProps {
  className?: string;
  format?: AdFormat;
  slot?: string; // override optionnel
}

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

export default function AdBlock({ className = "", format = "display", slot }: AdBlockProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense pas encore chargé, le push se fera au prochain montage
    }
  }, []);

  const slotId = slot ?? SLOTS[format];

  if (format === "in-article") {
    return (
      <div className={`ad-container ad-in-article ${className}`} style={{ textAlign: "center", margin: "32px 0", overflow: "hidden" }}>
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
      <div className={`ad-container ad-multiplex ${className}`} style={{ margin: "40px 0", overflow: "hidden" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-5064203547863113"
          data-ad-slot={slotId}
          ref={adRef}
        />
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={{ textAlign: "center", margin: "24px 0", minHeight: "250px", overflow: "hidden" }}>
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
