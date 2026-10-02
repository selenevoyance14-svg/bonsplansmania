import { notFound } from "next/navigation";
import RefontePreviewContent from "@/app/refonte-preview/RefontePreviewContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ n: "2" }, { n: "3" }];
}

export default async function PaginatedHomePage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const page = Number(n);

  if (page !== 2 && page !== 3) notFound();

  return <RefontePreviewContent page={page} />;
}
