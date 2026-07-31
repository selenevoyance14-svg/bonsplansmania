import { getAllArticles } from "@/lib/articles";
import Header from "@/app/components/Header";
import BrandFilter from "@/app/components/BrandFilter";
import { NINJA_BRANDS } from "@/lib/brand-filters";
import type { Metadata } from "next";
import { ChevronRight, Flame, Star, Award } from "lucide-react";
import AdBlock from "@/app/components/AdBlock";

const categoryLabels: Record<string, { label: string; color: string }> = {
  "bon-plan":         { label: "Bon Plan",              color: "bon-plan" },
  "test-gratuit":     { label: "Test Gratuit",          color: "test-gratuit" },
  "test-avis":        { label: "Test & Avis",           color: "test-avis" },
  "concours":         { label: "Concours",              color: "concours" },
  "box-beaute":       { label: "Box Beauté",            color: "box-beaute" },
  "beaute":           { label: "Beauté",                color: "beaute" },
  "selection":        { label: "Sélection",             color: "selection" },
  "calendrier-avent": { label: "Calendrier de l'Avent", color: "calendrier-avent" },
  "code-promo":       { label: "Code Promo",            color: "code-promo" },
};

export const metadata: Metadata = {
  title: "Bons Plans Ninja : Airfryer, CREAMi, SLUSHi, Foodi — Bons Plans Mania",
  description: "Bons plans Ninja actuellement publiés : Airfryer Foodi, CREAMi, SLUSHi, CRISPi et blenders. Comparez les modèles, capacités et offres avant de commander.",
  alternates: { canonical: "https://bonsplansmania.fr/bons-plans-ninja" },
};

// Filtre simple : tag "ninja" OU slug contient "ninja"
const EXCLUDED_TAGS_FROM_HERE = new Set(["puericulture", "allaitement", "tire-lait", "biberon", "poussette", "siege-auto", "babyphone", "tetine", "chaise-haute", "porte-bebe", "cosy-bebe", "lit-bebe", "table-a-langer", "couche-bebe", "lait-maternel"]);

const EXCLUDED_CATEGORIES = new Set(["test-gratuit", "test-avis", "concours", "box-beaute"]);

function isNinjaArticle(meta: { slug?: string; tags?: string[]; category?: string }) {
  if (meta.category && EXCLUDED_CATEGORIES.has(meta.category)) return false;
  const slug = (meta.slug || "").toLowerCase();
  if (slug.includes("ninja")) return true;
  const tags = (meta.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => EXCLUDED_TAGS_FROM_HERE.has(t))) return false;
  return tags.some((t) => t === "ninja" || t.startsWith("ninja-"));
}

export default async function BonsPlansNinjaPage() {
  const all = getAllArticles();
  const articles = all.filter((a) => isNinjaArticle(a.meta));

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
      endDate: a.meta.endDate,
      tags: a.meta.tags,
      price: a.meta.price,
      affiliateUrl: a.meta.affiliateUrl,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Bons Plans Ninja — Airfryer, CREAMi, SLUSHi, Foodi",
          description: "Tous les bons plans, promos et tests sur les produits Ninja : airfryers Foodi, sorbetières CREAMi, machines à granités SLUSHi, friteuses CRISPi.",
          url: "https://bonsplansmania.fr/bons-plans-ninja",
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
            { "@type": "ListItem", position: 2, name: "Bons Plans Ninja" },
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
              <span><Flame size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />Bons Plans Ninja</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Flame size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#dc2626" }} />
              Bons Plans Ninja : Airfryer, CREAMi, SLUSHi, Foodi
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Retrouvez les <strong>bons plans Ninja actuellement publiés</strong> sur les <strong>Airfryers Foodi</strong> (Dual Zone, FlexDrawer), les machines à desserts glacés <strong>CREAMi</strong>, les machines à boissons glacées <strong>SLUSHi</strong>, les appareils <strong>CRISPi</strong> et les blenders. {articles.length} articles.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "16px" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px" }}>
              <Star size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Pourquoi les appareils Ninja sont-ils autant recherchés ?
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              <strong>Ninja</strong> propose plusieurs gammes consacrées à des usages précis : cuisson avec peu ou sans ajout d&apos;huile, desserts glacés, boissons fraîches et mixage. Cette diversité explique la présence de nombreux modèles, mais elle peut aussi compliquer le choix. Avant d&apos;acheter, il est important de comparer la <strong>capacité</strong>, le nombre de compartiments, les programmes, les dimensions et les accessoires réellement inclus.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Award size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Quel Ninja choisir selon ton usage
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Ninja Foodi Dual Zone</strong> : deux compartiments pour préparer simultanément deux aliments avec des réglages distincts.</li>
              <li><strong>Ninja Foodi FlexDrawer</strong> : un grand tiroir modulable, intéressant pour cuisiner des quantités plus importantes.</li>
              <li><strong>Ninja CRISPi</strong> : des récipients en verre permettant de surveiller la cuisson et de servir ou conserver plus facilement les préparations.</li>
              <li><strong>Ninja CREAMi</strong> : pour réaliser des glaces, sorbets, crèmes glacées et autres desserts froids à partir de préparations congelées.</li>
              <li><strong>Ninja SLUSHi</strong> : conçue pour les boissons glacées, granités et cocktails sans devoir ajouter de glace dans la cuve.</li>
              <li><strong>Ninja Blast</strong> : un blender personnel et transportable destiné notamment aux smoothies et aux boissons mixées.</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Flame size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Où trouver les meilleurs prix Ninja
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Les prix des appareils Ninja varient selon le <strong>modèle</strong>, le vendeur et les opérations commerciales. Bons Plans Mania rassemble sur cette page les offres publiées concernant les Airfryers Foodi, les CREAMi, les SLUSHi, les CRISPi et les blenders Ninja.
            </p>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Avant de commander, compare le prix avec les autres vendeurs et vérifie la <strong>référence exacte</strong>, la capacité, les accessoires inclus ainsi que les conditions de livraison. Les soldes, le Black Friday ou les opérations Prime Day peuvent proposer des réductions, mais ces périodes ne garantissent pas automatiquement le prix le plus bas.
            </p>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Les conditions de retour, de garantie et de livraison dépendent du produit et du vendeur sélectionné. Elles doivent être contrôlées directement sur la fiche de l&apos;offre avant l&apos;achat.
            </p>

            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              Comment repérer une offre Ninja intéressante ?
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li>Compare la référence complète : deux appareils visuellement proches peuvent avoir des capacités ou accessoires différents.</li>
              <li>Vérifie le prix au moment de la commande : une promotion peut évoluer ou se terminer rapidement.</li>
              <li>Choisis la capacité selon le nombre de personnes et la place disponible dans la cuisine.</li>
              <li>Ne paie pas pour des fonctions ou accessoires que tu n&apos;utiliseras pas réellement.</li>
              <li>Contrôle l&apos;identité du vendeur, les délais de livraison et les conditions de retour.</li>
            </ul>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Certains liens présents dans les articles sont affiliés. Bons Plans Mania peut recevoir une commission en cas d&apos;achat, sans coût supplémentaire pour toi.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>
              Tous les bons plans Ninja ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Les bons plans Ninja seront bientôt disponibles.
              </p>
            ) : (
              <BrandFilter articles={cards} brands={NINJA_BRANDS} />
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
