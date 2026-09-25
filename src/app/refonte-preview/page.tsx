import { Fragment } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { getAllArticles, isEffectivelyExpired, type Article } from "@/lib/articles";
import { FEATURED_PARTNER, isFeaturedPartnerActive } from "@/lib/featured-partner";
import AdBlock from "@/app/components/AdBlock";
import ListAd from "@/app/components/ListAd";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import Header from "@/app/components/Header";
import EditorialNewsletter from "./EditorialNewsletter";
import AmazonCardPrice from "@/app/components/AmazonCardPrice";
import AmazonProductImage from "@/app/components/AmazonProductImage";
import { hasDirectMerchantCta } from "@/lib/article-commerce";
import { formatCardTitle } from "@/lib/display-title";
import CuratedDealsTabs, { type CuratedDealGroup } from "./CuratedDealsTabs";
import styles from "./refonte.module.css";

export const metadata: Metadata = {
  title: "Aperçu de la page d’accueil",
  alternates: { canonical: "https://bonsplansmania.fr" },
  robots: { index: false, follow: true },
};

const labels: Record<string, string> = {
  "bon-plan": "Bon plan repéré",
  "bon-plan-beaute": "Trouvaille beauté",
  "box-beaute": "Box du mois",
  "code-promo": "Code à retenir",
  concours: "Concours ouvert",
  "test-gratuit": "Test gratuit",
  comparatif: "Le guide",
};

const DEAL_CATEGORIES = new Set([
  "bon-plan",
  "bon-plan-beaute",
  "box-beaute",
  "code-promo",
  "calendrier-avent",
]);

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

function articleTimestamp(article: Article) {
  return new Date(`${article.meta.updated ?? article.meta.date}T12:00:00`).getTime();
}

function isRefundArticle(article: Article) {
  const searchable = [article.meta.title, article.meta.description, article.meta.price, ...(article.meta.tags ?? [])].join(" ");
  return /100\s*%\s*(?:rembours|cagnott|crédit)|rembours|cagnott|crédité.+carte|carte.+crédité/i.test(searchable);
}

function isPartnerArticle(article: Article, merchant: string) {
  const searchable = [article.meta.title, article.meta.description, article.meta.affiliateUrl, ...(article.meta.tags ?? [])].join(" ");
  return searchable.toLocaleLowerCase("fr-FR").includes(merchant.toLocaleLowerCase("fr-FR"));
}

