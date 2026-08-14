/**
 * Registre des fiches produits communautaires (/produit/[slug]).
 *
 * Source de vérité unique : la page rubrique /avis-prix-beaute lit cette liste.
 * Les fiches elles-mêmes restent des pages dédiées sous src/app/produit/,
 * chacune portant ses propres offres marchands.
 *
 * Pour ajouter une fiche : créer la page sous src/app/produit/<slug>/ puis
 * ajouter l'entrée correspondante ici.
 */

export interface CommunityProduct {
  slug: string;
  brand: string;
  name: string;
  image: string;
  imageAlt: string;
  /** Rayon du parfum, sert au filtre femme / homme de /avis-prix-beaute */
  gender?: "femme" | "homme";
  category: "parfums" | "soins-visage" | "k-beauty" | "solaires" | "coffrets" | "box-beaute";
  /** Description courte affichée sur la page rubrique */
  teaser: string;
  lead?: string;
  idealFor?: string[];
  strengths?: string[];
  watchOut?: string[];
  editorialNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  offers?: CommunityMerchantOffer[];
  /** Date d'ajout de la fiche au site (ISO), sert au tri récent / ancien */
  addedAt: string;
}

export interface CommunityMerchantOffer {
  merchant: string;
  note?: string;
  href: string;
  price?: string;
  checkedAt?: string;
  offer?: string;
  amazonAsin?: string;
}

