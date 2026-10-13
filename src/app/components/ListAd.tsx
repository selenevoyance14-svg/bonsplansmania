import AdBlock from "@/app/components/AdBlock";

const DEFAULT_AD_POSITIONS = new Set([10, 20, 30]);

export default function ListAd({
  afterCard,
  every,
  force = false,
  ariaLabel,
}: {
  afterCard: number;
  every?: number;
  force?: boolean;
  ariaLabel?: string;
}) {
  const shouldShow = force || (every
    ? afterCard > 0 && afterCard % every === 0
    : DEFAULT_AD_POSITIONS.has(afterCard));

  if (!shouldShow) return null;

  return (
    <div
      className="bpm-list-ad"
      aria-label={ariaLabel ?? `Publicité après l'offre ${afterCard}`}
      style={{
        width: "100%",
        minWidth: 0,
        gridColumn: "1 / -1",
      }}
    >
      <AdBlock
        format={every !== undefined || afterCard === 10 ? "in-article" : "display"}
        collapseWhenEmpty
      />
    </div>
  );
}
