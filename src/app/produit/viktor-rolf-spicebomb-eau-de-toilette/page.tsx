import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "viktor-rolf-spicebomb-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Viktor & Rolf Spicebomb : avis et prix par format",
  description:
    "Viktor & Rolf Spicebomb Eau de Toilette : avis, notes épicées et prix vérifiés des vaporisateurs 50 ml, 90 ml et 150 ml.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function SpicebombProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Viktor & Rolf"
      name="Spicebomb Eau de Toilette"
      image="/images/products/viktor-rolf-spicebomb-eau-de-toilette.png"
      imageAlt="Flacon grenade Viktor & Rolf Spicebomb Eau de Toilette"
      lead="Poivre rose et bergamote en tête, un cœur de piment, de safran et de paprika, puis tabac, cuir et vétiver. Un épicé franc, taillé pour l’hiver, dans un flacon en forme de grenade qu’on repère à trois mètres."
      idealFor={["Amateurs de parfums épicés", "Saison fraîche", "Parfum de soirée"]}
      strengths={["Signature épicée reconnaissable", "Flacon original", "Sillage affirmé"]}
      watchOut={["Peut sembler puissant en journée", "À tester si vous êtes sensible aux notes épicées", "La tenue varie selon la peau"]}
      editorialNote="Notre avis : Spicebomb convient surtout aux personnes qui recherchent un parfum masculin épicé, chaleureux et marqué. Son caractère affirmé le rend particulièrement adapté à l’automne, à l’hiver et aux sorties. Le 150 ml offre le meilleur prix au millilitre, tandis que le 90 ml constitue un bon compromis entre budget et contenance."
      offers={[
        {
          merchant: "News Parfums",
          note: "Eau de Toilette vaporisateur 50 ml — 0,92 € par ml",
          price: "46,00 €",
          checkedAt: "2026-09-19",
          offer: "Baisse de 12,10 € par rapport à notre relevé du 14 août 2026 (58,10 €)",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Fviktor-and-rolf-parfums%2F6345--viktor-rolf-spicebomb-eau-de-toilette-vapo50ml--3605521515629.html",
        },
        {
          merchant: "News Parfums",
          note: "Eau de Toilette vaporisateur 90 ml — environ 0,66 € par ml",
          price: "59,50 €",
          checkedAt: "2026-09-19",
          offer: "40 ml supplémentaires pour 13,50 € de plus que le format 50 ml",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Fviktor-and-rolf-parfums%2F6345--viktor-rolf-spicebomb-eau-de-toilette-vapo50ml--3605521515629.html",
        },
        {
          merchant: "News Parfums",
          note: "Eau de Toilette vaporisateur 150 ml — environ 0,59 € par ml",
          price: "88,32 €",
          checkedAt: "2026-09-19",
          offer: "Meilleur prix au millilitre parmi les trois formats vérifiés",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23249990&url=https%3A%2F%2Fwww.news-parfums.com%2Ffr%2Fviktor-and-rolf-parfums%2F6345--viktor-rolf-spicebomb-eau-de-toilette-vapo50ml--3605521515629.html",
        },
      ]}
    />
  );
}
