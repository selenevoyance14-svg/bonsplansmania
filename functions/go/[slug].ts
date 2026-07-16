// Cloudflare Pages Function — redirection affiliée cachée
// Requête : /go/<article-slug> → 302 vers le vrai lien affilié
// Le vrai lien vit UNIQUEMENT côté serveur (mapping compilé au build),
// jamais dans le HTML public.

import mapping from "../data/affiliate-mapping.json";

type MappingRecord = { url: string; label?: string };
const MAP = mapping as Record<string, MappingRecord>;

export const onRequest: PagesFunction = async ({ params }) => {
  const slug = String(params.slug || "").trim();
  const entry = MAP[slug];

  if (!entry?.url) {
    // Slug inconnu → renvoie l'utilisateur vers l'article correspondant s'il existe
    // sinon vers la home. Jamais d'erreur brute côté visiteur.
    const fallback = slug ? `/article/${slug}` : "/";
    return Response.redirect(new URL(fallback, "https://bonsplansmania.fr").toString(), 302);
  }

  // Cache court côté CDN : la destination peut changer sans purge lourde
  return new Response(null, {
    status: 302,
    headers: {
      Location: entry.url,
      "Cache-Control": "public, max-age=300",
      "Referrer-Policy": "no-referrer-when-downgrade",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
};
