import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-soin-precieux-melisse-mauve-des-bois";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Soin Précieux Baïja Mélisse : avis, utilisation et prix",
  description:
    "Soin Précieux Baïja Mélisse et Mauve des Bois 30 ml : avis, actifs, utilisation sur les peaux ternes ou matures et prix officiel vérifié.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Baïja"
      name="Soin Précieux Mélisse & Mauve des Bois 30 ml"
      image="/images/products/baija-soin-melisse-mauve-visage.webp"
      imageAlt="Soin Précieux Visage Baïja Mélisse et Mauve des Bois"
      lead="Le Soin Précieux Baïja est un fluide destiné aux peaux ternes ou matures en manque de tonus. Sa formule associe des extraits de mélisse et de mauve des bois à du collagène, de la vitamine C et de l’acide hyaluronique."
      idealFor={["Peaux ternes ou matures", "Manque de tonus et d’éclat", "Soin à appliquer avant la crème"]}
      strengths={["Mélisse et mauve des bois", "Acide hyaluronique, vitamine C et collagène", "99 % d’ingrédients d’origine naturelle annoncés"]}
      watchOut={["La formule contient du parfum", "Les effets sur les signes de l’âge restent progressifs et variables", "Ce soin ne remplace pas une protection solaire"]}
      editorialNote="Notre avis : ce soin vise surtout l’éclat, le confort et l’hydratation des peaux ternes ou matures. Il s’utilise comme un sérum, matin et soir sur le visage et le cou propres, avant la crème. Son prix officiel a augmenté de 1 € depuis notre relevé du 14 août 2026."
      offers={[
        {
          merchant: "Baïja",
          note: "Soin Précieux Mélisse & Mauve des Bois 30 ml — disponible sur la boutique officielle",
          price: "30,90 €",
          checkedAt: "2026-09-19",
          offer: "Prix en hausse de 1 € depuis notre relevé du 14 août 2026 (29,90 €)",
          href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fsoin-precieux-visage-melisse-mauve-des-bois-30ml",
        },
      ]}
    />
  );
}
