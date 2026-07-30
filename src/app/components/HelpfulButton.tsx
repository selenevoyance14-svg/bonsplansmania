"use client";

import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";

const ENDPOINT =
  "https://bonsplansmania-newsletter.selenevoyance14.workers.dev/helpful";

export default function HelpfulButton({ id }: { id: string }) {
  const [count, setCount] = useState(0);
  const [voted, setVoted] = useState(false);
  const [sending, setSending] = useState(false);
  const storageKey = `bpm-helpful:${id}`;

  useEffect(() => {
    setVoted(localStorage.getItem(storageKey) === "1");
    fetch(`${ENDPOINT}?id=${encodeURIComponent(id)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count?: number } | null) => {
        if (typeof data?.count === "number") setCount(data.count);
      })
      .catch(() => undefined);
  }, [id, storageKey]);

  async function vote() {
    if (voted || sending) return;
    setSending(true);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("helpful");
      const data = (await response.json()) as { count: number };
      setCount(data.count);
      setVoted(true);
      localStorage.setItem(storageKey, "1");
    } catch {
      // Le bouton reste disponible pour une nouvelle tentative.
    } finally {
      setSending(false);
    }
  }

  return (
    <button
      className={`helpful-button${voted ? " is-voted" : ""}`}
      disabled={voted || sending}
      onClick={vote}
      type="button"
    >
      <ThumbsUp size={17} fill={voted ? "currentColor" : "none"} />
      {voted ? "Merci !" : "Utile"} <span>({count})</span>
    </button>
  );
}
