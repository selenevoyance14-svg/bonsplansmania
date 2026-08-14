import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "nuxe-prodigieux-le-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Nuxe Prodigieux Le Parfum : avis et où l’acheter",
  description:
    "Nuxe Prodigieux Le Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function ProdigieuxProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Nuxe"
      name="Prodigieux Le Parfum"
      image="/images/products/nuxe-prodigieux-le-parfum.png"
      imageAlt="Flacon Nuxe Prodigieux Le Parfum au dégradé orangé"
      lead="L’odeur de l’Huile Prodigieuse transposée en parfum : fleur d’oranger, magnolia et vanille sur un fond de bois de coco. Un solaire doux qui sent les vacances, sans l’effet monoï trop appuyé."
      idealFor={[
        "Les personnes qui aiment les parfums solaires et vanillés",
        "Les adeptes de l’odeur de l’Huile Prodigieuse",
        "Un parfum facile à emporter grâce au format 30 ml",
      ]}
      strengths={["Accord fleur d’oranger, magnolia et vanille", "Sillage chaud et solaire", "Flacon compact de 30 ml"]}
      watchOut={["La vanille peut sembler trop présente si vous préférez les parfums très frais", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : Nuxe Prodigieux Le Parfum convient surtout aux personnes qui apprécient les senteurs solaires, florales et vanillées. Il reprend l’univers olfactif de l’Huile Prodigieuse dans un parfum chaleureux qui évoque facilement l’été et les vacances."
      offers={[
        {
          merchant: "Atida",
          note: "Eau de parfum 30 ml",
          price: "25,99 €",
          checkedAt: "2026-08-14",
          href: "https://nwq.atida.fr/?P512F8957CD2D1F1&redir=https%3A%2F%2Fwww.atida.fr%2Fnuxe-prodigieux-le-parfum-30ml.html%3Fmsclkid%3Db190adcc3f4216533c9ac7b33fcf4054%26utm_source%3Dbing%26utm_medium%3Dcpc%26utm_campaign%3Dint_fr_atida_shopping_bing_long_medium%26utm_term%3D4584001470394067%26utm_content%3DLong%2520Medium",
        },
      ]}
    />
  );
}
