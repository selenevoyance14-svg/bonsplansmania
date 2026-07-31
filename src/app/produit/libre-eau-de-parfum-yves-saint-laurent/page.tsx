import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "libre-eau-de-parfum-yves-saint-laurent";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Libre Yves Saint Laurent : avis et où l’acheter",
  description:
    "Libre Eau de Parfum 50 ml d’Yves Saint Laurent : notre présentation, les avis de la communauté Bons Plans Mania et où trouver le flacon.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LibreProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Yves Saint Laurent"
      name="Libre Eau de Parfum"
      image="/images/products/ysl-libre-eau-de-parfum-50ml-officiel.png"
      imageAlt="Flacon Libre Eau de Parfum 50 ml d’Yves Saint Laurent"
      lead="Une lavande florale moderne où la fraîcheur aromatique rencontre la sensualité de la fleur d’oranger. Une signature affirmée, lumineuse et chaleureuse."
      offers={[
        {
          merchant: "Perfume’s Club",
          note: "Flacon 50 ml",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Fyves-saint-laurent%2Flibre-eau-de-parfum-vaporisateur%2Fp_48401%2F",
        },
      ]}
    />
  );
}
