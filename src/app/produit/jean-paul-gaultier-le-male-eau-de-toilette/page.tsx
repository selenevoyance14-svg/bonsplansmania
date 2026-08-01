import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "jean-paul-gaultier-le-male-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Jean Paul Gaultier Le Male : avis et où l’acheter",
  description:
    "Jean Paul Gaultier Le Male Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LeMaleProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Jean Paul Gaultier"
      name="Le Male Eau de Toilette"
      image="/images/products/jean-paul-gaultier-le-male-eau-de-toilette.png"
      imageAlt="Flacon buste à la marinière Jean Paul Gaultier Le Male Eau de Toilette"
      lead="Menthe et lavande en tête, cannelle et fleur d’oranger au cœur, vanille et fève tonka en fond. Sorti en 1995, il a inventé le masculin sucré et n’a jamais quitté le top des ventes. Le flacon buste à la marinière est un objet en soi."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-jean-paul-gaultier-le-male-eau-de-toilette-homme-c000510",
        },
      ]}
    />
  );
}
