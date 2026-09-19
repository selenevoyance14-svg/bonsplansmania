import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "valentino-born-in-roma-donna-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Born in Roma Donna Valentino : avis, notes et prix",
  description:
    "Born in Roma Donna de Valentino : avis sur ses notes de jasmin, cassis, vanille Bourbon et bois, avec les formats et prix vérifiés.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BornInRomaProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Valentino"
      name="Donna Born in Roma Eau de Parfum"
      image="/images/products/valentino-born-in-roma-donna-eau-de-parfum.png"
      imageAlt="Flacon clouté Valentino Donna Born in Roma Eau de Parfum"
      lead="Un floral boisé qui joue sur le contraste : jasmin sambac et bourgeon de cassis en tête, vanille bourbon et bois de cèdre en fond. Le flacon clouté rose reprend les studs emblématiques de la maison."
      idealFor={["Les amateurs de parfums floraux orientaux et boisés", "Les personnes qui apprécient le jasmin et la vanille", "Un parfum féminin élégant pour le quotidien ou le soir"]}
      strengths={["Un jasmin lumineux associé au cassis", "Un fond chaleureux de vanille Bourbon et de bois", "Trois contenances disponibles : 30, 50 et 100 ml"]}
      watchOut={["La vanille peut sembler trop présente si vous préférez les parfums très frais", "Ne pas le confondre avec Born in Roma Intense, Coral Fantasy ou Green Stravaganza", "Le prix au millilitre devient plus intéressant sur les grands formats"]}
      editorialNote="Notre avis : Donna Born in Roma convient surtout aux personnes qui recherchent un parfum féminin floral, boisé et vanillé. Le 30 ml est le moins cher à l’achat, tandis que le 100 ml offre actuellement le meilleur prix au millilitre chez Beauty Success."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 30 ml",
          price: "84,90 €",
          checkedAt: "2026-09-19",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fcatalogsearch%2Fresult%2F%3Fq%3DValentino%2BParfum%2BDonna%2BBorn%2Bin%2BRoma%2B-%2BEau%2Bde%2BParfum",
        },
      ]}
    />
  );
}
