import SeasonalHubPage, { seasonalMetadata } from "@/app/components/seasonal/SeasonalHubPage";
import type { Metadata } from "next";
export const metadata: Metadata = seasonalMetadata("halloween-2026") as Metadata;
export default function Page() { return <SeasonalHubPage slug="halloween-2026" />; }
