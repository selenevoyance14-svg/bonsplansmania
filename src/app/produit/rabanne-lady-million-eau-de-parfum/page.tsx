import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "rabanne-lady-million-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Lady Million Rabanne : avis, notes et prix",
  description:
    "Lady Million Eau de Parfum Rabanne : avis sur ses notes de framboise, jasmin, fleur d’oranger, miel et patchouli, avec les prix vérifiés.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LadyMillionProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Rabanne"
      name="Lady Million Eau de Parfum"
      image="/images/products/rabanne-lady-million-eau-de-parfum.png"
      imageAlt="Flacon diamant doré Rabanne Lady Million Eau de Parfum"
      lead="Un floral chypré solaire : néroli et framboise en ouverture, fleur d’oranger et jasmin au cœur, patchouli, miel et ambre en fond. Le flacon diamant doré est resté inchangé depuis 2010."
      idealFor={["Les amateurs de parfums floraux fruités", "Les personnes qui apprécient la fleur d’oranger et le jasmin", "Un parfum féminin affirmé pour le soir"]}
      strengths={["Une ouverture fraîche de néroli et de framboise", "Un cœur solaire de jasmin et de fleur d’oranger", "Trois formats disponibles : 30, 50 et 80 ml"]}
      watchOut={["Son fond miellé peut sembler trop opulent si vous préférez les parfums légers", "Ne pas le confondre avec Lady Million Royal ou Million Gold for Her", "Le 30 ml coûte moins cher à l’achat, mais le 80 ml est plus avantageux au millilitre"]}
      editorialNote="Notre avis : Lady Million convient surtout aux personnes qui recherchent un parfum féminin floral, fruité et opulent. Parmi les prix vérifiés, le flacon de 80 ml offre le meilleur rapport quantité-prix, tandis que le 30 ml reste le choix le moins cher pour découvrir le parfum."
      offers={[
        {
          merchant: "News Parfums",
          note: "Eau de parfum vaporisateur 30 ml",
          price: "48,76 €",
          checkedAt: "2026-09-19",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Frabanne-parfum%2F4290-lady-million-eau-de-parfum-3349668508471.html",
        },
        {
          merchant: "News Parfums",
          note: "Eau de parfum vaporisateur 50 ml",
          price: "68,87 €",
          checkedAt: "2026-09-19",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Frabanne-parfum%2F4290-lady-million-eau-de-parfum-3349668508471.html",
        },
        {
          merchant: "News Parfums",
          note: "Eau de parfum vaporisateur 80 ml",
          price: "87,13 €",
          checkedAt: "2026-09-19",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Frabanne-parfum%2F4290-lady-million-eau-de-parfum-3349668508471.html",
        },
      ]}
    />
  );
}
