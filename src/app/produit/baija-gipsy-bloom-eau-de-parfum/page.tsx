import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-gipsy-bloom-eau-de-parfum";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Baïja Gipsy Bloom : avis et prix du parfum",
  description: "Baïja Gipsy Bloom Eau de Parfum 15 ml : notre avis, ses notes de rose, benjoin et santal, son prix vérifié et où l’acheter.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function BaijaGipsyBloomProductPage() {
  return <CommunityProductPage slug={slug} brand="Baïja" name="Gipsy Bloom Eau de Parfum 15 ml" image="/images/products/baija-gipsy-bloom-eau-de-parfum-15ml.webp" imageAlt="Flacon Baïja Gipsy Bloom Eau de Parfum 15 ml" lead="Gipsy Bloom est une eau de parfum Baïja florale et poudrée. La rose ouvre la composition, le benjoin apporte une facette douce et le santal installe un fond plus chaud." idealFor={["Les personnes qui aiment les parfums floraux poudrés", "Une fragrance douce au quotidien", "Un petit format facile à emporter"]} strengths={["Accord rose, benjoin et santal", "Format nomade de 15 ml", "Profil floral facile à identifier"]} watchOut={["Le format 15 ml est plus petit qu’un flacon classique", "Le rendu et la tenue varient selon la peau"]} editorialNote="Notre avis : Gipsy Bloom convient surtout aux amatrices de floraux doux et poudrés. La rose reste lumineuse, tandis que le benjoin et le santal apportent un fond plus enveloppant sans transformer la fragrance en parfum très gourmand." offers={[{ merchant: "Baïja", note: "Eau de Parfum Gipsy Bloom 15 ml — boutique officielle", price: "19,90 €", checkedAt: "2026-08-14", href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fparfum-corps-gipsy-bloom-15ml" }]} />;
}
