import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "dior-miss-dior-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Dior Miss Dior : avis et où l’acheter",
  description:
    "Dior Miss Dior Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function MissDiorProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Dior"
      name="Miss Dior Eau de Parfum"
      image="/images/products/dior-miss-dior-eau-de-parfum.png"
      imageAlt="Flacon Dior Miss Dior Eau de Parfum et son nœud couture argenté"
      lead="Un bouquet de roses de Grasse porté par la pivoine et l’iris, adouci par le bois de santal et le musc blanc. Le flacon à nœud couture est devenu un classique du dressing, autant offert que porté."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-dior-miss-dior-eau-de-parfum-femme-c068266",
        },
      ]}
    />
  );
}
