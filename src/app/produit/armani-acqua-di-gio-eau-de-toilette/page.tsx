import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "armani-acqua-di-gio-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Armani Acqua di Giò : avis et où l’acheter",
  description:
    "Giorgio Armani Acqua di Giò Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function AcquaDiGioProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Giorgio Armani"
      name="Acqua di Giò Eau de Toilette"
      image="/images/products/armani-acqua-di-gio-eau-de-toilette.png"
      imageAlt="Flacon Giorgio Armani Acqua di Giò Eau de Toilette"
      lead="Le fondateur des parfums marins, sorti en 1996 : notes iodées, bergamote et néroli en tête, romarin et jasmin au cœur, patchouli et musc blanc en fond. Trente ans après, il reste la référence du frais propre."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-giorgio-armani-acqua-di-gio-eau-de-toilette-homme-c074564",
        },
      ]}
    />
  );
}
