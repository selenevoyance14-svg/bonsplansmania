import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "kayali-yum-boujee-marshmallow-81";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Kayali Yum Boujee Marshmallow 81 : avis et où l’acheter",
  description:
    "Kayali Yum Boujee Marshmallow 81 Eau de Parfum Intense : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon 10 ml.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function KayaliYumBoujeeMarshmallowProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Kayali"
      name="Yum Boujee Marshmallow 81 Eau de Parfum Intense"
      image="/images/products/kayali-yum-boujee-marshmallow-81.png"
      imageAlt="Flacon Kayali Yum Boujee Marshmallow 81 Eau de Parfum Intense 10 ml"
      lead="Le gourmand assumé de la maison de Mona Kattan : guimauve rose et vanille fouettée sur un départ fruité de pomme Pink Lady et de citron italien. Un sillage sucré, lacté et tenace, dans un format 10 ml qui se glisse dans un sac."
      offers={[
        {
          merchant: "Amazon",
          note: "Flacon 10 ml",
          href: "https://amzn.to/3TzJ8Vh",
        },
      ]}
    />
  );
}
