"use client";

import { useEffect, useState } from "react";
import { Gift, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "bpm_featured_offer_igraal_september_2026";
const SESSION_POPUP_KEY = "bpm_popup_shown_this_session";
const DISMISS_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;
const DISPLAY_DELAY_MS = 25 * 1000;
const MIN_SCROLL_PROGRESS = 0.5;

const offer = {
  eyebrow: "Offre du moment",
  title: "10 € offerts avec iGraal",
  description: "Inscrivez-vous et récupérez aussi du cashback sur vos achats en ligne.",
  buttonLabel: "Découvrir l’offre",
  href: "/article/igraal-cashback-parrainage-15-euros-offerts-inscription-2026",
  image: "/images/articles/igraal-parrainage-10-euros-septembre-2026.png",
  endDate: "2026-09-30T23:59:59+02:00",
};

export default function FeaturedOfferPopup() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isLocalPreview =
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).has("previewOffer");
    if (isLocalPreview) {
      const previewTimer = window.setTimeout(() => setShow(true), 0);
      return () => window.clearTimeout(previewTimer);
    }

    if (pathname === offer.href) return;
    if (Date.now() > new Date(offer.endDate).getTime()) return;
    if (sessionStorage.getItem(SESSION_POPUP_KEY)) return;

    const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_PERIOD_MS) return;

    const reveal = () => {
      if (sessionStorage.getItem(SESSION_POPUP_KEY)) return;
      sessionStorage.setItem(SESSION_POPUP_KEY, "offer");
      setShow(true);
    };

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= MIN_SCROLL_PROGRESS) {
        reveal();
        window.removeEventListener("scroll", onScroll);
      }
    };

    const timer = window.setTimeout(reveal, DISPLAY_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  function handleClose() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }

  function handleClick() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    window.gtag?.("event", "featured_offer_click", {
      offer_name: "igraal_september_2026",
      page_path: window.location.pathname,
    });
  }

  if (!show) return null;

  return (
    <aside className="featured-offer-popup" aria-label="Offre iGraal du moment">
      <button className="featured-offer-close" onClick={handleClose} aria-label="Fermer cette offre">
        <X size={18} />
      </button>

      <Image
        src={offer.image}
        alt=""
        width={1672}
        height={941}
        sizes="(max-width: 560px) 82px, 112px"
        className="featured-offer-image"
      />

      <div className="featured-offer-content">
        <span className="featured-offer-eyebrow">
          <Gift size={14} aria-hidden="true" />
          {offer.eyebrow}
        </span>
        <strong>{offer.title}</strong>
        <p>{offer.description}</p>
        <a href={offer.href} onClick={handleClick}>
          {offer.buttonLabel}
        </a>
        <small>Lien de parrainage · Offre soumise à conditions</small>
      </div>

      <style jsx>{`
        .featured-offer-popup {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 9997;
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          width: min(410px, calc(100vw - 32px));
          overflow: hidden;
          border: 1px solid #99e5e7;
          border-radius: 18px;
          background: linear-gradient(135deg, #ecfeff 0%, #ffffff 58%, #fdf2f8 100%);
          box-shadow: 0 18px 45px rgba(15, 118, 110, 0.2);
          animation: offerSlideIn 0.35s ease-out;
        }

        .featured-offer-close {
          position: absolute;
          top: 9px;
          right: 9px;
          z-index: 2;
          display: grid;
          width: 30px;
          height: 30px;
          place-items: center;
          border: 0;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.9);
          color: #fff;
          cursor: pointer;
        }

        .featured-offer-image {
          width: 100%;
          height: 100%;
          min-height: 172px;
          object-fit: cover;
        }

        .featured-offer-content {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: flex-start;
          padding: 18px 42px 15px 17px;
        }

        .featured-offer-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 7px;
          color: #0b8a8e;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        strong {
          color: #111827;
          font-size: 1.08rem;
          line-height: 1.25;
        }

        p {
          margin: 6px 0 11px;
          color: #4b5563;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        a {
          display: inline-flex;
          justify-content: center;
          border-radius: 10px;
          background: linear-gradient(135deg, #0ea5a9 0%, #fb7185 100%);
          padding: 9px 14px;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 800;
          text-decoration: none;
        }

        small {
          margin-top: 8px;
          color: #6b7280;
          font-size: 0.62rem;
          line-height: 1.25;
        }

        @keyframes offerSlideIn {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 560px) {
          .featured-offer-popup {
            right: 12px;
            bottom: 12px;
            grid-template-columns: 82px minmax(0, 1fr);
            width: calc(100vw - 24px);
            border-radius: 15px;
          }

          .featured-offer-image {
            min-height: 154px;
          }

          .featured-offer-content {
            padding: 15px 38px 13px 13px;
          }

          strong {
            font-size: 0.98rem;
          }

          p {
            font-size: 0.74rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .featured-offer-popup {
            animation: none;
          }
        }
      `}</style>
    </aside>
  );
}
