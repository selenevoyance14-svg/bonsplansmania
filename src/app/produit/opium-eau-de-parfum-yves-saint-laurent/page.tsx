import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "opium-eau-de-parfum-yves-saint-laurent";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Opium Yves Saint Laurent : avis et où l’acheter",
  description:
    "Opium Eau de Parfum d’Yves Saint Laurent : notre présentation, les avis de la communauté Bons Plans Mania et où l’acheter au prix vérifié.",
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
      lead="Un parfum oriental au caractère chaleureux et épicé, l’un des sillages les plus reconnaissables de la parfumerie. Cette fiche réunit les expériences de la communauté et les bons plans actifs."
      idealFor={["Les amateurs de parfums orientaux et épicés", "Les personnes qui apprécient les senteurs chaudes et enveloppantes", "Un parfum de caractère pour le soir"]}
      strengths={["Signature orientale reconnaissable", "Accord chaleureux et épicé", "Format 30 ml"]}
      watchOut={["Son caractère intense peut sembler trop opulent si vous préférez les parfums légers", "La tenue et le rendu varient selon la peau"]}
      editorialNote="Notre avis : Opium convient surtout aux personnes qui recherchent un parfum oriental affirmé, chaud et épicé. Son sillage possède beaucoup de caractère et se prête particulièrement bien aux soirées et aux saisons fraîches."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 30 ml",
          price: "144,10 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-yves-saint-laurent-opium-eau-de-parfum-femme-c000806",
        },
      ]}
    />
  );
}
