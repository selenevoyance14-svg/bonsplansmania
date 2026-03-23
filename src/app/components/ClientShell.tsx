"use client";

import dynamic from "next/dynamic";

const NewsletterPopup = dynamic(() => import("./NewsletterPopup"), { ssr: false });
const ThirdPartyScripts = dynamic(() => import("./ThirdPartyScripts"), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <NewsletterPopup />
      <ThirdPartyScripts />
    </>
  );
}
