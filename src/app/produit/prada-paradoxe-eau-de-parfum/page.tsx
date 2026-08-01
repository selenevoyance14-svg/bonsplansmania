import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "prada-paradoxe-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Prada Paradoxe : avis et où l’acheter",
  description:
    "Prada Paradoxe Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon triangle.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function ParadoxeProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Prada"
      name="Paradoxe Eau de Parfum"
      image="/images/products/prada-paradoxe-eau-de-parfum.png"
      imageAlt="Flacon triangle Prada Paradoxe Eau de Parfum"
      lead="Un floral ambré construit autour du néroli, de la fleur de jasmin et d’un fond de musc et d’ambre. Portable au quotidien, plus discret que les gourmands du moment, dans le flacon triangle rechargeable de la maison."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-prada-paradoxe-eau-de-parfum-femme-c071661",
        },
      ]}
    />
  );
}
