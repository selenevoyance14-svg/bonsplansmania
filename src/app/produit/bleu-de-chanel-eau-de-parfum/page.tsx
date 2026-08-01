import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "bleu-de-chanel-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Bleu de Chanel : avis et où l’acheter",
  description:
    "Chanel Bleu de Chanel Eau de Parfum : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BleuDeChanelProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Chanel"
      name="Bleu de Chanel Eau de Parfum"
      image="/images/products/bleu-de-chanel-eau-de-parfum.png"
      imageAlt="Flacon bleu nuit Chanel Bleu de Chanel Eau de Parfum"
      lead="Un boisé aromatique tenu de bout en bout : citron et menthe en ouverture, gingembre et noix de muscade au cœur, santal, cèdre et encens en fond. Le passage en eau de parfum l’a rendu plus dense et plus long que l’eau de toilette."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-chanel-bleu-de-chanel-eau-de-parfum-vaporisateur-homme-c030627",
        },
      ]}
    />
  );
}
