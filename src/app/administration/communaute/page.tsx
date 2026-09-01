import type { Metadata } from "next";
import CommunityModeration from "@/app/components/CommunityModeration";

export const metadata: Metadata = { title: "Modération de la communauté", robots: { index: false, follow: false, noarchive: true } };
export default function CommunityAdministrationPage() { return <CommunityModeration />; }
