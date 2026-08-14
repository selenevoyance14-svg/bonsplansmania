import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-lost-paradise-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Baïja Lost Paradise : avis et prix du parfum",
  description: "Baïja Lost Paradise Eau de Parfum 15 ml : notre avis, ses notes d’ananas, fleurs blanches et fève tonka, son prix et où l’acheter.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BaijaLostParadiseProductPage() {
  return <CommunityProductPage slug={slug} brand="Baïja" name="Lost Paradise Eau de Parfum 15 ml" image="/images/products/baija-lost-paradise-eau-de-parfum-15ml.webp" imageAlt="Flacon Baïja Lost Paradise Eau de Parfum 15 ml" lead="Lost Paradise est une eau de parfum Baïja fruitée, pétillante et solaire. L’ananas domine le départ, les fleurs blanches structurent le cœur et la fève tonka réchauffe le fond." idealFor={["Les personnes qui aiment les parfums fruités solaires", "Une senteur estivale et dépaysante", "Un petit format facile à emporter"]} strengths={["Départ lumineux à l’ananas", "Fond doux à la fève tonka", "Format nomade de 15 ml"]} watchOut={["Le profil fruité et solaire peut sembler très estival", "La tenue varie selon la peau"]} editorialNote="Notre avis : Lost Paradise est le plus exotique de cette sélection Baïja. Il convient aux personnes qui aiment l’ananas frais, les fleurs blanches et les fonds doux légèrement vanillés, avec une ambiance clairement solaire." offers={[{ merchant: "Baïja", note: "Eau de Parfum Lost Paradise 15 ml — boutique officielle", price: "19,90 €", checkedAt: "2026-08-14", href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fparfum-corps-lost-paradise-15ml" }]} />;
}
