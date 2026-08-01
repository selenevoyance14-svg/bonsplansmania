import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "viktor-rolf-spicebomb-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Viktor & Rolf Spicebomb : avis et où l’acheter",
  description:
    "Viktor & Rolf Spicebomb Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function SpicebombProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Viktor & Rolf"
      name="Spicebomb Eau de Toilette"
      image="/images/products/viktor-rolf-spicebomb-eau-de-toilette.png"
      imageAlt="Flacon grenade Viktor & Rolf Spicebomb Eau de Toilette"
      lead="Poivre rose et bergamote en tête, un cœur de piment, de safran et de paprika, puis tabac, cuir et vétiver. Un épicé franc, taillé pour l’hiver, dans un flacon en forme de grenade qu’on repère à trois mètres."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-viktor-rolf-spicebomb-eau-de-toilette-homme-c000307",
        },
      ]}
    />
  );
}
