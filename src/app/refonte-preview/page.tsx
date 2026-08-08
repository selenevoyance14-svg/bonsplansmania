import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Search, Sparkles } from "lucide-react";
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

export default function RefontePreviewPage() {
  const active = getAllArticles().filter((article) => !isEffectivelyExpired(article.meta));
  const heroDeals = active.slice(0, 4);
  const heroSlugs = new Set(heroDeals.map((article) => article.meta.slug));
  const latest = active.filter((article) => !heroSlugs.has(article.meta.slug)).slice(0, 4);
  const deals = active.filter((article) => !heroSlugs.has(article.meta.slug)).slice(4, 11);
  const freeTests = active
    .filter((article) => article.meta.category === "test-gratuit" || article.meta.category === "test-produit")
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
      <div className={styles.alert}>NOUVELLES OFFRES VÉRIFIÉES CHAQUE JOUR · SÉLECTION INDÉPENDANTE</div>

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

        <DealCarousel slides={heroDeals.map(({ meta }) => ({ slug:meta.slug, title:formatCardTitle(meta.title), image:meta.image, imageAlt:meta.imageAlt, label:labels[meta.category] ?? "Sélection de la rédaction", date:`vérifié le ${formatDate(meta.date)}`, price:meta.price, amazonAsin:meta.amazonAsin, directOffer:hasDirectMerchantCta({ category:meta.category, affiliateUrl:meta.affiliateUrl, expired:false, endDate:meta.endDate }) }))} />
      </section>

      <section className={styles.trust} aria-label="Nos engagements">
        {["Offres sélectionnées", "Mise à jour quotidienne", "Prix clairement affichés", "Liens transparents"].map((item) => (
          <span key={item}><Check size={15} /> {item}</span>
        ))}
      </section>

      <section className={styles.latestStrip} aria-label="Dernières publications">
        <header><span>Tout juste publiés</span><h2>Les dernières nouveautés</h2></header>
        <div>
        {latest.map(({ meta }) => (
          <Link href={`/article/${meta.slug}`} key={meta.slug} className={styles.latestItem}>
            <Image src={meta.image} alt={meta.imageAlt} width={128} height={96} />
            <span>
              <small>{labels[meta.category] ?? "Nouveau"}</small>
              <strong>{formatCardTitle(meta.title)}</strong>
              {(meta.amazonAsin || meta.price) && <b className={styles.latestPrice}><AmazonCardPrice asin={meta.amazonAsin} fallback={meta.price || "Voir l’offre"} /></b>}
              <em>{formatDate(meta.date)}</em>
            </span>
          </Link>
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
                    <a href={`/go/${article.meta.slug}`} target="_blank" rel="nofollow sponsored noopener" aria-label={`Voir l’offre ${article.meta.title} sur le site marchand`}><ArrowUpRight size={17} /></a>
                  ) : (
                    <Link href={`/article/${article.meta.slug}`} aria-label={`Découvrir ${article.meta.title}`}><ArrowUpRight size={17} /></Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.adSlot} aria-label="Publicité"><AdBlock format="multiplex" /></div>

      <EditorialNewsletter />

      <section className={styles.commercialRow}>
        <article className={styles.brandMoment}>
          <small><Sparkles size={13} /> La marque du moment</small>
          <span className={styles.brandEmoji}>{BRAND_OF_THE_WEEK.emoji}</span>
          <h2>{BRAND_OF_THE_WEEK.name}</h2>
          <p>{BRAND_OF_THE_WEEK.tagline}</p>
          <a href={BRAND_OF_THE_WEEK.hubUrl} target="_blank" rel="nofollow sponsored noopener">Découvrir la sélection <ArrowUpRight size={16} /></a>
        </article>
        <article className={styles.partnerSpot}>
          <small>{partnerActive ? FEATURED_PARTNER.badge : "ESPACE PARTENAIRE"}</small>
          {partnerActive ? <><Image src={FEATURED_PARTNER.imageSrc} alt={FEATURED_PARTNER.imageAlt} width={180} height={130} /><div><h2>{FEATURED_PARTNER.brandName}</h2><p>{FEATURED_PARTNER.description}</p><Link href={FEATURED_PARTNER.primaryCtaHref}>{FEATURED_PARTNER.primaryCtaLabel} <ArrowUpRight size={16} /></Link></div></> : <p>Une mise en avant élégante réservée à une marque sélectionnée.</p>}
        </article>
      </section>

      <section className={styles.manifesto}>
        <Sparkles size={22} />
        <p>Moins de bruit. Plus de bonnes trouvailles.</p>
        <span>Des offres choisies avec soin, jamais empilées au hasard.</span>
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
