"use client";

import { Fragment, useSyncExternalStore } from "react";

type ArticleDateLabelProps = {
  date: string;
  updated?: string;
  className?: string;
  format?: "short" | "long";
  showUpdated?: boolean;
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

function getCurrentParisDate(): string {
  return getParisDateKey(new Date());
}

function getServerDate(): null {
  return null;
}

function formatDate(date: string, format: "short" | "long"): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: format === "long" ? "long" : "short",
    ...(format === "long" ? { year: "numeric" } : {}),
    timeZone: "Europe/Paris",
  });
}

export default function ArticleDateLabel({
  date,
  updated,
  className,
  format = "short",
  showUpdated = false,
}: ArticleDateLabelProps) {
  const today = useSyncExternalStore(subscribeToDateChange, getCurrentParisDate, getServerDate);

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
