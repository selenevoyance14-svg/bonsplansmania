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
      idealFor={["Les amateurs de parfums gourmands et orientaux", "Les personnes qui apprécient la poire et la vanille", "Un parfum féminin chaleureux pour le soir"]}
      strengths={["Accord fruité et vanillé facile à reconnaître", "Fond boisé au santal", "Format 30 ml"]}
      watchOut={["Le sillage sucré peut ne pas convenir si vous préférez les parfums très frais", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : La Belle convient surtout aux personnes qui aiment les parfums féminins gourmands, fruités et enveloppants. La poire apporte une ouverture juteuse, puis la vanille et le bois de santal donnent un fond plus chaud."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 30 ml",
          price: "77,50 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-jean-paul-gaultier-la-belle-eau-de-parfum-femme-c059722",
        },
      ]}
    />
  );
}
