import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import { FEATURED_PARTNER, isFeaturedPartnerActive } from "@/lib/featured-partner";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import Header from "@/app/components/Header";
import EditorialNewsletter from "./EditorialNewsletter";
import AmazonCardPrice from "@/app/components/AmazonCardPrice";
import { hasDirectMerchantCta } from "@/lib/article-commerce";
import { formatCardTitle } from "@/lib/display-title";
import styles from "./refonte.module.css";

const labels: Record<string, string> = {
  "bon-plan": "Bon plan repéré",
  "bon-plan-beaute": "Trouvaille beauté",
  "box-beaute": "Box du mois",
  "code-promo": "Code à retenir",
  concours: "Concours ouvert",
  "test-gratuit": "Test gratuit",
  comparatif: "Le guide",
};

const FREE_TEST_CATEGORIES = new Set(["test-gratuit", "test-produit"]);

// Les contenus éditoriaux ont leurs propres rubriques et ne doivent pas
// prendre la place des nouveaux bons plans dans la sélection de l'accueil.
const HOMEPAGE_EDITORIAL_CATEGORIES = new Set([
  "test-avis",
  "comparatif",
  "selection",
]);

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(
    new Date(`${date}T12:00:00`),
  );
}

function merchantHref(slug: string, affiliateUrl?: string) {
  return process.env.NODE_ENV === "development" && affiliateUrl
    ? affiliateUrl
    : `/go/${slug}`;
}

function getBrandKey(title: string) {
  const cleaned = formatCardTitle(title)
    .toLocaleLowerCase("fr-FR")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9à-ÿ\s-]/g, " ")
    .trim();

  const compoundBrands = [
    "la roche-posay", "l oréal", "the ordinary", "beauty of joseon",
    "elizabeth arden", "jean paul gaultier", "yves saint laurent",
  ];
  return compoundBrands.find((brand) => cleaned.startsWith(brand)) ?? cleaned.split(/\s+/)[0] ?? cleaned;
}

function selectDiverse<T extends { meta: { slug: string; title: string } }>(
  articles: T[],
  count: number,
  excluded = new Set<string>(),
) {
  const selected: T[] = [];
  const brands = new Set<string>();

  for (const article of articles) {
    if (excluded.has(article.meta.slug)) continue;
    const brand = getBrandKey(article.meta.title);
    if (brands.has(brand)) continue;
    selected.push(article);
    brands.add(brand);
    if (selected.length === count) break;
  }

  if (selected.length < count) {
    const selectedSlugs = new Set(selected.map((article) => article.meta.slug));
    for (const article of articles) {
      if (excluded.has(article.meta.slug) || selectedSlugs.has(article.meta.slug)) continue;
      selected.push(article);
      if (selected.length === count) break;
    }
  }
  return selected;
}

