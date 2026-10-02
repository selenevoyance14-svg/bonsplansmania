import type { Metadata } from "next";
import RefontePreviewContent from "./RefontePreviewContent";

export const metadata: Metadata = {
  title: "Aperçu de la page d’accueil",
  alternates: { canonical: "https://bonsplansmania.fr" },
  robots: { index: false, follow: true },
};

export default function RefontePreviewPage() {
  return <RefontePreviewContent />;
}
