import { canUseLiveAmazonTitle } from "@/lib/amazon-title";
import HomeOfferPrice from "./HomeOfferPrice";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Truck } from "lucide-react";
import { getAllArticles, isEffectivelyExpired, type Article } from "@/lib/articles";
import { FEATURED_PARTNER, isFeaturedPartnerActive } from "@/lib/featured-partner";
import ListAd from "@/app/components/ListAd";
import Header from "@/app/components/Header";
import EditorialNewsletter from "./EditorialNewsletter";
import AmazonCardPrice from "@/app/components/AmazonCardPrice";
import AmazonProductImage from "@/app/components/AmazonProductImage";
import ArticleDateLabel from "@/app/components/ArticleDateLabel";
import { hasDirectMerchantCta } from "@/lib/article-commerce";
import { formatCardTitle } from "@/lib/display-title";
import { extractPriceAmount, parsePrice } from "@/lib/price";
import CuratedDealsTabs, { type CuratedDealGroup } from "./CuratedDealsTabs";
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

const DEAL_CATEGORIES = new Set([
  "bon-plan",
  "bon-plan-beaute",
  "box-beaute",
  "code-promo",
  "calendrier-avent",
]);

const BON_PLAN_CATEGORIES = new Set(["bon-plan", "bon-plan-beaute"]);

function getHomepagePriceDetails(article: Article) {
  if (!BON_PLAN_CATEGORIES.has(article.meta.category)) {
    return { originalPrice: undefined, discountPct: undefined };
  }

  const parsedPrice = parsePrice(article.meta.price);
  const originalPrice = article.meta.prix_origine || parsedPrice.was;
  const promoAmount = parsedPrice.nowAmount ?? extractPriceAmount(article.meta.price);
  const originalAmount = extractPriceAmount(originalPrice);
  const discountPct =
    promoAmount !== undefined &&
    originalAmount !== undefined &&
    originalAmount > promoAmount
      ? Math.round(((originalAmount - promoAmount) / originalAmount) * 100)
      : parsedPrice.discountPct;

  return { originalPrice, discountPct };
}

// Les contenus éditoriaux ont leurs propres rubriques et ne doivent pas
// prendre la place des nouveaux bons plans dans la sélection de l'accueil.
const HOMEPAGE_EDITORIAL_CATEGORIES = new Set([
  "test-avis",
  "comparatif",
  "selection",
]);

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

