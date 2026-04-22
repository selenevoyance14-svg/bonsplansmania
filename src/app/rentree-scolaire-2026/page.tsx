import SeasonalHubPage, { seasonalMetadata } from "@/app/components/seasonal/SeasonalHubPage";
import type { Metadata } from "next";
export const metadata: Metadata = seasonalMetadata("rentree-scolaire-2026") as Metadata;
export default function Page() { return <SeasonalHubPage slug="rentree-scolaire-2026" />; }
