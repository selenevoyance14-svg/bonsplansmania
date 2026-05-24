#!/usr/bin/env node
/**
 * Test rapide PA-API : appelle GetItems sur un ou plusieurs ASINs.
 *
 * Usage :
 *   node scripts/paapi-test.mjs                       # ASIN par défaut
 *   node scripts/paapi-test.mjs B0CWGFW8P6 B08N5WRWNW # plusieurs ASINs
 *
 * Variables d'environnement requises :
 *   AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG
 *   AMAZON_MARKETPLACE  (optionnel, défaut: www.amazon.fr)
 */

import { getItems } from "./lib/amazon-paapi.mjs";

const asins = process.argv.slice(2);
if (asins.length === 0) asins.push("B0CWGFW8P6");

const creds = {
  accessKey: process.env.AMAZON_ACCESS_KEY,
  secretKey: process.env.AMAZON_SECRET_KEY,
  partnerTag: process.env.AMAZON_PARTNER_TAG,
  marketplace: process.env.AMAZON_MARKETPLACE || "www.amazon.fr",
};

const missing = Object.entries(creds)
  .filter(([k, v]) => k !== "marketplace" && !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(`✗ Variables manquantes : ${missing.join(", ")}`);
  process.exit(2);
}

console.log(`→ GetItems sur ${asins.join(", ")} (${creds.marketplace})`);

try {
  const res = await getItems({ ...creds, asins });
  console.log(`HTTP ${res.statusCode}`);

  if (res.statusCode === 403 && typeof res.body === "string" && res.body.includes("not in allowlist")) {
    console.error(`✗ Host bloqué par l'allowlist réseau de l'environnement.`);
    console.error(`  → Ajoute webservices.amazon.fr à la policy réseau.`);
    process.exit(3);
  }

  if (res.statusCode !== 200) {
    console.error("✗ Réponse non-200 :");
    console.error(JSON.stringify(res.body, null, 2));
    process.exit(1);
  }

  const items = res.body?.ItemsResult?.Items ?? [];
  const errors = res.body?.Errors ?? [];

  for (const it of items) {
    const title = it.ItemInfo?.Title?.DisplayValue ?? "(sans titre)";
    const price = it.Offers?.Listings?.[0]?.Price?.DisplayAmount ?? "—";
    const rating = it.CustomerReviews?.StarRating?.Value ?? "—";
    const reviews = it.CustomerReviews?.Count ?? "—";
    console.log(`\n✓ ${it.ASIN}`);
    console.log(`  titre  : ${title}`);
    console.log(`  prix   : ${price}`);
    console.log(`  note   : ${rating} (${reviews} avis)`);
    console.log(`  lien   : ${it.DetailPageURL}`);
  }
  for (const e of errors) {
    console.log(`\n! ${e.Code} : ${e.Message}`);
  }
} catch (err) {
  if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
    console.error(`✗ DNS impossible (${err.code}) — host bloqué ou réseau coupé.`);
    process.exit(3);
  }
  console.error(`✗ ${err.message}`);
  process.exit(1);
}