export default function RefontePreviewPage({ page = 1 }: { page?: number } = {}) {
  const currentPage = Math.min(3, Math.max(1, page));
  const partnerActive = isFeaturedPartnerActive(FEATURED_PARTNER, new Date());
  const active = getAllArticles().filter((article) => !isEffectivelyExpired(article.meta));
  const homepageEligible = active.filter(
    (article) => !HOMEPAGE_EDITORIAL_CATEGORIES.has(article.meta.category),
  );
  const homepageDeals = selectDiverse(homepageEligible, 120);
  const deals = homepageDeals.slice((currentPage - 1) * 40, currentPage * 40);
  const couponLimit = new Date();
  couponLimit.setDate(couponLimit.getDate() - 21);
  const amazonCoupons = active
    .filter((article) => {
      const checkedAt = new Date(`${article.meta.updated ?? article.meta.date}T12:00:00`);
      return checkedAt >= couponLimit
        && article.meta.tags?.some((tag) => tag.toLocaleLowerCase("fr-FR") === "coupon-amazon")
        && Boolean(article.meta.amazonAsin || article.meta.affiliateUrl?.includes("amazon.fr"));
    })
    .sort((a, b) => new Date(b.meta.updated ?? b.meta.date).getTime() - new Date(a.meta.updated ?? a.meta.date).getTime())
    .slice(0, 6);
  const sortedDeals = active
    .filter((article) => DEAL_CATEGORIES.has(article.meta.category) && Boolean(article.meta.affiliateUrl))
    .sort((a, b) => articleTimestamp(b) - articleTimestamp(a) || Number(Boolean(b.meta.dealOfDay)) - Number(Boolean(a.meta.dealOfDay)));
  const configuredPartnerDeals = selectDiverse(
    sortedDeals.filter((article) => isPartnerArticle(article, FEATURED_PARTNER.merchant)),
    6,
  );
  const partnerDeals = partnerActive && configuredPartnerDeals.length > 0
    ? configuredPartnerDeals
    : selectDiverse(sortedDeals.filter((article) => isPartnerArticle(article, "carrefour")), 6);
  const partnerBrand = partnerActive && configuredPartnerDeals.length > 0
    ? FEATURED_PARTNER.brandName
    : "Carrefour";
  const reimbursedDeals = selectDiverse(
    sortedDeals.filter(isRefundArticle),
    6,
  );
  const toCuratedItems = (articles: Article[], badge: string) => articles.map((article) => ({
    slug: article.meta.slug,
    title: article.meta.title,
    image: article.meta.image,
    imageAlt: article.meta.imageAlt,
    amazonAsin: article.meta.amazonAsin,
    price: article.meta.price,
    updated: article.meta.updated ?? article.meta.date,
    badge,
  }));
  const curatedDealGroups: CuratedDealGroup[] = [
    {
      id: "partner",
      label: "Offres partenaire",
      title: `Les offres ${partnerBrand} à ne pas manquer`,
      description: `Les offres prioritaires de ${partnerBrand}, sélectionnées et expliquées clairement.`,
      href: "/offres-du-jour/partenaire",
      allLabel: `Voir toutes les offres ${partnerBrand}`,
      items: toCuratedItems(partnerDeals, `Offre ${partnerBrand}`),
    },
    {
      id: "coupons",
      label: "Coupons Amazon",
      title: "Coupons Amazon à cocher",
      description: "Le vrai prix final après le coupon, et le code promotionnel supplémentaire lorsqu’il existe.",
      href: "/offres-du-jour/coupons",
      allLabel: "Voir tous les coupons Amazon",
      items: toCuratedItems(amazonCoupons, "Coupon à cocher"),
    },
    {
      id: "refund",
      label: "Remboursé / cagnotté",
      title: "100 % remboursé ou cagnotté",
      description: "Les opérations qui permettent de récupérer tout ou partie du prix, avec les conditions détaillées.",
      href: "/offres-du-jour/rembourse",
      allLabel: "Voir toutes les offres remboursées ou cagnottées",
      items: toCuratedItems(reimbursedDeals, "Remboursé ou cagnotté"),
    },
  ];
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

      <div className={styles.adSlot} aria-label="Publicité"><AdBlock format="in-article" collapseWhenEmpty /></div>

      <div className={styles.categoryRail} aria-hidden="true"><div /></div>

      <CuratedDealsTabs groups={curatedDealGroups} />

      <section className={styles.selection} id="selection">
        <header className={styles.sectionHeading}>
          <div><h2>Dernières offres</h2></div>
          <Link href="/bons-plans-en-cours">Voir toutes les offres <ArrowUpRight size={15} /></Link>
        </header>

        <div className={styles.editorialGrid}>
          {deals.map((article, index) => (
            <Fragment key={article.meta.slug}>
            <article className={index === 0 ? styles.featuredCard : styles.card}>
              <Link href={`/article/${article.meta.slug}`} className={styles.imageWrap}>
                <AmazonProductImage
                  asin={article.meta.amazonAsin}
                  fallbackSrc={article.meta.image}
                  alt={article.meta.imageAlt}
                  sizes={index === 0 ? "(max-width: 800px) 90vw, 50vw" : "(max-width: 800px) 75vw, 24vw"}
                  priority={index === 0}
                  objectFit="contain"
                  padding="12px"
                />
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
            <ListAd afterCard={index + 1} />
            </Fragment>
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
