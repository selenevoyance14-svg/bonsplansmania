import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import { BRAND_OF_THE_WEEK } from "@/lib/highlight-brand";
import { FEATURED_PARTNER, isFeaturedPartnerActive } from "@/lib/featured-partner";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import Header from "@/app/components/Header";
import DealCarousel from "./DealCarousel";
import EditorialNewsletter from "./EditorialNewsletter";
import AmazonCardPrice from "@/app/components/AmazonCardPrice";
import { hasDirectMerchantCta } from "@/lib/article-commerce";
import { formatCardTitle } from "@/lib/display-title";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";
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

export default function RefontePreviewPage() {
  const active = getAllArticles().filter((article) => !isEffectivelyExpired(article.meta));
  const homepageDeals = selectDiverse(active, 17);
  const heroDeals = selectDiverse(
    active.filter(({ meta }) => hasDirectMerchantCta({
      category: meta.category,
      affiliateUrl: meta.affiliateUrl,
      expired: false,
      endDate: meta.endDate,
    })),
    4,
  );
  const latest = homepageDeals.slice(4, 7);
  const deals = homepageDeals.slice(8, 17);
  const freeTests = active
    .filter((article) => article.meta.category === "test-gratuit" || article.meta.category === "test-produit")
    .slice(0, 4);
  const partnerActive = isFeaturedPartnerActive(FEATURED_PARTNER, new Date());
  const beautyProducts = COMMUNITY_PRODUCTS.slice(0, 4);
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
      <div className={styles.alert}>NOUVELLES OFFRES VÉRIFIÉES CHAQUE JOUR · SÉLECTION INDÉPENDANTE</div>

      {/* Zone à exclure des annonces automatiques AdSense dans le tableau de bord. */}
      <div id="bpm-home-above-fold" className={styles.aboveFold}>
        <Header activePage="/" />

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>La sélection qui mérite le détour</span>
            <h1>Les bons plans qui valent <em>vraiment</em> le coup.</h1>
            <p>Promotions, box beauté, tests gratuits et concours : une sélection claire, vérifiée et mise à jour chaque jour.</p>
            <form action="/recherche" className={styles.search}>
              <Search size={17} aria-hidden />
              <input name="q" aria-label="Rechercher" placeholder="Une marque, un produit, une réduction…" />
              <button type="submit">Rechercher</button>
            </form>
          </div>

          <DealCarousel slides={heroDeals.map(({ meta }) => ({ slug:meta.slug, title:formatCardTitle(meta.title), image:meta.image, imageAlt:meta.imageAlt, label:labels[meta.category] ?? "Sélection de la rédaction", date:`vérifié le ${formatDate(meta.date)}`, price:meta.price, amazonAsin:meta.amazonAsin, directOffer:true, merchantHref:merchantHref(meta.slug, meta.affiliateUrl) }))} />
        </section>
      </div>

      <section className={styles.trust} aria-label="Nos engagements">
        {["Offres sélectionnées", "Mise à jour quotidienne", "Prix clairement affichés", "Liens transparents"].map((item) => (
          <span key={item}><Check size={15} /> {item}</span>
        ))}
      </section>

      <section className={styles.latestStrip} aria-label="Dernières publications">
        <header><h2>Les dernières nouveautés</h2></header>
        <div>
        {latest.map(({ meta }) => {
          const linksToMerchant = hasDirectMerchantCta({
            category: meta.category,
            affiliateUrl: meta.affiliateUrl,
            expired: false,
            endDate: meta.endDate,
          });

          return (
          <Link
            href={linksToMerchant ? merchantHref(meta.slug, meta.affiliateUrl) : `/article/${meta.slug}`}
            key={meta.slug}
            className={styles.latestItem}
            target={linksToMerchant ? "_blank" : undefined}
            rel={linksToMerchant ? "nofollow sponsored noopener" : undefined}
          >
            <Image src={meta.image} alt={meta.imageAlt} width={128} height={96} />
            <span>
              <small>{labels[meta.category] ?? "Nouveau"}</small>
              <strong>{formatCardTitle(meta.title)}</strong>
              {(meta.amazonAsin || meta.price) && (
                <b className={styles.latestPrice}>
                  <AmazonCardPrice asin={meta.amazonAsin} fallback={meta.price || "Prix à vérifier"} />
                </b>
              )}
              <span className={styles.latestMeta}>
                <em>{formatDate(meta.date)}</em>
                <b>{linksToMerchant ? "Voir l’offre" : "Lire l’article"} <ArrowUpRight size={13} /></b>
              </span>
            </span>
          </Link>
          );
        })}
        </div>
      </section>

      <section className={styles.featureRow}>
        <div className={styles.featureColumn}>
          <h2 className={styles.featureLabel}>Partenaire à la une</h2>
          <article className={styles.partnerFeature} aria-labelledby="partner-feature-title">
            {partnerActive ? (
              <>
                <Image src={FEATURED_PARTNER.imageSrc} alt={FEATURED_PARTNER.imageAlt} width={300} height={220} />
                <div>
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
        </div>
        <div className={styles.featureColumn}>
          <h2 className={styles.featureLabel}>Marque du moment</h2>
          <article className={styles.brandMoment}>
            <div className={styles.brandMomentContent}>
              <div>
                <h2>{BRAND_OF_THE_WEEK.name}</h2>
                <p>{BRAND_OF_THE_WEEK.tagline}</p>
                <a href={BRAND_OF_THE_WEEK.hubUrl} target="_blank" rel="nofollow sponsored noopener">Découvrir la sélection <ArrowUpRight size={16} /></a>
              </div>
              <Image src="/images/articles/beauty-of-joseon-relief-sun-creme-solaire-yesstyle-2026.png" alt="Beauty of Joseon Relief Sun SPF50+" width={210} height={190} />
            </div>
          </article>
        </div>
      </section>

      <div className={styles.adSlot} aria-label="Publicité"><AdBlock format="in-article" /></div>

      <section className={styles.selection} id="selection">
        <header className={styles.sectionHeading}>
          <div><span>Fraîchement repérés</span><h2>Les offres à ne pas manquer</h2></div>
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
                <small>{article.meta.category.replaceAll("-", " ")} · {formatDate(article.meta.date)}</small>
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

      <section className={styles.beautyCompare} aria-labelledby="beauty-compare-title">
        <header>
          <div><span>Beauté</span><h2 id="beauty-compare-title">Guide d’achat beauté</h2></div>
          <p>Avis, caractéristiques et offres vérifiées chez plusieurs marchands, sans prix ni promotion inventés.</p>
        </header>
        <div className={styles.beautyCompareGrid}>
          {beautyProducts.map((product) => (
            <Link href={`/produit/${product.slug}`} key={product.slug} className={styles.beautyCompareCard}>
              <Image src={product.image} alt={product.imageAlt} width={180} height={180} />
              <small>{product.category.replaceAll("-", " ")}</small>
              <strong>{product.brand}</strong>
              <span>{product.name}</span>
              <b>Voir le produit <ArrowUpRight size={14} /></b>
            </Link>
          ))}
        </div>
        <Link href="/avis-prix-beaute" className={styles.beautyCompareCta}>Voir tous les produits <ArrowUpRight size={16} /></Link>
      </section>

      <div className={styles.adSlot} aria-label="Publicité"><AdBlock format="multiplex" compactMultiplex /></div>

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
