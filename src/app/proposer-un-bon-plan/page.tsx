import type { Metadata } from "next";
import Header from "@/app/components/Header";
import DealTipForm from "@/app/components/DealTipForm";

export const metadata: Metadata = {
  title: "Proposer un bon plan | Bons Plans Mania",
  description: "Partagez un bon plan, un code promo, un jeu concours ou un test produit avec la communauté Bons Plans Mania.",
  robots: { index: false, follow: true },
};

export default function ProposerUnBonPlanPage() {
  return <><Header activePage="/proposer-un-bon-plan" /><main className="community-page"><div className="container community-page-inner"><span className="community-section-kicker">Partage & entraide</span><h1>Proposer un bon plan</h1><p className="community-page-intro">Vous avez repéré une réduction, un concours ou un test produit intéressant ? Envoyez-le-nous. Chaque proposition est vérifiée avant une éventuelle publication.</p><DealTipForm /></div></main></>;
}
