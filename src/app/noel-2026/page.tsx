import SeasonalHubPage, { seasonalMetadata } from "@/app/components/seasonal/SeasonalHubPage";
import type { Metadata } from "next";
export const metadata: Metadata = seasonalMetadata("noel-2026") as Metadata;
export default function Page() { return <SeasonalHubPage slug="noel-2026" />; }
