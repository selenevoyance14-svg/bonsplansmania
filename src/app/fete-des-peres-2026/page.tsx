import SeasonalHubPage, { seasonalMetadata } from "@/app/components/seasonal/SeasonalHubPage";
import type { Metadata } from "next";
export const metadata: Metadata = seasonalMetadata("fete-des-peres-2026") as Metadata;
export default function Page() { return <SeasonalHubPage slug="fete-des-peres-2026" />; }
