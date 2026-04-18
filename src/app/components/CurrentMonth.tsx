"use client";

export default function CurrentMonth() {
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const now = new Date();
  return <span>{months[now.getMonth()]} {now.getFullYear()}</span>;
}
