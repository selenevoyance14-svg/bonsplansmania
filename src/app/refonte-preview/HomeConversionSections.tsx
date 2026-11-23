import Link from "next/link";
import Image from "next/image";
import FeaturedPartner from "@/app/components/FeaturedPartner";
import { FEATURED_PARTNER, isFeaturedPartnerActive } from "@/lib/featured-partner";
import AmazonProductImage from "@/app/components/AmazonProductImage";
import HomeOfferPrice from "./HomeOfferPrice";
import { type Article } from "@/lib/articles";
import { formatCardTitle } from "@/lib/display-title";
import styles from "./refonte.module.css";

const merchants = [
  { name: "Prozis", match: "prozis", href: "/marque/prozis", note: "Code BONSMANIA · conditions dans chaque offre" },
  { name: "Carrefour", match: "carrefour", href: "/marque/carrefour", note: "Remises et avantages carte : consultez les conditions" },
  { name: "Amazon", match: "amazon", href: "/bons-plans-amazon", note: "Prix et coupons à vérifier sur la fiche produit" },
];

export function ProzisCodeBadge({ article }: { article: Article }) {
  const isProzis = /prozis/i.test(`${article.meta.merchant || ""} ${article.meta.affiliateUrl || ""}`);
  return isProzis ? <span className={styles.promoCodeBadge} title="Réductions et cadeaux selon les conditions de l’offre">Code BONSMANIA</span> : null;
}

export default function HomeConversionSections({ highlights, offers }: { highlights: Article[]; offers: Article[] }) {
  return <>
    <section className={styles.conversionSection} aria-labelledby="today-title">
      <div className={styles.conversionHeading}><div><p className={styles.eyebrow}>La sélection Bons Plans Mania</p><h1 id="today-title">À ne pas manquer aujourd’hui</h1></div><Link href="/bons-plans-en-cours">Tous les bons plans →</Link></div>
      <OfferCards articles={highlights} />
    </section>
    <div className={styles.conversionPartner} id="partenaire-a-la-une">
      <FeaturedPartner partner={FEATURED_PARTNER} initiallyActive={isFeaturedPartnerActive(FEATURED_PARTNER, new Date())} />
    </div>
    <section className={styles.conversionSection} aria-labelledby="merchant-title">
      <div className={styles.conversionHeading}><div><h2 id="merchant-title">Offres qui cartonnent</h2><p>Trois marchands à explorer, avec notre sélection d’offres récentes.</p></div></div>
      <div className={styles.merchantGrid}>{merchants.map(merchant => {
        const items = offers.filter(a => `${a.meta.merchant || ""} ${a.meta.affiliateUrl || ""}`.toLowerCase().includes(merchant.match)).slice(0, 3);
        return <article className={styles.merchantBlock} key={merchant.name}><h3>{merchant.name}</h3><p>{merchant.note}</p><ul>{items.map(a => <li key={a.meta.slug}><a
          className={styles.merchantOfferLink}
          href={/^https?:\/\//i.test(a.meta.affiliateUrl || "") ? `/go/${a.meta.affiliateAlias || a.meta.slug}` : `/article/${a.meta.slug}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          aria-label={`Voir l’offre : ${formatCardTitle(a.meta.title)} chez ${merchant.name}`}
        ><Image src={a.meta.image} alt="" width={64} height={64} loading="lazy" /><span className={styles.merchantOfferCopy}><span className={styles.merchantOfferTitle}>{formatCardTitle(a.meta.title)}</span><span className={styles.merchantOfferPrice}><HomeOfferPrice mode="price" asin={a.meta.amazonAsin} price={a.meta.price} originalPrice={a.meta.prix_origine} /><ProzisCodeBadge article={a} /></span></span></a></li>)}</ul><Link className={styles.merchantAll} href={merchant.href}>Voir toutes les offres {merchant.name} →</Link></article>;
      })}</div>
    </section>
  </>;
}

function OfferCards({ articles, emptyMessage }: { articles: Article[]; emptyMessage?: string }) {
  if (!articles.length) return <p className={styles.emptyOfferPanel}>{emptyMessage} <Link href="/bons-plans-en-cours">Voir les bons plans en cours →</Link></p>;
  return (<div className={styles.highlightGrid}>{articles.map((article, index) => <article className={styles.highlightCard} key={article.meta.slug}>
        <Link href={`/article/${article.meta.slug}`} className={styles.highlightImage}><AmazonProductImage asin={article.meta.amazonAsin} fallbackSrc={article.meta.image} alt={article.meta.imageAlt} priority={index === 0} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" objectFit="contain" padding="16px" /></Link>
        <div className={styles.highlightCopy}><span className={styles.offerMerchant}>{article.meta.merchant || "Bon plan"}</span><h2><Link href={`/article/${article.meta.slug}`}>{formatCardTitle(article.meta.title)}</Link></h2>
          <div className={styles.highlightPrice}><HomeOfferPrice mode="price" asin={article.meta.amazonAsin} price={article.meta.price} originalPrice={article.meta.prix_origine} /><ProzisCodeBadge article={article} /></div>
          <a className={styles.conversionOfferButton} href={`/go/${article.meta.slug}`} target="_blank" rel="nofollow sponsored noopener">Voir l’offre <span aria-hidden>↗</span></a>
          <Link className={styles.offerDetails} href={`/article/${article.meta.slug}`}>Détails et conditions</Link>
        </div>
      </article>)}</div>);
}
