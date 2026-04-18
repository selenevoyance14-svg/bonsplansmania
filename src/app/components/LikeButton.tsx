"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ slug }: { slug: string }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const likes = JSON.parse(localStorage.getItem("bpm_likes") || "[]");
    setLiked(likes.includes(slug));
  }, [slug]);

  function toggle() {
    const likes: string[] = JSON.parse(localStorage.getItem("bpm_likes") || "[]");
    const updated = liked ? likes.filter((s) => s !== slug) : [...likes, slug];
    localStorage.setItem("bpm_likes", JSON.stringify(updated));
    setLiked(!liked);
  }

  return (
    <button
      onClick={toggle}
      aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "6px 14px", borderRadius: "20px", border: "1px solid var(--border, #e5e7eb)",
        background: liked ? "#FEE2E2" : "transparent", color: liked ? "#DC2626" : "var(--text-muted, #6b7280)",
        cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, transition: "all 0.2s",
      }}
    >
      <Heart size={14} fill={liked ? "#DC2626" : "none"} />
      {liked ? "Favori" : "Ajouter"}
    </button>
  );
}
