import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "chanel-coco-mademoiselle-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Chanel Coco Mademoiselle : avis et où l’acheter",
  description:
    "Chanel Coco Mademoiselle Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function CocoMademoiselleProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Chanel"
      name="Coco Mademoiselle Eau de Parfum"
      image="/images/products/chanel-coco-mademoiselle-eau-de-parfum.png"
      imageAlt="Flacon Chanel Coco Mademoiselle Eau de Parfum vaporisateur"
      lead="L’oriental frais de la maison Chanel : orange et bergamote en ouverture, un cœur de rose et de jasmin, puis un fond de patchouli et de vétiver qui lui donne son caractère. Créé en 2001, c’est devenu l’un des parfums féminins les plus vendus au monde."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-chanel-coco-mademoiselle-eau-de-parfum-femme-c030521",
        },
      ]}
    />
  );
}
