import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import AmazonProductImage from "@/app/components/AmazonProductImage";
import { formatCardTitle } from "@/lib/display-title";
import { parsePrice } from "@/lib/price";
import styles from "./refonte.module.css";

export type CuratedDealItem = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  amazonAsin?: string;
  price?: string;
  updated: string;
  badge: string;
};

export type CuratedDealGroup = {
  id: "partner" | "coupons" | "refund" | "small";
  label: string;
  title: string;
  description: string;
  href: string;
  allLabel: string;
  items: CuratedDealItem[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(
    new Date(`${date}T12:00:00`),
  );
}

export default function CuratedDealsTabs({ groups, featuredCard }: { groups: CuratedDealGroup[]; featuredCard?: ReactNode }) {
  const activeGroup = groups.find((group) => group.items.length > 0);

  if (!activeGroup) return null;

  return (
    <section className={styles.dealsHub} aria-labelledby="deals-hub-title">
      <div className={styles.dealsHubTopline}>
        <div>
          <h2 id="deals-hub-title">À ne pas manquer aujourd’hui</h2>
        </div>
        <Link href="/offres-du-jour">
          Voir toutes les offres <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      <div
        id={`deals-panel-${activeGroup.id}`}
        role="region"
        aria-label="Sélection de bons plans"
        className={styles.dealsPanel}
      >
        <div className={styles.dealsHubGrid}>
          {featuredCard}
          {activeGroup.items.map((article) => {
            const { now, was, savings } = parsePrice(article.price);
            return (
              <article className={`${styles.dealsHubCard} ${styles[`dealsHubCard_${activeGroup.id}`]}`} key={article.slug}>
                <Link href={`/article/${article.slug}`} className={styles.dealsHubImage}>
                  <AmazonProductImage
                    asin={article.amazonAsin}
                    fallbackSrc={article.image}
                    alt={article.imageAlt}
                    sizes="(max-width: 760px) 34vw, 140px"
                    objectFit="contain"
                    padding="12px"
                  />
                  <span>{activeGroup.id === "coupons" && <Check size={11} />} {article.badge}</span>
                </Link>
                <div className={styles.dealsHubCopy}>
                  <small>Vérifié le {formatDate(article.updated)}</small>
                  <h4><Link href={`/article/${article.slug}`}>{formatCardTitle(article.title)}</Link></h4>
                  <div className={styles.dealsHubPrice}>
                    <strong>{now || article.price || "Voir l’offre"}</strong>
                    {activeGroup.id === "coupons" && was && <del>{was}</del>}
                    {activeGroup.id === "coupons" && savings && <b>{savings}</b>}
                  </div>
                  <div className={styles.dealsHubFooter}>
                    <span>Voir l’offre</span>
                    <Link href={`/article/${article.slug}`} aria-label={`Découvrir ${article.title}`}><ArrowUpRight size={15} /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
