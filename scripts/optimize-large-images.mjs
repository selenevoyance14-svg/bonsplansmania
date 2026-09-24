import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, "public", "images", "articles");
const MIN_BYTES = 500 * 1024;
// 1 000 px suffit pour la largeur maximale d'un article et évite d'envoyer
// des visuels 2K/3K à un écran mobile.
const MAX_DIMENSION = 1000;
const SUPPORTED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  }));
  return files.flat();
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

async function optimizeImage(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(extension)) return null;

  const before = (await fs.stat(filePath)).size;
  if (before <= MIN_BYTES) return null;

  const temporaryPath = `${filePath}.optimizing`;
  let pipeline = sharp(filePath)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });

  if (extension === ".png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
      effort: 10,
      palette: true,
      quality: 80,
      colours: 256,
    });
  } else if (extension === ".webp") {
    pipeline = pipeline.webp({ quality: 80, effort: 6 });
  } else {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  }

  await pipeline.toFile(temporaryPath);
  const after = (await fs.stat(temporaryPath)).size;

  if (after >= before) {
    await fs.unlink(temporaryPath);
    return { before, after: before, changed: false };
  }

  await fs.rename(temporaryPath, filePath);
  return { before, after, changed: true };
}

const files = await walk(IMAGE_DIR);
let scanned = 0;
let optimized = 0;
let beforeBytes = 0;
let afterBytes = 0;

for (const filePath of files) {
  const result = await optimizeImage(filePath);
  if (!result) continue;
  scanned += 1;
  beforeBytes += result.before;
  afterBytes += result.after;
  if (result.changed) optimized += 1;
}

console.log(`Images de plus de 500 Ko analysées : ${scanned}`);
console.log(`Images réellement optimisées : ${optimized}`);
console.log(`Poids avant : ${formatBytes(beforeBytes)}`);
console.log(`Poids après : ${formatBytes(afterBytes)}`);
console.log(`Économie : ${formatBytes(beforeBytes - afterBytes)}`);
