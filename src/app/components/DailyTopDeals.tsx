import type { Article } from "@/lib/articles";
import ArticleCard from "@/app/components/ArticleCard";

type HomeDeal = Pick<Article, "meta">;

// Le tirage se faisait côté navigateur, à partir de la date du jour. Résultat :
// le HTML statique — celui que Google indexe et celui qui s'affiche avant
// hydratation — montrait toujours les 4 mêmes articles, et la rotation ne se
// voyait qu'une fois le JS chargé. On tire désormais au build (02/08/2026) :
// la sélection change à chaque déploiement et elle est visible dès le HTML.
function hashSeed(seed: string): number {
  let value = 2166136261;
  for (const character of seed) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function selectDeals(candidates: HomeDeal[], seed: string, count: number): HomeDeal[] {
  const shuffled = [...candidates];
  let state = hashSeed(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = Math.imul(state ^ (state >>> 15), 1 | state) >>> 0;
    state = (state ^ (state + Math.imul(state ^ (state >>> 7), 61 | state))) >>> 0;
    const random = ((state ^ (state >>> 14)) >>> 0) / 4_294_967_296;
    const swapIndex = Math.floor(random * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

export default function DailyTopDeals({
  candidates,
  seed,
}: {
  candidates: HomeDeal[];
  seed: string;
}) {
  const deals = selectDeals(candidates, seed, 4);

  return (
    <div className="articles-grid articles-grid-4">
      {deals.map((article, index) => (
        <ArticleCard
          key={article.meta.slug}
          article={article}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
