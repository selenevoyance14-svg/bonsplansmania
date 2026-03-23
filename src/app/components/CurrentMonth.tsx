"use client";

import { useState, useEffect } from "react";

export default function CurrentMonth() {
  const [month, setMonth] = useState("");

  useEffect(() => {
    const now = new Date();
    const display = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "Europe/Paris" });
    setMonth(display.charAt(0).toUpperCase() + display.slice(1));
  }, []);

  return <>{month}</>;
}
