import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, Tag, Percent, Zap } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan":         { label: "Bon Plan",              color: "bon-plan" },
  "bon-plan-beaute":  { label: "Bon Plan",              color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           color: "test-avis" },
  "concours":         { label: "Concours",              color: "concours" },
  "box-beaute":       { label: "Box Beauté",            color: "box-beaute" },
  "beaute":           { label: "Beauté",                color: "beaute" },
  "selection":        { label: "Beauté",                color: "beaute" },
  "calendrier-avent": { label: "Calendrier de l'Avent", color: "calendrier-avent" },
  "code-promo":       { label: "Code Promo",            color: "code-promo" },
};

export const metadata: Metadata = {
  title: "Amazon Bons Plans 2026 : Promos, Codes Promo et Réductions — Bons Plans Mania",
  description: "Tous les meilleurs bons plans Amazon du moment : promos flash, produits à prix cassés en beauté, bébé, maison, tech et mode. Sélection mise à jour quotidiennement.",
  alternates: { canonical: "https://bonsplansmania.fr/amazon-bons-plans" },
};

export default async function AmazonBonsPlansPage() {
  const all = getAllArticles();

  const articles = all.filter((a) => {
    const tags = (a.meta.tags || []).map((t) => t.toLowerCase());
    const title = (a.meta.title || "").toLowerCase();
    const url = (a.meta.affiliateUrl || "").toLowerCase();
    return (
      tags.includes("amazon") ||
      title.includes("amazon") ||
      url.includes("amzn.to") ||
      url.includes("amazon.fr") ||
      url.includes("amazon.com")
    );
  });

  const cards = articles.map((a) => {
    const cl = categoryLabels[a.meta.category];
    return {
      slug: a.meta.slug,
      title: a.meta.title,
      description: a.meta.description,
      date: a.meta.date,
      image: a.meta.image,
      imageAlt: a.meta.imageAlt,
      category: a.meta.category,
      categoryLabel: cl?.label ?? a.meta.category,
      categoryColor: cl?.color ?? a.meta.category,
      readingTime: a.meta.readingTime,
      expired: a.meta.expired,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Amazon Bons Plans 2026",
          description: "Tous les meilleurs bons plans Amazon du moment en beauté, bébé, maison, tech et mode.",
          url: "https://bonsplansmania.fr/amazon-bons-plans",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 20).map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://bonsplansmania.fr/article/${a.meta.slug}`,
              name: a.meta.title,
            })),
          },
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://bonsplansmania.fr" },
            { "@type": "ListItem", position: 2, name: "Amazon Bons Plans" },
          ],
        }) }}
      />
      <Header />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span><Tag size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Amazon Bons Plans</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Zap size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#f59e0b" }} />
              Amazon Bons Plans 2026 : les meilleures promos du moment
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Notre sélection complète de <strong>bons plans Amazon</strong> : beauté, puériculture, maison, mode, tech… Promos flash, ventes limitées, codes promo et réductions jusqu&apos;à -80% sur les plus grandes marques. {articles.length} offres mises à jour quotidiennement.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <Percent size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Comment trouver les meilleurs bons plans Amazon ?
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              <strong>Amazon</strong> propose des millions de produits avec des promos qui changent en permanence. Le plus dur n&apos;est pas de trouver un bon plan — c&apos;est de repérer les <strong>vraies bonnes affaires</strong> au bon moment. On trie pour toi les offres vraiment intéressantes : promos flash à durée limitée, produits avec plus de 4,5/5 d&apos;avis, fins de série à prix cassé.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>Nos conseils pour maximiser tes économies</h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Active le cashback iGraal</strong> (jusqu&apos;à 2,5% sur Amazon) avant de valider ton panier</li>
              <li><strong>Vérifie l&apos;historique des prix</strong> avec une extension comme Keepa pour éviter les fausses promos</li>
              <li><strong>Ajoute aux favoris</strong> puis attends les Prime Days et les French Days pour acheter</li>
              <li><strong>Cumule les coupons Amazon</strong> (cases à cocher) avec les remises affichées</li>
              <li><strong>Privilégie Prime</strong> pour la livraison gratuite 24-48h et les offres exclusives</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>Les catégories Amazon les plus attractives</h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Beauté & soins</strong> : CeraVe, La Roche-Posay, Garnier, Maybelline — souvent -30 à -50%</li>
              <li><strong>Puériculture</strong> : Philips Avent, MAM, Thermobaby, Chicco, Homvana — tarifs imbattables sur les biberons et accessoires bébé</li>
              <li><strong>Tech & maison</strong> : Roborock, Dyson, Ninja, Tefal, Xiaomi — promos flash fréquentes</li>
              <li><strong>Mode & sport</strong> : Under Armour, Asics, Nike, Columbia — fins de série bien remisées</li>
              <li><strong>Épicerie & nutrition</strong> : packs économiques, compléments, cafés en capsules</li>
            </ul>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans Amazon du moment ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans Amazon seront bientôt disponibles.
              </p>
            ) : (
              <LoadMoreGrid articles={cards} />
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} BonsPlansMania — Certains liens sont des liens affiliés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
