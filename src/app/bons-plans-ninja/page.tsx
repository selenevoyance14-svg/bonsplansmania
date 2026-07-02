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
  description: "Tous les bons plans Ninja du moment : airfryers Foodi, sorbetières CREAMi, machines à granités SLUSHi, friteuses CRISPi. La marque culte 2026 du petit électroménager cuisine.",
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
              Tous les <strong>bons plans Ninja</strong> du moment, la marque culte 2026 du petit électroménager cuisine. <strong>Airfryers Foodi</strong> (Dual Zone, FlexDrawer), <strong>sorbetières CREAMi</strong> (Scoop and Swirl, Deluxe), <strong>machines à granités SLUSHi</strong>, <strong>friteuses sans huile CRISPi</strong>. {articles.length} articles.
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
              Pourquoi Ninja cartonne en 2026
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "12px" }}>
              <strong>Ninja</strong> est devenue en quelques années la marque favorite des passionnés de cuisine maison. Chaque gamme a un produit star : <strong>Foodi</strong> pour les airfryers familiaux, <strong>CREAMi</strong> pour les glaces maison, <strong>SLUSHi</strong> pour les granités d&apos;été, <strong>CRISPi</strong> pour la friteuse sans huile en verre. La marque combine <strong>design soigné</strong>, <strong>fonctionnalités innovantes</strong> et <strong>prix accessibles</strong> vs les marques premium type Vitamix ou KitchenAid.
            </p>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Award size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Quel Ninja choisir selon ton usage
            </h2>
            <ul style={{ color: "var(--muted-foreground)", marginBottom: "16px", paddingLeft: "20px" }}>
              <li><strong>Ninja Foodi (airfryer)</strong> : pour la cuisson saine du quotidien, viande, légumes, frites sans huile. Modèles Dual Zone (2 tiroirs) = top famille.</li>
              <li><strong>Ninja CRISPi</strong> : la version verre de l&apos;airfryer, visibilité de la cuisson + nettoyage facile.</li>
              <li><strong>Ninja CREAMi</strong> : glaces, sorbets, gelatos, milkshakes maison. Le must si vous avez des enfants ou des invités gourmands.</li>
              <li><strong>Ninja SLUSHi</strong> : machines à granités et boissons glacées. Indispensable pour l&apos;été et les fêtes des enfants.</li>
              <li><strong>Ninja Blast / Mixer</strong> : blenders portables et personnels pour smoothies et shakes.</li>
            </ul>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "12px", marginTop: "24px" }}>
              <Flame size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Où trouver les meilleurs prix Ninja
            </h2>
            <p style={{ color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Les <strong>prix Ninja varient beaucoup sur Amazon</strong> : un airfryer Foodi peut passer de 250 € à 165 € selon les périodes. Les <strong>Prime Days (juillet)</strong> et le <strong>Black Friday (novembre)</strong> sont les meilleurs moments pour craquer. Suivre cette page = recevoir directement les baisses de prix dès qu&apos;elles tombent. Côté garantie Amazon : <strong>retour 30 jours offert</strong>, livraison Prime souvent gratuite.
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
