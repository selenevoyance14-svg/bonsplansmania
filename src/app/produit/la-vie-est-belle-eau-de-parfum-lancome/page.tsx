import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "la-vie-est-belle-eau-de-parfum-lancome";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "La Vie Est Belle Lancôme : avis et où l’acheter",
  description:
    "La Vie Est Belle Eau de Parfum de Lancôme : notre présentation, les avis de la communauté Bons Plans Mania et où l’acheter au prix vérifié.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LaVieEstBelleProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Lancôme"
      name="La Vie Est Belle Eau de Parfum"
      image="/images/products/la-vie-est-belle-eau-de-parfum-lancome.png"
      imageAlt="Flacon La Vie Est Belle Eau de Parfum de Lancôme"
      lead="Un iris gourmand devenu iconique, adouci par la poire et réchauffé par la vanille, le praliné et le patchouli. Un parfum généreux au sillage doux et enveloppant."
      idealFor={["Les amateurs de parfums floraux et gourmands", "Les personnes qui apprécient l’iris, la vanille et le praliné", "Un parfum enveloppant pour le soir ou les saisons fraîches"]}
      strengths={["Signature à l’iris facilement reconnaissable", "Accord gourmand de praline et de vanille", "Flacon rechargeable selon le format"]}
      watchOut={["Sa douceur gourmande peut sembler trop sucrée si vous préférez les parfums frais", "La tenue et le rendu varient selon la peau"]}
      editorialNote="Notre avis : La Vie Est Belle convient surtout aux personnes qui aiment les parfums floraux gourmands, doux et enveloppants. L’iris structure la fragrance tandis que la vanille, le praliné et le patchouli lui donnent son caractère chaleureux."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 15 ml",
          price: "39,90 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-lancome-la-vie-est-belle-eau-de-parfum-femme-c002321",
        },
      ]}
    />
  );
}
