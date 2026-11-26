import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "https://bonsplansmania.fr/marques-partenaires" },
};

export default function MarquesPage() {
  permanentRedirect("/marques-partenaires");
}
