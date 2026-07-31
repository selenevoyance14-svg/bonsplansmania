import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles, Store } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";
import ProductReviewStat from "@/app/components/ProductReviewStat";

const canonical = "https://bonsplansmania.fr/avis-prix-beaute";

export const metadata: Metadata = {
  title: "Avis et prix beauté : les fiches produits de la communauté — Bons Plans Mania",
  description:
    "Les fiches produits beauté de Bons Plans Mania : comparez les prix chez plusieurs marchands, lisez les avis de la communauté et partagez le vôtre.",
  alternates: { canonical },
};

export default function AvisPrixBeautePage() {
  return (
    <>
      <Header activePage="/avis-prix-beaute" />
      <main>
        <section className="section" style={{ paddingBottom: "8px" }}>
          <div className="container">
            <nav className="breadcrumbs">
              <Link href="/">Accueil</Link>
              <ChevronRight size={12} />
              <span>Avis et prix beauté</span>
            </nav>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Sparkles size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />
              Avis et prix beauté
            </h1>
            <p style={{ color: "var(--muted-foreground)" }}>
              Les produits testés par la communauté — {COMMUNITY_PRODUCTS.length} fiche
              {COMMUNITY_PRODUCTS.length > 1 ? "s" : ""}
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "20px", paddingBottom: "0" }}>
          <div
            style={{
              background: "white",
              border: "1px solid var(--border, #e5e7eb)",
              borderRadius: "16px",
              padding: "24px 28px",
              fontSize: "0.97rem",
              lineHeight: 1.65,
              color: "#1f2937",
            }}
          >
            <p>
              Une <strong>fiche produit</strong> réunit au même endroit ce qu&apos;on a de
              plus utile sur un produit beauté : le <strong>prix relevé chez plusieurs
              marchands</strong>, une description honnête, et les{" "}
              <strong>avis laissés par la communauté</strong>.
            </p>
            <p>
              Contrairement à un article de bon plan, qui photographie une offre à un
              instant donné, la fiche reste en place et s&apos;enrichit avec le temps. Tu
              peux y déposer ton propre avis, indiquer si celui des autres t&apos;a été
              utile, et retrouver le produit en favori.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="beauty-community-products">
              {COMMUNITY_PRODUCTS.map((product) => (
                <Link
                  className="beauty-community-product-link"
                  href={`/produit/${product.slug}`}
                  key={product.slug}
                >
                  <span>{product.brand}</span>
                  <strong>{product.name}</strong>
                  <small>
                    Prix et avis <ChevronRight size={14} />
                  </small>
                </Link>
              ))}
            </div>

            <div style={{ display: "grid", gap: "16px", marginTop: "28px" }}>
              {COMMUNITY_PRODUCTS.map((product) => (
                <Link
                  key={`detail-${product.slug}`}
                  href={`/produit/${product.slug}`}
                  style={{
                    display: "flex",
                    gap: "18px",
                    alignItems: "center",
                    background: "white",
                    border: "1px solid var(--border, #e5e7eb)",
                    borderRadius: "16px",
                    padding: "16px 18px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    width={96}
                    height={96}
                    loading="lazy"
                    style={{ width: "96px", height: "96px", objectFit: "contain", flexShrink: 0 }}
                  />
                  <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
                      {product.brand}
                    </span>
                    <strong style={{ fontSize: "1.05rem" }}>{product.name}</strong>
                    <span style={{ fontSize: "0.92rem", color: "#4b5563" }}>{product.teaser}</span>
                    <span
                      style={{
                        display: "flex",
                        gap: "14px",
                        flexWrap: "wrap",
                        fontSize: "0.85rem",
                        color: "#6D28D9",
                        fontWeight: 600,
                        marginTop: "2px",
                      }}
                    >
                      <span>dès {product.fromPrice}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Store size={13} /> {product.merchantCount} marchands comparés
                      </span>
                      <ProductReviewStat productSlug={product.slug} />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container" style={{ paddingTop: "0", paddingBottom: "0" }}>
          <AdBlock />
        </section>

        <section className="section" style={{ paddingTop: "8px" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px" }}>
              Pour aller plus loin
            </h2>
            <ul style={{ lineHeight: 2 }}>
              <li>
                <Link href="/categorie/comparatif">Nos guides et comparatifs beauté</Link>
              </li>
              <li>
                <Link href="/categorie/test-avis">Nos tests et avis produits</Link>
              </li>
              <li>
                <Link href="/bons-plans-beaute">Tous les bons plans beauté</Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
