import type { BrandDef } from "@/app/components/BrandFilter";

// Liste manuelle propre pour /categorie/bon-plan et /bons-plans-en-cours
// (validée par l'utilisateur, ajustée le 29 mai 2026).
export const BON_PLAN_BRANDS: BrandDef[] = [
  // Marketplaces & sites
  { key: "amazon", label: "Amazon", keywords: ["amazon"] },
  { key: "cdiscount", label: "Cdiscount", keywords: ["cdiscount"] },
  { key: "yesstyle", label: "YesStyle", keywords: ["yesstyle"] },
  { key: "lookfantastic", label: "Lookfantastic", keywords: ["lookfantastic"] },
  { key: "bebeboutik", label: "Bebeboutik", keywords: ["bebeboutik", "bébéboutik"] },
  { key: "showroom-prive", label: "Showroom Privé", keywords: ["showroom privé", "showroom prive", "showroom-prive", "showroomprive"] },
  { key: "greenweez", label: "Greenweez", keywords: ["greenweez"] },
  { key: "private-sport-shop", label: "Private Sport Shop", keywords: ["private sport shop", "private-sport-shop"] },
  { key: "zooplus", label: "Zooplus", keywords: ["zooplus", "zoo plus"] },
  { key: "mano-mano", label: "Mano Mano", keywords: ["mano mano", "manomano", "mano-mano"] },
  { key: "darty", label: "Darty", keywords: ["darty"] },
  // Cashback (catégorie large)
  { key: "cashback", label: "Cashback", keywords: ["cashback", "igraal", "ebuyclub", "poulpeo"] },
  // Beauté
  { key: "loreal", label: "L'Oréal", keywords: ["l'oréal", "l oreal", "loreal", "l'oreal", "loreal-paris", "l'oréal paris"] },
  { key: "garnier", label: "Garnier", keywords: ["garnier"] },
  { key: "maybelline", label: "Maybelline", keywords: ["maybelline"] },
  { key: "ghd", label: "GHD", keywords: ["ghd"] },
  { key: "dr-pierre-ricaud", label: "Dr Pierre Ricaud", keywords: ["dr pierre ricaud", "dr-pierre-ricaud", "pierre ricaud", "pierre-ricaud"] },
  { key: "lea-nature", label: "Léa Nature", keywords: ["léa nature", "lea nature", "lea-nature", "léa-nature"] },
  { key: "loccitane", label: "L'Occitane", keywords: ["l'occitane", "l occitane", "loccitane", "occitane"] },
  { key: "clarins", label: "Clarins", keywords: ["clarins"] },
  { key: "beauty-success", label: "Beauty Success", keywords: ["beauty success", "beauty-success", "beautysuccess"] },
  // Famille / bébé
  { key: "puericulture", label: "Puériculture", keywords: ["puériculture", "puericulture"] },
  { key: "pampers", label: "Pampers", keywords: ["pampers"] },
  // K-Beauty (catégorie)
  { key: "kbeauty", label: "K-Beauty", keywords: ["k-beauty", "kbeauty", "k beauty"] },
  // Tech
  { key: "philips", label: "Philips", keywords: ["philips"] },
  { key: "samsung", label: "Samsung", keywords: ["samsung"] },
  { key: "dyson", label: "Dyson", keywords: ["dyson"] },
  { key: "oral-b", label: "Oral-B", keywords: ["oral-b", "oral b", "oralb"] },
  // Ajouts utilisateur
  { key: "thalgo", label: "Thalgo", keywords: ["thalgo"] },
  { key: "adopt", label: "Adopt'", keywords: ["adopt", "adopt-parfums", "adopt parfums", "adopt'"] },
  { key: "weleda", label: "Weleda", keywords: ["weleda"] },
  { key: "beaba", label: "Béaba", keywords: ["béaba", "beaba"] },
  { key: "stylvana", label: "Stylvana", keywords: ["stylvana", "stylevana"] },
  { key: "miin", label: "MiiN Cosmetics", keywords: ["miin", "miin cosmetics", "miin-cosmetics", "miin cosmetic"] },
  { key: "les-createurs-bio", label: "Les Créateurs Bio", keywords: ["les créateurs bio", "les createurs bio", "les-createurs-bio", "createurs bio", "createurs-bio"] },
  { key: "magnifaik", label: "Magnifaïk", keywords: ["magnifaïk", "magnifaik"] },
  { key: "atelier-du-sourcil", label: "L'Atelier du Sourcil", keywords: ["atelier du sourcil", "l'atelier du sourcil", "atelier-du-sourcil"] },
  { key: "pranarom", label: "Pranarôm", keywords: ["pranarôm", "pranarom"] },
  { key: "le-rouge-francais", label: "Le Rouge Français", keywords: ["le rouge français", "rouge français", "le-rouge-francais", "rouge-francais", "le rouge francais"] },
  { key: "mademoiselle-bio", label: "Mademoiselle Bio", keywords: ["mademoiselle bio", "mademoiselle-bio"] },
  { key: "rakuten", label: "Rakuten", keywords: ["rakuten"] },
  { key: "famille-mary", label: "Famille Mary", keywords: ["famille mary", "famille-mary"] },
  { key: "afibel", label: "Afibel", keywords: ["afibel"] },
  { key: "beaute-produit", label: "Beauté Produit", keywords: ["beauté produit", "beaute produit", "beaute-produit", "beauteproduit", "beaute-produit.com"] },
  { key: "daxon", label: "Daxon", keywords: ["daxon"] },
  { key: "laboratoire-biarritz", label: "Laboratoire Biarritz", keywords: ["laboratoire biarritz", "laboratoire-biarritz", "labo biarritz"] },
  { key: "news-parfums", label: "News Parfums", keywords: ["news parfums", "news-parfums", "newsparfums"] },
  { key: "blanche-porte", label: "Blanche Porte", keywords: ["blanche porte", "blanche-porte", "blancheporte"] },
  { key: "gemo", label: "Gémo", keywords: ["gémo", "gemo"] },
  { key: "damart", label: "Damart", keywords: ["damart"] },
];

