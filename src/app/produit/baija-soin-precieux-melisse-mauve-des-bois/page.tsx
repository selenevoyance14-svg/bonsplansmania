import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-soin-precieux-melisse-mauve-des-bois";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;
export const metadata: Metadata = { title: "Soin Précieux Baïja Mélisse : avis et prix", description: "Avis sur le Soin Précieux Baïja Mélisse et Mauve des Bois : peaux ternes ou matures, actifs, précautions et prix.", alternates: { canonical }, robots: { index: true, follow: true } };

export default function Page() {
  return <CommunityProductPage slug={slug} brand="Baïja" name="Soin Précieux Mélisse & Mauve des Bois 30 ml" image="/images/products/baija-soin-melisse-mauve-visage.webp" imageAlt="Soin Précieux Visage Baïja Mélisse et Mauve des Bois" lead="Le Soin Précieux Baïja est un fluide destiné aux peaux en manque de tonus. Sa formule associe extraits de mélisse et de mauve des bois, acide hyaluronique et vitamine C." idealFor={["Peaux ternes ou matures", "Manque de tonus et d’éclat", "Soin à appliquer avant la crème"]} strengths={["Mélisse et mauve des bois", "Acide hyaluronique", "99 % d’ingrédients d’origine naturelle annoncés"]} watchOut={["La formule contient du parfum", "Les effets anti-âge restent progressifs et variables"]} editorialNote="Notre avis : ce soin vise surtout l’éclat, le confort et l’hydratation des peaux ternes ou matures. Il s’utilise davantage comme un sérum avant la crème que comme un hydratant unique." offers={[{ merchant: "Baïja", note: "Soin Précieux Mélisse & Mauve des Bois 30 ml — boutique officielle", price: "29,90 €", checkedAt: "2026-08-14", href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fsoin-precieux-visage-melisse-mauve-des-bois-30ml" }]} />;
}
