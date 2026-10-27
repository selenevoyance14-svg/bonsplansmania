const ALERTS_URL = "https://bonsplansmania-alerts.selenevoyance14.workers.dev/alerts";
const unavailable = () => Response.json(
  { error: "Le service d’alertes est momentanément indisponible. Réessayez dans quelques minutes." },
  { status: 503, headers: { "Cache-Control": "no-store" } },
);

export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const upstream = await fetch(ALERTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Preserve the existing per-visitor rate limit through the proxy.
        "CF-Connecting-IP": request.headers.get("CF-Connecting-IP") || "unknown",
      },
      body: await request.text(),
      signal: AbortSignal.timeout(20000),
    });
    const data = await upstream.json().catch(() => null) as { ok?: boolean; alreadyExists?: boolean; error?: string } | null;
    if (!data || (upstream.ok && data.ok !== true)) return unavailable();
    return Response.json(
      upstream.ok ? { ok: true, alreadyExists: data.alreadyExists === true } : { error: data.error || "Impossible de créer l’alerte pour le moment." },
      { status: upstream.status, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return unavailable();
  }
};