// Liste manuelle des box beauté présentes sur le site
export const BOX_BEAUTE_BRANDS: BrandDef[] = [
  { key: "biotyfull", label: "Biotyfull Box", keywords: ["biotyfull", "biotyfull-box", "biotyfull box"] },
  { key: "blissim", label: "Blissim", keywords: ["blissim"] },
  { key: "glowria", label: "Glowria", keywords: ["glowria"] },
  { key: "lookfantastic", label: "Lookfantastic", keywords: ["lookfantastic"] },
  { key: "prescription-lab", label: "Prescription Lab", keywords: ["prescription lab", "prescription-lab", "prescriptionlab"] },
  { key: "my-little-box", label: "My Little Box", keywords: ["my little box", "my-little-box", "mylittlebox"] },
  { key: "my-beauty-factory", label: "My Beauty Factory", keywords: ["my beauty factory", "my-beauty-factory", "mybeautyfactory"] },
  { key: "laromabox", label: "L'Arôma Box", keywords: ["laromabox", "l-aroma-box", "l'aroma box", "larômabox", "l'arôma box", "aroma box"] },
  { key: "belle-au-naturel", label: "Belle au Naturel", keywords: ["belle au naturel", "belle-au-naturel"] },
  { key: "mademoiselle-bio", label: "Mademoiselle Bio", keywords: ["mademoiselle bio", "mademoiselle-bio"] },
  { key: "mademoiselle-confettis", label: "Mademoiselle Confettis", keywords: ["mademoiselle confettis", "mademoiselle-confettis"] },
  { key: "nuoo", label: "Nuoo", keywords: ["nuoo"] },
];
