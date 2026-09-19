import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "dior-miss-dior-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Miss Dior Eau de Parfum : avis, notes et prix",
  description:
    "Miss Dior Eau de Parfum : avis sur ses notes de rose centifolia, vanille, fève tonka et bois de santal, avec son prix vérifié.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function MissDiorProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Dior"
      name="Miss Dior Eau de Parfum"
      image="/images/products/dior-miss-dior-eau-de-parfum.png"
      imageAlt="Flacon Dior Miss Dior Eau de Parfum et son nœud couture argenté"
      lead="La nouvelle Miss Dior Eau de Parfum associe une rose centifolia aux accents miellés et poivrés à une vanille crémeuse, une fève tonka amandée et un bois de santal lacté. Le résultat est floral, gourmand et plus enveloppant."
      idealFor={["Les amateurs de parfums floraux et vanillés", "Les personnes qui aiment la rose, la fève tonka et le santal", "Un parfum féminin intense pour le quotidien ou une occasion"]}
      strengths={["Une rose centifolia de Grasse au cœur de la composition", "Un fond gourmand de vanille et de fève tonka", "Un sillage chaleureux et tenace"]}
      watchOut={["Cette nouvelle version est plus vanillée et gourmande que les anciennes éditions", "Ne pas la confondre avec Miss Dior Parfum, Blooming Bouquet ou le Roller-Pearl", "Le rendu et la tenue peuvent varier selon la peau"]}
      editorialNote="Notre avis : cette version de Miss Dior s’adresse surtout aux personnes qui aiment les floraux chaleureux. La rose reste bien présente, mais la vanille, la fève tonka et le santal lui donnent un caractère plus crémeux et sensuel que les anciennes compositions."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 30 ml",
          price: "88,90 €",
          checkedAt: "2026-09-19",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-dior-miss-dior-eau-de-parfum-notes-florales-vanillees-sensuelles-femme-2931370304",
        },
      ]}
    />
  );
}
