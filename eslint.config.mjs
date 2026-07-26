import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // Le site est exporté statiquement et utilise volontairement des ancres
      // natives pour éviter d'embarquer le routeur client sur chaque carte.
      "@next/next/no-html-link-for-pages": "off",
      // Le contenu éditorial français contient naturellement des apostrophes.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: [
      "src/app/article/**/page.tsx",
      "src/app/bons-plans-en-cours/page.tsx",
    ],
    rules: {
      // Date.now() est évalué pendant la génération statique, pas dans un
      // composant client réactif.
      "react-hooks/purity": "off",
    },
  },
  {
    files: ["src/app/components/NewsletterInline.tsx"],
    rules: {
      // Hydratation volontaire de l'état d'abonnement depuis localStorage.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    ".open-next/**",
    "public/**",
    "scripts/output/**",
    "next-env.d.ts",
  ]),
]);
