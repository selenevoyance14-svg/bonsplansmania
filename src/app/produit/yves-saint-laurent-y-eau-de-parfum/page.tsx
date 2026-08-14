import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "yves-saint-laurent-y-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Yves Saint Laurent Y : avis et où l’acheter",
  description:
    "Yves Saint Laurent Y Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function YProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Yves Saint Laurent"
      name="Y Eau de Parfum"
      image="/images/products/yves-saint-laurent-y-eau-de-parfum.png"
      imageAlt="Flacon dégradé bleu Yves Saint Laurent Y Eau de Parfum"
      lead="Bergamote et gingembre sur un cœur de sauge sclarée et de genévrier, puis un fond de fève tonka, de cèdre et d’ambre gris. Plus propre et plus net que la plupart des boisés du rayon, sans être fade."
      idealFor={["Les amateurs de parfums frais et boisés", "Un parfum masculin polyvalent", "Les personnes qui apprécient la sauge et le gingembre"]}
      strengths={["Ouverture fraîche à la bergamote et au gingembre", "Fond boisé et ambré", "Eau de parfum facile à porter"]}
      watchOut={["La fève tonka peut apporter une douceur marquée", "La tenue et le sillage varient selon la peau"]}
      editorialNote="Notre avis : Y Eau de Parfum convient aux personnes qui recherchent un parfum masculin frais, boisé et moderne. Le gingembre et la bergamote donnent de l’éclat, tandis que la sauge, le cèdre et la fève tonka apportent davantage de profondeur."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 60 ml",
          price: "103,90 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-yves-saint-laurent-y-eau-de-parfum-homme-c042882",
        },
      ]}
    />
  );
}