export const COMMUNITY_PRODUCTS: CommunityProduct[] = [
  {
    slug: "baija-jardin-pallanca-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-14T12:00:00",
    brand: "Baïja",
    name: "Jardin Pallanca Eau de Parfum 15 ml",
    image: "/images/products/baija-jardin-pallanca-eau-de-parfum-15ml.webp",
    imageAlt: "Flacon Baïja Jardin Pallanca Eau de Parfum 15 ml",
    teaser: "Un petit parfum frais et fruité où le cassis rencontre le jasmin et les muscs blancs, dans un format facile à emporter.",
    lead: "Jardin Pallanca est une eau de parfum Baïja au profil pétillant, frais et fruité. Son format 15 ml vise surtout les personnes qui souhaitent un parfum nomade à glisser facilement dans un sac.",
    idealFor: ["Les personnes qui aiment les parfums fruités et frais", "Un parfum léger à porter au quotidien", "Un petit format facile à emporter"],
    strengths: ["Accord cassis, jasmin et muscs blancs", "Format nomade de 15 ml", "Fabrication française annoncée par Baïja"],
    watchOut: ["Le format 15 ml est plus petit qu’un flacon classique", "La tenue et le rendu d’un parfum varient selon la peau"],
    editorialNote: "Notre avis : Jardin Pallanca convient surtout à celles qui recherchent une fragrance fraîche, fruitée et facile à porter. Le cassis apporte un départ pétillant, le jasmin adoucit le cœur et les muscs blancs donnent un fond propre et discret.",
    seoTitle: "Baïja Jardin Pallanca : avis et prix du parfum",
    seoDescription: "Baïja Jardin Pallanca Eau de Parfum 15 ml : notre avis, notes de cassis, jasmin et muscs blancs, prix vérifié et lien affilié Baïja.",
    offers: [{
      merchant: "Baïja",
      note: "Eau de Parfum Jardin Pallanca 15 ml — boutique officielle",
      price: "19,90 €",
      checkedAt: "2026-08-14",
      href: "https://irb.baija.com/?P51318757CD2D1D1&redir=https%3A%2F%2Fbaija.com%2Fproducts%2Fl-irresistible-eau-de-parfum-jardin-pallanca",
    }],
  },
  {
    slug: "beauty-of-joseon-relief-sun",
    category: "k-beauty",
    addedAt: "2026-08-13T12:00:00",
    brand: "Beauty of Joseon",
    name: "Relief Sun SPF50+ PA++++",
    image: "/images/articles/beauty-of-joseon-relief-sun-creme-solaire-yesstyle-2026.png",
    imageAlt: "Beauty of Joseon Relief Sun crème solaire SPF50+ PA++++",
    teaser: "Un solaire coréen hydratant au riz et aux probiotiques, apprécié pour son fini sans traces blanches.",
    lead: "Une protection solaire visage coréenne à la texture de crème légère. Elle convient surtout aux peaux normales à sèches qui recherchent un SPF quotidien confortable sans effet blanc.",
    idealFor: ["Protection quotidienne SPF50+", "Peaux normales à sèches", "Routine K-Beauty simple"],
    strengths: ["Texture confortable sous le maquillage", "Fini sans traces blanches", "Association riz et probiotiques"],
    watchOut: ["Une peau très grasse peut préférer une texture plus mate", "La protection doit être renouvelée en cas d’exposition"],
    editorialNote: "Notre avis : c’est un excellent solaire de ville pour celles qui abandonnent les SPF trop épais. Son principal intérêt est le confort d’utilisation quotidien, pas une promesse de soin miracle.",
    seoTitle: "Beauty of Joseon Relief Sun : avis et prix",
    seoDescription: "Beauty of Joseon Relief Sun SPF50+ : notre avis, les peaux auxquelles il convient, prix Amazon via API, offre YesStyle et avis des utilisatrices.",
    offers: [
      {
        merchant: "Amazon",
        note: "Prix et disponibilité actualisés par l’API officielle",
        href: "https://www.amazon.fr/dp/B0DFMGBZ9Z?tag=lebrunnathali-21",
        amazonAsin: "B0DFMGBZ9Z",
      },
      {
        merchant: "YesStyle",
        note: "Fiche Beauty of Joseon",
        price: "14,40 €",
        checkedAt: "2026-08-14",
        offer: "Codes promotionnels YesStyle selon l’opération en cours",
        href: "https://www.awin1.com/cread.php?awinmid=15447&awinaffid=990397&ued=https%3A%2F%2Fwww.yesstyle.com%2Ffr%2Fbeauty-of-joseon-relief%2Finfo.html%2Fpid.1137908658",
      },
    ],
  },
  {
    slug: "cerave-creme-hydratante-visage",
    category: "soins-visage",
    addedAt: "2026-08-13T11:55:00",
    brand: "CeraVe",
    name: "Crème Hydratante Visage",
    image: "/images/articles/comparatif-creme-bio-hydratante-cerave-visage-produit.png",
    imageAlt: "CeraVe Crème Hydratante Visage aux céramides et à l’acide hyaluronique",
    teaser: "Un hydratant simple aux trois céramides et à l’acide hyaluronique pour les peaux normales à sèches.",
    lead: "Une crème hydratante sans sophistication inutile, pensée pour soutenir la barrière cutanée. Elle convient surtout aux peaux normales à sèches et aux routines minimalistes.",
    idealFor: ["Peaux normales à sèches", "Barrière cutanée fragilisée", "Routine sans parfum"],
    strengths: ["Trois céramides essentiels", "Acide hyaluronique", "Formule simple et non parfumée"],
    watchOut: ["Peut sembler trop riche sur une peau très grasse", "Ce n’est pas un soin ciblé contre les taches ou les rides"],
    editorialNote: "Notre avis : CeraVe est une valeur sûre pour hydrater sans multiplier les actifs. Elle convient davantage à un besoin de confort et de barrière cutanée qu’à une recherche de correction anti-âge intensive.",
    seoTitle: "CeraVe Crème Hydratante Visage : avis et prix",
    seoDescription: "Avis sur la crème hydratante visage CeraVe : céramides, types de peau, points forts, limites, prix Amazon via API et avis des utilisatrices.",
    offers: [
      {
        merchant: "Amazon",
        note: "Prix et disponibilité actualisés par l’API officielle",
        href: "https://www.amazon.fr/dp/B07C5XYT19?tag=lebrunnathali-21",
        amazonAsin: "B07C5XYT19",
      },
    ],
  },
  {
    slug: "dr-pierre-ricaud-creme-lifting-raffermissante",
    category: "soins-visage",
    addedAt: "2026-08-13T18:20:00",
    brand: "Dr Pierre Ricaud",
    name: "Crème Lifting Raffermissante",
    image: "/images/articles/dr-pierre-ricaud-creme-lifting-raffermissante-booster-collagenes-et-elastine.png",
    imageAlt: "Crème lifting raffermissante Dr Pierre Ricaud booster collagènes et élastine",
    teaser: "Un soin anti-âge destiné aux peaux matures qui recherchent surtout fermeté, confort et amélioration de l’apparence de l’ovale.",
    lead: "La Crème Lifting Raffermissante Dr Pierre Ricaud cible la perte de fermeté avec un positionnement booster de collagènes et d’élastine. Cette fiche rassemble notre analyse, le prix vérifié chez la marque et les avis des visiteuses.",
    idealFor: ["Peaux matures", "Perte de fermeté", "Visage et ovale moins toniques"],
    strengths: ["Texture pensée pour le confort des peaux matures", "Positionnement ciblé fermeté", "Nombreux avis clients chez la marque"],
    watchOut: ["Les résultats varient selon la peau et la régularité", "Un cosmétique ne remplace pas une protection solaire quotidienne"],
    editorialNote: "Notre avis : une option cohérente pour découvrir les soins Dr Pierre Ricaud lorsque la priorité est la fermeté. Il faut juger surtout le confort, la tolérance et l’évolution de la peau après plusieurs semaines.",
    seoTitle: "Dr Pierre Ricaud avis : crème lifting raffermissante",
    seoDescription: "Dr Pierre Ricaud : avis sur la crème lifting raffermissante, types de peau, points forts, limites, offre officielle et avis des utilisatrices.",
    offers: [{
      merchant: "Dr Pierre Ricaud",
      note: "Boutique officielle Dr Pierre Ricaud",
      price: "28,90 €",
      offer: "-44 %",
      checkedAt: "2026-08-14",
      href: "https://www.awin1.com/cread.php?awinmid=6977&awinaffid=990397&ued=https%3A%2F%2Fwww.ricaud.com%2Ffr-fr%2Fcreme-lifting-raffermissante-booster-collagenes-et-elastine-1.htm",
    }],
  },
  {
    slug: "clarins-double-serum-avis",
    category: "soins-visage",
    addedAt: "2026-08-13T18:15:00",
    brand: "Clarins",
    name: "Double Serum",
    image: "/images/articles/avis-clarins-soins-anti-age-premium-test-2026.png",
    imageAlt: "Clarins Double Serum soin visage anti-âge premium",
    teaser: "Le sérum anti-âge emblématique de Clarins : une formule premium à évaluer selon le confort, l’éclat et le budget.",
    lead: "Clarins Double Serum est un soin anti-âge premium connu pour sa double formule. Notre analyse distingue les promesses de la marque, l’expérience cosmétique et les résultats que chaque utilisatrice peut réellement commenter.",
    idealFor: ["Peaux matures ou en manque d’éclat", "Routine anti-âge premium", "Utilisatrices appréciant les textures sensorielles"],
    strengths: ["Texture et dosage caractéristiques", "S’intègre facilement avant une crème", "Référence connue avec beaucoup de retours d’utilisation"],
    watchOut: ["Budget élevé", "La présence de parfum peut déplaire aux peaux très réactives", "Aucun résultat individuel n’est garanti"],
    editorialNote: "Notre avis : Double Serum mise autant sur l’expérience d’utilisation que sur son positionnement anti-âge. Il est surtout pertinent si la texture plaît et si le budget permet une utilisation régulière.",
    seoTitle: "Clarins Double Serum : avis, utilisation et offre",
    seoDescription: "Clarins Double Serum : notre avis, pour quelles peaux, points forts, limites, offre Clarins suivie et avis des utilisatrices Bons Plans Mania.",
    offers: [{
      merchant: "Clarins",
      note: "Double Serum 30 ml — boutique officielle Clarins",
      price: "108 €",
      checkedAt: "2026-08-14",
      offer: "Code WELCOME20 : -20 % sur la première commande et cadeaux selon conditions",
      href: "https://track.effiliation.com/servlet/effi.redir?id_compteur=23248736&url=https%3A%2F%2Fwww.clarins.fr%2Fdouble-serum---serum-anti-age-raffermissant%2F80103084.html",
    }],
  },
  {
    slug: "nuxe-huile-prodigieuse-avis-prix",
    category: "soins-visage",
    addedAt: "2026-08-13T18:10:00",
    brand: "Nuxe",
    name: "Huile Prodigieuse",
    image: "/images/articles/nuxe-huile-prodigieuse-100ml-visage-corps-cheveux-2026.png",
    imageAlt: "Nuxe Huile Prodigieuse huile sèche visage corps et cheveux",
    teaser: "L’huile sèche multi-usage culte de Nuxe pour le visage, le corps et les cheveux, avec une fragrance très présente.",
    lead: "L’Huile Prodigieuse de Nuxe est un soin sec multi-usage destiné à nourrir et satiner le visage, le corps et les cheveux. Son parfum signature fait partie de l’expérience et mérite d’être pris en compte avant l’achat.",
    idealFor: ["Peaux normales à sèches", "Pointes de cheveux sèches", "Routine corps sensorielle"],
    strengths: ["Usage visage, corps et cheveux", "Fini d’huile sèche", "Plusieurs versions disponibles"],
    watchOut: ["Parfum marqué", "À doser légèrement sur les cheveux fins", "La version classique n’est pas une protection solaire"],
    editorialNote: "Notre avis : son intérêt vient de sa polyvalence et de son fini sec. Elle séduira surtout les personnes qui aiment sa fragrance ; les peaux réactives au parfum devront tester avec prudence.",
    seoTitle: "Nuxe Huile Prodigieuse : avis et prix",
    seoDescription: "Nuxe Huile Prodigieuse : notre avis, usages visage corps cheveux, points forts, précautions, prix chez nos partenaires et avis des utilisatrices.",
    offers: [{
      merchant: "Amazon",
      note: "Nuxe Huile Prodigieuse 100 ml",
      price: "24,20 €",
      checkedAt: "2026-08-14",
      href: "https://www.amazon.fr/100-Nuxe-Huile-Prodigieuse-S%C3%A8che/dp/B01ATJESD6?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=34TV2XPXUMZJR&dib=eyJ2IjoiMSJ9.oa4U5V3WoUZCEIpR-0WD2lbVZvm2HxYWU8C1y2ftn3yJqTj9YDCOgmSEOCC6F9qVcAEOA9Y45SaP3ZODhhMTQV-Oz_vJbQjZgVfzfs9a82F1E6KpHSMDPOsa5oJWiJ5E5S8eHC5y-lAh7H0aFW2BMcX8lHFp7vV9YxkoqH_hleRoeP8499Eg3Y4cgR3WP8JtaMlCMWjrB3Gg7-iKGKzbaC6ucL8fAzwbGmgP5_x7bsNBoEu6qBINoCMOioIV-9uXJ0q-fwxLW33y1E_X7KFCrus2SSPScKMEQ4baGrXduek.KuNcuJYTL5ovma_mGlY8ykNNK3V22slFb0wk1NMwrAU&dib_tag=se&keywords=huile%2Bprodigieuse&qid=1786705709&sprefix=huile%2Bprodigieuse%2B%2Caps%2C173&sr=8-3&th=1&linkCode=ll2&tag=lebrunnathali-21&linkId=5d661e0a8321606421cffbb112c39ee2&ref_=as_li_ss_tl",
    }],
  },
  {
    slug: "meilleure-creme-anti-age-60-ans",
    category: "soins-visage",
    addedAt: "2026-08-13T18:05:00",
    brand: "Nuxe",
    name: "Nuxuriance Ultra La Crème Anti-Âge Global 50 ml",
    image: "/images/articles/nuxe-nuxuriance-ultra-creme-riche-anti-age-2026.png",
    imageAlt: "Nuxe Nuxuriance Ultra La Crème Anti-Âge Global 50 ml",
    teaser: "Une crème visage Nuxe de 50 ml destinée aux peaux matures qui recherchent confort, fermeté et action sur les signes de l’âge.",
    lead: "Nuxuriance Ultra La Crème Anti-Âge Global de Nuxe est un soin visage de 50 ml conçu pour les peaux matures. Cette fiche présente ses usages, ses points forts et ses limites avant l’achat.",
    idealFor: ["Peaux matures", "Recherche de confort", "Routine visage anti-âge"],
    strengths: ["Format 50 ml", "Soin visage ciblé pour les peaux matures", "Texture crème adaptée à une routine quotidienne"],
    watchOut: ["La tolérance et les résultats varient selon la peau", "Vérifier la composition en cas de sensibilité", "Cette crème ne remplace pas une protection solaire"],
    editorialNote: "Notre avis : une crème à envisager si vous recherchez un soin Nuxe destiné aux peaux matures. Le choix doit surtout dépendre du confort de la texture, de la tolérance et du budget.",
    seoTitle: "Nuxe Nuxuriance Ultra 50 ml : avis et prix",
    seoDescription: "Nuxe Nuxuriance Ultra La Crème Anti-Âge Global 50 ml : avis, types de peau, points forts, précautions et lien Amazon.",
    offers: [{
      merchant: "Amazon",
      note: "Nuxe Nuxuriance Ultra La Crème Anti-Âge Global 50 ml",
      price: "31,13 €",
      checkedAt: "2026-08-14",
      href: "https://www.amazon.fr/Nuxe-3264680036880-NUXURIANCE%C2%AE-ULTRA-50ml/dp/B0CRS2SGQM?crid=4MKQHLRPG9PW&dib=eyJ2IjoiMSJ9.CQnAIV22KOXWkLuDVDnSCpW4lxsJmaGOxVol-w_8ADbzTfd2mQxiSHJ6jyOZW-SzVf5v3xMMh_hLSUw1l56xrdKLaao3h91mToFH2oyPiVnfXHBK6V5DscQHoIOqe-2Mzhc-VpXSwwSpbrYHgkandqbaYwnWkO52Lt3OYuEV8L1t6bHiRZD-ZspZ5z5t60-NcTf_6k2x3lGyLg7Iq0S5Cpg8qgsZD41dcktmIeBWycVz5OR0FuceCm-aWmj3ye6YRwwJLoIcYEaDBXUs7e4h1QFkdtZ29iIXqRFo11S0EG4.tuar5xIW2pM8ekFkKhRdehm0QzshfTQfftqUqFeAo7A&dib_tag=se&keywords=nuxe+nuxuriance&qid=1786706047&sprefix=nuxe+n%2Caps%2C175&sr=8-3&linkCode=ll2&tag=lebrunnathali-21&linkId=721c01b6839c6799f80e33a4e0c655f7&ref_=as_li_ss_tl",
    }],
  },
  {
    slug: "la-roche-posay-anthelios-uvmune-400-fluide-invisible-spf50",
    category: "solaires",
    addedAt: "2026-08-13T11:50:00",
    brand: "La Roche-Posay",
    name: "Anthelios UVMune 400 Fluide Invisible SPF50+",
    image: "/images/articles/bon-plan-lookfantastic-la-roche-posay-anthelios-uvmune-400-spf50-19-32-euros-juillet-2026.png",
    imageAlt: "La Roche-Posay Anthelios UVMune 400 Fluide Invisible SPF50+ 50 ml",
    teaser: "Un fluide solaire visage non parfumé à très haute protection, adapté notamment aux peaux sensibles.",
    lead: "Un solaire visage fluide et non parfumé, conçu pour une haute protection quotidienne contre les UVB et les UVA longs. Une option pertinente pour les peaux sensibles qui préfèrent une texture légère.",
    offers: [
      {
        merchant: "Lookfantastic",
        note: "Flacon 50 ml non parfumé",
        price: "18,11 €",
        checkedAt: "2026-08-02",
        offer: "Prix ancien daté : vérifier le tarif actuel",
        href: "https://www.awin1.com/cread.php?awinmid=7496&awinaffid=990397&ued=https%3A%2F%2Fwww.lookfantastic.fr%2Fp%2Fla-roche-posay-anthelios-uvmune-400-invisible-fluid-non-perfumed-suncream-spf50-50ml%2F13494906%2F",
      },
    ],
  },
  {
    slug: "laneige-lip-sleeping-mask",
    category: "k-beauty",
    addedAt: "2026-08-13T11:45:00",
    brand: "Laneige",
    name: "Lip Sleeping Mask",
    image: "/images/articles/bon-plan-laneige-lip-sleeping-mask-3-versions-yesstyle-juin-2026.png",
    imageAlt: "Laneige Lip Sleeping Mask masque de nuit pour les lèvres",
    teaser: "Le masque de nuit coréen pour les lèvres sèches, décliné en plusieurs parfums.",
    lead: "Un masque lèvres riche à utiliser le soir, destiné aux lèvres sèches ou gercées. Les différentes versions partagent le même positionnement gourmand et nourrissant.",
    idealFor: ["Lèvres sèches", "Soin à appliquer le soir", "Personnes appréciant les textures riches"],
    strengths: ["Format 20 g", "S’utilise en petite quantité", "Plusieurs parfums selon les stocks"],
    watchOut: ["Le parfum peut ne pas convenir aux lèvres sensibles", "La texture riche peut sembler épaisse", "Le résultat varie selon l’état des lèvres"],
    editorialNote: "Notre avis : un soin de nuit pratique pour les lèvres sèches, surtout si vous appréciez les textures enveloppantes et parfumées. Une petite quantité suffit à chaque utilisation.",
    offers: [
      {
        merchant: "YesStyle",
        note: "Laneige Lip Sleeping Mask 20 g",
        price: "11,95 €",
        checkedAt: "2026-08-14",
        offer: "Codes promotionnels YesStyle selon l’opération en cours",
        href: "https://www.awin1.com/cread.php?awinmid=15447&awinaffid=990397&ued=https%3A%2F%2Fwww.yesstyle.com%2Ffr%2Flaneige-lip-sleeping%2Finfo.html%2Fpid.1039417845",
      },
    ],
  },
  {
    slug: "terre-d-hermes-eau-de-toilette",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T19:16:00",
    brand: "Hermès",
    name: "Terre d’Hermès Eau de Toilette",
    image: "/images/products/terre-d-hermes-eau-de-toilette.png",
    imageAlt: "Flacon Hermès Terre d’Hermès Eau de Toilette",
    teaser:
      "Orange et pamplemousse sur une note minérale de silex, un fond de vétiver et de cèdre.",
  },
  {
    slug: "viktor-rolf-spicebomb-eau-de-toilette",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T19:12:00",
    brand: "Viktor & Rolf",
    name: "Spicebomb Eau de Toilette",
    image: "/images/products/viktor-rolf-spicebomb-eau-de-toilette.png",
    imageAlt: "Flacon grenade Viktor & Rolf Spicebomb Eau de Toilette",
    teaser:
      "Poivre rose et bergamote, un cœur de piment et de safran, puis tabac et cuir. Taillé pour l’hiver.",
  },
  {
    slug: "azzaro-the-most-wanted-eau-de-parfum-intense",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T19:08:00",
    brand: "Azzaro",
    name: "The Most Wanted Eau de Parfum Intense",
    image: "/images/products/azzaro-the-most-wanted-eau-de-parfum-intense.png",
    imageAlt: "Flacon noir cranté Azzaro The Most Wanted Eau de Parfum Intense",
    teaser:
      "Cardamome et gingembre, liqueur de bourbon et bois ambrés, vanille en fond. Un gourmand du soir.",
  },
  {
    slug: "hugo-boss-bottled-eau-de-toilette",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T19:04:00",
    brand: "Hugo Boss",
    name: "Boss Bottled Eau de Toilette",
    image: "/images/products/hugo-boss-bottled-eau-de-toilette.png",
    imageAlt: "Flacon Hugo Boss Boss Bottled Eau de Toilette",
    teaser:
      "Pomme et bergamote, cannelle et œillet, santal et vétiver. Le boisé épicé passe-partout.",
  },
  {
    slug: "armani-acqua-di-gio-eau-de-toilette",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T19:00:00",
    brand: "Giorgio Armani",
    name: "Acqua di Giò Eau de Toilette",
    image: "/images/products/armani-acqua-di-gio-eau-de-toilette.png",
    imageAlt: "Flacon Giorgio Armani Acqua di Giò Eau de Toilette",
    teaser:
      "Le fondateur des parfums marins : notes iodées, bergamote et néroli, patchouli et musc blanc.",
  },
  {
    slug: "rabanne-1-million-eau-de-toilette",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T18:56:00",
    brand: "Rabanne",
    name: "1 Million Eau de Toilette",
    image: "/images/products/rabanne-1-million-eau-de-toilette.png",
    imageAlt: "Flacon lingot doré Rabanne 1 Million Eau de Toilette",
    teaser:
      "Pamplemousse et menthe, un cœur de rose et de cannelle, puis cuir et ambre. Il ne cherche pas la discrétion.",
  },
  {
    slug: "yves-saint-laurent-y-eau-de-parfum",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T18:52:00",
    brand: "Yves Saint Laurent",
    name: "Y Eau de Parfum",
    image: "/images/products/yves-saint-laurent-y-eau-de-parfum.png",
    imageAlt: "Flacon dégradé bleu Yves Saint Laurent Y Eau de Parfum",
    teaser:
      "Bergamote et gingembre, sauge sclarée et genévrier, fève tonka et cèdre en fond.",
  },
  {
    slug: "jean-paul-gaultier-le-male-eau-de-toilette",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T18:48:00",
    brand: "Jean Paul Gaultier",
    name: "Le Male Eau de Toilette",
    image: "/images/products/jean-paul-gaultier-le-male-eau-de-toilette.png",
    imageAlt: "Flacon buste à la marinière Jean Paul Gaultier Le Male Eau de Toilette",
    teaser:
      "Menthe et lavande, cannelle et fleur d’oranger, vanille et fève tonka. Le masculin sucré fondateur.",
  },
  {
    slug: "dior-sauvage-eau-de-toilette",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T18:44:00",
    brand: "Dior",
    name: "Sauvage Eau de Toilette",
    image: "/images/products/dior-sauvage-eau-de-toilette.png",
    imageAlt: "Flacon Dior Sauvage Eau de Toilette",
    teaser:
      "Bergamote de Calabre et poivre de Sichuan, puis l’ambroxan qui a fait sa réputation.",
  },
  {
    slug: "bleu-de-chanel-eau-de-parfum",
    gender: "homme",
    category: "parfums",
    addedAt: "2026-08-01T18:40:00",
    brand: "Chanel",
    name: "Bleu de Chanel Eau de Parfum",
    image: "/images/products/bleu-de-chanel-eau-de-parfum.png",
    imageAlt: "Flacon bleu nuit Chanel Bleu de Chanel Eau de Parfum",
    teaser:
      "Un boisé aromatique tenu : citron et menthe, gingembre et muscade, santal et encens en fond.",
  },
  {
    slug: "nuxe-prodigieux-le-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T18:12:00",
    brand: "Nuxe",
    name: "Prodigieux Le Parfum",
    image: "/images/products/nuxe-prodigieux-le-parfum.png",
    imageAlt: "Flacon Nuxe Prodigieux Le Parfum au dégradé orangé",
    teaser:
      "L’odeur de l’Huile Prodigieuse en parfum : fleur d’oranger, magnolia et vanille sur un fond de bois de coco.",
  },
  {
    slug: "guerlain-la-petite-robe-noire-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T18:06:00",
    brand: "Guerlain",
    name: "La Petite Robe Noire Eau de Parfum",
    image: "/images/products/guerlain-la-petite-robe-noire-eau-de-parfum.png",
    imageAlt:
      "Flacon Guerlain La Petite Robe Noire Eau de Parfum au bouchon cœur",
    teaser:
      "Une cerise noire gourmande adossée à la rose et à l’amande, sur un fond de patchouli et de fève tonka.",
  },
  {
    slug: "chloe-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T17:58:00",
    brand: "Chloé",
    name: "Chloé Eau de Parfum",
    image: "/images/products/chloe-eau-de-parfum.png",
    imageAlt: "Flacon Chloé Eau de Parfum et son ruban beige",
    teaser:
      "La rose sans la lourdeur : pivoine et litchi, un cœur de rose fraîche, un fond d’ambre et de cèdre.",
  },
  {
    slug: "burberry-goddess-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T17:45:00",
    brand: "Burberry",
    name: "Goddess Eau de Parfum",
    image: "/images/products/burberry-goddess-eau-de-parfum.png",
    imageAlt: "Flacon doré Burberry Goddess Eau de Parfum",
    teaser:
      "Une vanille en trois textures — infusée, crémeuse et brûlée — relevée par la lavande et le cacao.",
  },
  {
    slug: "mugler-alien-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T17:20:00",
    brand: "Mugler",
    name: "Alien Eau de Parfum",
    image: "/images/products/mugler-alien-eau-de-parfum.png",
    imageAlt: "Flacon violet et or Mugler Alien Eau de Parfum",
    teaser:
      "Jasmin sambac, bois de cachemire et ambre blanc : l’un des sillages les plus tenaces du rayon.",
  },
  {
    slug: "rabanne-lady-million-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T17:14:00",
    brand: "Rabanne",
    name: "Lady Million Eau de Parfum",
    image: "/images/products/rabanne-lady-million-eau-de-parfum.png",
    imageAlt: "Flacon diamant doré Rabanne Lady Million Eau de Parfum",
    teaser:
      "Un floral chypré solaire : néroli et framboise, fleur d’oranger et jasmin, patchouli et miel en fond.",
  },
  {
    slug: "valentino-born-in-roma-donna-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T17:08:00",
    brand: "Valentino",
    name: "Donna Born in Roma Eau de Parfum",
    image: "/images/products/valentino-born-in-roma-donna-eau-de-parfum.png",
    imageAlt: "Flacon clouté Valentino Donna Born in Roma Eau de Parfum",
    teaser:
      "Jasmin sambac et bourgeon de cassis en tête, vanille bourbon et bois de cèdre en fond.",
  },
  {
    slug: "prada-paradoxe-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T16:58:00",
    brand: "Prada",
    name: "Paradoxe Eau de Parfum",
    image: "/images/products/prada-paradoxe-eau-de-parfum.png",
    imageAlt: "Flacon triangle Prada Paradoxe Eau de Parfum",
    teaser:
      "Un floral ambré autour du néroli et du jasmin, dans le flacon triangle rechargeable de la maison.",
  },
  {
    slug: "jean-paul-gaultier-la-belle-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T16:54:00",
    brand: "Jean Paul Gaultier",
    name: "La Belle Eau de Parfum",
    image: "/images/products/jean-paul-gaultier-la-belle-eau-de-parfum.png",
    imageAlt: "Flacon buste Jean Paul Gaultier La Belle Eau de Parfum",
    teaser:
      "Trois notes, pas une de plus : poire juteuse, vanille et bois de santal, pour un sillage sucré et lumineux.",
  },
  {
    slug: "carolina-herrera-good-girl-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T16:48:00",
    brand: "Carolina Herrera",
    name: "Good Girl Eau de Parfum",
    image: "/images/products/carolina-herrera-good-girl-eau-de-parfum.png",
    imageAlt: "Flacon escarpin Carolina Herrera Good Girl Eau de Parfum",
    teaser:
      "Jasmin sambac et tubéreuse en pleine lumière, cacao et fève tonka dans l’ombre. Un parfum du soir très tenace.",
  },
  {
    slug: "dior-miss-dior-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T16:42:00",
    brand: "Dior",
    name: "Miss Dior Eau de Parfum",
    image: "/images/products/dior-miss-dior-eau-de-parfum.png",
    imageAlt:
      "Flacon Dior Miss Dior Eau de Parfum et son nœud couture argenté",
    teaser:
      "Un bouquet de roses de Grasse porté par la pivoine et l’iris, adouci par le bois de santal et le musc blanc.",
  },
  {
    slug: "chanel-coco-mademoiselle-eau-de-parfum",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T16:30:00",
    brand: "Chanel",
    name: "Coco Mademoiselle Eau de Parfum",
    image: "/images/products/chanel-coco-mademoiselle-eau-de-parfum.png",
    imageAlt: "Flacon Chanel Coco Mademoiselle Eau de Parfum vaporisateur",
    teaser:
      "L’oriental frais de Chanel : orange et bergamote, un cœur de rose et de jasmin, un fond de patchouli et de vétiver.",
  },
  {
    slug: "sol-de-janeiro-cheirosa-62-perfume-mist-90ml",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T16:05:00",
    brand: "Sol de Janeiro",
    name: "Cheirosa 62 Brume Parfumée 90 ml",
    image: "/images/products/sol-de-janeiro-cheirosa-62-perfume-mist-90ml.png",
    imageAlt: "Flacon Sol de Janeiro Cheirosa 62 Brume Parfumée 90 ml",
    teaser:
      "L’odeur qui a rendu la marque brésilienne célèbre : pistache et caramel salé sur un fond de vanille et d’héliotrope.",
  },
  {
    slug: "kayali-yum-boujee-marshmallow-81",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-08-01T15:40:00",
    brand: "Kayali",
    name: "Yum Boujee Marshmallow 81 Eau de Parfum Intense",
    image: "/images/products/kayali-yum-boujee-marshmallow-81.png",
    imageAlt:
      "Flacon Kayali Yum Boujee Marshmallow 81 Eau de Parfum Intense 10 ml",
    teaser:
      "Le gourmand assumé de Mona Kattan : guimauve rose et vanille fouettée sur un départ fruité de pomme et de citron.",
  },
  {
    slug: "la-vie-est-belle-eau-de-parfum-lancome",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-07-30T18:51:00",
    brand: "Lancôme",
    name: "La Vie Est Belle Eau de Parfum",
    image: "/images/products/la-vie-est-belle-eau-de-parfum-lancome.png",
    imageAlt: "Flacon La Vie Est Belle Eau de Parfum 50 ml de Lancôme",
    teaser:
      "Un iris gourmand devenu iconique, adouci par la poire et réchauffé par la vanille, le praliné et le patchouli.",
  },
  {
    slug: "opium-eau-de-parfum-yves-saint-laurent",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-07-30T15:11:00",
    brand: "Yves Saint Laurent",
    name: "Opium Eau de Parfum",
    image: "/images/products/opium-eau-de-parfum-yves-saint-laurent.png",
    imageAlt: "Flacon Opium Eau de Parfum 50 ml d’Yves Saint Laurent",
    teaser:
      "Un oriental au caractère chaleureux et épicé, l’un des sillages les plus reconnaissables de la parfumerie.",
  },
  {
    slug: "libre-eau-de-parfum-yves-saint-laurent",
    gender: "femme",
    category: "parfums",
    addedAt: "2026-07-30T18:51:00",
    brand: "Yves Saint Laurent",
    name: "Libre Eau de Parfum",
    image: "/images/products/ysl-libre-eau-de-parfum-50ml-officiel.png",
    imageAlt: "Flacon Libre Eau de Parfum 50 ml d’Yves Saint Laurent",
    teaser:
      "Une lavande florale moderne où la fraîcheur aromatique rencontre la sensualité de la fleur d’oranger.",
  },
];
