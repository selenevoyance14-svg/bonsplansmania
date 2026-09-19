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
      editorialNote="Notre avis : La Vie Est Belle reste une valeur sûre pour qui recherche un parfum féminin floral, gourmand et tenace. Au moment de notre vérification, le flacon de 75 ml était même moins cher que le 50 ml chez Perfume’s Club : vérifiez donc toujours les contenances avant de commander."
      offers={[
        {
          merchant: "Perfume’s Club",
          note: "Eau de parfum vaporisateur 75 ml",
          price: "66,02 €",
          checkedAt: "2026-09-19",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Flancome%2Fla-vie-est-belle-eau-de-parfum-vaporisateur%2Fp_35520%2F",
        },
        {
          merchant: "Perfume’s Club",
          note: "Eau de parfum vaporisateur 50 ml",
          price: "70,15 €",
          checkedAt: "2026-09-19",
          href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Flancome%2Fla-vie-est-belle-eau-de-parfum-vaporisateur%2Fp_35520%2F",
        },
        {
          merchant: "Beauty Success",
          note: "Eau de parfum vaporisateur 15 ml",
          price: "39,90 €",
          checkedAt: "2026-09-19",
          href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23247206&url=https%3A%2F%2Fwww.beautysuccess.fr%2Fparfum-lancome-la-vie-est-belle-eau-de-parfum-femme-c002321",
        },
      ]}
    />
  );
}
