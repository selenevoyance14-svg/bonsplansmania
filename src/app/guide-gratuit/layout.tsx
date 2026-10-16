import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide gratuit : 96 liens pour tester des produits | BonsPlansMania",
  description:
    "Téléchargez notre guide PDF gratuit : 96 liens uniques vers des plateformes et programmes de tests, plus 10 conseils pour mieux candidater.",
  alternates: { canonical: "https://bonsplansmania.fr/guide-gratuit" },
  openGraph: {
    title: "Guide gratuit : 96 liens pour tester des produits",
    description:
      "13 pages, 96 liens uniques et 10 conseils pour améliorer vos candidatures aux tests de produits.",
    type: "website",
    url: "https://bonsplansmania.fr/guide-gratuit",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
