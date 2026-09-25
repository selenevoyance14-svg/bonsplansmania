import type { Metadata } from "next";
import LegacyArchiveNotice from "../LegacyArchiveNotice";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Archives des jeux concours terminés",
  description: "Les anciens jeux concours sont désormais réunis dans l’archive générale de Bons Plans Mania.",
  alternates: { canonical: "https://bonsplansmania.fr/archives" },
  robots: { index: false, follow: true },
};

export default function ConcoursArchivesPage() {
  return <LegacyArchiveNotice title="Archives des concours" />;
}
