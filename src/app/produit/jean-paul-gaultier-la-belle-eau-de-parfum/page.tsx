import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "jean-paul-gaultier-la-belle-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Jean Paul Gaultier La Belle : avis et où l’acheter",
  description:
    "Jean Paul Gaultier La Belle Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LaBelleProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Jean Paul Gaultier"
      name="La Belle Eau de Parfum"
      image="/images/products/jean-paul-gaultier-la-belle-eau-de-parfum.png"
      imageAlt="Flacon buste Jean Paul Gaultier La Belle Eau de Parfum"
      lead="Trois notes, pas une de plus : poire juteuse, vanille et bois de santal. Une formule volontairement simple qui donne un sillage sucré et lumineux, dans le flacon buste orné de roses dorées."
      offers={[
        {
          merchant: "Perfume’s Club",
          note: "Eau de parfum vaporisateur",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Fjean-paul-gaultier%2Fla-belle-eau-de-parfum-vaporisateur%2Fp_17244%2F",
        },
      ]}
    />
  );
}
