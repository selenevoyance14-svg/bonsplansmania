import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const APPLY = process.argv.includes("--apply");
const CATEGORY = process.argv.find((arg) => arg.startsWith("--category="))?.split("=")[1] ?? "concours";
const ALLOWED_CATEGORIES = new Set(["concours", "test-gratuit"]);

if (!ALLOWED_CATEGORIES.has(CATEGORY)) {
  console.error("Catégorie acceptée : concours ou test-gratuit");
  process.exit(1);
}

const reportPrefix = CATEGORY === "concours" ? "contest" : "free-product-test";
const REPORT_PATH = path.join(process.cwd(), `reports/content/${reportPrefix}-end-date-review.csv`);
const DETECTED_PATH = path.join(process.cwd(), `reports/content/${reportPrefix}-end-date-detected.csv`);

const MONTHS: Record<string, number> = {
  janvier: 1,
  fevrier: 2,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  aout: 8,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  decembre: 12,
  décembre: 12,
};

const monthPattern = Object.keys(MONTHS).join("|");
const contextPattern = String.raw`(?:date\s+limite|jusqu['’](?:au|à)|se\s+termine(?:ra)?\s+le|cl[oô]ture(?:\s+des\s+participations)?(?:\s+le|\s+au)?|fin\s+des\s+participations(?:\s+le)?)`;
const writtenDate = new RegExp(
  String.raw`${contextPattern}\s*:?\s*(\d{1,2})(?:er)?\s+(${monthPattern})\s+(20\d{2})`,
  "giu",
);
const numericDate = new RegExp(
  String.raw`${contextPattern}\s*:?\s*(\d{1,2})[/.\-](\d{1,2})[/.\-](20\d{2})`,
  "giu",
);

type Candidate = { iso: string; evidence: string };
type ReviewRow = { file: string; date: string; reason: string; evidence: string };

function toIso(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function extractCandidates(text: string): Candidate[] {
  const candidates: Candidate[] = [];
  for (const match of text.matchAll(writtenDate)) {
    const iso = toIso(Number(match[3]), MONTHS[match[2].toLowerCase()], Number(match[1]));
    if (iso) candidates.push({ iso, evidence: match[0].replace(/\s+/g, " ").trim() });
  }
  for (const match of text.matchAll(numericDate)) {
    const iso = toIso(Number(match[3]), Number(match[2]), Number(match[1]));
    if (iso) candidates.push({ iso, evidence: match[0].replace(/\s+/g, " ").trim() });
  }
  return candidates;
}

function insertEndDate(raw: string, endDate: string): string {
  const expiredLine = /^expired:\s*(?:true|false)\s*$/m;
  if (expiredLine.test(raw)) {
    return raw.replace(expiredLine, (line) => `${line}\nendDate: "${endDate}"`);
  }
  const frontmatterEnd = raw.indexOf("\n---", 4);
  if (frontmatterEnd === -1) return raw;
  return `${raw.slice(0, frontmatterEnd)}\nendDate: "${endDate}"${raw.slice(frontmatterEnd)}`;
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

const review: ReviewRow[] = [];
const detected: Array<{ file: string; endDate: string; evidence: string }> = [];
let added = 0;

for (const file of fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".mdx"))) {
  const fullPath = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  if (
    data.category !== CATEGORY ||
    data.published === false ||
    data.expired === true ||
    data.endDate
  ) continue;

  const searchable = [data.seoDescription, data.description, content]
    .filter((value): value is string => typeof value === "string")
    .join("\n");
  const candidates = extractCandidates(searchable);
  const byDate = new Map<string, string[]>();
  for (const candidate of candidates) {
    const evidence = byDate.get(candidate.iso) ?? [];
    evidence.push(candidate.evidence);
    byDate.set(candidate.iso, evidence);
  }

  if (byDate.size === 1) {
    const [endDate] = byDate.keys();
    detected.push({
      file,
      endDate,
      evidence: [...new Set(byDate.get(endDate) ?? [])].join(" | "),
    });
    if (APPLY) fs.writeFileSync(fullPath, insertEndDate(raw, endDate), "utf8");
    added++;
    continue;
  }

  const reason = byDate.size === 0 ? "aucune date de fin explicite" : "plusieurs dates de fin contradictoires";
  const evidence = [...byDate.entries()]
    .map(([date, excerpts]) => `${date}: ${[...new Set(excerpts)].join(" | ")}`)
    .join(" || ");
  review.push({ file, date: String(data.date || ""), reason, evidence });
}

const report = [
  ["file", "publicationDate", "reason", "evidence"].map(csvCell).join(","),
  ...review.map((row) => [row.file, row.date, row.reason, row.evidence].map(csvCell).join(",")),
].join("\n") + "\n";
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, report, "utf8");
const detectedReport = [
  ["file", "endDate", "evidence"].map(csvCell).join(","),
  ...detected.map((row) => [row.file, row.endDate, row.evidence].map(csvCell).join(",")),
].join("\n") + "\n";
fs.writeFileSync(DETECTED_PATH, detectedReport, "utf8");

console.log(`${APPLY ? "Ajoutées" : "Dates fiables détectées"} : ${added}`);
console.log(`À vérifier manuellement : ${review.length}`);
console.log(`Rapport : ${path.relative(process.cwd(), REPORT_PATH)}`);
console.log(`Dates détectées : ${path.relative(process.cwd(), DETECTED_PATH)}`);
