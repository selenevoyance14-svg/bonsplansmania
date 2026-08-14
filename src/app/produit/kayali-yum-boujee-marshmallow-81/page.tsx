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
      idealFor={["Les amateurs de parfums floraux très gourmands", "Les personnes qui apprécient la fraise, la guimauve et la vanille", "Un parfum sucré à porter seul ou en superposition"]}
      strengths={["Accord gourmand immédiatement reconnaissable", "Mélange de fraise, guimauve rose et vanille fouettée", "Format voyage 10 ml facile à emporter"]}
      watchOut={["Son caractère très sucré peut ne pas convenir si vous préférez les parfums frais ou discrets", "La tenue et le rendu varient selon la peau"]}
      editorialNote="Notre avis : Yum Boujee Marshmallow 81 convient surtout aux personnes qui recherchent un parfum gourmand, fruité et très sucré. La fraise et la guimauve dominent le cœur, tandis que la vanille fouettée et le musc rose donnent un fond plus doux et enveloppant."
      offers={[
        {
          merchant: "Amazon",
          note: "Flacon 10 ml",
          href: "https://amzn.to/3TzJ8Vh",
        },
        {
          merchant: "KAYALI",
          note: "Eau de parfum 10 ml Travel Spray",
          price: "25,00 €",
          checkedAt: "2026-08-14",
          href: "https://kayali.com/en-fr/products/yum-boujee-marshmallow-81?variant=44390614761609",
        },
      ]}
    />
  );
}
