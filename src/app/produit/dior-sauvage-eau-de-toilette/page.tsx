import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "dior-sauvage-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Dior Sauvage : avis et où l’acheter",
  description:
    "Dior Sauvage Eau de Toilette : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le vaporisateur.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function SauvageProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Dior"
      name="Sauvage Eau de Toilette"
      image="/images/products/dior-sauvage-eau-de-toilette.png"
      imageAlt="Flacon Dior Sauvage Eau de Toilette"
      lead="Bergamote de Calabre et poivre de Sichuan en tête, puis cet ambroxan qui a fait sa réputation, adossé à la lavande et au vétiver. Le parfum masculin le plus vendu au monde depuis dix ans, et ça se sent : il est partout."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de toilette vaporisateur",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-dior-sauvage-eau-de-toilette-homme-c023461",
        },
      ]}
    />
  );
}
