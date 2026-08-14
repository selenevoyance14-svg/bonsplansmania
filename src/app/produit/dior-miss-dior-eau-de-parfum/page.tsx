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
      idealFor={["Les amateurs de parfums floraux", "Les personnes qui apprécient la rose et la pivoine", "Un parfum féminin élégant pour le quotidien ou une occasion"]}
      strengths={["Bouquet de rose, pivoine, iris et muguet", "Fond de bois tendres", "Format 30 ml"]}
      watchOut={["Le bouquet floral peut sembler trop poudré si vous préférez les parfums très frais", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : Miss Dior Eau de Parfum convient surtout aux personnes qui recherchent un floral élégant et enveloppant. La rose et la pivoine dominent, accompagnées par l’iris, le muguet et un fond boisé plus doux."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 30 ml",
          price: "86,90 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-dior-miss-dior-eau-de-parfum-femme-c068266",
        },
      ]}
    />
  );
}
