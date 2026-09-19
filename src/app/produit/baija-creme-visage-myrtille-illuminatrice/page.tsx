import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-creme-visage-myrtille-illuminatrice";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Crème visage Baïja Myrtille : avis et prix",
  description:
    "Prix vérifié et avis sur la crème visage fouettée Baïja à la myrtille : formule, bienfaits, utilisation et évolution du tarif.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Baïja"
      name="Crème Visage Fouettée Myrtille"
      image="/images/products/baija-creme-myrtille-visage.webp"
      imageAlt="Crème visage fouettée Baïja à l’extrait de myrtille"
      lead="Cette crème fouettée Baïja associe extrait de myrtille, huiles de sésame et de tournesol. La marque la présente comme un soin quotidien hydratant, adoucissant et illuminateur pour les peaux en manque d’éclat."
      idealFor={[
        "Peaux ternes ou matures",
        "Besoin d’hydratation et d’éclat",
        "Application matin et soir sur le visage et le cou",
      ]}
      strengths={[
        "Extrait de myrtille riche en antioxydants",
        "Texture fouettée légère",
        "98 % d’ingrédients d’origine naturelle annoncés",
        "73 % des testeurs ont constaté davantage d’éclat après 28 jours selon Baïja",
      ]}
      watchOut={[
        "Le prix officiel est passé de 29,90 € le 14 août à 30,90 € le 19 septembre 2026",
        "La formule contient du parfum et plusieurs allergènes parfumants",
        "Ce soin hydratant ne remplace pas une protection solaire",
      ]}
      editorialNote="Notre avis : une crème cohérente pour une peau normale à sèche qui recherche surtout du confort et de la luminosité. Le tarif a augmenté de 1 € depuis notre précédent relevé : il n’y a donc pas de baisse de prix à signaler actuellement."
      offers={[
        {
          merchant: "Baïja",
          note: "Crème Visage Fouettée à l’extrait de myrtille — boutique officielle, disponible",
          price: "30,90 €",
          checkedAt: "2026-09-19",
          href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fcreme-fondante-visage-myrtille-illuminatrice",
        },
      ]}
    />
  );
}
