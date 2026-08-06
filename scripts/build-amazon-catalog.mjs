#!/usr/bin/env node
/**
 * Construit un catalogue Amazon "bons plans" pour bonsplansmania.
 * Sources : pages bestsellers Amazon ciblées audience bons plans
 * (beauté, maison, cuisine, jardin, mode, parfum, etc.)
 *
 * Pour chaque ASIN : titre, prix, image (téléchargée), note, nb avis.
 * Filtre les "non-cadeau" (pneu, batterie auto, lessive, etc.)
 * Garde uniquement les produits < 50€ (audience bons plans = budget < 50€).
 *
 * Sortie : src/data/amazon-flash-deals.json
 * Images : public/images/amazon/
 *
 * Lancé automatiquement avant chaque build.
 */

import fs from "fs";
import path from "path";
import https from "https";
import zlib from "zlib";
import { fileURLToPath } from "url";

console.error(
  "Ce script est désactivé : les données Amazon doivent provenir des outils officiels du Programme Partenaires (PA-API)."
);
process.exit(1);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(ROOT, "src", "data", "amazon-flash-deals.json");
const IMG_DIR = path.join(ROOT, "public", "images", "amazon");
const PARTNER_TAG = "lebrunnathali-21";

const MAX_PRICE = 50;
const MAX_PRODUCTS = 50;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.mkdirSync(IMG_DIR, { recursive: true });

const SOURCE_PAGES = [
  "https://www.amazon.fr/gp/bestsellers/beauty",
  "https://www.amazon.fr/gp/bestsellers/grocery",
  "https://www.amazon.fr/gp/bestsellers/kitchen",
  "https://www.amazon.fr/gp/bestsellers/baby",
  "https://www.amazon.fr/gp/bestsellers/handmade",
  "https://www.amazon.fr/gp/most-gifted/",
  "https://www.amazon.fr/gp/most-wished-for/",
];

const BLACKLIST = [
  "papier toilette", "lessive", "couche pampers",
  "batterie auto", "huile moteur", "pneu",
  "cartouche imprimante", "câble usb",
  "papier alu", "sac poubelle", "javel", "détergent",
  "vis", "boulon", "rallonge électrique",
  "ration militaire", "destop", "ampoule led h7",
  "anti-puce", "vermifuge",
];

function fetchHTML(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects <= 0) return reject(new Error("Too many redirects"));
    https
      .get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9",
          "Accept-Encoding": "gzip, deflate",
        },
        timeout: 25000,
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, url).href;
          res.resume();
          return fetchHTML(next, redirects - 1).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const enc = res.headers["content-encoding"];
        let stream = res;
        if (enc === "gzip") stream = res.pipe(zlib.createGunzip());
        else if (enc === "deflate") stream = res.pipe(zlib.createInflate());
        const chunks = [];
        stream.on("data", (c) => chunks.push(c));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        stream.on("error", reject);
      })
      .on("error", reject);
  });
}

function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 25000 }, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          const size = fs.statSync(filePath).size;
          if (size < 2000) { fs.unlinkSync(filePath); return reject(new Error("File too small")); }
          resolve(size);
        });
        file.on("error", reject);
      })
      .on("error", reject);
  });
}

const parseAsins = (h) => [...new Set([...h.matchAll(/(?:data-asin="|\/dp\/|"asin":")([A-Z0-9]{10})/g)].map((m) => m[1]))];
const parsePrice = (h) => { const m = h.match(/"priceAmount":\s*([0-9]+\.?[0-9]*)/); return m ? parseFloat(m[1]) : null; };
const parseRating = (h) => { const m = h.match(/title="([0-9],[0-9])\s+sur\s+5\s+étoiles"/); return m ? parseFloat(m[1].replace(",", ".")) : null; };
const parseReviews = (h) => {
  const m = h.match(/aria-label="([0-9\s ]+)\s+Commentaires?"/);
  if (m) return parseInt(m[1].replace(/[\s ]/g, ""), 10);
  const m2 = h.match(/acrCustomerReviewText[^>]*>\(([0-9\s ]+)\)/);
  return m2 ? parseInt(m2[1].replace(/[\s ]/g, ""), 10) : null;
};
const parseImage = (h) => {
  const hi = h.match(/"hiRes":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.jpg)"/);
  if (hi) return hi[1];
  const lg = h.match(/"large":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.jpg)"/);
  return lg ? lg[1] : null;
};
const parseTitle = (h) => { const m = h.match(/id="productTitle"[^>]*>([^<]+)</); return m ? m[1].trim().replace(/\s+/g, " ") : null; };
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

function isLegit(title, price) {
  if (!title || !price) return false;
  if (price > MAX_PRICE) return false;
  const t = title.toLowerCase();
  return !BLACKLIST.some((b) => t.includes(b));
}

async function processAsin(asin) {
  try {
    const html = await fetchHTML(`https://www.amazon.fr/dp/${asin}`);
    const title = parseTitle(html);
    const image = parseImage(html);
    const price = parsePrice(html);
    if (!title || !image || !price) return null;
    if (!isLegit(title, price)) return { _skip: true, title, price };
    const rating = parseRating(html);
    const reviews = parseReviews(html);
    const slug = `${slugify(title)}-${asin.slice(-6).toLowerCase()}`;
    const imgFilename = `${slug}.jpg`;
    const imgPath = path.join(IMG_DIR, imgFilename);
    if (!fs.existsSync(imgPath)) await downloadImage(image, imgPath);
    return {
      asin, slug, title, price,
      ...(rating ? { rating } : {}),
      ...(reviews ? { reviews_count: reviews } : {}),
      image: `/images/amazon/${imgFilename}`,
      affiliate_url: `https://www.amazon.fr/dp/${asin}?tag=${PARTNER_TAG}`,
    };
  } catch { return null; }
}

async function main() {
  console.log(`\n=== Catalogue Flash Deals bonsplansmania ===\n`);

  const seenAsins = new Set();
  for (const url of SOURCE_PAGES) {
    try {
      const html = await fetchHTML(url);
      const asins = parseAsins(html);
      let added = 0;
      for (const a of asins) if (!seenAsins.has(a)) { seenAsins.add(a); added++; }
      console.log(`  + ${added.toString().padStart(3)} depuis ${url.replace("https://www.amazon.fr", "")}`);
    } catch (e) { console.log(`  ! ${url} -> ${e.message}`); }
    await new Promise((r) => setTimeout(r, 800));
  }
  console.log(`\n→ ${seenAsins.size} ASINs à traiter\n`);

  const products = [];
  let skipped = 0, ko = 0, idx = 0;
  for (const asin of seenAsins) {
    if (products.length >= MAX_PRODUCTS) break;
    idx++;
    const r = await processAsin(asin);
    if (r === null) ko++;
    else if (r._skip) skipped++;
    else {
      products.push(r);
      console.log(`  ✓ [${idx}] ${asin} ${r.price.toFixed(2).padStart(6)}€  ${r.title.slice(0, 50)}`);
    }
    await new Promise((res) => setTimeout(res, 700));
  }

  products.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  if (products.length === 0) {
    console.warn(
      "\n⚠ Aucun produit récupéré : le dernier catalogue valide est conservé.\n"
    );
    return;
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify({
    generated_at: new Date().toISOString(),
    count: products.length,
    products,
  }, null, 2), "utf-8");

  console.log(`\n✓ ${products.length} produits | ⊘ ${skipped} blacklist | ✗ ${ko} KO`);
  console.log(`→ ${OUT_FILE}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
