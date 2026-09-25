import type { Metadata } from "next";
import LegacyArchiveNotice from "../LegacyArchiveNotice";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Archives des bons plans terminés",
  description: "Les anciens bons plans sont désormais réunis dans l’archive générale de Bons Plans Mania.",
  alternates: { canonical: "https://bonsplansmania.fr/archives" },
  robots: { index: false, follow: true },
};

export default function BonsPlansArchivesPage() {
  return <LegacyArchiveNotice title="Archives des bons plans" />;
}
