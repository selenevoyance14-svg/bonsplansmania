import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "rabanne-1-million-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Rabanne 1 Million : avis et où l’acheter",
  description:
    "Rabanne 1 Million Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function UnMillionProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Rabanne"
      name="1 Million Eau de Toilette"
      image="/images/products/rabanne-1-million-eau-de-toilette.png"
      imageAlt="Flacon lingot doré Rabanne 1 Million Eau de Toilette"
      lead="Pamplemousse et menthe en ouverture, un cœur de rose et de cannelle, puis cuir, ambre et bois blancs. Un parfum qui ne cherche pas la discrétion, dans son flacon lingot devenu un classique du rayon."
      idealFor={["Les amateurs de parfums épicés et ambrés", "Un parfum masculin affirmé pour le soir", "Les personnes qui apprécient la cannelle et le cuir"]}
      strengths={["Accord épicé, ambré et cuiré", "Sillage reconnaissable", "Flacon lingot emblématique"]}
      watchOut={["Son sillage puissant peut ne pas convenir aux personnes qui préfèrent les parfums discrets", "La cannelle et l’ambre apportent une tonalité assez chaude"]}
      editorialNote="Notre avis : Rabanne 1 Million Eau de Toilette convient surtout aux personnes qui aiment les parfums masculins chauds, épicés et très présents. La fraîcheur du pamplemousse et de la menthe laisse rapidement place à la cannelle, à l’ambre et au cuir."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette 30 ml",
          price: "59,90 €",
          checkedAt: "2026-08-14",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-rabanne-1-million-eau-de-toilette-homme-c000282",
        },
      ]}
    />
  );
}
