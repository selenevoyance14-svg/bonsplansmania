"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { Check, Clipboard, MoveRight, Sparkles } from "lucide-react";
import {
  isFeaturedPartnerActive,
  type FeaturedPartnerConfig,
} from "@/lib/featured-partner";

type CopyStatus = "idle" | "copied" | "error";

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Le repli ci-dessous couvre notamment les contextes non sécurisés.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export default function FeaturedPartner({
  partner,
  initiallyActive,
}: {
  partner: FeaturedPartnerConfig;
  initiallyActive: boolean;
}) {
  const [isActive, setIsActive] = useState(initiallyActive);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    const refreshVisibility = () => {
      setIsActive(isFeaturedPartnerActive(partner, new Date()));
    };

    refreshVisibility();
    const interval = window.setInterval(refreshVisibility, 60_000);
    return () => window.clearInterval(interval);
  }, [partner]);

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), 2_500);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  if (!isActive) return null;

  const handleCopy = async () => {
    const copied = await copyText(partner.promoCode);
    setCopyStatus(copied ? "copied" : "error");

    if (copied && typeof window.gtag === "function") {
      window.gtag("event", "promo_code_copy", {
        merchant: partner.merchant,
        promo_code: partner.promoCode,
        click_location: "homepage_featured_partner",
      });
    }
  };

  return (
    <section
      className="featured-partner-section"
      aria-labelledby={`featured-partner-${partner.id}-title`}
      style={
        {
          "--featured-partner-bg": partner.theme.background,
          "--featured-partner-border": partner.theme.border,
          "--featured-partner-primary": partner.theme.primary,
          "--featured-partner-text": partner.theme.text,
          "--featured-partner-secondary": partner.theme.secondaryText,
        } as CSSProperties
      }
    >
      <div className="container">
        <div className="featured-partner">
          <div className="featured-partner__content">
            <span className="featured-partner__badge">
              <Sparkles size={13} aria-hidden />
              {partner.badge}
            </span>
            <h2
              id={`featured-partner-${partner.id}-title`}
              className="featured-partner__title"
            >
              {partner.title}
            </h2>
            <p className="featured-partner__description">
              {partner.description}
            </p>

            {partner.promoCode ? (
              <div className="featured-partner__promo">
                <div>
                  <span className="featured-partner__promo-code">
                    {partner.promoCode}
                  </span>
                  <span className="featured-partner__validity">
                    {partner.promoValidityText}
                  </span>
                </div>
                <button
                  type="button"
                  className="featured-partner__copy"
                  onClick={handleCopy}
                  aria-label={`Copier le code promo ${partner.promoCode} de ${partner.brandName}`}
                >
                  {copyStatus === "copied" ? (
                    <Check size={17} aria-hidden />
                  ) : (
                    <Clipboard size={17} aria-hidden />
                  )}
                  {copyStatus === "copied"
                    ? "Code copié"
                    : partner.copyButtonLabel}
                </button>
              </div>
            ) : null}

            <p
              className="featured-partner__copy-status"
              aria-live="polite"
              aria-atomic="true"
            >
              {copyStatus === "copied"
                ? "Code copié"
                : copyStatus === "error"
                  ? `Copie impossible. Sélectionnez le code ${partner.promoCode}.`
                  : ""}
            </p>

            <p className="featured-partner__conditions">
              {partner.conditionsText}
            </p>

            <a
              href={partner.primaryCtaHref}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="featured-partner__cta"
              data-affiliate-position="homepage_featured_partner"
              data-affiliate-merchant={partner.merchant}
              data-affiliate-offer={partner.promoCode || undefined}
            >
              {partner.primaryCtaLabel}
              <MoveRight size={18} aria-hidden />
            </a>
          </div>

          <div className="featured-partner__visual">
            <Image
              src={partner.imageSrc}
              alt={partner.imageAlt}
              fill
              sizes="(max-width: 720px) 100vw, 36vw"
              className="featured-partner__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
