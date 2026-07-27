import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { AffiliatePosition } from "@/lib/box-beauty-comparison";

type Props = {
  href: string;
  merchant: string;
  offerName: string;
  position: AffiliatePosition;
  children?: ReactNode;
  className?: string;
};

export default function AffiliateButton({
  href,
  merchant,
  offerName,
  position,
  children,
  className = "",
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={`btn btn-primary box-affiliate-button ${className}`.trim()}
      data-affiliate-merchant={merchant}
      data-affiliate-position={position}
      data-affiliate-offer={offerName}
      aria-label={`${children || "Voir l'offre"} chez ${merchant} (nouvel onglet)`}
    >
      {children || "Voir l'offre actuelle"}
      <ExternalLink size={15} aria-hidden />
    </a>
  );
}