export default function RefontePreviewPage({ page = 1 }: { page?: number } = {}) {
  const currentPage = Math.min(3, Math.max(1, page));
  const active = getAllArticles().filter((article) => !isEffectivelyExpired(article.meta));
  const homepageEligible = active.filter(
    (article) => !HOMEPAGE_EDITORIAL_CATEGORIES.has(article.meta.category),
  );
  const homepageDeals = selectDiverse(homepageEligible, 120);
  const deals = homepageDeals.slice((currentPage - 1) * 40, currentPage * 40);
  const freeTests = active
    .filter((article) => FREE_TEST_CATEGORIES.has(article.meta.category))
    .slice(0, 4);
  const partnerActive = isFeaturedPartnerActive(FEATURED_PARTNER, new Date());
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BonsPlansMania",
    url: "https://bonsplansmania.fr",
    description: "Bons plans, codes promo, tests de produits gratuits, concours et box beauté sélectionnés et vérifiés.",
    publisher: {
      "@type": "Organization",
      name: "Bons Plans Mania",
      url: "https://bonsplansmania.fr",
      logo: { "@type": "ImageObject", url: "https://bonsplansmania.fr/icon.svg" },
      contactPoint: { "@type": "ContactPoint", email: "bonsplansmania@gmail.com", contactType: "customer service" },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bonsplansmania.fr/recherche?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className={styles.shell}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      {/* Zone à exclure des annonces automatiques AdSense dans le tableau de bord. */}
      <div id="bpm-home-above-fold" className={styles.aboveFold}>
        <Header activePage="/" />

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>Bons plans, codes promo et <em>offres du moment</em></h1>
            <p>Promotions, box beauté, tests gratuits et concours : une sélection claire, vérifiée et mise à jour chaque jour.</p>
            <form action="/recherche" className={styles.search}>
              <Search size={17} aria-hidden />
              <input name="q" aria-label="Rechercher" placeholder="Une marque, un produit, une réduction…" />
              <button type="submit">Rechercher</button>
            </form>
          </div>
          <article id="partenaire-a-la-une" className={`${styles.partnerFeature} ${styles.heroPartner}`} aria-labelledby="partner-feature-title">
            {partnerActive ? (
              <>
                <Image src={FEATURED_PARTNER.imageSrc} alt={FEATURED_PARTNER.imageAlt} width={300} height={220} />
                <div>
                  <span>Partenaire à la une</span>
                  <h2 id="partner-feature-title">{FEATURED_PARTNER.brandName}</h2>
                  <p>{FEATURED_PARTNER.description}</p>
                  <a href={FEATURED_PARTNER.primaryCtaHref} target="_blank" rel="noopener noreferrer">
                    {FEATURED_PARTNER.primaryCtaLabel} <ArrowUpRight size={16} />
                  </a>
                </div>
              </>
            ) : (
              <div><h2 id="partner-feature-title">Espace partenaire</h2><p>Une mise en avant élégante réservée à une marque sélectionnée.</p></div>
            )}
          </article>
        </section>
      </div>

      <section className={styles.trust} aria-label="Nos engagements">
        {["Offres sélectionnées", "Mise à jour quotidienne", "Prix clairement affichés", "Liens transparents"].map((item) => (
          <span key={item}><Check size={15} /> {item}</span>
        ))}
      </section>

      <nav className={styles.categoryRail} aria-label="Accès rapide aux catégories">
        <div>
          {[
            ["Beauté", "/bons-plans-beaute"],
            ["Bébé", "/bons-plans-bebe"],
            ["Maison", "/bons-plans-maison"],
            ["Tech", "/bons-plans-tech"],
            ["Jardin", "/bons-plans-jardin"],
            ["Mode", "/bons-plans-mode"],
            ["Jouets", "/bons-plans-jouets"],
            ["Rentrée", "/bons-plans-rentree"],
          ].map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </div>
      </nav>

      <div className={styles.adSlot} aria-label="Publicité"><AdBlock format="in-article" collapseWhenEmpty /></div>

      <section className={styles.selection} id="selection">
        <header className={styles.sectionHeading}>
          <div><h2>Les offres à regarder de plus près</h2></div>
          <Link href="/bons-plans-en-cours">Voir toutes les offres <ArrowUpRight size={15} /></Link>
        </header>

        <div className={styles.editorialGrid}>
          {deals.map((article, index) => (
            <article key={article.meta.slug} className={index === 0 ? styles.featuredCard : styles.card}>
              <Link href={`/article/${article.meta.slug}`} className={styles.imageWrap}>
                <Image src={article.meta.image} alt={article.meta.imageAlt} fill sizes={index === 0 ? "(max-width: 800px) 90vw, 50vw" : "(max-width: 800px) 75vw, 24vw"} />
                <span>{labels[article.meta.category] ?? "Nouveau"}</span>
              </Link>
              <div className={styles.cardCopy}>
                <small>{article.meta.category.replaceAll("-", " ")} · {formatDate(article.meta.updated ?? article.meta.date)}</small>
                <h3><Link href={`/article/${article.meta.slug}`}>{formatCardTitle(article.meta.title)}</Link></h3>
                {index === 0 && <p>{article.meta.description}</p>}
                <div className={styles.cardFooter}>
                  <strong><AmazonCardPrice asin={article.meta.amazonAsin} fallback={article.meta.price || "Voir le bon plan"} /></strong>
                  {hasDirectMerchantCta({ category:article.meta.category, affiliateUrl:article.meta.affiliateUrl, expired:false, endDate:article.meta.endDate }) ? (
                    <a href={merchantHref(article.meta.slug, article.meta.affiliateUrl)} target="_blank" rel="nofollow sponsored noopener" aria-label={`Voir l’offre ${article.meta.title} sur le site marchand`}><ArrowUpRight size={17} /></a>
                  ) : (
                    <Link href={`/article/${article.meta.slug}`} aria-label={`Découvrir ${article.meta.title}`}><ArrowUpRight size={17} /></Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <nav className={styles.pagination} aria-label="Pages des bons plans">
          {[1, 2, 3].map((pageNumber) => (
            <Link
              key={pageNumber}
              href={pageNumber === 1 ? "/#selection" : `/page/${pageNumber}#selection`}
              className={pageNumber === currentPage ? styles.paginationActive : ""}
              aria-current={pageNumber === currentPage ? "page" : undefined}
            >
              {pageNumber}
            </Link>
          ))}
        </nav>
      </section>

      {freeTests.length > 0 && (
        <section className={styles.freeTests} aria-labelledby="free-tests-title">
          <header>
            <div><span>À tester gratuitement</span><h2 id="free-tests-title">Recevez, testez, donnez votre avis</h2></div>
            <Link href="/categorie/test-gratuit">Voir tous les tests <ArrowUpRight size={15} /></Link>
          </header>
          <div className={styles.freeTestsGrid}>
            {freeTests.map(({ meta }) => (
              <article key={meta.slug} className={styles.freeTestCard}>
                <Link href={`/article/${meta.slug}`} className={styles.freeTestImage}>
                  <Image src={meta.image} alt={meta.imageAlt} fill sizes="(max-width: 760px) 44vw, 22vw" />
                  <span>100 % gratuit</span>
                </Link>
                <div><small>Candidature ouverte</small><h3><Link href={`/article/${meta.slug}`}>{meta.title}</Link></h3><Link href={`/article/${meta.slug}`} className={styles.freeTestCta}>Je découvre <ArrowUpRight size={14} /></Link></div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className={styles.adSlot} aria-label="Publicité"><AdBlock format="multiplex" compactMultiplex collapseWhenEmpty /></div>

      <EditorialNewsletter />

      <section className={styles.manifesto}>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.logo}>Bons Plans <em>Mania</em></Link>
          <p>Les bons plans qui valent vraiment le coup, sélectionnés et vérifiés avec soin.</p>
        </div>
        <div className={styles.footerLinks}>
          <h2>À propos</h2>
          <Link href="/qui-suis-je">👋 Qui suis-je</Link>
          <a href="mailto:bonsplansmania@gmail.com">bonsplansmania@gmail.com</a>
          <Link href="/partenariats">Partenariats &amp; collaborations</Link>
        </div>
        <div className={styles.footerLinks}>
          <h2>Informations</h2>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/marques">Toutes les marques</Link>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Bons Plans Mania</span>
          <span>Certains liens peuvent être affiliés, sans coût supplémentaire pour vous.</span>
        </div>
      </footer>
      <StickyAdMobile />
    </main>
  );
}
