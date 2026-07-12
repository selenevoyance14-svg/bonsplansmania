import { redirect } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/articles";

const MOIS_FR = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre",
];

function resolveSlug(): string {
  const now = new Date();
  const mois = MOIS_FR[now.getMonth()];
  const annee = now.getFullYear();
  const targetSlug = `meilleurs-bons-plans-beaute-${mois}-${annee}`;

  if (getArticleBySlug(targetSlug)) return targetSlug;

  const fallback = getAllArticles()
    .filter((a) => a.meta.slug.startsWith("meilleurs-bons-plans-beaute-"))
    .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1))[0];

  return fallback ? fallback.meta.slug : "meilleurs-bons-plans-beaute-juin-2026";
}

export const dynamic = "force-dynamic";

export default function Page() {
  redirect(`/article/${resolveSlug()}`);
}
