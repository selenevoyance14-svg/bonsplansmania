"use client";

import { useEffect, useRef } from "react";

type AdFormat = "display" | "in-article" | "multiplex";

interface AdBlockProps {
  className?: string;
  format?: AdFormat;
  // TODO Yann : créer 3 slots dédiés dans AdSense (in-article fluid + multiplex autorelaxed + display)
  // et remplacer ces IDs. En attendant, on réutilise le slot display existant — AdSense optimise quand même.
  slot?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const DEFAULT_SLOT = "1564426359";

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

  const slotId = slot ?? DEFAULT_SLOT;

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
    <div className={`ad-container ${className}`} style={{ textAlign: "center", margin: "24px 0", minHeight: "90px", overflow: "hidden" }}>
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
