import { canUseLiveAmazonTitle } from "@/lib/amazon-title";
import HomeOfferPrice from "./HomeOfferPrice";
import { Fragment } from "react";
import Link from "next/link";
import { ArrowUpRight, Truck } from "lucide-react";
import { getAllArticles, isEffectivelyExpired, type Article } from "@/lib/articles";
import ListAd from "@/app/components/ListAd";
import Header from "@/app/components/Header";
import HomeConversionSections, { ProzisCodeBadge } from "./HomeConversionSections";
import EditorialNewsletter from "./EditorialNewsletter";
import AmazonProductImage from "@/app/components/AmazonProductImage";
import ArticleDateLabel from "@/app/components/ArticleDateLabel";
import { hasDirectMerchantCta } from "@/lib/article-commerce";
import { formatCardTitle } from "@/lib/display-title";
import { extractPriceAmount, parsePrice } from "@/lib/price";
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

export default function RefontePreviewContent({ page = 1 }: { page?: number }) {
  const currentPage = Math.min(3, Math.max(1, page));
  const active = getAllArticles().filter(
    (article) => !isEffectivelyExpired(article.meta)
      && article.meta.slug !== "bon-plan-amazon-aestemon-monster-trucks-dinosaures-lot-2-septembre-2026",
  );
  const homepageEligible = active.filter(
    (article) => !HOMEPAGE_EDITORIAL_CATEGORIES.has(article.meta.category),
  );
  const conversionOffers = active.filter(article => DEAL_CATEGORIES.has(article.meta.category) && article.meta.affiliateUrl && article.meta.price && !/\.svg(?:\?|$)/i.test(article.meta.image));
  const merchantCounts = new Map<string, number>();
  const highlights = conversionOffers.filter(article => {
    const merchant = article.meta.merchant || getBrandKey(article.meta.title);
    const count = merchantCounts.get(merchant) || 0;
    if (count >= 1) return false;
    merchantCounts.set(merchant, count + 1);
    return true;
  }).slice(0, 6);
  // Une seule liste paginée, sans les six offres déjà mises en avant.
  const highlightedSlugs = new Set(highlights.map(article => article.meta.slug));
  const homepageDeals = selectDiverse(homepageEligible, 120, highlightedSlugs);
  const deals = homepageDeals.slice((currentPage - 1) * 40, currentPage * 40);

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
      <Header activePage="/" />
      {currentPage !== 1 && <h1 className={styles.visuallyHidden}>Dernières offres — page {currentPage}</h1>}
      {currentPage === 1 && <>
        <HomeConversionSections highlights={highlights} offers={conversionOffers} />
        <div className={styles.newsletterBand}><EditorialNewsletter /></div>
      </>}

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
                    <ProzisCodeBadge article={article} />
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
                    <a className={styles.offerButton} href={`/go/${article.meta.slug}`} target="_blank" rel="nofollow sponsored noopener" aria-label={`Voir l’offre ${article.meta.title} sur le site marchand`}>
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

      <div data-nosnippet>
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
          <Link href="/marques-partenaires">Toutes les marques</Link>
          <Link href="/bons-plans-amazon">Bons plans Amazon</Link>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Bons Plans Mania</span>
          <span>Certains liens peuvent être affiliés, sans coût supplémentaire pour vous.</span>
        </div>
      </footer>
      </div>
    </main>
  );
}
