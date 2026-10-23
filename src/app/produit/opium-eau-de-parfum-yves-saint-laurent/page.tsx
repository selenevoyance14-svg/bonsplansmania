import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "opium-eau-de-parfum-yves-saint-laurent";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Opium YSL : avis, prix et notes du parfum",
  description:
    "Opium Eau de Parfum d’Yves Saint Laurent : notes de myrrhe, vanille et ambre, avis, formats et prix vérifiés chez plusieurs marchands.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function OpiumProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Yves Saint Laurent"
      name="Opium Eau de Parfum"
      image="/images/products/opium-eau-de-parfum-yves-saint-laurent.png"
      imageAlt="Flacon Opium Eau de Parfum d’Yves Saint Laurent"
      lead="Opium est un parfum ambré et épicé construit autour de la myrrhe, de la vanille, de l’ambre et du patchouli. Cette fiche compare les prix des formats disponibles et rassemble les avis de la communauté."
      idealFor={["Les amateurs de parfums ambrés, orientaux et épicés", "Les personnes qui apprécient les senteurs chaudes et enveloppantes", "Un parfum affirmé pour le soir et les saisons fraîches"]}
      strengths={["Accord ambré autour de la myrrhe", "Fond chaud de vanille, ambre et patchouli", "Formats 30, 50 et 90 ml selon les marchands"]}
      watchOut={["Ne pas confondre Opium avec Black Opium", "Son caractère intense peut sembler trop opulent si vous préférez les parfums légers", "Les prix et les disponibilités varient fortement selon la contenance", "L’offre Amazon est une eau de toilette 50 ml, différente de l’eau de parfum"]}
      editorialNote="Notre avis : Opium s’adresse surtout aux personnes qui recherchent un parfum ambré très affirmé. La myrrhe et les épices lui donnent davantage de caractère qu’un parfum gourmand classique. Comparez une même contenance et une même concentration : l’offre Amazon ajoutée ici est une eau de toilette 50 ml, tandis que YSL Beauté propose l’eau de parfum 50 ml à 96 € lors de notre vérification du 23 octobre 2026."
      offers={[
        {
          merchant: "Amazon — Eau de toilette",
          note: "Opium Eau de Toilette 50 ml : concentration différente de l’Eau de Parfum comparée chez YSL Beauté",
          offer: "Offre consultée le 23 octobre 2026 : achat ponctuel, vendu par Pluzen et expédié par Amazon. Livraison gratuite sur l’offre consultée. Le vendeur peut évoluer.",
          amazonAsin: "B073VMFK2L",
          href: "/go/opium-edt-50ml-amazon",
        },
        {
          merchant: "YSL Beauté",
          note: "Eau de parfum vaporisateur 50 ml",
          price: "96,00 €",
          checkedAt: "2026-10-23",
          offer: "Ancien prix affiché 120 € · remise de 20 % · livraison offerte dès 50 € selon conditions",
          href: "/go/opium-edp-50ml-ysl-beaute",
        },
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 30 ml",
          offer: "Prix à consulter sur la fiche du marchand : ancien relevé retiré",
          href: "/go/opium-edp-beauty-success",
        },
      ]}
    />
  );
}
