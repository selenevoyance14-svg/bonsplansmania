import { NextResponse } from "next/server";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";

// Le site est exporté en statique : la liste est régénérée à chaque publication.
export const dynamic = "force-static";

const BLOCKED_IMAGES = new Set([
  "/images/articles/_placeholder-bonsplansmania.png",
  "/images/articles/_placeholder-neutral.svg",
  "/images/articles/_placeholder-bonsplansmania-beige.png",
  "/images/articles/_archive-concours-termine.png",
  "/images/articles/_archive-test-produit-termine.png",
  "/images/articles/_archive-offre-expiree.png",
]);

export function GET() {
  const now = Date.now();
  const maximumAge = 10 * 24 * 60 * 60 * 1000;

  const articles = getAllArticles()
    .filter(({ meta }) => !isEffectivelyExpired(meta) && !meta.noindex)
    .filter(({ meta }) => meta.image && !BLOCKED_IMAGES.has(meta.image))
    .filter(({ meta }) => {
      const date = new Date(meta.updated || meta.date).getTime();
      return Number.isFinite(date) && now - date <= maximumAge;
    })
    .slice(0, 30)
    .map(({ meta }) => ({
      slug: meta.slug,
      title: meta.title,
      description: meta.description,
      date: meta.updated || meta.date,
      category: meta.category,
      image: new URL(meta.image, "https://bonsplansmania.fr").toString(),
      url: `https://bonsplansmania.fr/article/${meta.slug}`,
      affiliate: Boolean(meta.affiliateUrl),
      endDate: meta.endDate || null,
    }));

  return NextResponse.json(
    { generatedAt: new Date().toISOString(), articles },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
