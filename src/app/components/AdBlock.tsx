"use client";

import { useEffect, useRef } from "react";

let ezoicIdCounter = 100;

interface AdBlockProps {
  className?: string;
}

declare global {
  interface Window {
    ezstandalone: {
      cmd: Array<() => void>;
      showAds: () => void;
      findAll: () => void;
    };
  }
}

export default function AdBlock({ className = "" }: AdBlockProps) {
  const idRef = useRef<number | null>(null);
  const initialized = useRef(false);

  if (idRef.current === null) {
    idRef.current = ezoicIdCounter++;
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      if (window.ezstandalone) {
        window.ezstandalone.cmd = window.ezstandalone.cmd || [];
        window.ezstandalone.cmd.push(() => {
          window.ezstandalone.showAds();
        });
      }
    } catch {
      // Ezoic not loaded yet
    }
  }, []);

  return (
    <div
      id={`ezoic-pub-ad-placeholder-${idRef.current}`}
      className={`ad-container ${className}`}
      style={{ textAlign: "center", margin: "24px 0", minHeight: "90px", overflow: "hidden" }}
    />
  );
}
