/** Never expose HTML error pages or raw upstream bodies in the admin UI. */
export async function readAdminResponse<T>(response: Response): Promise<T> {
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error(`Le serveur a renvoyé une page inattendue (HTTP ${response.status}). Réessaie depuis bonsplansmania.fr, sans www.`);
  }
  try { return await response.json() as T; }
  catch { throw new Error(`Réponse du serveur illisible (HTTP ${response.status}).`); }
}
