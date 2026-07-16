"use client";

import { useState } from "react";
import { BadgeCheck, ChevronDown, Copy, Check, ExternalLink, X, Infinity as InfinityIcon } from "lucide-react";
import {
  type CodePromoOffer,
  offerCtaLabel,
  offerTypeColor,
  offerTypeLabel,
  getOfferAffiliateUrl,
  getOfferBrand,
} from "@/lib/code-promo-offers";

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date();
  const days = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Terminée";
  if (days === 0) return "Expire aujourd'hui";
  if (days === 1) return "Expire demain";
  if (days <= 7) return `Expire dans ${days} jours`;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `Expire le ${dd}/${d.getFullYear() === now.getFullYear() ? mm : `${mm}/${d.getFullYear()}`}`;
}

interface Props {
  offer: CodePromoOffer;
}

export default function OfferCard({ offer }: Props) {
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const brand = getOfferBrand(offer);
  const brandDisplayName = offer.brandName ?? brand?.name;
  const affiliateUrl = getOfferAffiliateUrl(offer);
  const expiryLabel = formatDate(offer.expires);
  const typeColor = offerTypeColor(offer.type);

  // Font-size adaptative pour la value : les longs libellés (GRATUITE, CASHBACK,
  // FIDÉLITÉ, CLUB R…) doivent tenir dans les 130 px de la colonne gauche.
  const vLen = offer.value.replace(/\s/g, "").length;
  const valueFontSize =
    vLen <= 4 ? "clamp(1.5rem, 4vw, 2rem)"
    : vLen <= 6 ? "clamp(1.2rem, 3.2vw, 1.55rem)"
    : vLen <= 8 ? "clamp(0.95rem, 2.5vw, 1.2rem)"
    : "clamp(0.82rem, 2.2vw, 1rem)";
  const typeLabel = offerTypeLabel(offer.type);
  const ctaLabel = offerCtaLabel(offer);
  const isCode = offer.type === "code" && !!offer.code;

  function handleCopy() {
    if (!offer.code) return;
    navigator.clipboard.writeText(offer.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleCta(e: React.MouseEvent) {
    if (isCode) {
      e.preventDefault();
      setModalOpen(true);
      // Copie automatique du code au clic (comme Dealabs)
      if (offer.code) {
        navigator.clipboard.writeText(offer.code).catch(() => {});
      }
    }
    // sinon lien classique, on laisse passer
  }

  return (
    <>
      <div className="offer-card">
        {/* Colonne gauche : valeur */}
        <div className="offer-card-value" style={{ background: `${typeColor}0d`, borderRight: `2px dashed ${typeColor}33` }}>
          <div className="offer-card-value-main" style={{ color: typeColor, fontSize: valueFontSize }}>
            {offer.value}
          </div>
          {offer.valueLabel && (
            <div className="offer-card-value-sub" style={{ color: typeColor }}>
              {offer.valueLabel}
            </div>
          )}
        </div>

        {/* Colonne centrale : badge + titre + conditions */}
        <div className="offer-card-content">
          <div className="offer-card-header">
            <div className="offer-card-type" style={{ color: typeColor }}>
              <BadgeCheck size={13} aria-hidden />
              <span>{typeLabel}</span>
            </div>
            {brandDisplayName && <span className="offer-card-brand">{brandDisplayName}</span>}
            {offer.permanent && (
              <span className="offer-card-permanent" title="Valable toute l'année">
                <InfinityIcon size={11} aria-hidden /> Permanent
              </span>
            )}
            {!offer.permanent && expiryLabel && (
              <span
                className="offer-card-expiry"
                style={{
                  color: expiryLabel.startsWith("Expire dans") || expiryLabel.startsWith("Expire aujourd") || expiryLabel === "Expire demain" ? "#DC2626" : "var(--muted-foreground)",
                  fontWeight: expiryLabel.startsWith("Expire dans") || expiryLabel === "Expire demain" ? 700 : 500,
                }}
              >
                {expiryLabel}
              </span>
            )}
          </div>
          <h3 className="offer-card-title">{offer.title}</h3>
          {offer.conditions && (
            <button
              type="button"
              onClick={() => setConditionsOpen((v) => !v)}
              className="offer-card-conditions-toggle"
              aria-expanded={conditionsOpen}
            >
              Conditions <ChevronDown size={13} style={{ transform: conditionsOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>
          )}
          {conditionsOpen && offer.conditions && (
            <p className="offer-card-conditions-body">{offer.conditions}</p>
          )}
        </div>

        {/* Colonne droite : CTA */}
        <div className="offer-card-cta-col">
          <a
            href={isCode ? "#" : affiliateUrl}
            target={isCode ? undefined : "_blank"}
            rel={isCode ? undefined : "nofollow sponsored noopener"}
            onClick={handleCta}
            className="offer-card-cta"
            style={{ background: typeColor }}
          >
            {ctaLabel}
          </a>
        </div>
      </div>

      {/* Modal reveal code (uniquement type=code) */}
      {isCode && modalOpen && (
        <div
          className="offer-modal-backdrop"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="offer-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="offer-modal-close"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
            <div className="offer-modal-brand" style={{ color: typeColor }}>
              {brandDisplayName}
            </div>
            <h4 className="offer-modal-title">{offer.title}</h4>
            <p className="offer-modal-instruction">Copie le code, puis clique sur le bouton pour aller sur le site :</p>
            <button
              type="button"
              onClick={handleCopy}
              className="offer-modal-code"
              style={{ borderColor: typeColor, color: typeColor }}
            >
              <span className="offer-modal-code-text">{offer.code}</span>
              <span className="offer-modal-code-copy">
                {copied ? <><Check size={14} /> Copié</> : <><Copy size={14} /> Copier</>}
              </span>
            </button>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="offer-modal-goto"
              style={{ background: typeColor }}
              onClick={() => setModalOpen(false)}
            >
              Aller sur le site <ExternalLink size={15} />
            </a>
          </div>
        </div>
      )}

      <style>{`
        .offer-card {
          display: grid;
          grid-template-columns: 130px 1fr auto;
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .offer-card:hover {
          box-shadow: 0 8px 20px -12px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }
        .offer-card-value {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 8px;
          text-align: center;
        }
        .offer-card-value-main {
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .offer-card-value-sub {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 4px;
          opacity: 0.85;
        }
        .offer-card-content {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }
        .offer-card-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          font-size: 0.72rem;
          margin-bottom: 6px;
        }
        .offer-card-type {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .offer-card-brand {
          font-weight: 700;
          color: #1f2937;
        }
        .offer-card-expiry {
          font-size: 0.72rem;
          margin-left: auto;
        }
        .offer-card-permanent {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 9px;
          border-radius: 999px;
          background: #ECFDF5;
          color: #059669;
          font-weight: 800;
          font-size: 0.66rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 1px solid #A7F3D0;
          margin-left: auto;
        }
        .offer-card-title {
          margin: 0;
          font-size: 0.98rem;
          line-height: 1.4;
          font-weight: 700;
          color: var(--foreground);
        }
        .offer-card-conditions-toggle {
          background: none;
          border: none;
          padding: 6px 0 0;
          color: var(--muted-foreground);
          font-size: 0.78rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-weight: 600;
          margin-top: 8px;
          text-align: left;
        }
        .offer-card-conditions-toggle:hover {
          color: var(--foreground);
        }
        .offer-card-conditions-body {
          margin: 6px 0 0;
          font-size: 0.82rem;
          line-height: 1.5;
          color: var(--muted-foreground);
        }
        .offer-card-cta-col {
          padding: 18px 18px 18px 8px;
          display: flex;
          align-items: center;
        }
        .offer-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: white;
          padding: 12px 22px;
          border-radius: 999px;
          font-weight: 700;
          text-decoration: none;
          font-size: 0.9rem;
          white-space: nowrap;
          transition: filter 0.15s, transform 0.15s;
        }
        .offer-card-cta:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .offer-card {
            grid-template-columns: 92px 1fr;
            grid-template-areas:
              "value content"
              "cta cta";
          }
          .offer-card-value { grid-area: value; padding: 14px 4px; }
          .offer-card-value-main { font-size: 1.3rem; }
          .offer-card-content { grid-area: content; padding: 14px 14px 8px; }
          .offer-card-cta-col {
            grid-area: cta;
            padding: 8px 14px 14px;
            justify-content: stretch;
            border-top: 1px solid var(--border);
          }
          .offer-card-cta {
            flex: 1;
            justify-content: center;
          }
          .offer-card-expiry {
            margin-left: 0;
            width: 100%;
          }
        }

        /* Modal */
        .offer-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
          animation: offer-modal-fade 0.18s ease-out;
        }
        @keyframes offer-modal-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .offer-modal {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 30px 26px 26px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.35);
          animation: offer-modal-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes offer-modal-pop {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .offer-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          color: var(--muted-foreground);
        }
        .offer-modal-close:hover {
          background: var(--muted);
          color: var(--foreground);
        }
        .offer-modal-brand {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .offer-modal-title {
          margin: 0 0 14px;
          font-size: 1.05rem;
          line-height: 1.4;
          font-weight: 800;
        }
        .offer-modal-instruction {
          font-size: 0.85rem;
          color: var(--muted-foreground);
          margin: 0 0 14px;
          line-height: 1.5;
        }
        .offer-modal-code {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          background: white;
          border: 2px dashed;
          padding: 14px 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          margin-bottom: 14px;
          transition: background 0.15s;
        }
        .offer-modal-code:hover {
          background: rgba(0,0,0,0.02);
        }
        .offer-modal-code-text {
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
        }
        .offer-modal-code-copy {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .offer-modal-goto {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: white;
          padding: 14px 22px;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          font-size: 0.95rem;
          transition: filter 0.15s;
        }
        .offer-modal-goto:hover {
          filter: brightness(1.08);
        }
      `}</style>
    </>
  );
}
