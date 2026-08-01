import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "rabanne-1-million-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Rabanne 1 Million : avis et où l’acheter",
  description:
    "Rabanne 1 Million Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function UnMillionProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Rabanne"
      name="1 Million Eau de Toilette"
      image="/images/products/rabanne-1-million-eau-de-toilette.png"
      imageAlt="Flacon lingot doré Rabanne 1 Million Eau de Toilette"
      lead="Pamplemousse et menthe en ouverture, un cœur de rose et de cannelle, puis cuir, ambre et bois blancs. Un parfum qui ne cherche pas la discrétion, dans son flacon lingot devenu un classique du rayon."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-rabanne-1-million-eau-de-toilette-homme-c000282",
        },
      ]}
    />
  );
}
