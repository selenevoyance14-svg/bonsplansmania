import type { Metadata } from "next";
import LegacyArchiveNotice from "../LegacyArchiveNotice";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Archives des tests produits terminés",
  description: "Les anciennes campagnes de tests produits sont désormais réunies dans l’archive générale de Bons Plans Mania.",
  alternates: { canonical: "https://bonsplansmania.fr/archives" },
  robots: { index: false, follow: true },
};

export default function TestsProduitsArchivesPage() {
  return <LegacyArchiveNotice title="Archives des tests produits" />;
}
