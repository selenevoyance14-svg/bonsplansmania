import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "guerlain-la-petite-robe-noire-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Guerlain La Petite Robe Noire : avis et où l’acheter",
  description:
    "Guerlain La Petite Robe Noire Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function PetiteRobeNoireProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Guerlain"
      name="La Petite Robe Noire Eau de Parfum"
      image="/images/products/guerlain-la-petite-robe-noire-eau-de-parfum.png"
      imageAlt="Flacon Guerlain La Petite Robe Noire Eau de Parfum au bouchon cœur"
      lead="Une cerise noire gourmande adossée à la rose et à l’amande, sur un fond de patchouli et de fève tonka. Le flacon au bouchon cœur et à la silhouette dessinée est l’un des plus reconnaissables du rayon."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-guerlain-la-petite-robe-noire-eau-de-parfum-femme-c001009",
        },
      ]}
    />
  );
}
