import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "rabanne-lady-million-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Rabanne Lady Million : avis et où l’acheter",
  description:
    "Rabanne Lady Million Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon diamant.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LadyMillionProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Rabanne"
      name="Lady Million Eau de Parfum"
      image="/images/products/rabanne-lady-million-eau-de-parfum.png"
      imageAlt="Flacon diamant doré Rabanne Lady Million Eau de Parfum"
      lead="Un floral chypré solaire : néroli et framboise en ouverture, fleur d’oranger et jasmin au cœur, patchouli, miel et ambre en fond. Le flacon diamant doré est resté inchangé depuis 2010."
      offers={[
        {
          merchant: "Amazon",
          note: "Eau de parfum vaporisateur",
          href: "https://amzn.to/4wzuoUW",
        },
      ]}
    />
  );
}
