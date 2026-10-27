// Local storage is an optional convenience, never evidence of API success.
export function hasNewsletterSubscription(): boolean {
  try { return localStorage.getItem("bpm_subscribed") === "true"; }
  catch { return false; }
}

export async function subscribeNewsletter(email: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    throw new Error("Impossible de joindre le service d’inscription. Réessayez dans quelques minutes.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success !== true) {
    throw new Error(data?.error || "L’inscription n’a pas pu être confirmée. Réessayez dans un instant.");
  }
  try {
    localStorage.setItem("bpm_newsletter_email", email.trim());
    localStorage.setItem("bpm_subscribed", "true");
  } catch {
    // Private browsing or blocked storage must not hide a successful signup.
  }
}
