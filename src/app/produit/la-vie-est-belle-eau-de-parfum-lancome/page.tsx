import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "la-vie-est-belle-eau-de-parfum-lancome";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "La Vie Est Belle Lancôme : avis, notes et prix",
  description:
    "La Vie Est Belle Eau de Parfum Lancôme : notes d’iris, poire, praline et vanille, avis, formats rechargeables et prix vérifiés.",
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
      imageAlt="Flacon La Vie Est Belle Eau de Parfum de Lancôme"
      lead="La Vie Est Belle est un parfum floral gourmand construit autour de l’iris. La poire et le cassis ouvrent la fragrance, puis la praline, la vanille, la fève tonka et le patchouli lui donnent son sillage doux et enveloppant."
      idealFor={["Les amateurs de parfums floraux gourmands", "Les personnes qui aiment l’iris, la vanille et la praline", "Un parfum généreux pour le soir ou les saisons fraîches"]}
      strengths={["Une signature à l’iris facilement reconnaissable", "Un accord gourmand équilibré par le patchouli", "Plusieurs contenances et des flacons rechargeables selon le format"]}
      watchOut={["Son côté sucré est marqué et peut déplaire si vous préférez les parfums frais", "Ne pas le confondre avec La Vie Est Belle L’Elixir, Vanille Nude ou les autres déclinaisons", "Le prix varie fortement selon la contenance et le vendeur"]}
      editorialNote="Notre avis : La Vie Est Belle s’adresse aux amateurs de parfums floraux gourmands à l’iris. Comparez les contenances et le contenu de chaque offre : Beauty Success propose le parfum seul, tandis que le coffret Amazon réunit une eau de parfum rechargeable de 30 ml et un mascara Hypnôse de 2 ml."
      offers={[
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 15 ml",
          price: "39,90 €",
          checkedAt: "2026-10-23",
          href: "/go/la-vie-est-belle-beauty-success",
        },
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 30 ml — sélectionner cette contenance",
          price: "74,90 €",
          checkedAt: "2026-10-23",
          href: "/go/la-vie-est-belle-beauty-success",
        },
        {
          merchant: "Amazon — coffret parfum et mascara",
          note: "Eau de parfum rechargeable 30 ml + mascara Hypnôse 2 ml, Noir Hypnotic",
          offer: "Vendu par Lancôme France et expédié par Amazon lors de la vérification du 23 octobre 2026.",
          amazonAsin: "B0GV19KZ92",
          href: "/go/la-vie-est-belle-coffret-30ml-amazon",
        },
      ]}
    />
  );
}
