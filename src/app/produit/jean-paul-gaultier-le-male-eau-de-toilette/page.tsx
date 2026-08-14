import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "jean-paul-gaultier-le-male-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Jean Paul Gaultier Le Male : avis et où l’acheter",
  description:
    "Jean Paul Gaultier Le Male Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LeMaleProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Jean Paul Gaultier"
      name="Le Male Eau de Toilette"
      image="/images/products/jean-paul-gaultier-le-male-eau-de-toilette.png"
      imageAlt="Flacon buste à la marinière Jean Paul Gaultier Le Male Eau de Toilette"
      lead="Menthe et lavande en tête, cannelle et fleur d’oranger au cœur, vanille et fève tonka en fond. Sorti en 1995, il a inventé le masculin sucré et n’a jamais quitté le top des ventes. Le flacon buste à la marinière est un objet en soi."
      idealFor={[
        "Les amateurs de parfums aromatiques et vanillés",
        "Les personnes qui apprécient les senteurs masculines gourmandes",
        "Un parfum reconnaissable pour la journée ou le soir",
      ]}
      strengths={["Accord menthe, lavande et vanille", "Sillage doux mais affirmé", "Flacon iconique en forme de buste"]}
      watchOut={["La vanille et la fève tonka peuvent sembler trop sucrées si vous préférez les parfums secs", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : Jean Paul Gaultier Le Male convient surtout aux personnes qui aiment les parfums masculins aromatiques, chaleureux et légèrement gourmands. La fraîcheur de la menthe et de la lavande équilibre la vanille, la cannelle et la fève tonka."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette 40 ml",
          price: "62,90 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-jean-paul-gaultier-le-male-eau-de-toilette-homme-c000510",
        },
      ]}
    />
  );
}
