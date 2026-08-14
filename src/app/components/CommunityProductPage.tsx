import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShieldCheck } from "lucide-react";
import Header from "@/app/components/Header";
import ProductFavoriteButton from "@/app/components/ProductFavoriteButton";
import ProductReviewForm from "@/app/components/ProductReviewForm";
import HelpfulButton from "@/app/components/HelpfulButton";
import ProductPublishedReviews from "@/app/components/ProductPublishedReviews";
import ProductRatingSummary from "@/app/components/ProductRatingSummary";
import AmazonLiveOffer from "@/app/components/AmazonLiveOffer";

/**
 * Un marchand chez qui le produit est disponible.
 *
 * Volontairement SANS prix : les tarifs saisis à la main devenaient faux en
 * quelques jours (31/07/2026 — un flacon affiché 134,99 € n'était même plus
 * vendu). Tant qu'un prix n'est pas tiré d'une API, on n'en affiche aucun et
 * on laisse la lectrice le lire chez le marchand.
 */
type MerchantOffer = {
  merchant: string;
  note?: string;
  href: string;
  /** Prix saisi uniquement après contrôle chez un marchand hors Amazon. */
  price?: string;
  checkedAt?: string;
  offer?: string;
  /** Amazon : le prix vient exclusivement de l'API officielle. */
  amazonAsin?: string;
};

export default function CommunityProductPage({
  slug,
  brand,
  name,
  image,
  imageAlt,
  lead,
  idealFor,
  strengths,
  watchOut,
  editorialNote,
  offers,
}: {
  slug: string;
  brand: string;
  name: string;
  image: string;
  imageAlt: string;
  lead: string;
  idealFor?: string[];
  strengths?: string[];
  watchOut?: string[];
  editorialNote?: string;
  offers?: MerchantOffer[];
}) {
  return (
    <>
      <Header />
      <main className="community-product-page">
        <section className="community-product-hero">
          <div className="container">
            <nav className="breadcrumbs">
              <Link href="/">Accueil</Link>
              <ChevronRight size={12} />
              <Link href="/bons-plans-beaute">Beauté</Link>
              <ChevronRight size={12} />
              <span>{name}</span>
            </nav>

            <div className="community-product-grid">
              <div className="community-product-visual">
                <Image
                  className="community-product-image"
                  src={image}
                  alt={imageAlt}
                  width={520}
                  height={520}
                  sizes="(max-width: 768px) 100vw, 520px"
                />
              </div>
              <div className="community-product-copy">
                <p className="product-brand">{brand}</p>
                <h1>{name}</h1>
                <p className="product-lead">{lead}</p>
                <ProductRatingSummary productSlug={slug} />
                <div className="community-product-actions">
                  <a href="#donner-avis" className="btn btn-primary">Donner mon avis</a>
                  <ProductFavoriteButton productSlug={slug} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {(idealFor?.length || strengths?.length || watchOut?.length || editorialNote) && (
          <section className="community-product-section">
            <div className="container community-product-narrow">
              <span className="community-section-kicker">Notre analyse</span>
              <h2>Avis rapide : à qui convient ce produit ?</h2>
              {editorialNote && <p className="community-section-intro">{editorialNote}</p>}
              <div className="merchant-comparison">
                {idealFor?.length ? <article className="merchant-offer"><div className="merchant-info"><strong>Idéal pour</strong><span>{idealFor.join(" · ")}</span></div></article> : null}
                {strengths?.length ? <article className="merchant-offer"><div className="merchant-info"><strong>Points forts</strong><span>{strengths.join(" · ")}</span></div></article> : null}
                {watchOut?.length ? <article className="merchant-offer"><div className="merchant-info"><strong>À savoir avant d’acheter</strong><span>{watchOut.join(" · ")}</span></div></article> : null}
              </div>
            </div>
          </section>
        )}

        {offers && offers.length > 0 && (
          <section className="community-product-section" id="prix">
            <div className="container community-product-narrow">
              <span className="community-section-kicker">Où l’acheter</span>
              <h2>Voir le produit chez nos partenaires</h2>
              <p className="community-section-intro">
                Les prix sont datés lorsqu’ils ont été contrôlés. Pour Amazon,
                aucun prix n’est saisi à la main : il provient uniquement de
                l’API officielle. Le tarif affiché chez le marchand au moment
                de la commande reste celui qui fait foi.
              </p>
              <div className="merchant-comparison" role="list">
                {offers.map((offer) => (
                  <article className="merchant-offer" role="listitem" key={offer.merchant}>
                    <div className="merchant-info">
                      <strong>{offer.merchant}</strong>
                      {offer.note && <span>{offer.note}</span>}
                      {offer.offer && <span>{offer.offer}</span>}
                    </div>
                    {offer.amazonAsin ? (
                      <AmazonLiveOffer asin={offer.amazonAsin} affiliateUrl={offer.href} />
                    ) : (
                      <div className="merchant-live-offer">
                        <span className="merchant-live-label">Prix chez {offer.merchant}</span>
                        <strong>{offer.price || "Prix actuel à consulter"}</strong>
                        {offer.checkedAt && (
                          <small>
                            Prix au {new Date(`${offer.checkedAt}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                          </small>
                        )}
                        <a
                          className="btn btn-primary btn-sm"
                          href={offer.href}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          data-affiliate-position="beauty_comparator"
                        >
                          Voir chez {offer.merchant}
                        </a>
                      </div>
                    )}
                  </article>
                ))}
              </div>
              <p className="affiliate-disclaimer">
                Liens affiliés : Bons Plans Mania peut recevoir une commission sans coût supplémentaire annoncé pour vous.
              </p>
            </div>
          </section>
        )}

        <section className="community-product-section community-opinion-section">
          <div className="container community-product-narrow">
            <span className="community-section-kicker">Avis de la communauté</span>
            <h2>Vous connaissez ce produit ?</h2>
            <ProductPublishedReviews productSlug={slug} />
            <div className="community-trust-note">
              <ShieldCheck size={20} />
              <p>Les notes des marchands ne sont jamais mélangées avec les avis de la communauté Bons Plans Mania.</p>
            </div>
            <div className="helpful-row">
              <span>Cette fiche vous a aidé ?</span>
              <HelpfulButton id={`product:${slug}`} />
            </div>
            <ProductReviewForm productSlug={slug} productName={`${name} — ${brand}`} />
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
