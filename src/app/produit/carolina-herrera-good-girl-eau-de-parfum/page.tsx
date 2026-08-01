import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "carolina-herrera-good-girl-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Carolina Herrera Good Girl : avis et où l’acheter",
  description:
    "Carolina Herrera Good Girl Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon escarpin.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function GoodGirlProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Carolina Herrera"
      name="Good Girl Eau de Parfum"
      image="/images/products/carolina-herrera-good-girl-eau-de-parfum.png"
      imageAlt="Flacon escarpin Carolina Herrera Good Girl Eau de Parfum"
      lead="Le contraste assumé : jasmin sambac et tubéreuse en pleine lumière, cacao, café et fève tonka dans l’ombre. Un parfum du soir, très tenace, dans le flacon escarpin qu’on reconnaît de loin."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-carolina-herrera-good-girl-eau-de-parfum-femme-c070804",
        },
      ]}
    />
  );
}
