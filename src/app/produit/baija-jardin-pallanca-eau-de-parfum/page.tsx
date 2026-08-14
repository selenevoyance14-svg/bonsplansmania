import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-jardin-pallanca-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Baïja Jardin Pallanca : avis et prix du parfum",
  description:
    "Baïja Jardin Pallanca Eau de Parfum 15 ml : notre avis, ses notes de cassis, jasmin et muscs blancs, son prix vérifié et où l’acheter.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BaijaJardinPallancaProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Baïja"
      name="Jardin Pallanca Eau de Parfum 15 ml"
      image="/images/products/baija-jardin-pallanca-eau-de-parfum-15ml.webp"
      imageAlt="Flacon Baïja Jardin Pallanca Eau de Parfum 15 ml"
      lead="Jardin Pallanca est une eau de parfum Baïja au profil pétillant, frais et fruité. Son petit format de 15 ml se glisse facilement dans un sac pour accompagner le quotidien ou les voyages."
      idealFor={["Les personnes qui aiment les parfums fruités et frais", "Un parfum léger à porter au quotidien", "Un petit format facile à emporter"]}
      strengths={["Accord cassis, jasmin et muscs blancs", "Format nomade de 15 ml", "Fabrication française annoncée par Baïja"]}
      watchOut={["Le format 15 ml est plus petit qu’un flacon classique", "La tenue et le rendu d’un parfum varient selon la peau"]}
      editorialNote="Notre avis : Jardin Pallanca convient surtout à celles qui recherchent une fragrance fraîche, fruitée et facile à porter. Le cassis apporte un départ pétillant, le jasmin adoucit le cœur et les muscs blancs donnent un fond propre et discret."
      offers={[
        {
          merchant: "Baïja",
          note: "Eau de Parfum Jardin Pallanca 15 ml — boutique officielle",
          price: "19,90 €",
          checkedAt: "2026-08-14",
          href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fl-irresistible-eau-de-parfum-jardin-pallanca",
        },
      ]}
    />
  );
}
