import type { Metadata } from "next";
import CommunityProductPage from "@/app/components/CommunityProductPage";

const slug = "sol-de-janeiro-cheirosa-62-perfume-mist-90ml";
const canonical = `https://bonsplansmania.fr/produit/${slug}`;

export const metadata: Metadata = {
  title: "Sol de Janeiro Cheirosa 62 : avis et où l’acheter",
  description:
    "Sol de Janeiro Cheirosa 62 Brume Parfumée 90 ml : notre présentation, les notes olfactives, les avis de la communauté Bons Plans Mania et où trouver le flacon.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function SolDeJaneiroCheirosa62ProductPage() {
  return (
    <CommunityProductPage
      slug={slug}
      brand="Sol de Janeiro"
      name="Cheirosa 62 Brume Parfumée 90 ml"
      image="/images/products/sol-de-janeiro-cheirosa-62-perfume-mist-90ml.png"
      imageAlt="Flacon Sol de Janeiro Cheirosa 62 Brume Parfumée 90 ml"
      lead="L’odeur qui a rendu la marque brésilienne célèbre : pistache et caramel salé sur un fond de vanille et d’héliotrope. Une brume pour le corps et les cheveux, plus légère qu’une eau de parfum mais qui tient étonnamment bien sur la peau."
      idealFor={["Les amateurs de brumes parfumées gourmandes", "Les personnes qui apprécient la pistache, la vanille et le caramel salé", "Une senteur solaire à vaporiser sur le corps et les cheveux"]}
      strengths={["Signature gourmande reconnaissable", "Brume utilisable sur le corps et les cheveux", "Format 90 ml facile à emporter"]}
      watchOut={["Une brume parfumée est généralement plus légère qu’une eau de parfum", "La tenue et le rendu varient selon la peau et les cheveux"]}
      editorialNote="Notre avis : Cheirosa 62 convient surtout aux personnes qui aiment les senteurs solaires et gourmandes. La pistache et l’amande ouvrent la composition, tandis que le caramel salé, la vanille et le bois de santal donnent un fond chaud et sucré."
      offers={[
        {
          merchant: "LookFantastic",
          note: "Flacon 90 ml",
          price: "18,75 €",
          checkedAt: "2026-08-14",
          href: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fp%2Fsol-de-janeiro-cheirosa-62-perfume-mist-90ml%2F13663341%2F%3Faffil%3Dawin%26utm_content%3Dhttps%253A%252F%252Fbonsplansmania.fr%252F%26utm_term%3DContent%26utm_source%3DAWin_990397%26utm_medium%3Daffiliate%26utm_campaign%3DAffiliateWin%26sv1%3Daffiliate%26sv_campaign_id%3D990397%26awc%3D7496_1785591667_1cef211f2f9313d43f060c0af9997fc4",
        },
      ]}
    />
  );
}
