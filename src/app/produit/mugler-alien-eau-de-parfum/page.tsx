import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "mugler-alien-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Mugler Alien : avis et où l’acheter",
  description:
    "Mugler Alien Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon rechargeable.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function AlienProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Mugler"
      name="Alien Eau de Parfum"
      image="/images/products/mugler-alien-eau-de-parfum.png"
      imageAlt="Flacon violet et or Mugler Alien Eau de Parfum"
      lead="Trois notes seulement, et une signature reconnaissable entre mille : jasmin sambac, bois de cachemire et ambre blanc. L’un des sillages les plus tenaces du rayon, dans un flacon rechargeable en boutique."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-mugler-alien-eau-de-parfum-femme-c004361",
        },
      ]}
    />
  );
}
