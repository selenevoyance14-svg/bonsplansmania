#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, "public/images/articles");
const CONTENT_DIRS = [path.join(ROOT, "content"), path.join(ROOT, "src")];
const MIN_BYTES = 300_000;
const MAX_WIDTH = 1600;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

const sourceFiles = CONTENT_DIRS.flatMap(walk).filter((file) =>
  /\.(?:mdx?|tsx?|json)$/i.test(file),
);
const sourceContents = new Map(
  sourceFiles.map((file) => [file, fs.readFileSync(file, "utf8")]),
);
const candidates = walk(IMAGE_DIR).filter((file) => {
  if (!/\.(?:png|jpe?g|webp)$/i.test(file)) return false;
  return fs.statSync(file).size > MIN_BYTES;
});

let optimized = 0;
let bytesBefore = 0;
let bytesAfter = 0;

for (const source of candidates) {
  const relative = path.relative(path.join(ROOT, "public"), source).split(path.sep).join("/");
  const publicPath = `/${relative}`;
  const referencedBy = sourceFiles.filter((file) => sourceContents.get(file).includes(publicPath));

  const isWebp = source.toLowerCase().endsWith(".webp");
  const destination = isWebp
    ? `${source}.optimized.webp`
    : source.replace(/\.(?:png|jpe?g)$/i, ".webp");
  const originalBytes = fs.statSync(source).size;
  await sharp(source)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(destination);

  const optimizedBytes = fs.statSync(destination).size;
  if (optimizedBytes >= originalBytes) {
    fs.unlinkSync(destination);
    continue;
  }

  if (isWebp) {
    fs.renameSync(destination, source);
  } else {
    const nextPublicPath = publicPath.replace(/\.(?:png|jpe?g)$/i, ".webp");
    for (const file of referencedBy) {
      const content = sourceContents.get(file).split(publicPath).join(nextPublicPath);
      fs.writeFileSync(file, content);
      sourceContents.set(file, content);
    }
    fs.unlinkSync(source);
  }
  optimized += 1;
  bytesBefore += originalBytes;
  bytesAfter += optimizedBytes;
}

console.log(
  `[images] ${optimized} images converties en WebP : ${(bytesBefore / 1e6).toFixed(1)} Mo → ${(bytesAfter / 1e6).toFixed(1)} Mo`,
);
