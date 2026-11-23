import assert from "node:assert/strict";
import { replaceExactAffiliateUrl } from "../src/lib/affiliate-content-links";
const root = "https://jeu.example/";
assert.equal(replaceExactAffiliateUrl(`[Jouer](${root}) [Règlement](${root}reglement.pdf)`, root, "/go/jeu"), "[Jouer](/go/jeu) [Règlement](https://jeu.example/reglement.pdf)");
const url = "https://merchant.example/?id=1&tag=partner";
for (const variant of [url, url.replaceAll("&", "\\&"), url.replaceAll("&", "&amp;")]) {
  assert.equal(replaceExactAffiliateUrl(`<a href="${variant}">Offre</a>`, url, "/go/offre"), '<a href="/go/offre">Offre</a>');
}
assert.equal(replaceExactAffiliateUrl(`[Autre](${url}&variant=2)`, url, "/go/offre"), `[Autre](${url}&variant=2)`);
console.log("Affiliate URL replacement regression checks passed");
