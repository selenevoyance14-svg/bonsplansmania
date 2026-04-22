import { readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = "out";
// Framework-level txt files to preserve
const KEEP_PATTERNS = [/^__next\._/];

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function shouldKeep(relPath: string): boolean {
  // Only keep __next._*.txt at the ROOT of out/ (not in subroutes)
  const parts = relPath.split("/");
  if (parts.length !== 1) return false;
  const filename = parts[0];
  return KEEP_PATTERNS.some((pat) => pat.test(filename));
}

async function main() {
  try {
    await stat(OUT_DIR);
  } catch {
    console.log(`[clean-rsc-txt] No ${OUT_DIR}/ directory — skipping.`);
    return;
  }

  let deleted = 0;
  let kept = 0;
  for await (const file of walk(OUT_DIR)) {
    if (!file.endsWith(".txt")) continue;
    const rel = file.substring(OUT_DIR.length + 1);
    if (shouldKeep(rel)) {
      kept++;
      continue;
    }
    await unlink(file);
    deleted++;
  }
  console.log(`[clean-rsc-txt] Deleted ${deleted} RSC payload .txt files, kept ${kept} framework files.`);
}

main().catch((err) => {
  console.error("[clean-rsc-txt] Error:", err);
  process.exit(1);
});
