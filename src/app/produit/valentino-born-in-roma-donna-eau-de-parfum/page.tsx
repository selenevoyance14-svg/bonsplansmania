import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "valentino-born-in-roma-donna-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Valentino Born in Roma Donna : avis et où l’acheter",
  description:
    "Valentino Donna Born in Roma Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BornInRomaProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Valentino"
      name="Donna Born in Roma Eau de Parfum"
      image="/images/products/valentino-born-in-roma-donna-eau-de-parfum.png"
      imageAlt="Flacon clouté Valentino Donna Born in Roma Eau de Parfum"
      lead="Un floral boisé qui joue sur le contraste : jasmin sambac et bourgeon de cassis en tête, vanille bourbon et bois de cèdre en fond. Le flacon clouté rose reprend les studs emblématiques de la maison."
      idealFor={["Les amateurs de parfums floraux orientaux et boisés", "Les personnes qui apprécient le jasmin et la vanille", "Un parfum féminin élégant pour le quotidien ou le soir"]}
      strengths={["Trio de jasmin lumineux", "Fond de vanille Bourbon", "Format 30 ml"]}
      watchOut={["La vanille peut sembler trop présente si vous préférez les parfums très frais", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : Donna Born in Roma convient surtout aux personnes qui recherchent un parfum féminin floral, boisé et vanillé. Le jasmin apporte une dimension lumineuse, tandis que la vanille Bourbon et les bois ambrés créent un fond plus chaleureux."
      offers={[
        {
          merchant: "News Parfums",
          note: "Eau de parfum vaporisateur 30 ml",
          price: "54,37 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Fvalentino-parfums%2F40352-donna-born-in-roma-eau-de-parfum-3614272761421.html%23",
        },
      ]}
    />
  );
}
