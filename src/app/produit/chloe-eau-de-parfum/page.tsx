import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "chloe-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Chloé Eau de Parfum : avis et où l’acheter",
  description:
    "Chloé Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon au ruban.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function ChloeProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Chloé"
      name="Chloé Eau de Parfum"
      image="/images/products/chloe-eau-de-parfum.png"
      imageAlt="Flacon Chloé Eau de Parfum et son ruban beige"
      lead="La rose, mais sans la lourdeur : pivoine et litchi en ouverture, un cœur de rose fraîche, un fond d’ambre et de cèdre. Un floral propre et facile à porter, reconnaissable à son ruban noué."
      offers={[
        {
          merchant: "LookFantastic",
          note: "Flacon 50 ml",
          href: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fp%2Fchloe-eau-de-parfum-for-her-50ml%2F11079307%2F",
        },
      ]}
    />
  );
}
