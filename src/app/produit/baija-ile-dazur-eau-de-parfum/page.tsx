import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-ile-dazur-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Baïja Île d’Azur : avis et prix du parfum",
  description: "Baïja Île d’Azur Eau de Parfum 15 ml : notre avis, ses notes de frangipanier, fleur d’oranger et vanille, son prix et où l’acheter.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BaijaIleDAzurProductPage() {
  return <CommunityProductPage slug={slug} brand="Baïja" name="Île d’Azur Eau de Parfum 15 ml" image="/images/products/baija-ile-dazur-eau-de-parfum-15ml.webp" imageAlt="Flacon Baïja Île d’Azur Eau de Parfum 15 ml" lead="Île d’Azur est une eau de parfum Baïja florale et solaire. La fleur de frangipanier ouvre la composition, la fleur d’oranger forme le cœur et la vanille adoucit le fond." idealFor={["Les personnes qui aiment les floraux solaires", "Les amatrices de fleur d’oranger et de vanille", "Un petit format facile à emporter"]} strengths={["Accord frangipanier, fleur d’oranger et vanille", "Profil floral chaleureux", "Format nomade de 15 ml"]} watchOut={["La vanille peut paraître douce aux personnes préférant les parfums très frais", "La tenue varie selon la peau"]} editorialNote="Notre avis : Île d’Azur convient aux amatrices de fleurs blanches solaires. Le frangipanier lui donne une tonalité exotique, la fleur d’oranger apporte de la lumière et la vanille arrondit l’ensemble sans en faire un parfum entièrement gourmand." offers={[{ merchant: "Baïja", note: "Eau de Parfum Île d’Azur 15 ml — boutique officielle", price: "19,90 €", checkedAt: "2026-08-14", href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fparfum-corps-ile-dazur-15ml" }]} />;
}
