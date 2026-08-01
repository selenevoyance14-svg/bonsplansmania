import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "azzaro-the-most-wanted-eau-de-parfum-intense";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Azzaro The Most Wanted : avis et où l’acheter",
  description:
    "Azzaro The Most Wanted Eau de Parfum Intense : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function MostWantedProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Azzaro"
      name="The Most Wanted Eau de Parfum Intense"
      image="/images/products/azzaro-the-most-wanted-eau-de-parfum-intense.png"
      imageAlt="Flacon noir cranté Azzaro The Most Wanted Eau de Parfum Intense"
      lead="Cardamome et gingembre en ouverture, puis un accord de liqueur de bourbon et de bois ambrés, et une vanille de fond bien présente. Un gourmand boisé du soir, avec une projection qui ne passe pas inaperçue."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum intense vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-azzaro-the-most-wanted-eau-de-parfum-intense-homme-c067470",
        },
      ]}
    />
  );
}
