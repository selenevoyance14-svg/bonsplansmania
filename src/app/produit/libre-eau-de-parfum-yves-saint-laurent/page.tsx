import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "libre-eau-de-parfum-yves-saint-laurent";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Libre Yves Saint Laurent : avis et où l’acheter",
  description:
    "Libre Eau de Parfum d’Yves Saint Laurent : notre présentation, les avis de la communauté Bons Plans Mania et où l’acheter au prix vérifié.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LibreProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Yves Saint Laurent"
      name="Libre Eau de Parfum"
      image="/images/products/ysl-libre-eau-de-parfum-50ml-officiel.png"
      imageAlt="Flacon Libre Eau de Parfum d’Yves Saint Laurent"
      lead="Une lavande florale moderne où la fraîcheur aromatique rencontre la sensualité de la fleur d’oranger. Une signature affirmée, lumineuse et chaleureuse."
      idealFor={["Les amateurs de parfums floraux aromatiques", "Les personnes qui apprécient la lavande et la fleur d’oranger", "Un parfum affirmé à porter en journée comme en soirée"]}
      strengths={["Contraste reconnaissable entre lavande et fleur d’oranger", "Sillage floral chaud et moderne", "Petit format 10 ml pratique à emporter"]}
      watchOut={["Son sillage affirmé peut ne pas convenir si vous préférez les parfums très discrets", "La tenue et le rendu varient selon la peau"]}
      editorialNote="Notre avis : Libre convient aux personnes qui aiment les parfums floraux modernes avec une facette aromatique. La lavande apporte de la fraîcheur tandis que la fleur d’oranger donne un résultat plus chaud et sensuel."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 10 ml",
          price: "29,90 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-yves-saint-laurent-libre-eau-de-parfum-femme-c060061",
        },
      ]}
    />
  );
}
