import { getArticlesByCategory } from "@/lib/articles";
import Header from "@/app/components/Header";
import LoadMoreGrid from "@/app/components/LoadMoreGrid";
import type { Metadata } from "next";
import { ChevronRight, Tag, Gift, Trophy, ShoppingBag, Calendar, TreePine, FlaskConical, Ticket, Sparkles, type LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";

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


export async function generateStaticParams() {
  return ["bon-plan", "test-gratuit", "test-avis", "test-produit", "concours", "box-beaute", "beaute", "selection", "calendrier", "calendrier-avent", "code-promo"].map((slug) => ({ slug }));
}

interface PageProps { params: Promise<{ slug: string }>; }

const categoryConfig: Record<string, { label: string; Icon: LucideIcon; desc: string; seoTitle: string; seoDesc: string; color: string }> = {
  // seoTitle : raccourcis < 60 chars (suppression du suffixe "— Bons Plans Mania" déjà présent dans le siteName)
  "bon-plan":         { label: "Bons Plans",             Icon: Tag,          desc: "Toutes les réductions, promos et codes exclusifs", seoTitle: "Bons Plans Beauté : Codes Promo & Réductions 2026", seoDesc: "Tous les bons plans beauté, codes promo et réductions du moment. Économisez sur vos marques préférées : Sephora, Yves Rocher, Amazon, Lookfantastic et plus. Mis à jour quotidiennement.", color: "bon-plan" },
  "test-produit":     { label: "Tests Produits",           Icon: FlaskConical, desc: "Tests gratuits et avis détaillés sur les produits beauté", seoTitle: "Tests Produits : Tests Gratuits et Avis Beauté", seoDesc: "Tous nos tests produits : tests gratuits (Trustt, ConsoBaby, Amazon) et avis détaillés sur les cosmétiques, soins et maquillage. Mis à jour quotidiennement.", color: "test-gratuit" },
  "test-gratuit":     { label: "Tests Gratuits",          Icon: Gift,         desc: "Des produits à tester gratuitement avant tout le monde", seoTitle: "Tests Gratuits : Produits Beauté à Tester", seoDesc: "Recevez des produits beauté gratuits à tester chez vous. Missions Trustt, ConsoBaby, TikTok et plus. Inscrivez-vous et testez les nouveautés avant tout le monde.", color: "test-gratuit" },
  "test-avis":        { label: "Tests & Avis",            Icon: FlaskConical, desc: "Nos tests et avis détaillés sur les produits beauté", seoTitle: "Tests & Avis Produits Beauté : Comparatifs", seoDesc: "Tests et avis détaillés sur les produits beauté. Comparatifs, notes et recommandations pour bien choisir vos cosmétiques, soins et maquillage.", color: "test-avis" },
  "concours":         { label: "Concours",                Icon: Trophy,       desc: "Les meilleurs jeux concours avec des lots à gagner", seoTitle: "Concours & Jeux : Gagnez Lots Beauté & Tech", seoDesc: "Les meilleurs jeux concours gratuits avec des lots à gagner : coffrets beauté, voyages, high-tech, bons d'achat. Participez en quelques clics, mis à jour chaque jour.", color: "concours" },
  "box-beaute":       { label: "Box Beauté",              Icon: ShoppingBag,  desc: "Tests et avis complets sur les box beauté du moment", seoTitle: "Box Beauté : Avis, Comparatifs et Bons Plans", seoDesc: "Découvrez les meilleures box beauté du moment : Blissim, Biotyfull Box, Lookfantastic. Avis détaillés, comparatifs et codes promo pour économiser sur vos abonnements.", color: "box-beaute" },
  "beaute":           { label: "Beauté",                   Icon: Sparkles,     desc: "Tutos, guides, comparatifs et avis sur les produits beauté", seoTitle: "Conseils Beauté : Tutos, Tests et Guides", seoDesc: "Tutos maquillage, comparatifs soins, guides skincare et avis produits. Tous nos conseils beauté pour bien choisir vos cosmétiques.", color: "beaute" },
  "selection":        { label: "Sélection",               Icon: Calendar,     desc: "Nos coups de cœur et sélections du moment", seoTitle: "Sélections Beauté : Nos Coups de Cœur", seoDesc: "Nos sélections et coups de cœur beauté du moment. Les meilleurs produits testés et approuvés par la rédaction, à prix doux.", color: "selection" },
  "calendrier":       { label: "Calendrier",              Icon: Calendar,     desc: "Calendriers beauté et coffrets à saisir", seoTitle: "Calendriers Beauté : Offres et Coffrets", seoDesc: "Calendriers beauté et coffrets à saisir. Les meilleures offres sur les calendriers des grandes marques beauté.", color: "calendrier" },
  "calendrier-avent": { label: "Calendrier de l'Avent",  Icon: TreePine,     desc: "Les meilleurs calendriers de l'avent beauté du moment", seoTitle: "Calendriers de l'Avent Beauté : Comparatif", seoDesc: "Les meilleurs calendriers de l'Avent beauté : Sephora, Dior, Rituals, Lookfantastic. Comparatif complet, prix, contenu et codes promo pour les acheter moins cher.", color: "calendrier-avent" },
  "code-promo":       { label: "Codes Promo",             Icon: Ticket,       desc: "Les meilleurs codes promo et réductions du moment", seoTitle: "Codes Promo Beauté & Mode : Réductions Exclusives", seoDesc: "Tous les codes promo beauté et mode du moment : Blanche Porte, Dr Pierre Ricaud, Sephora, Yves Rocher. Codes vérifiés et mis à jour régulièrement.", color: "code-promo" },
};

/**
 * Intros SEO 200-300 mots sur les pages catégorie.
 * Sans ces blocs, Google voyait les pages catégorie comme des pages "thin content"
 * (aucun texte propre, uniquement une grille de liens vers les articles).
 */
const categoryIntros: Record<string, string> = {
  "bon-plan": `<p>Bienvenue dans la <strong>plus grande sélection de bons plans</strong> de Bons Plans Mania. Nous référençons chaque jour les meilleures réductions du moment : promos beauté (Sephora, Yves Rocher, Nuxe, Caudalie), bons plans bébé (Pampers, Béaba, Tidoo), électroménager (Bosch, Philips, Rowenta), high-tech (Amazon, Cdiscount, Fnac), mode (Showroomprivé, Gémo, Petit Bateau), et bien plus.</p><p>Tous les bons plans sont <strong>vérifiés un par un</strong> par notre équipe — vrais prix, vraies promos, vraies dates de validité. Nous indiquons systématiquement le prix avant/après, le pourcentage de remise, la durée de l'offre et les conditions (code promo, minimum d'achat, expéditeur). Nos articles incluent souvent une <strong>capture d'écran de la promo</strong> pour preuve.</p><p>Astuce : si tu cherches un produit en particulier, utilise la barre de recherche ou explore par marque via <a href="/marques">notre annuaire marques</a>. Pour les offres permanentes (toute l'année), regarde <a href="/codes-promo-permanents">codes promo permanents</a>. Et pour cumuler ton bon plan avec du cashback (1-20%), inscris-toi à iGraal — on en explique le fonctionnement dans nos articles dédiés.</p>`,

  "test-produit": `<p>Les <strong>tests produits</strong> regroupent à la fois les <a href="/categorie/test-gratuit">tests gratuits</a> (échantillons offerts contre un avis) et les <a href="/categorie/test-avis">avis détaillés</a> sur les produits qu'on a réellement utilisés.</p><p>Pour les tests gratuits, nous référençons les missions Trustt, Konbini, Sampleo, ConsoBaby, Mamadvisor, BeautéTest, Cosmétique-testing et les missions TikTok / Instagram des marques (Marilou Bio, ACM, Tout Petit Marseillais, etc.). L'inscription est toujours gratuite, et le produit est envoyé chez toi en échange d'un avis honnête.</p><p>Côté tests & avis, nous publions des comparatifs (lisseurs, robots aspirateurs, parfums, planchas) et des avis individuels sur les produits phares (Babycook, Foreo Bear, Yuka, Tiger Balm…). On indique systématiquement les avantages ET les inconvénients, parce qu'on est avant tout consommateurs nous aussi.</p>`,

  "test-gratuit": `<p>Reçois <strong>des produits beauté gratuits à tester chez toi</strong> en échange de ton avis. Nous référençons chaque semaine les meilleures opportunités de tests gratuits : missions Trustt (jusqu'à 100 testeurs par campagne), Konbini, Sampleo, ConsoBaby (puériculture), Mamadvisor, BeautéTest, Cosmétique-testing, missions ambassadrice TikTok (Marilou Bio, ACM, Tout Petit Marseillais, La Roche-Posay…) et programmes d'échantillonnage des grandes marques.</p><p>Le principe est simple : tu t'inscris (gratuit), tu remplis ton profil, et tu reçois le produit chez toi en échange d'un avis. Les missions Trustt sont les plus généreuses (produit entier offert), tandis que d'autres envoient des échantillons.</p><p>Conseil : <strong>inscris-toi à plusieurs plateformes</strong> en même temps pour multiplier tes chances. Les places sont limitées et partent vite (souvent en 24-48h). Active aussi les notifications email pour être prévenue à chaque nouvelle mission.</p>`,

  "test-avis": `<p>Nos <strong>tests et avis</strong> sont basés sur l'utilisation réelle des produits, par nous ou par notre communauté. Pas de copier-coller de fiches techniques, pas d'avis sponsorisés déguisés — on dit ce qu'on pense, en toute transparence.</p><p>Tu y trouveras des <strong>comparatifs guides d'achat</strong> sur les catégories importantes (parfums hommes, lisseurs cheveux, robots aspirateurs, planchas, matelas, sérums anti-âge), des <strong>avis marque</strong> (Dr Pierre Ricaud, Nuxe, Yves Rocher, Caudalie, Beauty Success) et des <strong>tests produits individuels</strong> sur des références phares (Foreo Bear, Babycook, Tiger Balm, Yuka).</p><p>Chaque test indique le prix, les avantages, les inconvénients, pour qui c'est fait, des alternatives à considérer, et notre note finale. Les liens vers Amazon, Awin ou Rakuten sont affiliés, ce qui nous permet de rémunérer le travail de test — sans surcoût pour toi.</p>`,

  "concours": `<p>Les <strong>jeux concours gratuits</strong> sont notre marque de fabrique : 15 ans d'expérience en tant que concouriste, ça forme un œil ! Nous référençons quotidiennement les meilleurs concours du moment, avec des lots à gagner pour tous les goûts : coffrets beauté (Magnifaïk, Biotyfull, Adopt), voyages (Europa-Park, Center Parcs, MS Vacances), high-tech (smartphones, électroménager), bons d'achat (Sephora, Yves Rocher, Amazon), et même de l'argent en cash.</p><p>Chaque concours indique : la date limite de participation, les lots à gagner précisément, les conditions (achat obligatoire ou non, âge, résidence), et le lien direct pour participer. Nous filtrons les <strong>fake concours</strong> et les arnaques pour ne te proposer que des concours sérieux organisés par des marques réelles ou des plateformes reconnues (La Belle Adresse, MesInstantsVico, MaFamilleZen…).</p><p>Astuce : inscris-toi aussi à notre newsletter — on envoie chaque semaine la sélection des concours qu'on garde "à part" (ceux avec peu de participants donc plus de chances de gagner).</p>`,

  "box-beaute": `<p>Les <strong>box beauté</strong> sont parfaites pour découvrir de nouveaux produits cosmétiques chaque mois sans se ruiner. Nous testons et comparons les meilleures box du marché : <strong>Biotyfull Box</strong> (100% bio, française), <strong>Blissim</strong> (la plus connue, multi-marques), <strong>Glowria</strong> (skincare premium), <strong>Lookfantastic Beauty Box</strong> (marques anglaises et internationales), <strong>My Little Box</strong>, <strong>Birchbox</strong>…</p><p>Pour chaque box, nous indiquons : le prix mensuel, la valeur des produits inclus (souvent 2-3 fois le prix d'achat), le type de produits (skincare, maquillage, cheveux, corps), le format (boîte mensuelle vs ponctuelle), les marques présentes, et les meilleurs codes promo pour économiser sur le premier mois ou l'année.</p><p>La Biotyfull Box mérite une mention spéciale : <strong>chaque mois une box thématique à 19,90€</strong> avec 5-7 produits de marques bio reconnues (Endro, Phyt's, Centifolia, Bioregena). Et plusieurs fois par an ils sortent des box spéciales (Noël, Fête des Mères) à des prix flash imbattables.</p>`,

  "beaute": `<p>Nos <strong>conseils beauté</strong> regroupent tutos, guides et comparatifs pour bien choisir tes cosmétiques. Routine skincare (sérums, crèmes, exfoliants), maquillage (fond de teint, mascara, rouges à lèvres), soins anti-âge, soins cheveux (shampoings, masques, traitements), cosmétiques bio et made in France…</p><p>Nous croisons systématiquement <strong>les notes Yuka</strong>, les avis Yuka-rivaux (INCI Beauty, Beauty Notation), et les avis utilisateurs Amazon / sites marchands pour t'aider à faire un choix éclairé. Nos comparatifs incluent toujours une fourchette de prix, le pays de fabrication, la composition (présence ou non de perturbateurs endocriniens, parfums allergisants), et nos coups de cœur personnels.</p><p>On traite aussi les <strong>sujets santé connexes</strong> comme l'aromathérapie (huiles essentielles), les remèdes naturels (Tiger Balm), les soins bébé (Mustela, Tidoo, Bioderma), les soins hommes (parfums, après-rasage, gel cheveux).</p>`,

  "selection": `<p>Nos <strong>sélections beauté</strong> sont nos coups de cœur du moment, testés et approuvés par la rédaction. À la différence des bons plans (qui priorisent le prix) ou des tests avis (qui détaillent un produit), les sélections sont des regroupements éditoriaux pour des occasions précises : "Top 5 produits pour la peau sèche", "Notre routine anti-âge à moins de 50€", "Les meilleurs cadeaux beauté pour la Fête des Mères", "Notre sélection bio pour les peaux sensibles"…</p><p>Chaque sélection mélange grandes marques (Caudalie, Nuxe, La Roche-Posay) et marques indé (Endro, Centifolia, Marilou Bio) pour t'offrir le meilleur de chaque univers. Les prix vont du très accessible (~10€) au premium (~100€) pour s'adapter à tous les budgets.</p>`,

  "calendrier": `<p>Les <strong>calendriers beauté</strong> regroupent les coffrets et boîtes éphémères qui rythment l'année : calendrier de l'Avent (novembre-décembre), coffrets Saint-Valentin, coffrets Fête des Mères, coffrets Fête des Pères, coffrets Noël… Bref, toutes les occasions où les marques sortent des produits ou packs limités à valeur ajoutée.</p><p>On référence les calendriers de toutes les grandes marques (Sephora, Dior, Yves Rocher, Nuxe, Caudalie, Rituals, Lookfantastic) et on indique : le prix de lancement, la valeur réelle des produits inclus (souvent +200% du prix payé), le contenu détaillé, les meilleurs codes promo pour les acheter moins cher.</p>`,

  "calendrier-avent": `<p>Le <strong>calendrier de l'Avent beauté</strong> est devenu un incontournable de fin d'année. Nous comparons chaque année les meilleurs calendriers du marché : <strong>Sephora</strong> (le plus généreux en valeur), <strong>Lookfantastic</strong> (marques internationales premium), <strong>Dior</strong> (le luxe), <strong>Rituals</strong> (le meilleur rapport contenu/prix), <strong>Yves Rocher</strong> (le plus accessible), <strong>Birchbox</strong>, <strong>Glossybox</strong>…</p><p>Pour chaque calendrier, on indique : le prix, la valeur des produits inclus (souvent 2-3 fois le prix), le nombre de cases (24-25), la répartition skincare / maquillage / parfum / corps, les marques présentes, et notre note finale. Le top achat se fait début octobre — les meilleurs partent vite.</p><p>Conseil : pour économiser, surveille les <strong>codes promo de pré-commande</strong> (souvent -10 à -20% en septembre-octobre).</p>`,

  "code-promo": `<p>Tous les <strong>codes promo</strong> vérifiés et à jour pour économiser sur tes achats en ligne. Beauté (Sephora, Yves Rocher, Adopt, Caudalie, Nuxe, Dr Pierre Ricaud), mode (Blanche Porte, Petit Bateau, Gémo, Showroomprivé), animaux (Zooplus), alimentaire bio (Greenweez, Léa Nature), high-tech (Cdiscount, Boulanger), grandes marketplaces…</p><p>Chaque code est <strong>testé et daté</strong> : on indique la réduction (%, €, livraison offerte), les conditions (minimum d'achat, exclusions), la durée de validité, et la marche à suivre exacte pour l'appliquer. Si un code expire, on le retire ou on le grise immédiatement pour ne pas te faire perdre de temps.</p><p>Astuce : combine toujours un code promo avec un <strong>cashback iGraal</strong> (1-20% remboursés) pour maximiser tes économies. On en parle dans <a href="/codes-promo-permanents">notre page codes promo permanents</a> qui liste toutes les marques avec des codes valables toute l'année.</p>`,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryConfig[slug];
  if (!cat) return {};
  return {
    title: cat.seoTitle,
    description: cat.seoDesc,
    alternates: { canonical: `https://bonsplansmania.fr/categorie/${slug}` },
    openGraph: {
      title: cat.seoTitle,
      description: cat.seoDesc,
      url: `https://bonsplansmania.fr/categorie/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: cat.seoTitle,
      description: cat.seoDesc,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = categoryConfig[slug];
  if (!cat) notFound();

  // Page parente test-produit : regroupe test-gratuit + test-avis
  const articles = slug === "test-produit"
    ? [...getArticlesByCategory("test-gratuit"), ...getArticlesByCategory("test-avis")]
        .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    : getArticlesByCategory(slug);

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
      featured: a.meta.featured,
      tags: a.meta.tags,
      price: a.meta.price,
    };
  });

  // Catégories où les filtres sont utiles (avec prix / marques / remises)
  // Filtres désactivés partout pour le moment — à refaire from scratch
  const useFilters = false;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: cat.label,
          description: cat.desc,
          url: `https://bonsplansmania.fr/categorie/${slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 10).map((a, i) => ({
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
            { "@type": "ListItem", position: 2, name: cat.label },
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
              <span><cat.Icon size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />{cat.label}</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <cat.Icon size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />{cat.label}
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              {cat.desc} — {articles.length} article{articles.length > 1 ? "s" : ""}
            </p>
            {slug === "test-produit" && (
              <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
                <a href="/categorie/test-gratuit" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "24px", background: "#FFF7ED", color: "#C2410C", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", border: "1.5px solid #C2410C22" }}>
                  <Gift size={14} /> Tests Gratuits
                </a>
                <a href="/categorie/test-avis" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "24px", background: "#EDE9FE", color: "#6D28D9", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", border: "1.5px solid #6D28D922" }}>
                  <FlaskConical size={14} /> Tests & Avis
                </a>
              </div>
            )}
          </div>
        </section>

        {categoryIntros[slug] && (
          <section className="container" style={{ paddingTop: "20px", paddingBottom: "0" }}>
            <div
              style={{ background: "white", border: "1px solid var(--border, #e5e7eb)", borderRadius: "16px", padding: "24px 28px", fontSize: "0.97rem", lineHeight: 1.65, color: "#1f2937" }}
              dangerouslySetInnerHTML={{ __html: categoryIntros[slug] }}
            />
          </section>
        )}

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section">
          <div className="container">
            {articles.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "64px 0" }}>
                Aucun article dans cette catégorie pour le moment.
              </p>
            ) : (
              <LoadMoreGrid articles={cards} />
            )}

            {/* Pagination statique : lien vers les pages paginées pour que Google découvre tous les articles
                (le LoadMoreGrid charge en JS donc les articles 25+ sont invisibles dans le HTML statique) */}
            {articles.length > 24 && (
              <nav aria-label="Pagination" style={{ marginTop: "40px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ padding: "10px 16px", fontWeight: 600 }}>Page 1 sur {Math.ceil(articles.length / 24)}</span>
                <a href={`/categorie/${slug}/page/2`} rel="next" style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border, #e5e7eb)", textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Suivante <ChevronRight size={16} />
                </a>
              </nav>
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
      <StickyAdMobile />
    </>
  );
}
