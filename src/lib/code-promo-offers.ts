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
  brandSlug: string;             // référence à CODE_PROMO_BRANDS (sinon utilise brandName)
  brandName?: string;            // override du nom marque si brandSlug n'est pas dans CODE_PROMO_BRANDS
  type: OfferType;
  value: string;                 // gros label à gauche : "-70 %", "10 €", "1=2"
  valueLabel?: string;           // sous-ligne petite : "SOLDES", "OFFERTS", etc.
  title: string;                 // titre du card
  code?: string;                 // révélé au clic (uniquement si type === "code")
  affiliateUrl?: string;         // override du brand affiliateUrl
  expires?: string;              // ISO YYYY-MM-DD ; absent = permanent
  permanent?: boolean;           // affiche badge "♾️ Permanent" (à utiliser pour /codes-promo-permanents)
  conditions?: string;           // texte accordion
  featured?: boolean;            // remonte en tête de liste
}

export const CODE_PROMO_OFFERS: CodePromoOffer[] = [
  // ============================================================
  // FRANÇOISE SAGET — 8 offres cumulables été 2026
  // ============================================================
  {
    id: "fs-soldes10-code",
    brandSlug: "francoise-saget",
    type: "code",
    value: "-10 %",
    valueLabel: "SUPPLÉMENTAIRES",
    title: "-10 % supplémentaires sur tout le site, cumulable avec les soldes -70 %",
    code: "SOLDES10",
    expires: "2026-07-21",
    conditions: "Code -10 % supplémentaires sur tout le site (soldes compris) à partir de 15 € d'achat. Valable jusqu'au 21/07/2026.",
    featured: true,
  },
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
  // ADOPT — panel 11 offres (soldes + newsletter + parrainage + fidélité + coffrets + …)
  // ============================================================
  {
    id: "adopt-soldes-50",
    brandSlug: "adopt",
    type: "soldes",
    value: "-50 %",
    valueLabel: "SOLDES",
    title: "Soldes Adopt jusqu'à -50 % sur les parfums et cosmétiques",
    expires: "2026-08-05",
    conditions: "Soldes d'été 2026 sur adopt.com. Sélection parfums, maquillage et soin corps.",
    featured: true,
  },
  {
    id: "adopt-newsletter-20",
    brandSlug: "adopt",
    type: "newsletter",
    value: "-20 %",
    valueLabel: "1ʳᵉ CDE",
    title: "-20 % sur la 1ʳᵉ commande en s'inscrivant à la newsletter",
    conditions: "Offre permanente. Code de réduction reçu par mail après inscription à la newsletter Adopt. Valable sur la première commande.",
    featured: true,
  },
  {
    id: "adopt-parrainage-20x2",
    brandSlug: "adopt",
    type: "offre",
    value: "-20 %",
    valueLabel: "PARRAINAGE",
    title: "-20 % pour le parrain ET pour le filleul (programme parrainage)",
    conditions: "Offre permanente. -20 % de réduction pour la personne parrainée et pour la marraine / le parrain, sur leur commande respective.",
  },
  {
    id: "adopt-fidelite-myadopt",
    brandSlug: "adopt",
    type: "offre",
    value: "5 €",
    valueLabel: "TOUS LES 75 €",
    title: "Programme fidélité MyAdopt : 5 € offerts tous les 75 € d'achat",
    conditions: "Programme fidélité gratuit MyAdopt. 5 € de bon d'achat crédités tous les 75 € cumulés sur ton compte. Compte à créer sur adopt.com.",
  },
  {
    id: "adopt-coffrets-25",
    brandSlug: "adopt",
    type: "offre",
    value: "-25 %",
    valueLabel: "COFFRETS",
    title: "Jusqu'à -25 % sur les coffrets parfums Adopt",
    conditions: "Offre permanente sur la catégorie coffrets parfums adopt.com.",
    featured: true,
  },
  {
    id: "adopt-carrousel-4-parfums-50",
    brandSlug: "adopt",
    type: "offre",
    value: "-50 %",
    valueLabel: "4 PARFUMS",
    title: "Carrousel 4 parfums 30 ml achetés = -50 % sur le lot",
    conditions: "Offre permanente : le carrousel de 4 parfums 30 ml revient à -50 % du prix unitaire cumulé. Sélection de flacons disponibles sur adopt.com.",
  },
  {
    id: "adopt-anniversaire-parfum-offert",
    brandSlug: "adopt",
    type: "offre",
    value: "OFFERT",
    valueLabel: "ANNIVERSAIRE",
    title: "1 parfum 30 ml offert pour ton anniversaire (membre MyAdopt)",
    conditions: "Cadeau anniversaire réservé aux membres du programme MyAdopt. Il faut avoir renseigné sa date d'anniversaire sur son compte. Bon d'achat valable dans le mois d'anniversaire.",
  },
  {
    id: "adopt-trio-3e-50",
    brandSlug: "adopt",
    type: "offre",
    value: "-50 %",
    valueLabel: "3ᵉ PARFUM",
    title: "Trio parfums : -50 % sur le 3ᵉ (formats 30 / 50 / 100 ml)",
    conditions: "Offre permanente : le 3ᵉ parfum du trio à -50 %. Valable sur les formats 30 ml, 50 ml et 100 ml. Le moins cher des trois bénéficie de la remise.",
  },
  {
    id: "adopt-flacons-vides-20",
    brandSlug: "adopt",
    type: "offre",
    value: "-20 %",
    valueLabel: "RETOUR",
    title: "-20 % en rapportant tes flacons vides en magasin Adopt",
    conditions: "Programme éco-responsable Adopt. Ramène tes flacons Adopt vides en boutique physique et bénéficie de -20 % sur ta prochaine commande.",
  },
  {
    id: "adopt-4-parfums-3-payes",
    brandSlug: "adopt",
    type: "offre",
    value: "4 = 3",
    valueLabel: "OFFERT",
    title: "4 parfums achetés = le 4ᵉ offert (formats 30 / 50 / 100 ml)",
    conditions: "Offre permanente : 4 parfums achetés = le 4ᵉ le moins cher offert (soit -25 % sur le lot). Valable sur les formats 30, 50 et 100 ml.",
  },

  // ============================================================
  // ATELIER DU SOURCIL — soldes été 2026 + newsletter
  // ============================================================
  {
    id: "atelier-du-sourcil-soldes-30",
    brandSlug: "atelier-du-sourcil",
    type: "soldes",
    value: "-30 %",
    valueLabel: "SOLDES",
    title: "Soldes d'été jusqu'à -30 % sur la sélection Atelier du Sourcil",
    expires: "2026-07-21",
    conditions: "Soldes d'été 2026 sur atelierdusourcil.com. Valable jusqu'au 21/07/2026 dans la limite des stocks disponibles.",
    featured: true,
  },
  {
    id: "atelier-du-sourcil-newsletter-10",
    brandSlug: "atelier-du-sourcil",
    type: "newsletter",
    value: "-10 %",
    valueLabel: "1ʳᵉ CDE",
    title: "-10 % sur la 1ʳᵉ commande en s'inscrivant à la newsletter",
    conditions: "Offre permanente. Code de réduction reçu par mail après inscription à la newsletter Atelier du Sourcil, valable sur la première commande.",
    featured: true,
  },

  // ============================================================
  // DARTY — opération GEM 17-19/07 (3 codes bas de panier)
  // ============================================================
  {
    id: "darty-gem60",
    brandSlug: "darty",
    type: "code",
    value: "-60 €",
    valueLabel: "DÈS 600 €",
    title: "-60 € dès 600 € d'achat sur le gros électroménager Darty",
    code: "GEM60",
    expires: "2026-07-19",
    conditions: "Opération GEM (gros électroménager) Multicanal du vendredi 17/07/2026 à 9h au dimanche 19/07/2026 à 23h59. Palier mini 600 € sur le rayon gros électroménager. Non cumulable avec GEM80 et GEM100.",
    featured: true,
  },
  {
    id: "darty-gem80",
    brandSlug: "darty",
    type: "code",
    value: "-80 €",
    valueLabel: "DÈS 800 €",
    title: "-80 € dès 800 € d'achat sur le gros électroménager Darty",
    code: "GEM80",
    expires: "2026-07-19",
    conditions: "Opération GEM (gros électroménager) Multicanal du vendredi 17/07/2026 à 9h au dimanche 19/07/2026 à 23h59. Palier mini 800 € sur le rayon gros électroménager. Non cumulable avec GEM60 et GEM100.",
    featured: true,
  },
  {
    id: "darty-gem100",
    brandSlug: "darty",
    type: "code",
    value: "-100 €",
    valueLabel: "DÈS 1000 €",
    title: "-100 € dès 1 000 € d'achat sur le gros électroménager Darty",
    code: "GEM100",
    expires: "2026-07-19",
    conditions: "Opération GEM (gros électroménager) Multicanal du vendredi 17/07/2026 à 9h au dimanche 19/07/2026 à 23h59. Palier mini 1 000 € sur le rayon gros électroménager. Non cumulable avec GEM60 et GEM80.",
    featured: true,
  },

  // ============================================================
  // BÉABA — soldes -60 % + code LAST5 + newsletter
  // ============================================================
  {
    id: "beaba-soldes-60",
    brandSlug: "beaba",
    type: "soldes",
    value: "-60 %",
    valueLabel: "SOLDES",
    title: "Soldes Béaba jusqu'à -60 % sur une sélection d'articles bébé",
    expires: "2026-07-21",
    conditions: "Soldes d'été 2026 sur beaba.com. Valables du 24/06/2026 au 21/07/2026 dans la limite des stocks disponibles, sur une sélection d'articles Béaba (repas bébé, allaitement, bain, éveil).",
    featured: true,
  },
  {
    id: "beaba-last5",
    brandSlug: "beaba",
    type: "code",
    value: "-5 %",
    valueLabel: "SUR SOLDES",
    title: "-5 % supplémentaires sur les articles déjà soldés (code LAST5)",
    code: "LAST5",
    expires: "2026-07-21",
    conditions: "Code -5 % en supplément sur les articles Béaba déjà soldés. Cumulable avec les prix soldés, valable jusqu'à la fin des soldes Béaba (21/07/2026).",
    featured: true,
  },
  {
    id: "beaba-newsletter-10",
    brandSlug: "beaba",
    type: "newsletter",
    value: "-10 %",
    valueLabel: "1ʳᵉ CDE",
    title: "-10 % sur la 1ʳᵉ commande en s'inscrivant à la newsletter",
    conditions: "Offre permanente. Code de réduction reçu par mail après inscription à la newsletter Béaba, valable sur la première commande.",
    featured: true,
  },
  {
    id: "beaba-packs-20",
    brandSlug: "beaba",
    type: "offre",
    value: "-20 %",
    valueLabel: "PACKS",
    title: "-20 % de remise permanente sur tous les packs Béaba",
    conditions: "Offre permanente : -20 % sur la sélection de packs Béaba (repas, allaitement, bain, éveil). Remise appliquée automatiquement sur les packs éligibles.",
  },
  {
    id: "beaba-bkmeal-coffret",
    brandSlug: "beaba",
    type: "code",
    value: "OFFERT",
    valueLabel: "COFFRET REPAS",
    title: "Coffret repas silicone offert pour l'achat d'un Babycook Néo® (code BKMEAL)",
    code: "BKMEAL",
    conditions: "Offre permanente : coffret repas en silicone offert pour tout achat d'un Babycook Néo® Béaba (coloris au choix). Code BKMEAL à saisir au panier.",
    featured: true,
  },
  {
    id: "beaba-bibex-doseuse",
    brandSlug: "beaba",
    type: "code",
    value: "OFFERT",
    valueLabel: "BOÎTE DOSEUSE",
    title: "Boîte doseuse de lait offerte pour l'achat d'un Bib'Espresso® (code BIBEX)",
    code: "BIBEX",
    conditions: "Offre permanente : boîte doseuse de lait offerte pour tout achat d'un Bib'Espresso® Béaba. Code BIBEX à saisir au panier.",
    featured: true,
  },
  {
    id: "beaba-paris-gourde",
    brandSlug: "beaba",
    type: "code",
    value: "OFFERT",
    valueLabel: "GOURDE INOX",
    title: "Gourde inox 350 ml offerte pour l'achat d'un sac à langer Paris (code PARIS)",
    code: "PARIS",
    conditions: "Offre permanente : gourde en inox 350 ml offerte pour tout achat d'un sac à langer Paris Béaba (coloris au choix). Code PARIS à saisir au panier.",
    featured: true,
  },
  {
    id: "beaba-sofa-toilette",
    brandSlug: "beaba",
    type: "code",
    value: "OFFERT",
    valueLabel: "SET TOILETTE",
    title: "Set accessoires de toilette offert pour l'achat d'un matelas Sofalange® (code SOFA)",
    code: "SOFA",
    conditions: "Offre permanente : set accessoires de toilette offert pour tout achat d'un matelas Sofalange® Béaba. Code SOFA à saisir au panier.",
    featured: true,
  },

  // ============================================================
  // BEAUTY SUCCESS — soldes + chéquier été + newsletter + offres perma
  // ============================================================
  {
    id: "beauty-success-soldes",
    brandSlug: "beauty-success",
    type: "soldes",
    value: "SOLDES",
    valueLabel: "JUSQU'AU 21/07",
    title: "Soldes d'été Beauty Success sur une sélection pastillée soldes",
    expires: "2026-07-21",
    conditions: "Soldes d'été 2026 sur beautysuccess.fr et parfumeries participantes. Valables du 24/06/2026 au 21/07/2026 sur une sélection de produits pastillés soldes. Non cumulable avec les produits déjà remisés.",
    featured: true,
  },
  {
    id: "beauty-success-hello20",
    brandSlug: "beauty-success",
    type: "newsletter",
    value: "-20 %",
    valueLabel: "1ʳᵉ CDE",
    title: "-20 % sur la 1ʳᵉ commande en s'inscrivant à la newsletter (code HELLO20)",
    code: "HELLO20",
    conditions: "Offre permanente. Code HELLO20 reçu par mail après inscription à la newsletter, valable une seule fois pendant 3 mois. Hors promotions en cours, offres du mois, produits marques points rouges, cartes cadeaux et prestations institut.",
    featured: true,
  },
  {
    id: "beauty-success-bienvenue20",
    brandSlug: "beauty-success",
    type: "code",
    value: "-20 %",
    valueLabel: "BIENVENUE",
    title: "-20 % cadeau de bienvenue avec le code BIENVENUE20",
    code: "BIENVENUE20",
    conditions: "Offre permanente. Code BIENVENUE20 valable une seule fois pendant 3 mois. Hors promotions en cours, offres du mois, produits marques points rouges, cartes cadeaux et prestations institut.",
  },
  {
    id: "beauty-success-bsparf25",
    brandSlug: "beauty-success",
    type: "code",
    value: "-25 %",
    valueLabel: "PARFUM",
    title: "-25 % sur ton parfum préféré avec le code BSPARF25",
    code: "BSPARF25",
    expires: "2026-08-30",
    conditions: "Offre valable du 06/07/2026 au 30/08/2026, une fois par personne, dans les parfumeries et instituts Beauty Success participants et sur beautysuccess.fr. Hors produits marques points rouges (Nuxe, Lierac, Clarins, Estée Lauder, YSL, etc.) et petit prix. Non cumulable avec les produits déjà remisés.",
    featured: true,
  },
  {
    id: "beauty-success-bspref25",
    brandSlug: "beauty-success",
    type: "code",
    value: "-25 %",
    valueLabel: "PRODUIT",
    title: "-25 % sur ton produit soin ou maquillage préféré (code BSPREF25)",
    code: "BSPREF25",
    expires: "2026-08-30",
    conditions: "Offre valable du 06/07/2026 au 30/08/2026, une fois par personne, dans les parfumeries et instituts Beauty Success participants et sur beautysuccess.fr. Hors produits marques points rouges et petit prix. Non cumulable avec les produits déjà remisés.",
    featured: true,
  },
  {
    id: "beauty-success-bsbeauty50",
    brandSlug: "beauty-success",
    type: "code",
    value: "-40 %",
    valueLabel: "2ᵉ PRODUIT",
    title: "-40 % sur le 2ᵉ produit soin ou maquillage acheté (code BSBEAUTY50)",
    code: "BSBEAUTY50",
    expires: "2026-08-30",
    conditions: "La remise -40 % s'applique sur le produit le moins cher des deux, par multiple de 2 produits achetés en une seule fois. Offre valable du 06/07/2026 au 30/08/2026, une fois par personne. Hors marques points rouges et petit prix. Non cumulable avec produits déjà remisés.",
    featured: true,
  },
  {
    id: "beauty-success-bsbeauty10",
    brandSlug: "beauty-success",
    type: "code",
    value: "10 €",
    valueLabel: "DÈS 65 €",
    title: "10 € offerts dès 65 € d'achat avec le code BSBEAUTY10",
    code: "BSBEAUTY10",
    expires: "2026-08-30",
    conditions: "Offre valable du 06/07/2026 au 30/08/2026, une fois par personne, sur beautysuccess.fr et parfumeries participantes. Hors marques points rouges et petit prix. Non cumulable avec produits déjà remisés.",
  },
  {
    id: "beauty-success-bsbeauty15",
    brandSlug: "beauty-success",
    type: "code",
    value: "15 €",
    valueLabel: "DÈS 79 €",
    title: "15 € offerts dès 79 € d'achat avec le code BSBEAUTY15",
    code: "BSBEAUTY15",
    expires: "2026-08-30",
    conditions: "Offre valable du 06/07/2026 au 30/08/2026, une fois par personne, sur beautysuccess.fr et parfumeries participantes. Hors marques points rouges et petit prix. Non cumulable avec produits déjà remisés.",
  },
  {
    id: "beauty-success-bsbeauty30",
    brandSlug: "beauty-success",
    type: "code",
    value: "30 €",
    valueLabel: "DÈS 140 €",
    title: "30 € offerts dès 140 € d'achat avec le code BSBEAUTY30",
    code: "BSBEAUTY30",
    expires: "2026-08-30",
    conditions: "Offre valable du 06/07/2026 au 30/08/2026, une fois par personne, sur beautysuccess.fr et parfumeries participantes. Hors marques points rouges et petit prix. Non cumulable avec produits déjà remisés.",
    featured: true,
  },
  {
    id: "beauty-success-coffrets-10-supp",
    brandSlug: "beauty-success",
    type: "offre",
    value: "-10 %",
    valueLabel: "COFFRETS",
    title: "-10 % supplémentaires sur les coffrets déjà remisés à -25 %",
    expires: "2026-07-21",
    conditions: "Offre valable du 22/06/2026 au 21/07/2026 sur beautysuccess.fr et parfumeries participantes. Valable uniquement sur les produits pastillés à -25 %.",
  },
  {
    id: "beauty-success-3-produits-cadeau",
    brandSlug: "beauty-success",
    type: "offre",
    value: "OFFERT",
    valueLabel: "3 SOLDES",
    title: "Un cadeau offert dès 3 produits soldés achetés",
    conditions: "À partir du 24/06/2026 jusqu'à écoulement des stocks, valable uniquement sur beautysuccess.fr. Cadeau offert dès 3 produits soldés dans le panier.",
  },
  {
    id: "beauty-success-til-40",
    brandSlug: "beauty-success",
    type: "offre",
    value: "-40 %",
    valueLabel: "MARQUE TiL",
    title: "-40 % sur toute la marque TiL Beauty Success",
    conditions: "Offre non cumulable réservée à beautysuccess.fr, applicable uniquement sur les produits de la marque TiL. Valable jusqu'à épuisement des stocks.",
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
  // BIOTYFULL BOX — offre exclusive 6 routines 13 € + baseline
  // ============================================================
  {
    id: "biotyfull-box-6-routines-13",
    brandSlug: "biotyfull-box",
    type: "offre",
    value: "13 €",
    valueLabel: "17 PRODUITS",
    title: "6 nouvelles routines beauté à 13 € (17 produits, valeur 353 €) sans engagement",
    affiliateUrl: "https://xno.biotyfullbox.fr/?P51362157CD2D1D1&redir=https%3A%2F%2Fpage.biotyfullbox.fr%2F6pour13",
    conditions: "Offre de bienvenue Biotyfull Box : 6 routines beauté + 17 produits (valeur 353 €) pour 13 € + 6,90 € de livraison en France. Abonnement sans engagement — la box d'août 2026 est facturée 39,90 € sauf résiliation depuis l'espace client avant le 29/07/2026 inclus. 1ères arrivées 1ères servies.",
    featured: true,
  },
  {
    id: "biotyfull-box-baseline",
    brandSlug: "biotyfull-box",
    type: "offre",
    value: "39,90 €",
    valueLabel: "PAR MOIS",
    title: "Box beauté 100 % Made in France à 39,90 €/mois (curation naturelle et/ou bio)",
    conditions: "Abonnement mensuel sans engagement. Curation 100 % Made in France, naturelle et/ou bio, avec magazine papier inclus. Livraison offerte en France.",
  },

  // ============================================================
  // LOOKFANTASTIC — codes hebdo été + SPF + Sol de Janeiro + boxes
  // ============================================================
  {
    id: "lookfantastic-shop-22",
    brandSlug: "lookfantastic",
    type: "code",
    value: "-22 %",
    valueLabel: "SITE-WIDE",
    title: "-22 % sur toute la sélection Lookfantastic avec le code SHOP",
    code: "SHOP",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fc%2Foffers%2Feu-exclusions%2Fsitewide%2Flanding-page%2F",
    expires: "2026-07-25",
    conditions: "Code SHOP -22 % valable du 15 au 18/07/2026 puis du 21 au 25/07/2026 sur la sélection site-wide Lookfantastic. Exclusions marques appliquées, consulter la landing page.",
    featured: true,
  },
  {
    id: "lookfantastic-dimanche-30",
    brandSlug: "lookfantastic",
    type: "code",
    value: "-30 %",
    valueLabel: "DIMANCHE",
    title: "Sunday Shopping -30 % sur Lookfantastic (code DIMANCHE)",
    code: "DIMANCHE",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fc%2Foffers%2Feu%2Fsunday-shopping%2Ffr%2F",
    expires: "2026-07-26",
    conditions: "Code DIMANCHE -30 % activé uniquement les dimanches 19/07/2026 et 26/07/2026 sur la landing Sunday Shopping Lookfantastic. Exclusions marques appliquées.",
    featured: true,
  },
  {
    id: "lookfantastic-lundi-25",
    brandSlug: "lookfantastic",
    type: "code",
    value: "-25 %",
    valueLabel: "LUNDI",
    title: "Monday Shopping -25 % sur Lookfantastic (code LUNDI)",
    code: "LUNDI",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fc%2Foffers%2Feu%2Fmonday-shopping%2Ffr%2F",
    expires: "2026-07-20",
    conditions: "Code LUNDI -25 % activé uniquement le lundi 20/07/2026 sur la landing Monday Shopping Lookfantastic. Exclusions marques appliquées.",
    featured: true,
  },
  {
    id: "lookfantastic-premium30",
    brandSlug: "lookfantastic",
    type: "code",
    value: "-30 %",
    valueLabel: "PREMIUM",
    title: "-30 % sur BIOEFFECT, Lancôme et Elemis avec le code PREMIUM30",
    code: "PREMIUM30",
    expires: "2026-07-31",
    conditions: "Code PREMIUM30 -30 % sur une sélection de marques premium Lookfantastic (BIOEFFECT, Lancôme, Elemis notamment). Valable jusqu'au 31/07/2026. Voir la landing pour la sélection exacte.",
    featured: true,
  },
  {
    id: "lookfantastic-spf-20",
    brandSlug: "lookfantastic",
    type: "offre",
    value: "-20 %",
    valueLabel: "SPF ÉTÉ",
    title: "Au moins -20 % sur toute la protection solaire (SPF) tout l'été",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fc%2Fseasonal%2Fsummer%2Fsuncare-spf%2F",
    expires: "2026-08-31",
    conditions: "Offre été 2026 sur la protection solaire Lookfantastic (SPF). Au moins -20 % appliqué directement en prix sur la sélection SPF (pas de code nécessaire). Valable jusqu'à fin août 2026. Exclusions produits.",
  },
  {
    id: "lookfantastic-sol-de-janeiro-gift",
    brandSlug: "lookfantastic",
    type: "offre",
    value: "CADEAU",
    valueLabel: "SOL DE JANEIRO",
    title: "Sol de Janeiro : cadeau offert pour l'achat de la marque",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fc%2Fbrands%2Fsol-de-janeiro%2Fsave-30%2F",
    expires: "2026-07-26",
    conditions: "Du 17 au 26/07/2026 : rituel de voyage Badalada ou routine Body Confidence Sol de Janeiro offert selon les paniers éligibles chez Lookfantastic. Voir la landing pour les détails et exclusions.",
  },
  {
    id: "lookfantastic-box-pro-ageing",
    brandSlug: "lookfantastic",
    type: "offre",
    value: "55 €",
    valueLabel: "VALEUR 260 €",
    title: "Édition Pro-Ageing Lookfantastic à 55 € (valeur 260 €+ : Dermalogica, Murad, Kiehl's, Elemis)",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fp%2Fbeauty-box%2Fl-edition-pro-ageing-d-une-valeur-de-260%2F17691474%2F",
    conditions: "Beauty Box édition Pro-Ageing : sélection de produits soin anti-âge (Dermalogica, Murad, Kiehl's, Elemis, etc.) pour 55 € au lieu de 260 € de valeur cumulée. Meilleur ratio Beauty Box du moment.",
    featured: true,
  },
  {
    id: "lookfantastic-box-you-deserve-it",
    brandSlug: "lookfantastic",
    type: "offre",
    value: "45 €",
    valueLabel: "VALEUR 145 €",
    title: "Édition You Deserve It Lookfantastic à 45 € (valeur 145 €+ : Make Up For Ever, ELEMIS, Augustinus Bader…)",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fp%2Fbeauty-box%2Fl-edition-you-deserve-it-valeur-superieure-a-145%2F17691484%2F",
    conditions: "Beauty Box édition You Deserve It : assortiment de best-sellers et découvertes (Make Up For Ever, ELEMIS, The Beauty Crop, EFFN, Augustinus Bader, KIKO) pour 45 € au lieu de 145 € de valeur cumulée.",
  },

  // ============================================================
  // SENSILAB — Metabolism Boost 4x -55 % + livraison offerte
  // ============================================================
  {
    id: "sensilab-metabolism-boost-55",
    brandSlug: "sensilab",
    type: "offre",
    value: "-55 %",
    valueLabel: "+ LIVRAISON",
    title: "Sensilab Metabolism Boost 4x à -55 % + livraison offerte (programme 4 étapes)",
    conditions: "Programme complet 4 étapes Metabolism Boost 4x de Sensilab (compléments alimentaires pour la gestion du poids et du métabolisme). Remise -55 % appliquée automatiquement + livraison offerte. Offre soumise à disponibilité stocks.",
    featured: true,
  },

  // ============================================================
  // GLOWRIA — offre exclusive 4 routines 13 € + baseline
  // ============================================================
  {
    id: "glowria-4-routines-13",
    brandSlug: "glowria",
    type: "offre",
    value: "13 €",
    valueLabel: "11 PRODUITS",
    title: "4 nouvelles routines beauté à 13 € (11 produits, valeur 349 €) sans engagement",
    affiliateUrl: "https://glowria.com/landing/4pour13?ae=487",
    conditions: "Offre de bienvenue Glowria : 4 routines beauté + 11 produits (valeur 349 €) pour 13 € + 6,90 € de livraison. Abonnement sans engagement — la box d'août 2026 est facturée 24,90 € sauf résiliation depuis l'espace client jusqu'à 2 jours avant la fin du mois en cours. 1ères arrivées 1ères servies.",
    featured: true,
  },
  {
    id: "glowria-baseline-24-90",
    brandSlug: "glowria",
    type: "offre",
    value: "24,90 €",
    valueLabel: "PAR MOIS",
    title: "Box beauté Glowria à 24,90 €/mois (curation soin, maquillage, cheveux)",
    conditions: "Abonnement mensuel sans engagement. Sélection Glowria de marques indies (Garancia, Baïja, Kerargan, Warda, Able Skincare, etc.). Livraison offerte en France sur les box mensuelles suivantes.",
  },

  // ============================================================
  // BLANCHE PORTE — offre newsletter courante
  // ============================================================
  {
    id: "blancheporte-soldes-80",
    brandSlug: "blanche-porte",
    type: "soldes",
    value: "-80 %",
    valueLabel: "SOLDES",
    title: "Soldes d'été Blancheporte jusqu'à -80 % sur les articles pastillés",
    expires: "2026-07-21",
    conditions: "Soldes d'été 2026 du 24/06/2026 au 21/07/2026 sur les articles signalés « Soldes » selon taille et coloris et dans la limite du stock disponible.",
    featured: true,
  },
  {
    id: "blancheporte-promos-ete-70",
    brandSlug: "blanche-porte",
    type: "offre",
    value: "-70 %",
    valueLabel: "PROMOS ÉTÉ",
    title: "Promotions d'été Blancheporte jusqu'à -70 %",
    expires: "2026-07-21",
    conditions: "Promotions d'été 2026 du 24/06/2026 au 21/07/2026, baisse des prix avec des réductions pouvant aller jusqu'à -70 % dans la limite des stocks disponibles. Non cumulable avec une autre offre promotionnelle.",
    featured: true,
  },
  {
    id: "blancheporte-10-supp-2-articles",
    brandSlug: "blanche-porte",
    type: "offre",
    value: "-10 %",
    valueLabel: "DÈS 2 ART.",
    title: "-10 % supplémentaires sur toute la commande dès 2 articles achetés",
    expires: "2026-07-21",
    conditions: "Offre valable du 15/07/2026 au 21/07/2026, hors frais d'envoi. -10 % supplémentaires sur toute la commande dès 2 articles. Non cumulable avec une autre offre promotionnelle.",
    featured: true,
  },
  {
    id: "blancheporte-newsletter",
    brandSlug: "blanche-porte",
    type: "code",
    value: "11 €",
    valueLabel: "DÈS 20 €",
    title: "11 € offerts dès 20 € d'achat avec le code 899009 (bienvenue Blancheporte)",
    code: "899009",
    conditions: "Code de bienvenue Blancheporte : 11 € offerts dès 20 € d'achat, à utiliser sur toute la boutique mode ou maison. Offre permanente pour toute première commande.",
    featured: true,
  },

  // ============================================================
  // CARTE NOIRE — soldes d'été café + livraison
  // ============================================================
  {
    id: "carte-noire-cafe30",
    brandSlug: "carte-noire",
    type: "code",
    value: "-30 %",
    valueLabel: "CAFÉS",
    title: "-30 % sur tous les cafés Carte Noire avec le code CAFE30",
    code: "CAFE30",
    conditions: "-30 % sur la sélection cafés Carte Noire (grains, moulus, capsules) avec le code CAFE30 à saisir au panier.",
    featured: true,
  },
  {
    id: "carte-noire-accessoires-30",
    brandSlug: "carte-noire",
    type: "offre",
    value: "-30 %",
    valueLabel: "ACCESSOIRES",
    title: "-30 % sur les accessoires café Carte Noire (tasses, machines, mugs…)",
    conditions: "-30 % sur la sélection accessoires Carte Noire (tasses, mugs, machines à café, bocaux, plateaux…) directement appliquée en prix, sans code.",
    featured: true,
  },
  {
    id: "carte-noire-coffrets-gros-formats",
    brandSlug: "carte-noire",
    type: "offre",
    value: "COFFRETS",
    valueLabel: "GROS FORMATS",
    title: "Coffrets dégustation et gros formats Carte Noire (grains + capsules)",
    conditions: "Assortiments avantageux Carte Noire : coffrets dégustation, best sellers et gros formats sur les cafés en grains et en capsules. Offres permanentes disponibles sur cartenoire.fr.",
  },
  {
    id: "carte-noire-livraison-50",
    brandSlug: "carte-noire",
    type: "livraison",
    value: "OFFERTE",
    valueLabel: "DÈS 50 €",
    title: "Livraison offerte dès 50 € d'achat (sinon 4,99 €)",
    conditions: "Livraison Carte Noire : 4,99 € en dessous de 50 € d'achat, offerte à partir de 50 € d'achat. Offre permanente en France métropolitaine.",
  },

  // ============================================================
  // CHAUSSEA — soldes + newsletter + click&collect + e-réservation
  // ============================================================
  {
    id: "chaussea-soldes-ete",
    brandSlug: "chaussea",
    type: "soldes",
    value: "SOLDES",
    valueLabel: "JUSQU'AU 28/07",
    title: "Soldes d'été Chaussea sur une sélection en magasin et sur chaussea.com",
    expires: "2026-07-28",
    conditions: "Soldes d'été 2026 Chaussea valables du 24/06/2026 au 28/07/2026 inclus, dans les magasins Chaussea et sur chaussea.com, dans la limite des stocks disponibles. Réductions calculées sur le prix de référence conforme à la réglementation. Non cumulables avec toute autre promotion.",
    featured: true,
  },
  {
    id: "chaussea-newsletter-10",
    brandSlug: "chaussea",
    type: "newsletter",
    value: "-10 %",
    valueLabel: "DÈS 50 €",
    title: "-10 % de bienvenue dès 50 € d'achat en s'inscrivant à la newsletter",
    conditions: "Offre de bienvenue Chaussea : -10 % sur toute commande dès 50 € TTC d'achat sur chaussea.com. Code de réduction reçu par mail après inscription à la newsletter, valable 14 jours à compter de la réception de l'email. Non cumulable avec d'autres codes ou promotions.",
    featured: true,
  },
  {
    id: "chaussea-click-collect-10",
    brandSlug: "chaussea",
    type: "offre",
    value: "-10 %",
    valueLabel: "CLICK & COLLECT",
    title: "-10 % sur ton panier en choisissant le Click & Collect en magasin",
    conditions: "Remise de 10 % sur le panier avec le Click & Collect Chaussea (récupération magasin). Service disponible uniquement dans certains magasins participants (voir la page magasins). Non cumulable avec les offres en cours. Produit doit être en stock dans le magasin choisi.",
  },
  {
    id: "chaussea-e-reservation-10",
    brandSlug: "chaussea",
    type: "offre",
    value: "-10 %",
    valueLabel: "E-RÉSERVATION",
    title: "-10 % sur ta commande en choisissant la E-réservation (payable en magasin)",
    conditions: "Remise de 10 % avec la E-réservation Chaussea (paiement en magasin). Option proposée sur la fiche produit. Non cumulable avec les offres en cours. Produit doit être en stock dans le magasin choisi.",
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
  // YESSTYLE — Best of Korean Beauty + codes flash + livraison
  // ============================================================
  {
    id: "yesstyle-best-of-korean-beauty",
    brandSlug: "yesstyle",
    type: "soldes",
    value: "-50 %",
    valueLabel: "BEST OF K-BEAUTY",
    title: "Best of Korean Beauty : jusqu'à -50 % sur 18 marques cultes",
    expires: "2026-07-26",
    conditions: "Campagne Best of Korean Beauty du 20 au 26 juillet 2026 : -30 à -50 % sur Beauty of Joseon, Isntree, Pyunkang Yul, ROVECTIN, espoir, OBgE, ISOI, ViveLab, 107 Beauty, GREEN MONSTER, VT, JOOCYEE, WELLAGE, Goodal, seeyoung, Dr. Althea, HER HYNESS, Ishizawa-Lab. Cumulable avec un code flash.",
    featured: true,
  },
  {
    id: "yesstyle-kglow26",
    brandSlug: "yesstyle",
    type: "code",
    value: "-15 %",
    valueLabel: "FLASH 4 JOURS",
    title: "-15 % supplémentaires du 21 au 24 juillet (code KGLOW26)",
    code: "KGLOW26",
    expires: "2026-07-24",
    conditions: "Code KGLOW26 : -15 % supplémentaires cumulables avec les brand promos Best of Korean Beauty. Actif du 21/07 au 24/07/2026. Un seul code flash par commande.",
    featured: true,
  },
  {
    id: "yesstyle-kglam26",
    brandSlug: "yesstyle",
    type: "code",
    value: "-15 %",
    valueLabel: "FLASH 5 JOURS",
    title: "-15 % supplémentaires du 24 au 28 juillet (code KGLAM26)",
    code: "KGLAM26",
    expires: "2026-07-28",
    conditions: "Code KGLAM26 : -15 % supplémentaires cumulables avec les brand promos Best of Korean Beauty. Actif du 24/07 au 28/07/2026. Un seul code flash par commande.",
    featured: true,
  },
  {
    id: "yesstyle-btsvip15",
    brandSlug: "yesstyle",
    type: "code",
    value: "-15 %",
    valueLabel: "K-POP 72 H",
    title: "-15 % supplémentaires 72 h VIP K-pop (code BTSVIP15)",
    code: "BTSVIP15",
    expires: "2026-07-27",
    conditions: "Code BTSVIP15 : -15 % supplémentaires spéciale K-pop, valable 72 h du 24/07 au 27/07/2026. Cumulable avec les brand promos. Un seul code flash par commande.",
  },
  {
    id: "yesstyle-lqqiclvxto",
    brandSlug: "yesstyle",
    type: "code",
    value: "-12 %",
    valueLabel: "DÈS 40 $US",
    title: "-12 % dès 40 $US d'achat (≈ 36,40 €) — code longue durée",
    code: "LQQICLVXTO",
    expires: "2026-08-31",
    conditions: "Code LQQICLVXTO : -12 % sur toute la boutique YesStyle dès 40 $US (≈ 36,40 €). Valable jusqu'au 31/08/2026. Ne se cumule PAS avec les codes flash KGLOW26 / KGLAM26 / BTSVIP15 (les codes flash sont plus avantageux sur la période).",
  },
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
  {
    id: "dpr-selection-ete-1190",
    brandSlug: "dr-pierre-ricaud",
    type: "offre",
    value: "11,90 €",
    valueLabel: "DÈS",
    title: "Sélection de l'été Dr Pierre Ricaud dès 11,90 €",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=6977&awinaffid=990397&ued=https%3A%2F%2Fwww.ricaud.com%2Ffr-fr%2Foffres-speciales.htm",
    expires: "2026-08-24",
    conditions: "Sélection de l'été Dr Pierre Ricaud : produits soin et maquillage à partir de 11,90 €. Offre valable du 29/07/2026 au 24/08/2026 sur ricaud.com.",
    featured: true,
  },
  {
    id: "dpr-trousses-ete-45",
    brandSlug: "dr-pierre-ricaud",
    type: "offre",
    value: "-45 %",
    valueLabel: "TROUSSES ÉTÉ",
    title: "Trousses d'été Dr Pierre Ricaud jusqu'à -45 %",
    affiliateUrl: "https://www.awin1.com/cread.php?awinmid=6977&awinaffid=990397&ued=https%3A%2F%2Fwww.ricaud.com%2Ffr-fr%2Fessentiels-ete.htm",
    expires: "2026-08-24",
    conditions: "Offre flash trousses d'été Dr Pierre Ricaud : jusqu'à -45 % sur la sélection essentiels été. Valable du 29/07/2026 au 24/08/2026 sur ricaud.com.",
    featured: true,
  },
  {
    id: "dpr-ete10",
    brandSlug: "dr-pierre-ricaud",
    type: "code",
    value: "-10 %",
    valueLabel: "6-9 AOÛT",
    title: "-10 % supplémentaires dès 50 € d'achat (code ETE10, du 6 au 9 août)",
    code: "ETE10",
    expires: "2026-08-09",
    conditions: "Code ETE10 -10 % supplémentaires dès 50 € d'achat sur ricaud.com. Actif uniquement du 06/08/2026 au 09/08/2026.",
  },
  {
    id: "dpr-aout10",
    brandSlug: "dr-pierre-ricaud",
    type: "code",
    value: "10 €",
    valueLabel: "13-16 AOÛT",
    title: "10 € offerts dès 60 € d'achat (code AOUT10, du 13 au 16 août)",
    code: "AOUT10",
    expires: "2026-08-16",
    conditions: "Code AOUT10 : 10 € offerts dès 60 € d'achat sur ricaud.com. Actif uniquement du 13/08/2026 au 16/08/2026.",
  },
  {
    id: "dpr-vac10",
    brandSlug: "dr-pierre-ricaud",
    type: "code",
    value: "-10 %",
    valueLabel: "20-23 AOÛT",
    title: "-10 % supplémentaires dès 50 € d'achat (code VAC10, du 20 au 23 août)",
    code: "VAC10",
    expires: "2026-08-23",
    conditions: "Code VAC10 -10 % supplémentaires dès 50 € d'achat sur ricaud.com. Actif uniquement du 20/08/2026 au 23/08/2026.",
  },
  {
    id: "dpr-beaute10",
    brandSlug: "dr-pierre-ricaud",
    type: "code",
    value: "10 €",
    valueLabel: "27-30 AOÛT",
    title: "10 € offerts dès 60 € d'achat (code BEAUTE10, du 27 au 30 août)",
    code: "BEAUTE10",
    expires: "2026-08-30",
    conditions: "Code BEAUTE10 : 10 € offerts dès 60 € d'achat sur ricaud.com. Actif uniquement du 27/08/2026 au 30/08/2026.",
  },

  // ============================================================
  // DAMART — 7 offres été 2026 (soldes + -20 % + newsletter + facilités)
  // ============================================================
  {
    id: "damart-soldes-ete-2026",
    brandSlug: "damart",
    type: "soldes",
    value: "SOLDES",
    valueLabel: "ÉTÉ 2026",
    title: "Soldes d'été Damart : sélection d'articles jusqu'au 21/07",
    expires: "2026-07-21",
    conditions: "Soldes du 24/06 au 21/07/2026 (arrêté préfectoral) sur une sélection d'articles signalés en boutiques et sur damart.fr, dans la limite des stocks disponibles.",
    featured: true,
  },
  {
    id: "damart-20-article-prefere",
    brandSlug: "damart",
    type: "offre",
    value: "-20 %",
    valueLabel: "ARTICLE PRÉFÉRÉ",
    title: "-20 % sur ton article préféré dès 19 € d'achat",
    expires: "2026-07-21",
    conditions: "Réduction de 20 % sur ton article préféré dès 19 € d'achat, hors soldes, points rouges et articles à prix déjà réduits. Valable une seule fois sur damart.fr et boutiques Damart en France, jusqu'au 21/07/2026. Non cumulable avec d'autres offres.",
    featured: true,
  },
  {
    id: "damart-newsletter-20",
    brandSlug: "damart",
    type: "newsletter",
    value: "20 €",
    valueLabel: "OFFERTS",
    title: "20 € offerts dès 40 € d'achat pour toute inscription à la newsletter",
    expires: "2026-08-31",
    conditions: "Réduction de 20 € dès 40 € d'achat, hors points rouges et articles à prix déjà réduits. + Frais de livraison Colissimo (6,90 €) offerts dès 60 € d'achat, remises déduites. Valable une seule fois jusqu'au 31/08/2026, non cumulable avec d'autres offres.",
    featured: true,
  },
  {
    id: "damart-livraison-boutique",
    brandSlug: "damart",
    type: "livraison",
    value: "GRATUITE",
    valueLabel: "BOUTIQUE",
    title: "Livraison en boutique Damart gratuite dès 19 € d'achat",
    permanent: true,
    conditions: "Livraison en boutique Damart offerte dès 19 € d'achat. En dessous : 3 € de frais.",
  },
  {
    id: "damart-alma-3x",
    brandSlug: "damart",
    type: "offre",
    value: "3×",
    valueLabel: "SANS FRAIS",
    title: "Paiement en 3× sans frais avec Alma dès 60 € d'achat",
    permanent: true,
    conditions: "Paiement en 3 fois sans frais avec Alma disponible dès 60 € et jusqu'à 2 000 € d'achat (sous réserve d'acceptation d'Alma). Résidence France métropolitaine + CB Visa/Mastercard Électron valide.",
  },
  {
    id: "damart-paypal-4x",
    brandSlug: "damart",
    type: "offre",
    value: "4×",
    valueLabel: "SANS FRAIS",
    title: "Paiement en 4× sans frais avec PayPal dès 30 € d'achat",
    permanent: true,
    conditions: "Paiement en 4 fois sans frais avec PayPal disponible dès 30 € et jusqu'à 2 000 € d'achat (sous réserve d'acceptation de PayPal). Redirection automatique vers ton compte PayPal au checkout.",
  },
  {
    id: "damart-fidelite",
    brandSlug: "damart",
    type: "cashback",
    value: "5 %",
    valueLabel: "FIDÉLITÉ",
    title: "5 % de remise fidélité à chaque commande via la carte cliente",
    permanent: true,
    conditions: "Programme fidélité Damart : 5 % de remise cumulés sur ta carte cliente à chaque achat. Cumulable avec les promos.",
  },

  // ============================================================
  // ALIEXPRESS — 7 codes Promo des Vacances (13-19 juillet 2026)
  // ============================================================
  {
    id: "aliexpress-frvs02",
    brandSlug: "aliexpress",
    type: "code",
    value: "-2 €",
    title: "-2 € dès 18 € d'achat sur AliExpress (Promo des Vacances)",
    code: "FRVS02",
    expires: "2026-07-19",
    conditions: "Code valable du 13 au 19 juillet 2026 à 23h59 sur les articles marqués « Promo des Vacances ». Palier mini 18 €.",
  },
  {
    id: "aliexpress-frvs06",
    brandSlug: "aliexpress",
    type: "code",
    value: "-6 €",
    title: "-6 € dès 45 € d'achat sur AliExpress (Promo des Vacances)",
    code: "FRVS06",
    expires: "2026-07-19",
    conditions: "Code valable du 13 au 19 juillet 2026 à 23h59 sur les articles marqués « Promo des Vacances ». Palier mini 45 €.",
  },
  {
    id: "aliexpress-frvs11",
    brandSlug: "aliexpress",
    type: "code",
    value: "-11 €",
    title: "-11 € dès 79 € d'achat sur AliExpress (meilleur ratio 14 %)",
    code: "FRVS11",
    expires: "2026-07-19",
    featured: true,
    conditions: "Meilleur ratio %/prix de la campagne. Code valable du 13 au 19 juillet 2026 à 23h59 sur les articles marqués « Promo des Vacances ». Palier mini 79 €.",
  },
  {
    id: "aliexpress-frvs20",
    brandSlug: "aliexpress",
    type: "code",
    value: "-20 €",
    title: "-20 € dès 149 € d'achat sur AliExpress (Promo des Vacances)",
    code: "FRVS20",
    expires: "2026-07-19",
    conditions: "Code valable du 13 au 19 juillet 2026 à 23h59 sur les articles marqués « Promo des Vacances ». Palier mini 149 €.",
  },
  {
    id: "aliexpress-frvs30",
    brandSlug: "aliexpress",
    type: "code",
    value: "-30 €",
    title: "-30 € dès 239 € d'achat sur AliExpress (Promo des Vacances)",
    code: "FRVS30",
    expires: "2026-07-19",
    conditions: "Code valable du 13 au 19 juillet 2026 à 23h59 sur les articles marqués « Promo des Vacances ». Palier mini 239 €.",
  },
  {
    id: "aliexpress-frvs45",
    brandSlug: "aliexpress",
    type: "code",
    value: "-45 €",
    title: "-45 € dès 359 € d'achat sur AliExpress (Promo des Vacances)",
    code: "FRVS45",
    expires: "2026-07-19",
    conditions: "Code valable du 13 au 19 juillet 2026 à 23h59 sur les articles marqués « Promo des Vacances ». Palier mini 359 €.",
  },
  // ============================================================
  // CDISCOUNT — code Philips exclusif juillet 2026
  // ============================================================
  {
    id: "cdiscount-15d89philips",
    brandSlug: "cdiscount",
    type: "code",
    value: "-15 €",
    valueLabel: "PHILIPS",
    title: "-15 € dès 89 € de produits Philips sur Cdiscount (cumulable)",
    code: "15D89PHILIPS",
    expires: "2026-07-31",
    featured: true,
    conditions: "Code exclusif produits Philips. Cumulable avec les remises produits déjà appliquées. Palier mini 89 € Philips. Vérifie la date d'expiration en caisse.",
    affiliateUrl: "https://tidd.ly/4dJ6jB6",
  },
  {
    id: "cdiscount-ventes-a-perte-60",
    brandSlug: "cdiscount",
    type: "soldes",
    value: "-60 %",
    valueLabel: "VENTES À PERTE",
    title: "Ventes à perte Cdiscount : jusqu'à -60 % sur tous les rayons",
    conditions: "Ventes à Perte Cdiscount : décote par magasin — Literie -60 %, Meuble & Déco -59 %, Mode -50 %, Sport -50 %, Jardin -45 %, Jeux Jouet -40 %, Bébé -40 %, Image & Son -30 %, Bricolage -30 %, PGC -30 %, PEM -30 %, Animalerie -30 %, Canapé -28 %, Auto -25 %, Cave -25 %, Info -23 %, Electro -20 %, Téléphonie -20 %, Jeux Vidéo -20 %, GEM -20 %.",
    featured: true,
  },
  {
    id: "cdiscount-hello10",
    brandSlug: "cdiscount",
    type: "code",
    value: "10 €",
    valueLabel: "1ʳᵉ CDE",
    title: "10 € offerts dès 50 € d'achat pour ta 1ʳᵉ commande (code HELLO10)",
    code: "HELLO10",
    conditions: "Code de bienvenue Cdiscount : 10 € offerts dès 50 € d'achat pour toute première commande. Non cumulable avec d'autres offres spécifiques marque.",
    featured: true,
  },
  {
    id: "cdiscount-vacancelego-50",
    brandSlug: "cdiscount",
    type: "code",
    value: "-50 %",
    valueLabel: "2ᵉ LEGO",
    title: "2ᵉ jeu LEGO à -50 % avec le code VACANCELEGO",
    code: "VACANCELEGO",
    conditions: "Opération LEGO Cdiscount : le 2ᵉ jeu LEGO acheté à -50 % avec le code VACANCELEGO. La remise s'applique sur le moins cher des deux. Sélection LEGO éligible sur la landing Cdiscount.",
    featured: true,
  },
  {
    id: "cdiscount-15des129",
    brandSlug: "cdiscount",
    type: "code",
    value: "-15 €",
    valueLabel: "DÈS 129 €",
    title: "15 € offerts dès 129 € d'achat avec le code 15DES129 (dernier jour)",
    code: "15DES129",
    expires: "2026-07-17",
    conditions: "Code 15DES129 : 15 € offerts dès 129 € d'achat sur Cdiscount. Offre courte : se termine ce soir 17/07/2026 à minuit.",
  },

  {
    id: "aliexpress-frvs60",
    brandSlug: "aliexpress",
    type: "code",
    value: "-60 €",
    title: "-60 € dès 479 € d'achat sur AliExpress (meilleure valeur absolue)",
    code: "FRVS60",
    expires: "2026-07-19",
    featured: true,
    conditions: "Meilleure valeur absolue de la campagne. Code valable du 13 au 19 juillet 2026 à 23h59 sur les articles marqués « Promo des Vacances ». Palier mini 479 €.",
  },

  // ============================================================
  // COSMÉ'CHIC — partenariat direct (BPM10 + newsletter)
  // ============================================================
  {
    id: "cosmechic-bpm10",
    brandSlug: "cosmechic",
    type: "code",
    value: "-10 %",
    title: "-10 % sur cosmechic.fr avec le code partenaire",
    code: "BPM10",
    affiliateUrl: "https://cosmechic.fr/fr/?utm_source=bonsplansmania&utm_medium=affiliation&utm_campaign=comparatif_beaute_2026&utm_content=code-bpm10",
    expires: "2026-10-20",
    conditions: "Code partenaire bonsplansmania valable du 20/07/2026 au 20/10/2026. Sans minimum d'achat. Uniquement sur les produits vendus et expédiés par Cosmé'Chic (hors vendeurs partenaires marketplace). Non cumulable avec l'offre newsletter.",
    featured: true,
  },
  {
    id: "cosmechic-newsletter-10",
    brandSlug: "cosmechic",
    type: "newsletter",
    value: "-10 %",
    valueLabel: "1ʳᵉ CDE",
    title: "-10 % sur la 1ʳᵉ commande en s'inscrivant à la newsletter",
    affiliateUrl: "https://cosmechic.fr/fr/?utm_source=bonsplansmania&utm_medium=affiliation&utm_campaign=comparatif_beaute_2026&utm_content=newsletter-cosmechic",
    conditions: "Offre permanente pour toute première commande sur cosmechic.fr. Inscription à la newsletter requise. Non cumulable avec le code BPM10.",
  },

  // ============================================================
  // A DEMAIN — offre newsletter permanente
  // ============================================================
  {
    id: "a-demain-newsletter-10",
    brandSlug: "a-demain",
    type: "newsletter",
    value: "-10 %",
    valueLabel: "1ʳᵉ CDE",
    title: "-10 % sur la 1ʳᵉ commande en s'inscrivant à la newsletter",
    conditions: "Offre permanente pour toute première commande sur a-demain.shop. Inscription à la newsletter requise, code de réduction reçu par mail après validation.",
    featured: true,
  },

  // ============================================================
  // RAKUTEN — 8 offres (3 codes JARDIN + 3 codes CLUBR + cashback + parrainage)
  // ============================================================
  {
    id: "rakuten-jardin10",
    brandSlug: "rakuten",
    type: "code",
    value: "-10 €",
    valueLabel: "DÈS 69 €",
    title: "-10 € dès 69 € d'achat sur la sélection jardin, bricolage, cuisine, piscine",
    code: "JARDIN10",
    expires: "2026-07-19",
    conditions: "10 € offerts dès 69 € d'achat sur les annonces vendeurs affichant la mention « -10 € avec le code JARDIN10 ». Catégories concernées : Bricolage, Cuisine, Mobilier de jardin, Outillage de jardin, Jeux d'extérieur, Plantes & jardinage, Barbecue, Piscine. Limité à 600 coupons sur la durée de l'opération, 1 seule commande par personne. Non cumulable avec un autre coupon. Valable jusqu'au 19/07/2026 à 23h59.",
    featured: true,
  },
  {
    id: "rakuten-jardin20",
    brandSlug: "rakuten",
    type: "code",
    value: "-20 €",
    valueLabel: "DÈS 159 €",
    title: "-20 € dès 159 € d'achat sur la sélection jardin, bricolage, cuisine, piscine",
    code: "JARDIN20",
    expires: "2026-07-19",
    conditions: "20 € offerts dès 159 € d'achat sur les annonces vendeurs affichant la mention « -20 € avec le code JARDIN20 ». Catégories concernées : Bricolage, Cuisine, Mobilier de jardin, Outillage de jardin, Jeux d'extérieur, Plantes & jardinage, Barbecue, Piscine. Limité à 900 coupons, 1 seule commande par personne. Non cumulable avec un autre coupon. Valable jusqu'au 19/07/2026 à 23h59.",
    featured: true,
  },
  {
    id: "rakuten-jardin100",
    brandSlug: "rakuten",
    type: "code",
    value: "-100 €",
    valueLabel: "DÈS 999 €",
    title: "-100 € dès 999 € d'achat sur la sélection jardin, bricolage, cuisine, piscine",
    code: "JARDIN100",
    expires: "2026-07-19",
    conditions: "100 € offerts dès 999 € d'achat sur les annonces vendeurs affichant la mention « -100 € avec le code JARDIN100 ». Catégories concernées : Bricolage, Cuisine, Mobilier de jardin, Outillage de jardin, Jeux d'extérieur, Plantes & jardinage, Barbecue, Piscine. Limité à 100 coupons, 1 seule commande par personne. Non cumulable. Valable jusqu'au 19/07/2026 à 23h59.",
  },
  {
    id: "rakuten-clubr-cashback-5",
    brandSlug: "rakuten",
    type: "cashback",
    value: "5 %",
    valueLabel: "CLUB R",
    title: "5 % de cashback dans la cagnotte Club R sur toutes vos commandes Rakuten",
    permanent: true,
    conditions: "Offre Club R : 5 % de cashback dans votre cagnotte pour toute commande sur fr.shopping.rakuten.com ou l'application mobile. Inscription au Club R requise. Hors livres neufs (loi Lang), produits assimilables, cartes cadeaux et annonces à taux réduit. Cashback valable 30 jours après confirmation de réception (depuis le 22/04/2026).",
    featured: true,
  },
  {
    id: "rakuten-clubr10",
    brandSlug: "rakuten",
    type: "code",
    value: "-10 €",
    valueLabel: "DÈS 69 €",
    title: "-10 € dès 69 € d'achat sur la sélection Club R",
    code: "CLUBR10",
    expires: "2026-07-31",
    conditions: "10 € offerts dès 69 € d'achat sur les annonces vendeurs affichant la mention « -10 € avec le code CLUBR10 ». Limité à 200 coupons, 1 seule commande par personne. Non cumulable avec un autre coupon. Valable jusqu'au 31/07/2026 à 23h59.",
  },
  {
    id: "rakuten-clubr20",
    brandSlug: "rakuten",
    type: "code",
    value: "-20 €",
    valueLabel: "DÈS 159 €",
    title: "-20 € dès 159 € d'achat sur la sélection Club R",
    code: "CLUBR20",
    expires: "2026-07-31",
    conditions: "20 € offerts dès 159 € d'achat sur les annonces vendeurs affichant la mention « -20 € avec le code CLUBR20 ». Limité à 200 coupons, 1 seule commande par personne. Non cumulable. Valable jusqu'au 31/07/2026 à 23h59.",
  },
  {
    id: "rakuten-clubr30",
    brandSlug: "rakuten",
    type: "code",
    value: "-30 €",
    valueLabel: "DÈS 299 €",
    title: "-30 € dès 299 € d'achat sur la sélection Club R",
    code: "CLUBR30",
    expires: "2026-07-31",
    conditions: "30 € offerts dès 299 € d'achat sur les annonces vendeurs affichant la mention « -30 € avec le code CLUBR30 ». Limité à 200 coupons, 1 seule commande par personne. Non cumulable. Valable jusqu'au 31/07/2026 à 23h59.",
  },
  {
    id: "rakuten-parrainage-10",
    brandSlug: "rakuten",
    type: "offre",
    value: "10 €",
    valueLabel: "PARRAINAGE",
    title: "10 € de réduction pour toute 1ʳᵉ commande dès 49 € via un code parrain",
    permanent: true,
    conditions: "10 € de réduction sur la 1ʳᵉ commande sur fr.shopping.rakuten.com dans les 90 jours suivant l'émission du code parrain, dès 49 € d'achat. 1 seule utilisation par personne, hors produits exclus (iPhone 16/17/Air, iPhone 14 128 Go noir minuit, AirPods 4 ANC, Samsung Galaxy Tab A9+, Sennheiser Momentum 4, casque Logitech Pro X). Non cumulable avec un autre coupon.",
  },

  // ============================================================
  // BAÏJA — offre newsletter permanente
  // ============================================================
  {
    id: "baija-newsletter-10",
    brandSlug: "baija",
    type: "newsletter",
    value: "-10 %",
    valueLabel: "1ʳᵉ CDE",
    title: "-10 % sur la 1ʳᵉ commande en s'inscrivant à la newsletter Baïja",
    permanent: true,
    conditions: "Offre permanente pour toute 1ʳᵉ commande sur baija.com. Inscription à la newsletter requise, code de réduction reçu par mail après validation.",
    featured: true,
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
