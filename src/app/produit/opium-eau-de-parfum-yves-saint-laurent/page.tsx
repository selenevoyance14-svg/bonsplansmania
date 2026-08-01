import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "opium-eau-de-parfum-yves-saint-laurent";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Opium Yves Saint Laurent : avis et où l’acheter",
  description:
    "Opium Eau de Parfum d’Yves Saint Laurent : notre présentation, les avis de la communauté Bons Plans Mania et où trouver le flacon 50 ml.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function OpiumProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Yves Saint Laurent"
      name="Opium Eau de Parfum"
      image="/images/products/opium-eau-de-parfum-yves-saint-laurent.png"
      imageAlt="Flacon Opium Eau de Parfum 50 ml d’Yves Saint Laurent"
      lead="Un parfum oriental au caractère chaleureux et épicé, l’un des sillages les plus reconnaissables de la parfumerie. Cette fiche réunit les expériences de la communauté et les bons plans actifs."
      offers={[
        {
          merchant: "Perfume’s Club",
          note: "Flacon 50 ml",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Fyves-saint-laurent%2Fopium-eau-de-parfum-vaporisateur%2Fp_44520%2F",
        },
      ]}
    />
  );
}
