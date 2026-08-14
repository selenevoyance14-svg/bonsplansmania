import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "baija-creme-visage-ortie-anti-imperfections";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;
export const metadata: Metadata = { title: "Crème visage Baïja Ortie : avis et prix", description: "Avis sur la crème visage légère Baïja à l’ortie : peau mixte ou grasse, imperfections, points forts et prix vérifié.", alternates: { canonical }, robots: { index: true, follow: true } };

export default function Page() {
  return <CommunityProductPage slug={slug} brand="Baïja" name="Crème Visage Légère Ortie" image="/images/products/baija-creme-ortie-visage.webp" imageAlt="Crème Visage Légère Baïja à l’extrait d’ortie" lead="La Crème Visage Légère à l’Ortie cible les brillances, les pores visibles et les imperfections avec une formule comprenant notamment de l’extrait d’ortie et de l’amidon de riz." idealFor={["Peaux mixtes à grasses", "Brillances et imperfections", "Texture légère au quotidien"]} strengths={["Extrait d’ortie", "Amidon de riz matifiant", "98 % d’ingrédients d’origine naturelle annoncés"]} watchOut={["La formule contient du parfum", "Les résultats sur les imperfections varient selon la peau"]} editorialNote="Notre avis : c’est la crème Baïja la plus cohérente pour une peau mixte ou grasse. L’amidon de riz vise un fini plus mat, mais les peaux sensibles au parfum devront rester prudentes." offers={[{ merchant: "Baïja", note: "Crème Visage Légère Ortie 40 ml — boutique officielle", price: "30,90 €", checkedAt: "2026-08-14", href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fcreme-legere-visage-ortie-40ml" }]} />;
}
