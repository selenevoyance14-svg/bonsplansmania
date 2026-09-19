import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "opium-eau-de-parfum-yves-saint-laurent";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Opium YSL : avis, prix et notes du parfum",
  description:
    "Opium Eau de Parfum d’Yves Saint Laurent : notes de myrrhe, vanille et ambre, avis, formats et prix vérifiés chez plusieurs marchands.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function OpiumProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Yves Saint Laurent"
      name="Opium Eau de Parfum"
      image="/images/products/opium-eau-de-parfum-yves-saint-laurent.png"
      imageAlt="Flacon Opium Eau de Parfum d’Yves Saint Laurent"
      lead="Opium est un parfum ambré et épicé construit autour de la myrrhe, de la vanille, de l’ambre et du patchouli. Cette fiche compare les prix des formats disponibles et rassemble les avis de la communauté."
      idealFor={["Les amateurs de parfums ambrés, orientaux et épicés", "Les personnes qui apprécient les senteurs chaudes et enveloppantes", "Un parfum affirmé pour le soir et les saisons fraîches"]}
      strengths={["Accord ambré autour de la myrrhe", "Fond chaud de vanille, ambre et patchouli", "Formats 30, 50 et 90 ml selon les marchands"]}
      watchOut={["Ne pas confondre Opium avec Black Opium", "Son caractère intense peut sembler trop opulent si vous préférez les parfums légers", "Les prix et les disponibilités varient fortement selon la contenance"]}
      editorialNote="Notre avis : Opium s’adresse surtout aux personnes qui recherchent un parfum ambré très affirmé. La myrrhe et les épices lui donnent davantage de caractère qu’un parfum gourmand classique. Le format 50 ml offre actuellement un meilleur rapport quantité-prix que le 30 ml."
      offers={[
        {
          merchant: "Perfume’s Club",
          note: "Eau de parfum vaporisateur 50 ml",
          price: "71,88 €",
          checkedAt: "2026-09-19",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Fyves-saint-laurent%2Fopium-eau-de-parfum-vaporisateur%2Fp_44520%2F",
        },
        {
          merchant: "YSL Beauté",
          note: "Eau de parfum vaporisateur 50 ml",
          price: "115,00 €",
          checkedAt: "2026-09-19",
          href: "https://www.yslbeauty.fr/parfums/parfum-femme/opium/opium-eau-de-parfum-spray/231YSL.html",
        },
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 30 ml",
          price: "144,00 €",
          checkedAt: "2026-09-19",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-yves-saint-laurent-opium-eau-de-parfum-femme-c000806",
        },
      ]}
    />
  );
}
