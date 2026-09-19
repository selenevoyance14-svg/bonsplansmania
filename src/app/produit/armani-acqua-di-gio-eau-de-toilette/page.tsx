import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "armani-acqua-di-gio-eau-de-toilette";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Acqua di Giò Armani : avis, notes et prix",
  description:
    "Acqua di Giò Eau de Toilette Armani : avis sur ce parfum marin aux notes d’agrumes, romarin, jasmin et muscs, avec les prix vérifiés.",
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
      idealFor={["Les amateurs de parfums frais et aquatiques", "Un parfum masculin léger pour le quotidien", "Le printemps et l’été"]}
      strengths={["Une fraîcheur marine et agrumée facile à porter", "Un parfum masculin peu sucré adapté au quotidien", "Plusieurs formats disponibles, dont des flacons rechargeables"]}
      watchOut={["Le sillage peut sembler trop léger si vous recherchez un parfum très puissant", "Ne pas le confondre avec Acqua di Giò Eau de Parfum, Profondo ou Parfum", "Les versions rechargeables et classiques n’ont pas toujours le même prix"]}
      editorialNote="Notre avis : Acqua di Giò Eau de Toilette convient particulièrement aux personnes qui recherchent un parfum masculin frais, marin et peu sucré. Le 30 ml rechargeable est intéressant pour commencer, tandis que les flacons de 100 et 200 ml offrent un meilleur prix au millilitre."
      offers={[
        {
          merchant: "Parfums Moins Chers",
          note: "Eau de toilette rechargeable 30 ml",
          price: "53,99 €",
          checkedAt: "2026-09-19",
          offer: "-23 % par rapport au prix indiqué de 70 €",
          href: "https://zmk.parfumsmoinschers.com/?P4642357CD2D191&redir=https%3A%2F%2Fwww.parfumsmoinschers.com%2Fproduit%2F65010-acqua-di-gio-giorgio-armani-eau-de-toilette-spray-30-ml.html%3Futm_source%3DMicrosoftAds%26utm_medium%3DCPC%26utm_campaign%3DMicrosoftShopping%26kwkuniv%3DP46423557DE3100-ccp46423557de3191-ZGRiODVmMmNmM2I5M2YzZjllNzYyN2I3ZjZiMjdhNmQ%253D%26utm_content%3D359907",
        },
        {
          merchant: "Parfums Moins Chers",
          note: "Eau de toilette vaporisateur 100 ml",
          price: "83,99 €",
          checkedAt: "2026-09-19",
          offer: "-26 % par rapport au prix indiqué de 114 €",
          href: "https://zmk.parfumsmoinschers.com/?P4642357CD2D191&redir=https%3A%2F%2Fwww.parfumsmoinschers.com%2Fproduit%2F65010-acqua-di-gio-giorgio-armani-eau-de-toilette-spray-30-ml.html%3Futm_source%3DMicrosoftAds%26utm_medium%3DCPC%26utm_campaign%3DMicrosoftShopping%26kwkuniv%3DP46423557DE3100-ccp46423557de3191-ZGRiODVmMmNmM2I5M2YzZjllNzYyN2I3ZjZiMjdhNmQ%253D%26utm_content%3D359907",
        },
        {
          merchant: "Parfums Moins Chers",
          note: "Eau de toilette vaporisateur 200 ml",
          price: "130,99 €",
          checkedAt: "2026-09-19",
          offer: "-27 % par rapport au prix indiqué de 179 €",
          href: "https://zmk.parfumsmoinschers.com/?P4642357CD2D191&redir=https%3A%2F%2Fwww.parfumsmoinschers.com%2Fproduit%2F65010-acqua-di-gio-giorgio-armani-eau-de-toilette-spray-30-ml.html%3Futm_source%3DMicrosoftAds%26utm_medium%3DCPC%26utm_campaign%3DMicrosoftShopping%26kwkuniv%3DP46423557DE3100-ccp46423557de3191-ZGRiODVmMmNmM2I5M2YzZjllNzYyN2I3ZjZiMjdhNmQ%253D%26utm_content%3D359907",
        },
      ]}
    />
  );
}
