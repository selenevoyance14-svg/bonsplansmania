import type { Metadata } from "next";
import { ChevronRight, BadgeCheck, Infinity as InfinityIcon } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import OfferGrid from "@/app/components/OfferGrid";
import { CODES_PERMANENTS_OFFERS } from "@/lib/codes-permanents-data";

export const metadata: Metadata = {
  title: "Codes promo permanents : les réductions valables toute l'année (2026)",
  description: "Liste complète des codes promo qui marchent toute l'année : Zooplus -10%, Sarenza -20€ bienvenue, L'Atelier du Sourcil -10%, MiiN Cosmetics, Dr Pierre Ricaud, parrainages et programmes fidélité.",
  alternates: { canonical: "https://bonsplansmania.fr/codes-promo-permanents" },
  openGraph: {
    title: "Codes promo permanents 2026 — Valables toute l'année",
    description: "Tous les codes promo, parrainages et programmes fidélité valables toute l'année.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr/codes-promo-permanents",
  },
};

const FIDELITE_PROGRAMS = [
  {
    name: "Programme Beauty Card Sephora",
    detail: "Points cumulés à chaque achat, paliers White/Black/Gold avec cadeaux exclusifs et accès anticipé aux ventes.",
  },
  {
    name: "Programme My Best Bio (Yves Rocher)",
    detail: "Cadeaux dès la 1ère commande, points fidélité, ventes anticipées 48h avant.",
  },
  {
    name: "Programme My Club (Showroom Privé)",
    detail: "Accès aux ventes 24h avant les non-membres, -10% supplémentaires régulièrement.",
  },
  {
    name: "Programme zooplus Zen (Zooplus)",
    detail: "-5% à vie sur les commandes régulières + livraison automatique programmée.",
  },
  {
    name: "Cdiscount à Volonté",
    detail: "Livraison gratuite illimitée + accès anticipé soldes + 30 jours de retours. 29€/an.",
  },
];

export default function CodesPromoPermanentsPage() {
  return (
    <>
      <Header />
      <main>
        <section
          style={{
            background: "linear-gradient(135deg, #0EA5A9 0%, #059669 100%)",
            padding: "44px 0 30px",
            color: "white",
          }}
        >
          <div className="container">
            <nav className="breadcrumbs" style={{ color: "rgba(255,255,255,0.85)" }}>
              <a href="/" style={{ color: "rgba(255,255,255,0.85)" }}>Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Codes promo permanents</span>
            </nav>
            <h1 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)", fontWeight: 900, marginBottom: "10px", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "12px" }}>
              <InfinityIcon size={30} aria-hidden />
              Codes promo permanents 2026
            </h1>
            <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "1.05rem", maxWidth: "780px", lineHeight: 1.5 }}>
              <strong>{CODES_PERMANENTS_OFFERS.length} offres valables toute l'année</strong> : parrainages, programmes fidélité, réductions de bienvenue, livraisons offertes.
              À garder sous le coude pour économiser à chaque commande, peu importe la saison.
            </p>
          </div>
        </section>

        {/* Mur d'offres permanentes */}
        <section className="section" style={{ paddingTop: "32px" }}>
          <div className="container">
            <OfferGrid offers={CODES_PERMANENTS_OFFERS} />
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>
                <BadgeCheck size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#0EA5A9" }} />
                Programmes fidélité à connaître
              </h2>
              <p>Gratuit dans tous les cas, cumulable avec les codes promo</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", maxWidth: "1100px", margin: "0 auto" }}>
              {FIDELITE_PROGRAMS.map((p) => (
                <div key={p.name} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                  <h3 style={{ fontSize: "1.02rem", fontWeight: 700, marginBottom: "8px", color: "#1f2937" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "var(--muted-foreground)", margin: 0 }}>{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", maxWidth: "780px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "14px" }}>Comment économiser au maximum à l&apos;année</h2>
              <ol style={{ paddingLeft: "20px", lineHeight: 1.75 }}>
                <li><strong>Inscris-toi à toutes les newsletters</strong> (avec une adresse dédiée si tu veux éviter le spam) pour récupérer les codes de bienvenue (-10% à -50%).</li>
                <li><strong>Active le cashback iGraal</strong> avant chaque achat : 1 à 20% remboursé en plus du code promo.</li>
                <li><strong>Cumule</strong> code promo + cashback + carte fidélité quand c&apos;est autorisé (vérifie les CGV).</li>
                <li><strong>Attends les périodes promo</strong> (French Days, Black Friday, soldes, ventes anniversaire) pour les gros achats.</li>
                <li><strong>Programme fidélité</strong> : passe par les paliers (Sephora Beauty Card, Yves Rocher, zooplus Zen) — les avantages augmentent avec le volume.</li>
                <li><strong>Inscris-toi à notre newsletter</strong> : on filtre les vrais bons plans des fausses promos toute la semaine.</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>Aller plus loin</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {[
                { href: "/bons-plans-en-cours", label: "Bons plans en cours", desc: "Ventes actives cette semaine", color: "#0EA5A9" },
                { href: "/code-promo", label: "Codes promo par marque", desc: "Toutes nos pages marques", color: "#1D4ED8" },
                { href: "/categorie/bon-plan", label: "Tous les bons plans", desc: "Archives + actuel", color: "#C2410C" },
                { href: "/categorie/box-beaute", label: "Box beauté en promo", desc: "Comparatif et codes", color: "#86198F" },
              ].map((c) => (
                <a key={c.href} href={c.href} style={{ background: "white", border: `1px solid ${c.color}22`, borderRadius: "16px", padding: "20px", textDecoration: "none", display: "block", transition: "transform 0.15s" }}>
                  <div style={{ fontWeight: 800, color: c.color, marginBottom: "6px", fontSize: "1.05rem" }}>{c.label}</div>
                  <div style={{ fontSize: "0.88rem", color: "#4b5563" }}>{c.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <StickyAdMobile />
    </>
  );
}
