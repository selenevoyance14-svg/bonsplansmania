// Offres codes promo affichées en cards visuelles style Dealabs sur /code-promo.
// Chaque offre = 1 card avec valeur à gauche + titre + CTA + expiration.
// - type "code"     → révèle le code à copier + CTA "Aller sur le site"
// - autres types    → CTA direct vers le lien affilié
//
// Les liens affiliés sont ceux définis dans code-promo-data.ts par défaut.
// Une offre peut override affiliateUrl si elle pointe vers une landing différente.

import { getBrandBySlug } from "./code-promo-data";

export type OfferType = "code" | "offre" | "soldes" | "cashback" | "livraison" | "newsletter";

export interface CodePromoOffer {
  id: string;                    // unique
  brandSlug: string;             // référence à CODE_PROMO_BRANDS
  type: OfferType;
  value: string;                 // gros label à gauche : "-70 %", "10 €", "1=2"
  valueLabel?: string;           // sous-ligne petite : "SOLDES", "OFFERTS", etc.
  title: string;                 // titre du card
  code?: string;                 // révélé au clic (uniquement si type === "code")
  affiliateUrl?: string;         // override du brand affiliateUrl
  expires?: string;              // ISO YYYY-MM-DD ; absent = permanent
  conditions?: string;           // texte accordion
  featured?: boolean;            // remonte en tête de liste
}

export const CODE_PROMO_OFFERS: CodePromoOffer[] = [
  // ============================================================
  // FRANÇOISE SAGET — 7 offres cumulables été 2026
  // ============================================================
  {
    id: "fs-soldes-70",
    brandSlug: "francoise-saget",
    type: "soldes",
    value: "-70 %",
    valueLabel: "SOLDES",
    title: "Soldes 3ᵉ démarque jusqu'à -70 % sur linge maison, déco, lingerie",
    expires: "2026-07-28",
    conditions: "Offre valable du 09/07 au 28/07/2026 dans la limite des stocks disponibles. Réduction visible sur les prix affichés.",
    featured: true,
  },
  {
    id: "fs-1-achete-1-offert",
    brandSlug: "francoise-saget",
    type: "offre",
    value: "1 = 2",
    valueLabel: "OFFERT",
    title: "1 acheté = 1 offert sur le linge de lit uni",
    expires: "2026-07-21",
    conditions: "Sur les gammes Uni jersey, Anti-tâches, Allergo pure, Comme à l'hôtel. Le moins cher des deux articles est offert. Valable jusqu'au 21/07/2026.",
    featured: true,
  },
  {
    id: "fs-50-collections",
    brandSlug: "francoise-saget",
    type: "offre",
    value: "-50 %",
    title: "-50 % sur les grandes collections linge de maison",
    expires: "2026-07-21",
    conditions: "Sur les collections Feuille à fleurs, Cascade fleurie, Trail 56, Ligne nautique et sélection. Jusqu'au 21/07/2026.",
  },
  {
    id: "fs-60-stars",
    brandSlug: "francoise-saget",
    type: "offre",
    value: "-60 %",
    title: "-60 % sur les 3 modèles stars (Éclats d'été, Doux baiser, Chouette la nuit)",
    expires: "2026-07-21",
    conditions: "Sur 3 modèles ciblés uniquement. Valable jusqu'au 21/07/2026.",
  },
  {
    id: "fs-40-panier",
    brandSlug: "francoise-saget",
    type: "offre",
    value: "-40 %",
    title: "-40 % sur 2 articles non remisés au panier",
    expires: "2026-07-21",
    conditions: "Cumulable avec les autres offres du site. Sélection d'articles non remisés. Jusqu'au 21/07/2026.",
  },
  {
    id: "fs-30-deco",
    brandSlug: "francoise-saget",
    type: "offre",
    value: "-30 %",
    title: "-30 % sur la déco, la lingerie et les articles enfants",
    expires: "2026-07-21",
    conditions: "Sélection Françoise Saget déco / lingerie / enfants. Jusqu'au 21/07/2026.",
  },
  {
    id: "fs-10-newsletter",
    brandSlug: "francoise-saget",
    type: "newsletter",
    value: "10 €",
    valueLabel: "OFFERTS",
    title: "10 € offerts dès 60 € d'achat en s'inscrivant à la newsletter",
    conditions: "Offre pérenne pour toute première commande. Cumulable avec les soldes et autres offres du moment.",
    featured: true,
  },

  // ============================================================
  // ADOPT — baseline permanente
  // ============================================================
  {
    id: "adopt-parfums-4-99",
    brandSlug: "adopt",
    type: "offre",
    value: "4,99 €",
    valueLabel: "DÈS",
    title: "Parfums Adopt dès 4,99 € (format 30 ml)",
    conditions: "Baseline permanente sur les parfums 30 ml de la marque. Livraison offerte selon conditions.",
    featured: true,
  },

  // ============================================================
  // SARENZA — service permanent
  // ============================================================
  {
    id: "sarenza-retours-100j",
    brandSlug: "sarenza",
    type: "livraison",
    value: "100 j",
    valueLabel: "RETOURS",
    title: "100 jours pour retourner tes chaussures gratuitement",
    conditions: "Retours et échanges gratuits sous 100 jours sur Sarenza.fr. Un des délais les plus généreux du marché.",
  },

  // ============================================================
  // BIOTYFULL BOX — offre permanente
  // ============================================================
  {
    id: "biotyfull-box-24-90",
    brandSlug: "biotyfull-box",
    type: "offre",
    value: "24,90 €",
    valueLabel: "PAR MOIS",
    title: "Box beauté 100 % bio à 24,90 €/mois (5 produits + magazine)",
    conditions: "Abonnement mensuel sans engagement. Vraie curation 100 % bio + magazine papier.",
    featured: true,
  },

  // ============================================================
  // BLANCHE PORTE — offre newsletter courante
  // ============================================================
  {
    id: "blancheporte-newsletter",
    brandSlug: "blanche-porte",
    type: "newsletter",
    value: "10 €",
    valueLabel: "OFFERTS",
    title: "10 € offerts sur la 1ʳᵉ commande en s'inscrivant à la newsletter",
    conditions: "Offre pérenne 1ʳᵉ commande. Consulter les conditions sur blancheporte.fr.",
  },

  // ============================================================
  // GREENWEEZ — service permanent
  // ============================================================
  {
    id: "greenweez-livraison",
    brandSlug: "greenweez",
    type: "livraison",
    value: "GRATUITE",
    valueLabel: "LIVRAISON",
    title: "Livraison gratuite dès 49 € d'achat sur Greenweez",
    conditions: "Leader européen bio alimentation et cosmétique. Livraison offerte dès 49 € en France métropolitaine.",
  },

  // ============================================================
  // YESSTYLE — service permanent
  // ============================================================
  {
    id: "yesstyle-livraison",
    brandSlug: "yesstyle",
    type: "livraison",
    value: "GRATUITE",
    valueLabel: "LIVRAISON",
    title: "Livraison gratuite dès 39 € d'achat + douanes prises en charge",
    conditions: "Livraison offerte dès 39 €. Taxes de douane prises en charge par YesStyle. K-beauty et J-beauty à prix directs.",
  },

  // ============================================================
  // DR PIERRE RICAUD — service permanent
  // ============================================================
  {
    id: "dpr-satisfait-100j",
    brandSlug: "dr-pierre-ricaud",
    type: "livraison",
    value: "100 j",
    valueLabel: "SATISFAIT",
    title: "Satisfait ou remboursé 100 jours + échantillons offerts",
    conditions: "100 jours pour être satisfait ou remboursé sur toute la boutique. Échantillons offerts à chaque commande.",
  },

  // ============================================================
  // DAMART — service permanent
  // ============================================================
  {
    id: "damart-fidelite",
    brandSlug: "damart",
    type: "cashback",
    value: "5 %",
    valueLabel: "FIDÉLITÉ",
    title: "5 % de remise fidélité à chaque commande via la carte cliente",
    conditions: "Programme fidélité Damart : 5 % de remise cumulés sur ta carte cliente à chaque achat. Cumulable avec les promos.",
  },
];

