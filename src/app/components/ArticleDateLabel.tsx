"use client";

import { Fragment, useSyncExternalStore } from "react";

type ArticleDateLabelProps = {
  date: string;
  updated?: string;
  className?: string;
  format?: "short" | "long";
  showUpdated?: boolean;
  variant?: "default" | "posted";
};

function getParisDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function subscribeToDateChange(onStoreChange: () => void): () => void {
  const interval = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(interval);
}

function getCurrentHour(): number {
  return Math.floor(Date.now() / 3_600_000);
}

function getServerHour(): null {
  return null;
}

function formatDate(date: string, format: "short" | "long"): string {
  const normalizedDate = date.includes("T") ? date : `${date}T12:00:00`;
  return new Date(normalizedDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: format === "long" ? "long" : "short",
    ...(format === "long" ? { year: "numeric" } : {}),
    timeZone: "Europe/Paris",
  });
}

function calendarDayDifference(from: string, to: string): number {
  const toUtc = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((toUtc(to) - toUtc(from)) / 86_400_000);
}

function formatPostedLabel(value: string, now: Date | null): string {
  if (!now) return `Posté le ${formatDate(value, "short")}`;

  const publishedDay = value.slice(0, 10);
  const today = getParisDateKey(now);
  const daysAgo = calendarDayDifference(publishedDay, today);
  const includesTime = /T\d{2}:\d{2}/.test(value);

  if (includesTime) {
    const publishedAt = new Date(value);
    const hoursAgo = Math.floor((now.getTime() - publishedAt.getTime()) / 3_600_000);
    if (hoursAgo >= 0 && hoursAgo < 24) {
      return `Posté il y a ${Math.max(1, hoursAgo)} h`;
    }
  }

  if (daysAgo === 0) return "Posté aujourd’hui";
  if (daysAgo > 0 && daysAgo < 7) return `Posté il y a ${daysAgo} j`;
  return `Posté le ${formatDate(value, "short")}`;
}

export default function ArticleDateLabel({
  date,
  updated,
  className,
  format = "short",
  showUpdated = false,
  variant = "default",
}: ArticleDateLabelProps) {
  const currentHour = useSyncExternalStore(subscribeToDateChange, getCurrentHour, getServerHour);
  const now = currentHour === null ? null : new Date(currentHour * 3_600_000);
  const today = now ? getParisDateKey(now) : null;

  if (variant === "posted") {
    const displayedDate = updated || date;
    return <time className={className} dateTime={displayedDate}>{formatPostedLabel(displayedDate, now)}</time>;
  }

  if (today && updated === today) {
    return <time className={className} dateTime={updated}>Mis à jour ce jour</time>;
  }

  if (today && date === today) {
    return <time className={className} dateTime={date}>Publié aujourd&apos;hui</time>;
  }

  return (
    <Fragment>
      <time className={className} dateTime={date}>{formatDate(date, format)}</time>
      {showUpdated && updated ? (
        <span className="article-date-updated">
          (mis à jour le {formatDate(updated, "long")})
        </span>
      ) : null}
    </Fragment>
  );
}
