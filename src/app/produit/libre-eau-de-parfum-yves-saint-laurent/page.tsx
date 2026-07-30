import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "libre-eau-de-parfum-yves-saint-laurent";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Libre Yves Saint Laurent : prix et avis",
  description:
    "Comparez le prix de Libre Eau de Parfum 50 ml d’Yves Saint Laurent et partagez votre avis avec la communauté Bons Plans Mania.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LibreProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Yves Saint Laurent"
      name="Libre Eau de Parfum"
      image="https://www.beautysuccess.fr/media/catalog/product/cache/02280392440d22bedc5c4ce4592badc4/8/1/814135853a-yves-saint-laurent-libre-50ml-visuel_1.webp"
      imageAlt="Flacon Libre Eau de Parfum 50 ml d’Yves Saint Laurent"
      lead="Une lavande florale moderne où la fraîcheur aromatique rencontre la sensualité de la fleur d’oranger. Une signature affirmée, lumineuse et chaleureuse."
      offers={[
        {
          merchant: "Perfume’s Club",
          price: "69,91 €",
          note: "50 ml — hors éventuels frais de livraison",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Fyves-saint-laurent%2Flibre-eau-de-parfum-vaporisateur%2Fp_48401%2F",
        },
        {
          merchant: "Beauty Success",
          price: "121,90 €",
          note: "50 ml — livraison standard offerte",
          href: "https://www.beautysuccess.fr/parfum-yves-saint-laurent-libre-eau-de-parfum-femme-c060061",
        },
        {
          merchant: "YSL Beauté",
          price: "125,00 €",
          note: "50 ml — boutique officielle",
          href: "https://www.yslbeauty.fr/parfums/parfum-femme/libre/libre-eau-de-parfum/WW-50424YSL.html",
        },
      ]}
    />
  );
}
