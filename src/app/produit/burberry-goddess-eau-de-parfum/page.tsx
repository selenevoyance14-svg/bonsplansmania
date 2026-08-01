import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "burberry-goddess-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Burberry Goddess : avis et où l’acheter",
  description:
    "Burberry Goddess Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon rechargeable.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BurberryGoddessProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Burberry"
      name="Goddess Eau de Parfum"
      image="/images/products/burberry-goddess-eau-de-parfum.png"
      imageAlt="Flacon doré Burberry Goddess Eau de Parfum"
      lead="Une vanille en trois textures — infusée, crémeuse et brûlée — relevée par la lavande et le cacao. Le gourmand le plus commenté de ces dernières années, dans un flacon rechargeable."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-burberry-goddess-eau-de-parfum-femme-c073665",
        },
      ]}
    />
  );
}
