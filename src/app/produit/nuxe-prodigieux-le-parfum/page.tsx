import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "nuxe-prodigieux-le-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Nuxe Prodigieux Le Parfum : avis, notes et prix",
  description:
    "Nuxe Prodigieux Le Parfum : avis sur ses notes de fleur d’oranger, magnolia, vanille et bois de coco, avec le prix du flacon 30 ml vérifié.",
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
      strengths={["Un accord solaire de fleur d’oranger, magnolia et vanille", "Une senteur proche de l’Huile Prodigieuse", "Un flacon compact de 30 ml facile à emporter"]}
      watchOut={["La vanille peut sembler trop présente si vous préférez les parfums très frais", "Ne pas le confondre avec l’Huile Prodigieuse ou Prodigieux Floral Le Parfum", "Le prix actuel est supérieur à celui relevé lors de notre précédente vérification"]}
      editorialNote="Notre avis : Nuxe Prodigieux Le Parfum convient surtout aux personnes qui apprécient les senteurs solaires, florales et vanillées. Attention au faux sentiment de promotion : le 30 ml est actuellement affiché à 27,99 €, contre 25,99 € lors de notre vérification du 14 août 2026."
      offers={[
        {
          merchant: "Atida",
          note: "Eau de parfum 30 ml",
          price: "27,99 €",
          checkedAt: "2026-09-19",
          offer: "Prix en hausse de 2 € depuis notre vérification du 14 août 2026",
          href: "https://nwq.atida.fr/?P512F8957CD2D1F1&redir=https%3A%2F%2Fwww.atida.fr%2Fnuxe-prodigieux-le-parfum-30ml.html%3Fmsclkid%3Db190adcc3f4216533c9ac7b33fcf4054%26utm_source%3Dbing%26utm_medium%3Dcpc%26utm_campaign%3Dint_fr_atida_shopping_bing_long_medium%26utm_term%3D4584001470394067%26utm_content%3DLong%2520Medium",
        },
      ]}
    />
  );
}
