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
      offers={[
        {
          merchant: "Amazon",
          note: "Vaporisateur",
          href: "https://amzn.to/4pMSlWc",
        },
      ]}
    />
  );
}
