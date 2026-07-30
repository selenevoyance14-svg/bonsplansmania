"use client";

import { useSyncExternalStore } from "react";
import type { Article } from "@/lib/articles";
import ArticleCard from "@/app/components/ArticleCard";

type HomeDeal = Pick<Article, "meta">;

function subscribeToDayChange(onStoreChange: () => void): () => void {
  const interval = window.setInterval(onStoreChange, 60_000);
  window.addEventListener("focus", onStoreChange);

  return () => {
    window.clearInterval(interval);
    window.removeEventListener("focus", onStoreChange);
  };
}

function getCurrentDay(): string {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function hashDay(day: string): number {
  let value = 2166136261;
  for (const character of day) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function selectDailyDeals(candidates: HomeDeal[], day: string, count: number): HomeDeal[] {
  const shuffled = [...candidates];
  let state = hashDay(day);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    const random = ((state ^ (state >>> 14)) >>> 0) / 4_294_967_296;
    const swapIndex = Math.floor(random * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

export default function DailyTopDeals({ candidates }: { candidates: HomeDeal[] }) {
  const day = useSyncExternalStore(
    subscribeToDayChange,
    getCurrentDay,
    () => "server",
  );
  const deals = day === "server"
    ? candidates.slice(0, 4)
    : selectDailyDeals(candidates, day, 4);

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
