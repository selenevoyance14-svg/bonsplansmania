import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-fluide-concentre-menthe-poivree";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;
export const metadata: Metadata = { title: "Fluide Baïja Menthe Poivrée : avis et prix", description: "Avis sur le fluide concentré visage Baïja à la menthe poivrée et niacinamide : types de peau, précautions et prix.", alternates: { canonical }, robots: { index: true, follow: true } };

export default function Page() {
  return <CommunityProductPage slug={slug} brand="Baïja" name="Fluide Concentré Menthe Poivrée 30 ml" image="/images/products/baija-fluide-menthe-visage.webp" imageAlt="Fluide Concentré Visage Baïja à la menthe poivrée" lead="Ce fluide concentré Baïja associe huile essentielle et hydrolat de menthe poivrée à la niacinamide dans une formule destinée à apaiser, purifier et aider à uniformiser le teint." idealFor={["Peaux mixtes à grasses", "Teint irrégulier et pores visibles", "Texture fluide sous une crème"]} strengths={["Menthe poivrée", "Niacinamide", "99 % d’ingrédients d’origine naturelle annoncés"]} watchOut={["La menthe poivrée peut ne pas convenir aux peaux très réactives", "Tester progressivement en cas de sensibilité"]} editorialNote="Notre avis : un fluide ciblé pour celles qui recherchent fraîcheur et action purifiante. La présence de niacinamide est intéressante, mais la menthe poivrée invite à la prudence sur une peau très sensible." offers={[{ merchant: "Baïja", note: "Fluide Concentré Menthe Poivrée 30 ml — boutique officielle", price: "30,90 €", checkedAt: "2026-08-14", href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Ffluide-concentre-visage-menthe-30ml" }]} />;
}
