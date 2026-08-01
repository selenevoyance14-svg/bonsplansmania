import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "valentino-born-in-roma-donna-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Valentino Born in Roma Donna : avis et où l’acheter",
  description:
    "Valentino Donna Born in Roma Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BornInRomaProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Valentino"
      name="Donna Born in Roma Eau de Parfum"
      image="/images/products/valentino-born-in-roma-donna-eau-de-parfum.png"
      imageAlt="Flacon clouté Valentino Donna Born in Roma Eau de Parfum"
      lead="Un floral boisé qui joue sur le contraste : jasmin sambac et bourgeon de cassis en tête, vanille bourbon et bois de cèdre en fond. Le flacon clouté rose reprend les studs emblématiques de la maison."
      offers={[
        {
          merchant: "Amazon",
          note: "Eau de parfum vaporisateur",
          href: "https://amzn.to/4fwRRjE",
        },
      ]}
    />
  );
}
