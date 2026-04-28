"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const SLOT_ID = "1564426359";

export default function StickyAdMobile() {
  const pushed = useRef(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (closed) return null;

  return (
    <div className="sticky-ad-mobile" aria-label="Publicité">
      <button
        onClick={() => setClosed(true)}
        aria-label="Fermer la publicité"
        className="sticky-ad-close"
      >
        ×
      </button>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "60px" }}
        data-ad-client="ca-pub-5064203547863113"
        data-ad-slot={SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
