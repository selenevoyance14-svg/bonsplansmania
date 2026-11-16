import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ChevronRight, Heart, Search, Sparkles } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";
import MyFavoriteProducts from "@/app/components/MyFavoriteProducts";
import CommunityProductList from "@/app/components/CommunityProductList";
import styles from "./avis-prix-beaute.module.css";

const canonical = "https://bonsplansmania.fr/avis-prix-beaute";

export const metadata: Metadata = {
  title: "Avis et comparateur de produits beauté — Bons Plans Mania",
  description:
    "Comparez les produits beauté par marque et par rayon, consultez les avis, les tests de Nathalie et les offres vérifiées chez plusieurs marchands.",
  alternates: { canonical },
};

export default function AvisPrixBeautePage() {
  return (
    <>
      <Header activePage="/avis-prix-beaute" />
      <main>
        <section className={styles.hero}>
          <div className="container">
            <nav className="breadcrumbs">
              <Link href="/">Accueil</Link>
              <ChevronRight size={12} />
              <span>Avis et prix beauté</span>
            </nav>

            <div className={styles.heroInner}>
              <div>
                <span className={styles.eyebrow}>
                  <Sparkles size={16} aria-hidden="true" /> Sélection indépendante
                </span>
                <h1 className={styles.title}>Avis et comparateur de produits beauté</h1>
                <p className={styles.lead}>
                  Trouvez un parfum, un soin ou un produit de maquillage, consultez les
                  avis disponibles et comparez les marchands. Les prix Amazon sont
                  actualisés automatiquement sur les fiches concernées.
                </p>
              </div>
              <div className={styles.heroStats} aria-label="Chiffres clés du comparateur">
                <div className={styles.stat}>
                  <strong>{COMMUNITY_PRODUCTS.length}</strong>
                  <span>fiches produits classées</span>
                </div>
                <div className={styles.stat}>
                  <strong>10</strong>
                  <span>univers beauté à explorer</span>
                </div>
                <div className={styles.stat}>
                  <strong>Prix</strong>
                  <span>datés ou mis à jour par l’API</span>
                </div>
                <div className={styles.stat}>
                  <strong>Avis</strong>
                  <span>personnels et communautaires</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MyFavoriteProducts />

        <section className="container" style={{ paddingTop: "24px", paddingBottom: "0" }}>
          <div className={styles.method}>
            <div className={styles.methodCard}>
              <strong><Search size={17} aria-hidden="true" /> Trouver rapidement</strong>
              <p>Recherchez une marque ou un produit, puis affinez par rayon.</p>
            </div>
            <div className={styles.methodCard}>
              <strong><BadgeCheck size={17} aria-hidden="true" /> Comprendre la sélection</strong>
              <p>Les fiches distinguent les tests personnels, les informations produit et les avis déposés.</p>
            </div>
            <div className={styles.methodCard}>
              <strong><Heart size={17} aria-hidden="true" /> Garder ses favoris</strong>
              <p>Enregistrez les références qui vous intéressent pour les retrouver facilement.</p>
            </div>
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
            <h2 style={{ fontSize: "1.35rem", fontWeight: 750, marginBottom: "14px" }}>
              Guides, tests et offres beauté
            </h2>
            <div className={styles.editorialGrid}>
              <Link href="/categorie/comparatif" className={styles.editorialLink}>
                <strong>Guides et comparatifs beauté</strong>
                <span>Des sélections pour comparer les usages, les formats et les critères importants.</span>
              </Link>
              <Link href="/categorie/test-avis" className={styles.editorialLink}>
                <strong>Tests et avis produits</strong>
                <span>Les produits réellement essayés, avec leurs points forts et leurs limites.</span>
              </Link>
              <Link href="/bons-plans-beaute" className={styles.editorialLink}>
                <strong>Bons plans beauté</strong>
                <span>Les offres ponctuelles vérifiées chez Amazon et les autres marchands.</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
