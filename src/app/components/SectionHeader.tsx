import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Props = {
  /** libellé de la pill (ex : "Nouveautés du mois") */
  badge: string;
  /** icône lucide à mettre dans la pill (optionnelle) */
  badgeIcon?: ReactNode;
  /** titre principal */
  title: string;
  /** emoji à mettre à gauche du titre */
  titleEmoji?: string;
  /** courte description sous le titre */
  subtitle?: string;
  /** couleur d'accent (hex saturé) — pill + emoji hover */
  color: string;
  /** URL du CTA "Tout voir" */
  href?: string;
  /** libellé du CTA (par défaut "Tout voir") */
  cta?: string;
};

export default function SectionHeader({
  badge,
  badgeIcon,
  title,
  titleEmoji,
  subtitle,
  color,
  href,
  cta = "Tout voir",
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: color,
            color: "#fff",
            padding: "5px 13px",
            borderRadius: "999px",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "12px",
            boxShadow: `0 4px 12px -2px ${color}66`,
          }}
        >
          {badgeIcon} {badge}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            lineHeight: 1.15,
          }}
        >
          {titleEmoji && <span aria-hidden>{titleEmoji}</span>}
          <span>{title}</span>
        </h2>
        {subtitle && (
          <p style={{ marginTop: "6px", color: "#4b5563", maxWidth: "620px" }}>{subtitle}</p>
        )}
      </div>
      {href && (
        <a href={href} className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap" }}>
          {cta} <ArrowRight size={14} aria-hidden style={{ verticalAlign: "middle", marginLeft: "4px" }} />
        </a>
      )}
    </div>
  );
}
