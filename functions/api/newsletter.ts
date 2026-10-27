const unavailable = () => Response.json(
  { error: "Le service d’inscription est momentanément indisponible. Réessayez dans quelques minutes." },
  { status: 503, headers: { "Cache-Control": "no-store" } },
);

export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const upstream = await fetch("https://bonsplansmania-newsletter.selenevoyance14.workers.dev/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      signal: AbortSignal.timeout(20000),
    });
    const data = await upstream.json().catch(() => null) as { success?: boolean; already?: boolean; error?: string } | null;
    if (!data || (upstream.ok && data.success !== true && data.already !== true)) return unavailable();
    return Response.json(
      upstream.ok ? { success: true, already: data.already === true } : { error: data.error || "L’inscription a échoué. Réessayez dans un instant." },
      { status: upstream.status, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return unavailable();
  }
};
