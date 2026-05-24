/**
 * Client minimal pour Amazon Product Advertising API 5 (PA-API 5).
 * Signature AWS SigV4, zéro dépendance externe.
 *
 * Doc officielle :
 *   https://webservices.amazon.com/paapi5/documentation/
 *
 * Marketplace par défaut : Amazon.fr (host webservices.amazon.fr, region eu-west-1).
 */

import crypto from "crypto";
import https from "https";

const MARKETPLACES = {
  "www.amazon.fr": { host: "webservices.amazon.fr", region: "eu-west-1" },
  "www.amazon.com": { host: "webservices.amazon.com", region: "us-east-1" },
  "www.amazon.co.uk": { host: "webservices.amazon.co.uk", region: "eu-west-1" },
  "www.amazon.de": { host: "webservices.amazon.de", region: "eu-west-1" },
  "www.amazon.es": { host: "webservices.amazon.es", region: "eu-west-1" },
  "www.amazon.it": { host: "webservices.amazon.it", region: "eu-west-1" },
};

const SERVICE = "ProductAdvertisingAPI";
const ALGORITHM = "AWS4-HMAC-SHA256";

const sha256Hex = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
const hmac = (key, data) => crypto.createHmac("sha256", key).update(data, "utf8").digest();

function signingKey(secret, dateStamp, region) {
  const kDate = hmac("AWS4" + secret, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, SERVICE);
  return hmac(kService, "aws4_request");
}

function isoTimestamps(now = new Date()) {
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return { amzDate: iso, dateStamp: iso.slice(0, 8) };
}

/**
 * Appel signé SigV4 à PA-API.
 *
 * @param {object} opts
 * @param {string} opts.accessKey            AMAZON_ACCESS_KEY
 * @param {string} opts.secretKey            AMAZON_SECRET_KEY
 * @param {string} opts.partnerTag           AMAZON_PARTNER_TAG (ex: lebrunnathali-21)
 * @param {string} [opts.marketplace]        ex: "www.amazon.fr" (défaut)
 * @param {"GetItems"|"SearchItems"|"GetBrowseNodes"|"GetVariations"} opts.operation
 * @param {object} opts.payload              Corps de la requête PA-API
 * @returns {Promise<{statusCode:number, body:any, headers:object}>}
 */
export async function callPaApi({
  accessKey,
  secretKey,
  partnerTag,
  marketplace = "www.amazon.fr",
  operation,
  payload,
}) {
  if (!accessKey || !secretKey || !partnerTag) {
    throw new Error("Identifiants PA-API manquants (accessKey/secretKey/partnerTag).");
  }
  const mp = MARKETPLACES[marketplace];
  if (!mp) throw new Error(`Marketplace non supporté : ${marketplace}`);

  const path = `/paapi5/${operation.toLowerCase()}`;
  const target = `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`;

  const body = JSON.stringify({
    ...payload,
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: marketplace,
  });

  const { amzDate, dateStamp } = isoTimestamps();
  const payloadHash = sha256Hex(body);

  const headers = {
    "content-encoding": "amz-1.0",
    "content-type": "application/json; charset=utf-8",
    "host": mp.host,
    "x-amz-date": amzDate,
    "x-amz-target": target,
  };

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders =
    signedHeaderNames.map((n) => `${n}:${headers[n]}\n`).join("");
  const signedHeaders = signedHeaderNames.join(";");

  const canonicalRequest = [
    "POST",
    path,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${mp.region}/${SERVICE}/aws4_request`;
  const stringToSign = [
    ALGORITHM,
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signature = crypto
    .createHmac("sha256", signingKey(secretKey, dateStamp, mp.region))
    .update(stringToSign, "utf8")
    .digest("hex");

  const authorization =
    `${ALGORITHM} Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: "POST",
        host: mp.host,
        path,
        headers: { ...headers, Authorization: authorization },
        timeout: 20000,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf-8");
          let parsed;
          try { parsed = JSON.parse(raw); } catch { parsed = raw; }
          resolve({ statusCode: res.statusCode, body: parsed, headers: res.headers });
        });
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(new Error("PA-API timeout")); });
    req.write(body);
    req.end();
  });
}

/**
 * Helper GetItems : récupère 1..10 ASINs en un appel.
 *
 * @param {object} opts                Identifiants (cf. callPaApi)
 * @param {string[]} opts.asins        1..10 ASINs
 * @param {string[]} [opts.resources]  Ressources PA-API à demander
 */
export function getItems({ asins, resources, ...creds }) {
  if (!Array.isArray(asins) || asins.length === 0 || asins.length > 10) {
    throw new Error("getItems : 1 à 10 ASINs requis.");
  }
  const defaultResources = [
    "Images.Primary.Large",
    "Images.Primary.Medium",
    "ItemInfo.Title",
    "ItemInfo.Features",
    "ItemInfo.ByLineInfo",
    "Offers.Listings.Price",
    "Offers.Listings.SavingBasis",
    "Offers.Listings.Promotions",
    "CustomerReviews.Count",
    "CustomerReviews.StarRating",
  ];
  return callPaApi({
    ...creds,
    operation: "GetItems",
    payload: {
      ItemIds: asins,
      Resources: resources ?? defaultResources,
    },
  });
}
