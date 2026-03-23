import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide Gratuit : 100+ Sites pour Tester des Produits Gratuitement | BonsPlansMania",
  description:
    "Téléchargez gratuitement notre guide PDF de 13 pages : 100+ plateformes pour recevoir des produits gratuits chez vous. Sampleo, TRND, marques beauté et astuces.",
  alternates: { canonical: "https://bonsplansmania.fr/guide-gratuit" },
  openGraph: {
    title: "Guide Gratuit : 100+ Sites pour Tester des Produits Gratuitement",
    description:
      "13 pages, 100+ plateformes, 50+ marques beauté. Le guide le plus complet pour recevoir des produits gratuits.",
    type: "website",
    url: "https://bonsplansmania.fr/guide-gratuit",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
