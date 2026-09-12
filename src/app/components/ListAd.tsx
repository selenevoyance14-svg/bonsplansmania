import AdBlock from "@/app/components/AdBlock";

const AD_POSITIONS = new Set([10, 20, 30]);

export default function ListAd({ afterCard }: { afterCard: number }) {
  if (!AD_POSITIONS.has(afterCard)) return null;

  return (
    <div
      className="bpm-list-ad"
      aria-label={`Publicité après l'offre ${afterCard}`}
      style={{ width: "100%", minWidth: 0, gridColumn: "1 / -1" }}
    >
      <AdBlock
        format={afterCard === 10 ? "in-article" : "display"}
        collapseWhenEmpty
      />
    </div>
  );
}
