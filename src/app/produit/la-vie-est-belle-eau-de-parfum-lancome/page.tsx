import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "la-vie-est-belle-eau-de-parfum-lancome";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "La Vie Est Belle Lancôme : prix et avis",
  description:
    "Comparez le prix de La Vie Est Belle Eau de Parfum 50 ml de Lancôme et partagez votre avis avec la communauté Bons Plans Mania.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LaVieEstBelleProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Lancôme"
      name="La Vie Est Belle Eau de Parfum"
      image="https://www.beautysuccess.fr/media/catalog/product/cache/4fea07e277c82ab4be7d759dcf561c32/c/0/c002321-lancome-la-vie-est-belle-visuel_1.webp"
      imageAlt="Flacon La Vie Est Belle Eau de Parfum 50 ml de Lancôme"
      lead="Un iris gourmand devenu iconique, adouci par la poire et réchauffé par la vanille, le praliné et le patchouli. Un parfum généreux au sillage doux et enveloppant."
      offers={[
        {
          merchant: "Perfume’s Club",
          price: "57,61 €",
          note: "50 ml — hors éventuels frais de livraison",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Flancome%2Fla-vie-est-belle-eau-de-parfum-vaporisateur%2Fp_35520%2F",
        },
        {
          merchant: "Beauty Success",
          price: "109,90 €",
          note: "50 ml — livraison standard offerte",
          href: "https://www.beautysuccess.fr/parfum-lancome-la-vie-est-belle-eau-de-parfum-femme-c002321",
        },
        {
          merchant: "Lancôme",
          price: "110,00 €",
          note: "50 ml — boutique officielle",
          href: "https://www.lancome.fr/parfum/parfum-femme/la-vie-est-belle/la-vie-est-belle/3614273694797.html",
        },
      ]}
    />
  );
}
