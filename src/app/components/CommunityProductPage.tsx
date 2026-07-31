import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import Header from "@/app/components/Header";
import ProductFavoriteButton from "@/app/components/ProductFavoriteButton";
import ProductReviewForm from "@/app/components/ProductReviewForm";
import HelpfulButton from "@/app/components/HelpfulButton";
import ProductPublishedReviews from "@/app/components/ProductPublishedReviews";
import ProductRatingSummary from "@/app/components/ProductRatingSummary";

type MerchantOffer = {
  merchant: string;
  price: string;
  note: string;
  href: string;
};

export default function CommunityProductPage({
  slug,
  brand,
  name,
  image,
  imageAlt,
  lead,
  offers,
}: {
  slug: string;
  brand: string;
  name: string;
  image: string;
  imageAlt: string;
  lead: string;
  offers: MerchantOffer[];
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
                <img
                  className="community-product-image"
                  src={image}
                  alt={imageAlt}
                  width="520"
                  height="520"
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

        <section className="community-product-section" id="prix">
          <div className="container community-product-narrow">
            <span className="community-section-kicker">Où l’acheter</span>
            <h2>Comparer chez trois marchands</h2>
            <p className="community-section-intro">
              Prix relevés le 30 juillet 2026 pour le même flacon de 50 ml.
              Le tarif affiché chez le marchand au moment de la commande reste celui qui fait foi.
            </p>
            <div className="merchant-comparison" role="list">
              {offers.map((offer, index) => (
                <article
                  className={`merchant-offer${index === 0 ? " is-featured" : ""}`}
                  role="listitem"
                  key={offer.merchant}
                >
                  <div className="merchant-rank">{index + 1}</div>
                  <div className="merchant-info">
                    <strong>{offer.merchant}</strong>
                    <span>{offer.note}</span>
                  </div>
                  <div className="merchant-price">
                    <small>Prix relevé</small>
                    <strong>{offer.price}</strong>
                  </div>
                  <a
                    className="btn btn-primary"
                    href={offer.href}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                  >
                    Voir l’offre
                  </a>
                </article>
              ))}
            </div>
            <p className="affiliate-disclaimer">
              Liens affiliés : Bons Plans Mania peut recevoir une commission sans coût supplémentaire annoncé pour vous.
            </p>
          </div>
        </section>

        <section className="community-product-section community-opinion-section">
          <div className="container community-product-narrow">
            <span className="community-section-kicker">Avis de la communauté</span>
            <h2>Vous connaissez ce parfum ?</h2>
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
