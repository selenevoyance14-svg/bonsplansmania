"use client";

import { useEffect, useRef } from "react";

interface AdBlockProps {
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  slot?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBlock({ format = "auto", slot = "", className = "" }: AdBlockProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet or blocked
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={{ textAlign: "center", margin: "24px 0", minHeight: "90px", overflow: "hidden" }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5064203547863113"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
