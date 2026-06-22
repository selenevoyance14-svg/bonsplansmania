import type { Metadata } from "next";
import { ChevronRight, BadgeCheck, Infinity as InfinityIcon } from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import StickyAdMobile from "@/app/components/StickyAdMobile";

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

interface PermanentCode {
  brand: string;
  category: string;
  offer: string;
  conditions: string;
  affiliateUrl: string;
  affiliateLabel: string;
  articleSlug?: string;
  color: string;
}

const CODES: PermanentCode[] = [
  {
    brand: "Amazon Prime",
    category: "Multi-catégories",
    offer: "30 jours d'essai gratuit + livraison rapide illimitée + Prime Video + Prime Reading",
    conditions: "Essai 30 jours, puis 6,99€/mois ou 69,90€/an. Annulable à tout moment.",
    affiliateUrl: "https://amzn.to/4dMkVTW",
    affiliateLabel: "Tester Amazon Prime",
    color: "#FF9900",
  },
  {
    brand: "Belle au Naturel",
    category: "Box Beauté Bio",
    offer: "Box bio à -50% sur la 1ère commande + 5€ offerts via parrainage + livraison incluse",
    conditions: "Parrainage : l'inviteur reçoit 5€ une fois la 1ère box validée. Sans engagement.",
    affiliateUrl: "https://www.belleaunaturel.fr/code-parrainage?code=NL3P62NT",
    affiliateLabel: "Voir Belle au Naturel",
    articleSlug: "belle-au-naturel-box-beaute-bio-parrainage-2026",
    color: "#84CC16",
  },
  {
    brand: "BZB / Bizzbee",
    category: "Mode",
    offer: "Programme Pass fidélité gratuit : bons d'achat à chaque commande, -25% anniversaire, loteries mensuelles",
    conditions: "Inscription Pass gratuite en magasin ou en ligne. Cumul automatique des points sur chaque achat.",
    affiliateUrl: "https://www.b-z-b.com/programme-de-fidelite.html",
    affiliateLabel: "Voir BZB / Bizzbee",
    articleSlug: "bon-plan-bzb-bizzbee-programme-fidelite-pass-2026",
    color: "#DB2777",
  },
  {
    brand: "Cdiscount",
    category: "High-Tech & Maison",
    offer: "Codes promo mensuels renouvelés (TEL15D99 -15€ téléphonie, GOOGLEDES199 -30€ Chromebook, etc.) + livraison gratuite avec Cdiscount à Volonté",
    conditions: "Codes valables 1 semaine à 1 mois selon catégorie. Renouvelés régulièrement.",
    affiliateUrl: "https://tidd.ly/4dJ6jB6",
    affiliateLabel: "Voir Cdiscount",
    articleSlug: "bon-plan-cdiscount-amenagement-exterieur-fete-meres-codes-promo-mai-2026",
    color: "#1D4ED8",
  },
  {
    brand: "Dr Pierre Ricaud",
    category: "Beauté",
    offer: "-50% sur la 1ère commande + cadeau de bienvenue + livraison offerte dès 49€",
    conditions: "Offre nouvelle cliente. Cumulable avec promos en cours.",
    affiliateUrl: "https://tidd.ly/3UFSiN5",
    affiliateLabel: "Voir Dr Pierre Ricaud",
    color: "#7C3AED",
  },
  {
    brand: "eBuyclub",
    category: "Cashback",
    offer: "Cashback sur 2 500+ marchands + 3€ offerts à l'inscription + coupons remboursés jusqu'à 60% sur les courses",
    conditions: "Inscription gratuite. Bonus 3€ crédité après la 1ère commande validée.",
    affiliateUrl: "https://www.ebuyclub.com/",
    affiliateLabel: "Voir eBuyclub",
    articleSlug: "bon-plan-ebuyclub-cashback-2500-marchands-3-euros-offerts-2026",
    color: "#2563EB",
  },
  {
    brand: "E.Leclerc",
    category: "High-Tech & Bricolage",
    offer: "Codes promo permanents sur les rayons high-tech (-100€ sur PC portables, -50€ électroménager) + 10% remboursés en bons d'achat",
    conditions: "Carte de fidélité E.Leclerc nécessaire pour les bons d'achat (gratuite).",
    affiliateUrl: "https://tidd.ly/4denv32",
    affiliateLabel: "Voir E.Leclerc",
    color: "#F97316",
  },
  {
    brand: "Greenweez",
    category: "Bio & Écologique",
    offer: "-10% sur la 1ère commande + livraison offerte dès 39€ avec le code BIENVENUE2026",
    conditions: "Code valable pour les nouveaux clients. Cumulable avec promos en cours. Bio alimentaire, cosmétique, maison écologique.",
    affiliateUrl: "https://www.greenweez.com/?utm_source=affilae&utm_medium=affiliation&utm_campaign=bonsplansmania&ae=344",
    affiliateLabel: "Voir Greenweez",
    color: "#76B82A",
  },
  {
    brand: "iGraal",
    category: "Cashback",
    offer: "Cashback de 1 à 20% sur 2000+ boutiques (Sephora, Amazon, Cdiscount, Zalando, etc.) + 3€ de bonus à l'inscription",
    conditions: "Inscription gratuite. Cumulable avec tous les codes promo des marques.",
    affiliateUrl: "https://www.igraal.com/?parrain_id=instantgagnantduweb",
    affiliateLabel: "Voir iGraal",
    color: "#10B981",
  },
  {
    brand: "L'Atelier du Sourcil",
    category: "Beauté",
    offer: "-10% sur la 1ère commande via newsletter + livraison offerte dès 50€",
    conditions: "Code reçu par e-mail après inscription. Cumulable avec promos en cours.",
    affiliateUrl: "https://tidd.ly/43vh4Wd",
    affiliateLabel: "Voir L'Atelier du Sourcil",
    articleSlug: "code-promo-atelier-du-sourcil-revitalash-revitabrow-soin-cils-sourcils-mai-2026",
    color: "#C026D3",
  },
  {
    brand: "Léa Nature",
    category: "Bio & Naturel",
    offer: "-10% sur la 1ère commande via newsletter (So'Bio Étic, Boho Green, Florame, Jonzac, Jardin Bio…)",
    conditions: "Inscription newsletter Léa Nature pour recevoir le code par e-mail. Cumulable avec promos en cours.",
    affiliateUrl: "https://ryt.leanature.com/?P5127D757CD2D2131&redir=https%3A%2F%2Fwww.leanature.com%2F",
    affiliateLabel: "Voir Léa Nature",
    color: "#4D7C0F",
  },
  {
    brand: "MiiN Cosmetics",
    category: "K-Beauty",
    offer: "-10% sur la 1ère commande via newsletter + Meisani Starter Packs à 20,99€",
    conditions: "Inscription newsletter MiiN. Cumulable avec packs découverte.",
    affiliateUrl: "https://tidd.ly/3JKQA7H",
    affiliateLabel: "Voir MiiN Cosmetics",
    articleSlug: "code-promo-miin-cosmetics-meisani-starter-pack-coreen-mai-2026",
    color: "#EC4899",
  },
  {
    brand: "News Parfums",
    category: "Parfums",
    offer: "Parfums de marque jusqu'à -70% toute l'année + livraison offerte dès 60€",
    conditions: "Sélection rotative de 500+ parfums. Originaux et flacons éco (sans boîte).",
    affiliateUrl: "https://fnty.co/c/r-XPuhDdkO",
    affiliateLabel: "Voir News Parfums",
    color: "#BE185D",
  },
  {
    brand: "Nubiance",
    category: "Beauté",
    offer: "Programme fidélité + parrainage : réductions cumulées sur les soins peaux noires & métissées",
    conditions: "Inscription newsletter pour code de bienvenue. Points fidélité cumulés à chaque commande.",
    affiliateUrl: "https://nubiance.fr/pages/programme-de-fidelite-parrainage",
    affiliateLabel: "Voir Nubiance",
    articleSlug: "nubiance-programme-fidelite-soin-peau-noire",
    color: "#92400E",
  },
  {
    brand: "Poulpeo",
    category: "Cashback",
    offer: "Cashback sur 1 600+ marchands + cashbacks boostés permanents + extension Chrome qui détecte le cashback dispo",
    conditions: "Inscription gratuite. Cashback validé sous 2-3 mois. Cumulable avec codes promo.",
    affiliateUrl: "https://www.poulpeo.com/p/UaLtab",
    affiliateLabel: "Voir Poulpeo",
    articleSlug: "bon-plan-poulpeo-cashback-boostes-michael-kors-expedia-huawei-mars-2026",
    color: "#6366F1",
  },
  {
    brand: "Rakuten",
    category: "Cashback",
    offer: "Cashback Club R gratuit toute l'année + Rakuten Points convertibles + opérations boostées Mega Peak Days",
    conditions: "Inscription gratuite au Club R. Cashback crédité après validation de la commande. Cumulable avec codes promo.",
    affiliateUrl: "https://fnty.co/c/r-GjssEgPP",
    affiliateLabel: "Voir Rakuten",
    articleSlug: "cashback-rakuten-guide-rakuten-points-club-r-gagner-argent-achats-2026",
    color: "#BF0000",
  },
  {
    brand: "Sarenza",
    category: "Chaussures",
    offer: "20€ offerts dès 100€ d'achat sur la 1ère commande + offres anniversaire, réveil (-40%), découverte (-30%)",
    conditions: "Inscription newsletter pour le code bienvenue. Articles expédiés par Sarenza uniquement.",
    affiliateUrl: "https://lk.gt/aXh1b",
    affiliateLabel: "Voir Sarenza",
    articleSlug: "bon-plan-sarenza-offre-mars-jusqu-a-50-pourcent-10-supp-mars-2026",
    color: "#F59E0B",
  },
  {
    brand: "Showroom Privé",
    category: "Mode & Lifestyle",
    offer: "Ventes privées quotidiennes -30% à -70% sur 200+ marques. Inscription gratuite, accès illimité.",
    conditions: "Inscription obligatoire (gratuite). Stocks limités, ventes 3 à 7 jours.",
    affiliateUrl: "https://lk.gt/aGiih",
    affiliateLabel: "Voir Showroom Privé",
    articleSlug: "bon-plan-showroomprive-ventes-jour-boss-asics-jimmy-choo-nivea-kinderkraft-mai-2026",
    color: "#EF4444",
  },
  {
    brand: "Twenty DC",
    category: "Beauté & Cosmetic Food",
    offer: "-10% sur la 1ère commande via newsletter (collagène marin Peau Magnifique, Zinc, Oméga 3)",
    conditions: "Inscription newsletter Twenty DC pour recevoir le code -10%. Cumulable avec promos en cours.",
    affiliateUrl: "https://osu.twentydc.com/?P51399D57CD2D1F1&redir=https%3A%2F%2Ftwentydc.com%2F",
    affiliateLabel: "Voir Twenty DC",
    articleSlug: "twentydc-collagene-marin-complement-beaute-france",
    color: "#F472B6",
  },
  {
    brand: "Uriage",
    category: "Dermo-cosmétique",
    offer: "-15% sur la 1ère commande via newsletter + conseils personnalisés (eau thermale, soin visage, corps, bébé)",
    conditions: "Inscription newsletter Uriage pour recevoir le code -15%. Cumulable avec promos en cours.",
    affiliateUrl: "https://ntk.uriage.fr/?P511FDB57CD2D131&redir=https%3A%2F%2Fwww.uriage.fr%2F",
    affiliateLabel: "Voir Uriage",
    color: "#00A4B8",
  },
  {
    brand: "Zooplus",
    category: "Animaux",
    offer: "-10% sur la 1ère commande + programme fidélité zooPoints + parrainage 250 points (~5€)",
    conditions: "Inscription newsletter pour le -10%. zooPoints cumulables sur chaque commande (1€ = 1 point, paliers à 200/500/2000 points).",
    affiliateUrl: "https://tidd.ly/4bvX2g9",
    affiliateLabel: "Voir Zooplus",
    articleSlug: "code-promo-zooplus-mars-2026",
    color: "#0EA5E9",
  },
];

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
        <section style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDFA 100%)", padding: "40px 0 28px", borderBottom: "2px solid #BAE6FD" }}>
          <div className="container">
            <nav className="breadcrumbs">
              <a href="/">Accueil</a>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>Codes promo permanents</span>
            </nav>
            <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.3rem)", fontWeight: 800, marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
              <InfinityIcon size={28} color="#1D4ED8" />
              Codes promo permanents 2026
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem", maxWidth: "780px" }}>
              Les <strong>codes promo et offres valables toute l&apos;année</strong> : parrainages, programmes fidélité, réductions de bienvenue, livraisons offertes. À garder sous le coude pour économiser à chaque commande, peu importe la saison.
            </p>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>
                <BadgeCheck size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#1D4ED8" }} />
                Les réductions valables toute l&apos;année
              </h2>
              <p>{CODES.length} marques avec un code permanent ou un programme actif en continu</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
              {CODES.map((code) => (
                <div key={code.brand} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: code.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "1.2rem" }}>
                      {code.brand.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{code.brand}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{code.category}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.55, marginBottom: "8px", color: "#1f2937" }}>
                    <strong>{code.offer}</strong>
                  </p>
                  <p style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--muted-foreground)", marginBottom: "14px", flex: 1 }}>
                    {code.conditions}
                  </p>
                  <a href={code.affiliateUrl} target="_blank" rel="nofollow noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "10px 16px", borderRadius: "10px", background: code.color, color: "white", fontWeight: 700, textDecoration: "none", fontSize: "0.92rem" }}>
                    {code.affiliateLabel} →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        <section className="section" style={{ background: "var(--muted)" }}>
          <div className="container">
            <div className="section-title">
              <h2>Programmes fidélité à connaître</h2>
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
                { href: "/bons-plans-en-cours", label: "Bons plans en cours", desc: "Ventes actives cette semaine", color: "#E63946" },
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
