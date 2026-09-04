import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type OfferType = "concours" | "test-gratuit" | "echantillon-gratuit";

interface Candidate {
  type: OfferType;
  title: string;
  brand: string;
  sourceUrl: string;
  endDate: string;
  summary: string;
  conditions?: string[];
  lots?: string;
  isFree?: boolean;
  officialSource?: boolean;
  personalData?: string[];
}

interface CheckResult {
  status: "ready" | "review" | "blocked";
  score: number;
  warnings: string[];
}

const root = process.cwd();
const inputArg = process.argv.find((arg) => arg.startsWith("--input="));
const outputArg = process.argv.find((arg) => arg.startsWith("--output="));
const inputPath = path.resolve(root, inputArg?.slice(8) || "data/agent-offres.json");
const outputDir = path.resolve(root, outputArg?.slice(9) || "drafts/offres");
const contentDir = path.join(root, "content");
const offerTypes = new Set<OfferType>(["concours", "test-gratuit", "echantillon-gratuit"]);

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T23:59:59Z`));
}

function inspect(candidate: Candidate): CheckResult {
  const warnings: string[] = [];
  let score = 100;
  let blockingIssue = false;

  if (!candidate.title?.trim() || !candidate.summary?.trim() || !candidate.brand?.trim()) {
    warnings.push("Titre, marque ou résumé manquant");
    score -= 50;
    blockingIssue = true;
  }
  if (!offerTypes.has(candidate.type)) {
    warnings.push("Type invalide (concours, test-gratuit ou echantillon-gratuit attendu)");
    score -= 50;
    blockingIssue = true;
  }
  if (!validDate(candidate.endDate)) {
    warnings.push("Date limite absente ou invalide (format attendu : AAAA-MM-JJ)");
    score -= 40;
    blockingIssue = true;
  } else if (Date.parse(`${candidate.endDate}T23:59:59Z`) < Date.now()) {
    warnings.push("Offre déjà terminée");
    score -= 100;
    blockingIssue = true;
  }

  try {
    const url = new URL(candidate.sourceUrl);
    if (url.protocol !== "https:") {
      warnings.push("Lien non sécurisé : HTTPS requis");
      score -= 35;
      blockingIssue = true;
    }
  } catch {
    warnings.push("Lien de participation invalide");
    score -= 60;
    blockingIssue = true;
  }

  if (candidate.isFree !== true) {
    warnings.push("La gratuité totale n'est pas confirmée");
    score -= 20;
    blockingIssue = true;
  }
  if (candidate.officialSource !== true) {
    warnings.push("La source officielle doit être vérifiée manuellement");
    score -= 15;
  }
  if (!candidate.conditions?.length) {
    warnings.push("Conditions de participation non renseignées");
    score -= 15;
  }
  if (!candidate.personalData?.length) {
    warnings.push("Données personnelles demandées non renseignées");
    score -= 5;
  }

  const normalizedScore = Math.max(0, score);
  return {
    score: normalizedScore,
    status: blockingIssue ? "blocked" : warnings.length ? "review" : "ready",
    warnings,
  };
}

function findDuplicate(candidate: Candidate): string | undefined {
  if (!fs.existsSync(contentDir)) return undefined;
  const targetTitle = slugify(candidate.title || "");
  for (const filename of fs.readdirSync(contentDir).filter((file) => file.endsWith(".mdx"))) {
    const raw = fs.readFileSync(path.join(contentDir, filename), "utf8");
    const { data } = matter(raw);
    if (
      (candidate.sourceUrl && data.affiliateUrl === candidate.sourceUrl) ||
      (targetTitle && slugify(String(data.title || "")) === targetTitle)
    ) {
      return filename;
    }
  }
  return undefined;
}

function renderDraft(candidate: Candidate, check: CheckResult): string {
  const today = new Date().toISOString().slice(0, 10);
  const category = candidate.type === "echantillon-gratuit" ? "test-gratuit" : candidate.type || "a-verifier";
  const brand = candidate.brand?.trim() || "Marque à vérifier";
  const title = candidate.title?.trim() || "Offre à vérifier";
  const summary = candidate.summary?.trim() || "Résumé à compléter avant publication.";
  const sourceUrl = candidate.sourceUrl || "URL à vérifier";
  const warnings = check.warnings.length
    ? check.warnings.map((warning) => `- ${warning}`).join("\n")
    : "- Aucun signal automatique";
  const conditions = candidate.conditions?.length
    ? candidate.conditions.map((condition) => `- ${condition}`).join("\n")
    : "- À vérifier";
  const personalData = candidate.personalData?.join(", ") || "À vérifier";

  return `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(summary)}
date: "${today}"
updated: "${today}"
endDate: "${candidate.endDate}"
category: "${category}"
tags: [${JSON.stringify(candidate.type || "a-verifier")}, ${JSON.stringify(brand.toLowerCase())}, "gratuit"]
image: "/images/articles/_placeholder-bonsplansmania.png"
imageAlt: ${JSON.stringify(`${brand} ${title}`)}
affiliateUrl: ${JSON.stringify(sourceUrl)}
affiliateLabel: "Je consulte l'offre officielle"
price: "Gratuit"
published: false
featured: false
expired: false
noindex: true
agentStatus: "${check.status}"
agentScore: ${check.score}
---

> **BROUILLON À VALIDER — ne pas publier en l'état.**

## Contrôle automatique

${warnings}

## ${title}

${summary}

### Ce qui est proposé

${candidate.lots || "Lot ou quantité à vérifier sur la page officielle."}

### Conditions de participation

${conditions}

### Données personnelles demandées

${personalData}

### Avant publication

- Ouvrir et vérifier le lien officiel : ${sourceUrl}
- Confirmer la date limite : ${candidate.endDate}
- Confirmer la gratuité et l'absence de frais cachés
- Ajouter une image autorisée et renseigner précisément son texte alternatif
- Relire les conditions et la zone géographique
`;
}

if (!fs.existsSync(inputPath)) {
  console.error(`Fichier introuvable : ${inputPath}`);
  console.error("Copiez data/agent-offres.example.json vers data/agent-offres.json, puis complétez les offres.");
  process.exit(1);
}

let parsedInput: unknown;
try {
  parsedInput = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  console.error(`JSON invalide dans ${inputPath}`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
if (!Array.isArray(parsedInput)) {
  console.error("Le fichier d'entrée doit contenir une liste d'offres.");
  process.exit(1);
}
const candidates = parsedInput as Candidate[];

fs.mkdirSync(outputDir, { recursive: true });
let created = 0;

for (const candidate of candidates) {
  if (!candidate || typeof candidate !== "object") {
    console.log("BLOCKED 0/100  Entrée ignorée : une offre doit être un objet JSON");
    continue;
  }
  const duplicate = findDuplicate(candidate);
  if (duplicate) {
    console.log(`DOUBLON  ${candidate.title} -> content/${duplicate}`);
    continue;
  }
  const check = inspect(candidate);
  const safeSlug = slugify(candidate.title || "") || `offre-a-verifier-${created + 1}`;
  const filename = `${safeSlug}.mdx`;
  fs.writeFileSync(path.join(outputDir, filename), renderDraft(candidate, check));
  console.log(`${check.status.toUpperCase().padEnd(7)} ${check.score}/100  ${filename}`);
  for (const warning of check.warnings) console.log(`         - ${warning}`);
  created += 1;
}

console.log(`\n${created} brouillon(s) créé(s) dans ${path.relative(root, outputDir)}.`);
