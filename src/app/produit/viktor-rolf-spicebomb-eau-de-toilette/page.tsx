import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "viktor-rolf-spicebomb-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Viktor & Rolf Spicebomb : avis et où l’acheter",
  description:
    "Viktor & Rolf Spicebomb Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function SpicebombProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Viktor & Rolf"
      name="Spicebomb Eau de Toilette"
      image="/images/products/viktor-rolf-spicebomb-eau-de-toilette.png"
      imageAlt="Flacon grenade Viktor & Rolf Spicebomb Eau de Toilette"
      lead="Poivre rose et bergamote en tête, un cœur de piment, de safran et de paprika, puis tabac, cuir et vétiver. Un épicé franc, taillé pour l’hiver, dans un flacon en forme de grenade qu’on repère à trois mètres."
      idealFor={["Amateurs de parfums épicés", "Saison fraîche", "Parfum de soirée"]}
      strengths={["Signature épicée reconnaissable", "Flacon original", "Sillage affirmé"]}
      watchOut={["Peut sembler puissant en journée", "À tester si vous êtes sensible aux notes épicées", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : Spicebomb convient surtout aux personnes qui recherchent un parfum masculin épicé, chaleureux et marqué. Son caractère affirmé le rend particulièrement adapté à l’automne, à l’hiver et aux sorties."
      offers={[
        {
          merchant: "News Parfums",
          note: "Eau de toilette vaporisateur",
          price: "58,10 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Fviktor-and-rolf-parfums%2F6345--viktor-rolf-spicebomb-eau-de-toilette-vapo50ml--3605521515629.html",
        },
      ]}
    />
  );
}
