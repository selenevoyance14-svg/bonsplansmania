import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import Header from "@/app/components/Header";
import ProductFavoriteButton from "@/app/components/ProductFavoriteButton";
import ProductReviewForm from "@/app/components/ProductReviewForm";
import HelpfulButton from "@/app/components/HelpfulButton";
import ProductPublishedReviews from "@/app/components/ProductPublishedReviews";
import ProductRatingSummary from "@/app/components/ProductRatingSummary";

const canonical =
  "https://bonsplansmania.fr/produit/opium-eau-de-parfum-yves-saint-laurent";

const merchantOffers = [
  {
    merchant: "Perfume’s Club",
    price: "64,94 €",
    note: "50 ml — hors éventuels frais de livraison",
    href: "https://clk.tradedoubler.com/click?p=401959&a=3421259&url=https%3A%2F%2Fwww.perfumesclub.fr%2Ffr%2Fyves-saint-laurent%2Fopium-eau-de-parfum-vaporisateur%2Fp_44520%2F",
  },
  {
    merchant: "Amazon",
    price: "134,99 €",
    note: "50 ml — prix affiché par le vendeur",
    href: "https://www.amazon.fr/dp/B073VNCWV8?tag=lebrunnathali-21",
  },
  {
    merchant: "Beauty Success",
    price: "144,00 €",
    note: "50 ml — livraison standard offerte",
    href: "https://www.beautysuccess.fr/parfum-yves-saint-laurent-opium-eau-de-parfum-femme-c000806",
  },
];

export const metadata: Metadata = {
  title: "Opium Yves Saint Laurent : prix et avis",
  description:
    "Découvrez Opium Eau de Parfum d’Yves Saint Laurent, comparez le prix disponible et partagez votre expérience avec la communauté Bons Plans Mania.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function OpiumProductPage() {
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
              <span>Opium Eau de Parfum</span>
            </nav>

            <div className="community-product-grid">
              <div className="community-product-visual">
                <img
                  className="community-product-image"
                  src="https://www.beautysuccess.fr/media/catalog/product/cache/1da98f12ce9c143a9bd146af7dfed3c9/8/1/8141393225-yves-saint-laurent-opium-vaporisateur-50ml-visuel_1.webp"
                  alt="Flacon Opium Eau de Parfum 50 ml d’Yves Saint Laurent"
                  width="520"
                  height="520"
                />
              </div>

              <div className="community-product-copy">
                <p className="product-brand">Yves Saint Laurent</p>
                <h1>Opium Eau de Parfum</h1>
                <p className="product-lead">
                  Un parfum oriental au caractère chaleureux et épicé. Cette
                  fiche permanente réunira les expériences de la communauté,
                  les bons plans actifs et les offres de nos partenaires.
                </p>

                <ProductRatingSummary productSlug="opium-eau-de-parfum-yves-saint-laurent" />

                <div className="community-product-actions">
                  <a href="#donner-avis" className="btn btn-primary">
                    Donner mon avis
                  </a>
                  <ProductFavoriteButton productSlug="opium-eau-de-parfum-yves-saint-laurent" />
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
              Les tarifs pouvant évoluer, le prix affiché chez le marchand au
              moment de la commande reste celui qui fait foi.
            </p>
            <div className="merchant-comparison" role="list">
              {merchantOffers.map((offer, index) => (
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
              Liens affiliés : Bons Plans Mania peut recevoir une commission sans
              coût supplémentaire annoncé pour vous.
            </p>
          </div>
        </section>

        <section className="community-product-section community-opinion-section">
          <div className="container community-product-narrow">
            <span className="community-section-kicker">Avis de la communauté</span>
            <h2>Vous connaissez ce parfum ?</h2>
            <ProductPublishedReviews productSlug="opium-eau-de-parfum-yves-saint-laurent" />
            <div className="community-trust-note">
              <ShieldCheck size={20} />
              <p>
                Aucune note marchande n’est mélangée avec les futurs avis de la
                communauté Bons Plans Mania.
              </p>
            </div>
            <div className="helpful-row">
              <span>Cette fiche vous a aidé ?</span>
              <HelpfulButton id="product:opium-eau-de-parfum-yves-saint-laurent" />
            </div>
            <ProductReviewForm
              productSlug="opium-eau-de-parfum-yves-saint-laurent"
              productName="Opium Eau de Parfum — Yves Saint Laurent"
            />
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} BonsPlansMania — Certains liens sont
              des liens affiliés.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
