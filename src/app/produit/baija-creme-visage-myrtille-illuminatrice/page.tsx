import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-creme-visage-myrtille-illuminatrice";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;
export const metadata: Metadata = { title: "Crème visage Baïja Myrtille : avis et prix", description: "Avis sur la crème visage fouettée Baïja à la myrtille : types de peau, points forts, précautions et prix vérifié.", alternates: { canonical }, robots: { index: true, follow: true } };

export default function Page() {
  return <CommunityProductPage slug={slug} brand="Baïja" name="Crème Visage Fouettée Myrtille" image="/images/products/baija-creme-myrtille-visage.webp" imageAlt="Crème Visage Fouettée Baïja à l’extrait de myrtille" lead="Cette crème fouettée Baïja associe extrait de myrtille, huiles de sésame et de tournesol dans une texture destinée à hydrater, adoucir et soutenir l’éclat de la peau." idealFor={["Peaux ternes ou matures", "Besoin d’hydratation et d’éclat", "Routine visage matin et soir"]} strengths={["Extrait de myrtille antioxydant", "Texture fouettée", "98 % d’ingrédients d’origine naturelle annoncés"]} watchOut={["La formule contient du parfum", "Un soin cosmétique ne remplace pas une protection solaire"]} editorialNote="Notre avis : une crème intéressante pour les peaux qui recherchent surtout confort et luminosité. Sa texture fouettée et ses huiles végétales conviendront davantage aux peaux normales à sèches qu’aux peaux très grasses." offers={[{ merchant: "Baïja", note: "Crème Visage Fouettée Myrtille — boutique officielle", price: "29,90 €", checkedAt: "2026-08-14", href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fcreme-fondante-visage-myrtille-illuminatrice" }]} />;
}
