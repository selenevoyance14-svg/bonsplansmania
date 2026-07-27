import fs from "node:fs";
import path from "node:path";

const FILES = [
  "avis-aroma-zone-cosmetiques-naturels-diy-test-serums.mdx",
  "avis-clarins-soins-anti-age-premium-test-2026.mdx",
  "avis-filorga-time-filler-ncef-optim-eyes-test-anti-age-2026.mdx",
  "avis-jod-cosmetics-baumes-fondants-soins-naturels-test-2026.mdx",
  "avis-pin-up-secret-masque-savon-lait-chevre-test-2026.mdx",
  "avis-seasonly-serums-huile-nuit-clean-beauty-test-2026.mdx",
  "routine-visage-homme-guide-complet-8-produits-2026.mdx",
  "thalgo-cosmetiques-marins-avis-test-1-mois-verdict.mdx",
];

const CONTENT_DIR = path.join(process.cwd(), "content");
const methodology =
  "\n> **Méthode éditoriale :** cette analyse compare les compositions, les caractéristiques publiées par les marques et les retours d'utilisateurs disponibles. Sauf mention explicite d'un produit reçu, elle ne constitue pas un test physique réalisé par la rédaction.\n";

const replacements: Array<[RegExp, string]> = [
  [/On a testé/g, "Nous avons analysé"],
  [/on a testé/g, "nous avons analysé"],
  [/qu'on a testés/g, "que nous avons analysés"],
  [/qu'on a testées/g, "que nous avons analysées"],
  [/qu'nous avons analysés/g, "que nous avons analysés"],
  [/\bLes produits qu'on a testés\b/g, "Les produits analysés"],
  [/\bLes produits phares qu'on a testés\b/g, "Les produits phares analysés"],
  [/\bLes 2 produits qu'on a testés\b/g, "Les 2 produits analysés"],
  [/\bLes 3 produits qu'on a testés\b/g, "Les 3 produits analysés"],
  [/\bproduits testés\b/g, "produits analysés"],
  [/\bsoins testés\b/g, "soins analysés"],
];

const metadata: Record<string, Record<string, string>> = {
  "avis-aroma-zone-cosmetiques-naturels-diy-test-serums.mdx": {
    title: "Aroma-Zone : analyse des sérums, huiles et produits DIY",
    description: "Analyse éditoriale d'Aroma-Zone : sérums, huiles essentielles et ingrédients DIY. Composition, prix et critères utiles avant de choisir.",
    seoTitle: "Aroma-Zone : analyse des sérums, huiles et produits DIY",
    seoDescription: "Analyse d'Aroma-Zone : sérums, huiles et DIY. Composition, gamme, prix et critères utiles avant de choisir un produit.",
  },
  "avis-clarins-soins-anti-age-premium-test-2026.mdx": {
    title: "Clarins : analyse des soins anti-âge premium en 2026",
    description: "Analyse éditoriale des soins Clarins : Double Serum et crèmes anti-âge. Composition, positionnement premium et critères utiles avant l'achat.",
    seoTitle: "Clarins : analyse des soins anti-âge premium",
    seoDescription: "Analyse des soins Clarins : Double Serum, crèmes anti-âge et technologie Collagen III. Gamme et rapport qualité-prix.",
  },
  "avis-filorga-time-filler-ncef-optim-eyes-test-anti-age-2026.mdx": {
    title: "Filorga : analyse de Time-Filler, NCEF et Optim-Eyes",
    description: "Analyse éditoriale de trois soins Filorga : Time-Filler 5XP, NCEF-Revitalize et Optim-Eyes. Compositions et points de vigilance.",
    seoTitle: "Filorga : analyse Time-Filler, NCEF et Optim-Eyes",
    seoDescription: "Analyse de trois soins Filorga : compositions, caractéristiques annoncées et critères de choix.",
  },
  "avis-jod-cosmetics-baumes-fondants-soins-naturels-test-2026.mdx": {
    title: "JOD Cosmetics : analyse des baumes fondants",
    description: "Analyse éditoriale de JOD Cosmetics : huile démaquillante stick, soin visage et blush baume. Composition, format et critères de choix.",
    seoTitle: "JOD Cosmetics : analyse des baumes fondants",
    seoDescription: "Analyse des baumes JOD Cosmetics : composition, formats et points à vérifier avant l'achat.",
  },
  "avis-pin-up-secret-masque-savon-lait-chevre-test-2026.mdx": {
    title: "Pin Up Secret : analyse des soins solides au lait de chèvre",
    description: "Analyse éditoriale du savon-masque et du masque Curcuma au lait de chèvre : composition, usage et points de vigilance.",
    seoTitle: "Pin Up Secret : analyse des soins au lait de chèvre",
    seoDescription: "Analyse des soins solides Pin Up Secret : composition, usages annoncés et précautions pour les peaux sensibles.",
  },
  "avis-seasonly-serums-huile-nuit-clean-beauty-test-2026.mdx": {
    title: "Seasonly : analyse des sérums et de l'huile de nuit",
    description: "Analyse éditoriale du sérum regard, de TensioLift et de l'huile de nuit Seasonly. Actifs, composition et critères de choix.",
    seoTitle: "Seasonly : analyse des sérums et de l'huile de nuit",
    seoDescription: "Analyse de trois soins Seasonly : actifs, compositions et critères utiles avant l'achat.",
  },
  "thalgo-cosmetiques-marins-avis-test-1-mois-verdict.mdx": {
    title: "Thalgo : analyse des cosmétiques marins",
    description: "Analyse éditoriale de trois produits Thalgo : huile démaquillante, masque Source Marine et gommage. Composition et rapport qualité-prix.",
    seoTitle: "Avis Thalgo : analyse des cosmétiques marins",
    seoDescription: "Analyse des cosmétiques marins Thalgo : composition, caractéristiques annoncées et prix.",
  },
};

const unsupportedExperienceReplacements: Array<[RegExp, string]> = [
  [/On l'a utilisé \*\*matin et soir pendant 4 semaines\*\*\. Le résultat :/g, "Les retours d'usage consultés et les caractéristiques annoncées mettent notamment en avant :"],
  [/On l'utilise \*\*matin et soir sous la crème\*\*, c'est devenu un réflexe\. \*\*La peau tire beaucoup moins en fin de journée\*\*\./g, "Ce type de sérum s'utilise généralement matin et soir sous la crème, selon les indications de la marque et la tolérance de la peau."],
  [/On nous pose souvent la question : est-ce que Thalgo vaut vraiment son prix \? Entre les crèmes à 30€ et les gommages à 40€, on comprend l'hésitation\. On a décidé de tester trois produits phares pendant un mois pour se faire un vrai avis\./g, "Thalgo vaut-il vraiment son prix ? Nous avons comparé trois produits phares à partir de leurs compositions, des informations de la marque et des retours d'utilisateurs disponibles."],
  [/C'est le produit qui nous a le plus convaincues\. La texture est onctueuse, l'odeur marine est discrète et agréable\. Après 10 minutes de pose, la peau est \*\*repulpée et confortable\*\* pendant toute la journée\. On l'a utilisé deux fois par semaine pendant un mois et la différence sur la qualité de la peau est visible\./g, "La marque présente une texture onctueuse et une pose de 10 minutes. Les retours consultés évoquent une peau plus confortable après utilisation, avec des résultats variables selon le type de peau."],
  [/Notre verdict après un mois est nuancé :/g, "Notre analyse est nuancée :"],
  [/nous avons analysé la marque pendant 1 mois/g, "notre analyse de la marque"],
  [/Le deuxième produit de notre test/g, "Le deuxième produit analysé"],
  [/On l'utilise tous les soirs depuis plusieurs semaines et on ne revient pas en arrière\./g, "Le format stick peut simplifier la routine du soir et limiter les risques de fuite."],
  [/On l'utilise depuis plusieurs semaines en alternance nettoyant\/masque et la peau est clairement plus nette\./g, "L'usage alterné nettoyant et masque correspond aux indications généralement données pour ce type de produit."],
];

for (const name of FILES) {
  const file = path.join(CONTENT_DIR, name);
  let source = fs.readFileSync(file, "utf8");
  for (const [pattern, replacement] of replacements) {
    source = source.replace(pattern, replacement);
  }
  for (const [pattern, replacement] of unsupportedExperienceReplacements) {
    source = source.replace(pattern, replacement);
  }
  for (const [key, value] of Object.entries(metadata[name] ?? {})) {
    source = source.replace(
      new RegExp(`^${key}:\\s*.*$`, "m"),
      `${key}: ${JSON.stringify(value)}`,
    );
  }

  if (!source.includes("**Méthode éditoriale :**")) {
    const frontmatterEnd = source.indexOf("\n---", 4);
    const firstHeading = source.indexOf("\n## ", frontmatterEnd + 4);
    const nextSeparator = source.indexOf("\n---", firstHeading + 1);
    const insertionPoint = nextSeparator > firstHeading ? nextSeparator : firstHeading;
    source =
      source.slice(0, insertionPoint) +
      methodology +
      source.slice(insertionPoint);
  }
  fs.writeFileSync(file, source);
}

console.log(`${FILES.length} avis sans preuve documentée normalisés`);
