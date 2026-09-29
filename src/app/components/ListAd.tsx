import AdBlock from "@/app/components/AdBlock";

const AD_POSITION = 10;

export default function ListAd({ afterCard }: { afterCard: number }) {
  if (afterCard !== AD_POSITION) return null;

  return (
    <div
      className="bpm-list-ad"
      aria-label={`Publicité après l'offre ${afterCard}`}
      style={{ width: "100%", minWidth: 0, gridColumn: "1 / -1" }}
    >
      <AdBlock />
    </div>
  );
}
