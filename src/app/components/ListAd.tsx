import AdBlock from "@/app/components/AdBlock";

const AD_FORMATS_BY_POSITION = new Map<number, "2" | "19">([
  [5, "2"],
  [10, "19"],
]);

export default function ListAd({ afterCard }: { afterCard: number }) {
  const moneytizerFormat = AD_FORMATS_BY_POSITION.get(afterCard);
  if (!moneytizerFormat) return null;

  return (
    <div
      className="bpm-list-ad"
      aria-label={`Publicité après l'offre ${afterCard}`}
      style={{
        width: "100%",
        minWidth: 0,
        gridColumn: "1 / -1",
        display: "grid",
        placeItems: "center",
      }}
    >
      <AdBlock moneytizerFormat={moneytizerFormat} />
    </div>
  );
}
