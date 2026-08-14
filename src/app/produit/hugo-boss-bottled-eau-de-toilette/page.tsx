import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "hugo-boss-bottled-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Hugo Boss Bottled : avis et où l’acheter",
  description:
    "Hugo Boss Boss Bottled Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BossBottledProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Hugo Boss"
      name="Boss Bottled Eau de Toilette"
      image="/images/products/hugo-boss-bottled-eau-de-toilette.png"
      imageAlt="Flacon Hugo Boss Boss Bottled Eau de Toilette"
      lead="Pomme et bergamote en tête, cannelle et œillet au cœur, santal et vétiver en fond. Le boisé épicé passe-partout par excellence : il se porte au bureau sans jamais gêner personne, ce qui explique sa longévité depuis 1998."
      idealFor={["Les amateurs de parfums boisés et épicés", "Un parfum masculin facile à porter au quotidien", "Les personnes qui apprécient la pomme et la cannelle"]}
      strengths={["Ouverture fruitée à la pomme", "Accord boisé et épicé", "Profil polyvalent"]}
      watchOut={["Sa tonalité chaude peut moins convenir en plein été", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : Boss Bottled convient surtout à celles et ceux qui recherchent un parfum masculin boisé, épicé et facile à porter. La pomme apporte une ouverture fruitée, tandis que la cannelle, le santal et le vétiver donnent un fond plus chaleureux."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette vaporisateur 30 ml",
          price: "64,90 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-boss-boss-bottled-eau-de-toilette-homme-c000460",
        },
      ]}
    />
  );
}
