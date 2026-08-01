import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "yves-saint-laurent-y-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Yves Saint Laurent Y : avis et où l’acheter",
  description:
    "Yves Saint Laurent Y Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function YProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Yves Saint Laurent"
      name="Y Eau de Parfum"
      image="/images/products/yves-saint-laurent-y-eau-de-parfum.png"
      imageAlt="Flacon dégradé bleu Yves Saint Laurent Y Eau de Parfum"
      lead="Bergamote et gingembre sur un cœur de sauge sclarée et de genévrier, puis un fond de fève tonka, de cèdre et d’ambre gris. Plus propre et plus net que la plupart des boisés du rayon, sans être fade."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-yves-saint-laurent-y-eau-de-parfum-homme-c042882",
        },
      ]}
    />
  );
}
