import { matchesSeasonalKeywords } from "./seasonal-match";

type SummerMeta = { title: string; tags?: string[] };

// Generic seasonal tags and advertising copy do not identify a product's use.
// Classify by the title and a small set of explicit product tags only.
export function getSummerThemes(meta: SummerMeta): string[] {
  const title = meta.title;
  const tags = new Set((meta.tags ?? []).map((tag) => tag.toLowerCase()));
  const matches = (words: string[]) => matchesSeasonalKeywords(title, words);
  const themes: string[] = [];
  if (matches(["creme solaire", "lait solaire", "spray solaire", "protection solaire", "protections solaires", "stick solaire", "fluide solaire", "ecran solaire", "spf 50", "spf 30", "spf50", "spf30", "apres soleil"]) || tags.has("creme-solaire") || tags.has("protection-solaire")) themes.push("solaires");
  if (matches(["autobronzant", "auto-bronzant"])) themes.push("autobronzants");
  if (matches(["ventilateur", "climatiseur", "climatisation", "brumisateur"])) themes.push("anti-canicule");
  if (matches(["parasol", "tente de camping", "tente camping", "tente plage", "tente de plage", "matelas camping", "matelas de camping", "sac de couchage", "glaciere", "maillot de bain", "piscine", "mobil-home", "sejour camping", "vacances camping", "camping 4", "camping 5", "sejour ete", "vacances ete"]) || tags.has("tente-plage")) themes.push("vacances");
  const baby = matches(["bebe", "enfant", "badabulle"]) || tags.has("bebe");
  if (baby && (matches(["anti-uv", "maillot", "couche de bain", "couches de bain", "couches piscine", "brassard", "bouee", "piscine", "tente plage"]) || tags.has("couches-bain") || tags.has("tente-anti-uv"))) themes.push("bebe-ete");
  return themes;
}
