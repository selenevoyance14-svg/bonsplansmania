import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";
import MyFavoriteProducts from "@/app/components/MyFavoriteProducts";
import CommunityProductList from "@/app/components/CommunityProductList";

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

        <MyFavoriteProducts />

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
            <CommunityProductList />
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