export function getOffersByBrand(brandSlug: string): CodePromoOffer[] {
  return CODE_PROMO_OFFERS.filter((o) => o.brandSlug === brandSlug);
}

export function getActiveOffers(today = new Date()): CodePromoOffer[] {
  return CODE_PROMO_OFFERS.filter((o) => {
    if (!o.expires) return true;
    return new Date(o.expires) >= today;
  });
}

export function getOfferAffiliateUrl(offer: CodePromoOffer): string {
  if (offer.affiliateUrl) return offer.affiliateUrl;
  const brand = getBrandBySlug(offer.brandSlug);
  return brand?.affiliateUrl ?? "#";
}

export function getOfferBrand(offer: CodePromoOffer) {
  return getBrandBySlug(offer.brandSlug);
}

export function offerTypeLabel(type: OfferType): string {
  switch (type) {
    case "code": return "Code promo";
    case "offre": return "Offre";
    case "soldes": return "Soldes";
    case "cashback": return "Cashback";
    case "livraison": return "Livraison";
    case "newsletter": return "Newsletter";
  }
}

export function offerTypeColor(type: OfferType): string {
  switch (type) {
    case "code": return "#2563EB";       // bleu
    case "offre": return "#DB2777";      // rose
    case "soldes": return "#DC2626";     // rouge
    case "cashback": return "#F59E0B";   // orange
    case "livraison": return "#059669";  // vert
    case "newsletter": return "#7C3AED"; // violet
  }
}

export function offerCtaLabel(offer: CodePromoOffer): string {
  if (offer.type === "code") return "Voir le code";
  if (offer.type === "newsletter") return "Je m'inscris";
  if (offer.type === "cashback") return "J'active mon cashback";
  return "Voir la remise";
}
