"use client";

import NewsletterPopup from "./NewsletterPopup";
import FeaturedOfferPopup from "./FeaturedOfferPopup";
import ThirdPartyScripts from "./ThirdPartyScripts";
import BackToTopButton from "./BackToTopButton";

export default function ClientShell() {
  return (
    <>
      <FeaturedOfferPopup />
      <NewsletterPopup />
      <ThirdPartyScripts />
      <BackToTopButton />
    </>
  );
}
