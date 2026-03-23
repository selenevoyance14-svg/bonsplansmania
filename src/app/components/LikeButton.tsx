"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ slug }: { slug: string }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const hasLiked = localStorage.getItem(`liked:${slug}`) === "1";
    setLiked(hasLiked);
  }, [slug]);

  function handleLike() {
    if (liked) return;
    setLiked(true);
    localStorage.setItem(`liked:${slug}`, "1");
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      aria-label={liked ? "Vous avez aimé cet article" : "J'aime cet article"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 16px",
        borderRadius: "999px",
        border: `2px solid ${liked ? "var(--primary)" : "var(--border, #e5e7eb)"}`,
        background: liked ? "var(--primary)" : "transparent",
        color: liked ? "white" : "var(--text-muted, #6b7280)",
        cursor: liked ? "default" : "pointer",
        fontSize: "0.9rem",
        fontWeight: 600,
        transition: "all 0.2s",
      }}
    >
      <Heart size={16} fill={liked ? "currentColor" : "none"} />
      {liked ? "Aimé !" : "J'aime"}
    </button>
  );
}
