import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "terre-d-hermes-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Terre d’Hermès : avis et où l’acheter",
  description:
    "Hermès Terre d’Hermès Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function TerreDHermesProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Hermès"
      name="Terre d’Hermès Eau de Toilette"
      image="/images/products/terre-d-hermes-eau-de-toilette.png"
      imageAlt="Flacon Hermès Terre d’Hermès Eau de Toilette"
      lead="Orange et pamplemousse sur une note minérale de silex, un cœur poivré et un fond de vétiver, de cèdre et de benjoin. Composé par Jean-Claude Ellena en 2006, c’est le plus sobre de cette sélection, et le plus facile à porter au quotidien."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-hermes-terre-d-hermes-eau-de-toilette-homme-c016961",
        },
      ]}
    />
  );
}
