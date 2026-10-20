import assert from "node:assert/strict";
import {
  getArticleBySlug,
  sanitizeAmazonClaims,
  sanitizeAmazonContent,
} from "../src/lib/articles";

const cases = [
  {
    input: "Amazon Prime : l’arbre à chat Hey-brother de 184 cm tombe à 85,49 €",
    expected: "Amazon Prime: l’arbre à chat Hey-brother de 184 cm est en promotion sur Amazon",
  },
  {
    input: "L’arbre à chat passe à 85,49 € au lieu de 129,99 € chez Amazon.",
    expected: "L’arbre à chat est disponible sur Amazon.",
  },
  {
    input: "Le modèle est proposé à 85,49 € au lieu de 129,99 €, soit 34 % d’économie.",
    expected: "Le modèle est disponible sur Amazon.",
  },
  {
    input: "Le prix de 85,49 € apparaît intéressant face à son prix normal de 129,99 €.",
    expected: "Le tarif affiché sur Amazon apparaît intéressant par rapport au prix de comparaison affiché sur Amazon.",
  },
];

for (const { input, expected } of cases) {
  assert.equal(sanitizeAmazonClaims(input), expected);
}

assert.equal(
  sanitizeAmazonContent("| **Prix Prime constaté** | 85,49 € |"),
  "| Prix Prime constaté | Voir le prix actuel sur Amazon |"
);

const article = getArticleBySlug(
  "bon-plan-amazon-arbre-chat-hey-brother-184cm-prime-2026"
);
assert.ok(article, "L’article de contrôle Amazon doit être trouvé");
assert.equal(
  article.meta.title,
  "Amazon Prime: l’arbre à chat Hey-brother de 184 cm en promotion"
);
assert.doesNotMatch(article.content, /\b(?:tombe|passe|est proposé)\s*[.,;:!?]?\s*$/gimu);
assert.doesNotMatch(article.content, /\b(?:prix|tarif)\s+(?:normal|conseillé)?\s*de\s*[.,;:!?]/giu);

console.log(`Amazon sanitizer: ${cases.length + 4} régressions vérifiées.`);
