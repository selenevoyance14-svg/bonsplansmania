import { notFound } from "next/navigation";
import { OffersSelectionPage, type Selection } from "../page";

const routeSelections: Record<string, Selection> = {
  partenaire: "partner",
  carrefour: "carrefour",
  coupons: "coupons",
  rembourse: "refund",
  leclerc: "leclerc",
  "moins-de-20-euros": "small",
};

export function generateStaticParams() {
  return Object.keys(routeSelections).map((selection) => ({ selection }));
}

export default async function FilteredOffersPage({
  params,
}: {
  params: Promise<{ selection: string }>;
}) {
  const { selection } = await params;
  const resolved = routeSelections[selection];
  if (!resolved) notFound();
  return <OffersSelectionPage selection={resolved} />;
}
