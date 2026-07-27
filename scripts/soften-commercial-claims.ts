import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const shouldWrite = process.argv.includes("--write");

const replacements: Array<[RegExp, string]> = [
  [/\bprix imbattable\b/giu, "prix intéressant au moment de la publication"],
  [/\bmeilleur prix jamais vu\b/giu, "prix particulièrement bas observé lors de la publication"],
  [/\bnuméro 1 mondial\b/giu, "acteur reconnu du secteur"],
  [/\bn°\s*1 mondial\b/giu, "acteur reconnu du secteur"],
  [/\ble plus bas du marché\b/giu, "parmi les prix bas observés au moment de la publication"],
];

function dirtyContentFiles(): Set<string> {
  const output = execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  return new Set(
    output
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3))
      .filter((file) => file.startsWith("content/")),
  );
}

const dirtyBeforeRun = dirtyContentFiles();
const changed: string[] = [];
const skipped: string[] = [];

for (const name of fs.readdirSync(CONTENT_DIR)) {
  if (!name.endsWith(".mdx")) continue;
  const relative = `content/${name}`;
  const file = path.join(CONTENT_DIR, name);
  const source = fs.readFileSync(file, "utf8");
  let updated = source;
  for (const [pattern, replacement] of replacements) {
    updated = updated.replace(pattern, replacement);
  }
  if (updated === source) continue;
  if (dirtyBeforeRun.has(relative)) {
    skipped.push(relative);
    continue;
  }
  changed.push(relative);
  if (shouldWrite) fs.writeFileSync(file, updated);
}

console.log(`${changed.length} fichier(s) ${shouldWrite ? "reformulé(s)" : "à reformuler"}`);
console.log(`${skipped.length} fichier(s) déjà modifié(s) ignoré(s)`);
for (const file of changed) console.log(file);
if (!shouldWrite) console.log("Relancer avec --write pour appliquer.");
