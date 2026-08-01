import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "la-vie-est-belle-eau-de-parfum-lancome";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "La Vie Est Belle Lancôme : avis et où l’acheter",
  description:
    "La Vie Est Belle Eau de Parfum 50 ml de Lancôme : notre présentation, les avis de la communauté Bons Plans Mania et où trouver le flacon.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function LaVieEstBelleProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Lancôme"
      name="La Vie Est Belle Eau de Parfum"
      image="/images/products/la-vie-est-belle-eau-de-parfum-lancome.png"
      imageAlt="Flacon La Vie Est Belle Eau de Parfum 50 ml de Lancôme"
      lead="Un iris gourmand devenu iconique, adouci par la poire et réchauffé par la vanille, le praliné et le patchouli. Un parfum généreux au sillage doux et enveloppant."
      offers={[
        {
          merchant: "Perfume’s Club",
          note: "Flacon 50 ml",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Flancome%2Fla-vie-est-belle-eau-de-parfum-vaporisateur%2Fp_35520%2F",
        },
      ]}
    />
  );
}
