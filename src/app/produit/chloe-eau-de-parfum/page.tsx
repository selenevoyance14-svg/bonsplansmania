import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "chloe-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Chloé Eau de Parfum : avis, notes et prix",
  description:
    "Chloé Eau de Parfum : avis sur ses notes de rose, pivoine, magnolia, ambre et cèdre, avec le prix du flacon 50 ml vérifié.",
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
      idealFor={["Amateurs de parfums floraux", "Personnes appréciant la rose fraîche", "Usage quotidien"]}
      strengths={["Un floral facile à porter au quotidien", "Une rose équilibrée par le magnolia, l’ambre et le cèdre", "Une réduction de 23 € actuellement sur le flacon 50 ml"]}
      watchOut={["Peut sembler trop floral si vous préférez les parfums gourmands", "Ne pas le confondre avec Chloé Eau de Parfum Intense ou Lumineuse", "Le code SHOP est annoncé sur la fiche, mais son prix final doit être vérifié dans le panier"]}
      editorialNote="Notre avis : Chloé Eau de Parfum convient aux personnes qui recherchent un floral féminin, propre et élégant. La promotion actuelle sur le 50 ml est intéressante : le prix affiché passe de 112,70 € à 89,70 €, soit 20 % de réduction."
      offers={[
        {
          merchant: "LookFantastic",
          note: "Flacon 50 ml",
          price: "89,70 €",
          checkedAt: "2026-09-19",
          offer: "-20 %, soit 23 € de réduction sur le prix de vente de 112,70 €",
          href: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fp%2Fchloe-eau-de-parfum-for-her-50ml%2F11079307%2F",
        },
      ]}
    />
  );
}