export default function RefontePreviewContent({ page = 1 }: { page?: number }) {
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
      {/* Zone éditoriale principale au-dessus de la publicité. */}
      <div id="bpm-home-above-fold" className={styles.aboveFold}>
        <Header activePage="/" />
      </div>

      <h1 className={styles.visuallyHidden}>Bons plans, codes promo, tests gratuits et concours</h1>

      <div className={styles.topDealsLayout}>
        <CuratedDealsTabs
          groups={curatedDealGroups}
          featuredCard={(
            <article id="partenaire-a-la-une" className={styles.partnerAside} aria-labelledby="partner-feature-title">
              {partnerActive ? (
                <>
                  <div className={styles.partnerAsideImage}>
                    <Image src={FEATURED_PARTNER.imageSrc} alt={FEATURED_PARTNER.imageAlt} fill sizes="(max-width: 760px) 68vw, 25vw" />
                    <span className={styles.partnerAsideBadge}>Partenaire à la une</span>
                  </div>
                  <div className={styles.partnerAsideCopy}>
                    <h2 id="partner-feature-title">{FEATURED_PARTNER.brandName}</h2>
                    <p>{FEATURED_PARTNER.description}</p>
                    <a
                      href={FEATURED_PARTNER.primaryCtaHref}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      data-affiliate-position="homepage_featured_partner"
                      data-affiliate-merchant={FEATURED_PARTNER.merchant}
                      data-affiliate-offer={FEATURED_PARTNER.promoCode}
                    >
                      {FEATURED_PARTNER.primaryCtaLabel} <ArrowUpRight size={16} />
                    </a>
                  </div>
                </>
              ) : (
                <div className={styles.partnerAsideCopy}><h2 id="partner-feature-title">Espace partenaire</h2><p>Une mise en avant élégante réservée à une marque sélectionnée.</p></div>
              )}
            </article>
          )}
        />
      </div>

      <section className={styles.selection} id="selection">
        <header className={styles.sectionHeading}>
          <div><h2>Dernières offres</h2></div>
          <Link href="/bons-plans-en-cours">Voir toutes les offres <ArrowUpRight size={15} /></Link>
        </header>

        <div className={styles.editorialGrid}>
          {deals.map((article, index) => {
            const { originalPrice } = getHomepagePriceDetails(article);
            const directMerchantCta = hasDirectMerchantCta({
              category: article.meta.category,
              affiliateUrl: article.meta.affiliateUrl,
              expired: false,
              endDate: article.meta.endDate,
            });

            return (
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
                <ArticleDateLabel
                  className={styles.postedBadge}
                  date={article.meta.date}
                  updated={article.meta.updated}
                  variant="posted"
                />
                <h3><Link href={`/article/${article.meta.slug}`}>{BON_PLAN_CATEGORIES.has(article.meta.category) ? <HomeOfferPrice mode="title" hideReferencePriceInTitle={article.meta.hideReferencePriceInTitle} title={article.meta.title} originalPrice={originalPrice} price={article.meta.price} asin={!article.meta.expired && canUseLiveAmazonTitle(article.meta.category, `${article.meta.title} ${article.meta.description} ${article.meta.slug}`) ? article.meta.amazonAsin : undefined} /> : formatCardTitle(article.meta.title)}</Link></h3>
                <p>{article.meta.description}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.priceGroup}>
                    <HomeOfferPrice mode="price" price={article.meta.price} originalPrice={originalPrice} asin={!article.meta.expired && canUseLiveAmazonTitle(article.meta.category, `${article.meta.title} ${article.meta.description} ${article.meta.slug}`) ? article.meta.amazonAsin : undefined} />
                    {article.meta.deliveryPrice ? (
                      <span className={styles.deliveryPrice} aria-label={`Livraison : ${article.meta.deliveryPrice}`} title="Prix de livraison">
                        <Truck size={17} aria-hidden />
                        <span>{article.meta.deliveryPrice}</span>
                      </span>
                    ) : null}
                    {directMerchantCta && article.meta.merchant ? (
                      <a className={styles.merchantName} href={`/go/${article.meta.slug}`} target="_blank" rel="nofollow sponsored noopener" aria-label={`Voir l’offre chez ${article.meta.merchant}`}>{article.meta.merchant}</a>
                    ) : null}
                  </div>
                  {directMerchantCta ? (
                    <a className={styles.offerButton} href={merchantHref(article.meta.slug, article.meta.affiliateUrl)} target="_blank" rel="nofollow sponsored noopener" aria-label={`Voir l’offre ${article.meta.title} sur le site marchand`}>
                      <span>Voir l’offre</span><ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <Link className={styles.articleButton} href={`/article/${article.meta.slug}`} aria-label={`Lire l’article ${article.meta.title}`}>
                      <span>Lire l’article</span><ArrowUpRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            </article>
            {(index + 1) % 5 === 0 ? (
              <ListAd
                afterCard={index + 1}
                every={5}
                force
                ariaLabel={`Publicité après l'offre ${index + 1}`}
              />
            ) : null}
            {currentPage === 1 && index === 3 ? <EditorialNewsletter /> : null}
            {currentPage === 1 && index === 7 ? (
              <aside className={styles.carrefourGuide} aria-labelledby="carrefour-guide-title">
                <div>
                  <h2 id="carrefour-guide-title">🛒 Vos produits Carrefour 100% gratuits !</h2>
                  <p>Économisez sur vos courses et testez gratuitement de grandes marques en magasin grâce au programme officiel <em>MonAvisLeRendGratuit</em>. Consultez les produits disponibles et les conditions de participation directement sur Carrefour.</p>
                </div>
                <a
                  href="https://communaute.carrefour.fr/app/730/channel/tester-des-produits-2238"
                  target="_blank"
                  rel="noopener"
                  aria-label="Voir les produits à tester sur le site officiel MonAvisLeRendGratuit"
                >
                  Voir les produits à tester <ArrowUpRight size={16} />
                </a>
              </aside>
            ) : null}
            </Fragment>
            );
          })}
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
    </main>
  );
}
