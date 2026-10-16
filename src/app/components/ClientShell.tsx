"use client";

import NewsletterPopup from "./NewsletterPopup";
import ThirdPartyScripts from "./ThirdPartyScripts";
import BackToTopButton from "./BackToTopButton";

export default function ClientShell() {
  return (
    <>
      <NewsletterPopup />
      <ThirdPartyScripts />
      <BackToTopButton />
    </>
  );
}
