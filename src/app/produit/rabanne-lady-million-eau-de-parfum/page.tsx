import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "rabanne-lady-million-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Rabanne Lady Million : avis et où l’acheter",
  description:
    "Rabanne Lady Million Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon diamant.",
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
      strengths={["Ouverture fraîche de néroli et de framboise", "Cœur de fleurs blanches", "Fond de miel et de patchouli"]}
      watchOut={["Son fond miellé peut sembler trop opulent si vous préférez les parfums légers", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : Lady Million convient surtout aux personnes qui recherchent un parfum féminin floral, fruité et opulent. Le néroli et la framboise apportent une ouverture vive, puis la fleur d’oranger, le jasmin, le miel et le patchouli composent un sillage plus chaleureux."
      offers={[
        {
          merchant: "News Parfums",
          note: "Eau de parfum vaporisateur 50 ml",
          price: "67,87 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Frabanne-parfum%2F4290-lady-million-eau-de-parfum-3349668508471.html",
        },
      ]}
    />
  );
}
