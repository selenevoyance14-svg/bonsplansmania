// Cloudflare Pages Function — redirection affiliée cachée
// Requête : /go/<article-slug> → 302 vers le vrai lien affilié
// Le vrai lien vit UNIQUEMENT côté serveur (mapping compilé au build),
// jamais dans le HTML public.

import mapping from "../data/affiliate-mapping.json";
import manualMapping from "../data/manual-affiliate-mapping.json";

type MappingRecord = {
  url: string;
  label?: string;
  startsAt?: string;
  endsAt?: string;
};

const generatedMap = mapping as Record<string, MappingRecord>;
const campaignMap = manualMapping as Record<string, MappingRecord>;
const collisions = Object.keys(campaignMap).filter((slug) => slug in generatedMap);

if (collisions.length > 0) {
  throw new Error(
    `[affiliate-mapping] Collision entre les mappings généré et manuel : ${collisions.join(", ")}`,
  );
}

const MAP: Record<string, MappingRecord> = {
  ...generatedMap,
  ...campaignMap,
};

function isEntryActive(entry: MappingRecord, referenceDate: Date): boolean {
  const referenceTime = referenceDate.getTime();
  const startTime = entry.startsAt ? Date.parse(entry.startsAt) : null;
  const endTime = entry.endsAt ? Date.parse(entry.endsAt) : null;

  if (startTime !== null && (!Number.isFinite(startTime) || referenceTime < startTime)) {
    return false;
  }
  if (endTime !== null && (!Number.isFinite(endTime) || referenceTime > endTime)) {
    return false;
  }
  return true;
}

export const onRequest: PagesFunction = async ({ params }) => {
  const slug = String(params.slug || "").trim();
  const entry = MAP[slug];

  if (!entry?.url) {
    // Slug inconnu → renvoie l'utilisateur vers l'article correspondant s'il existe
    // sinon vers la home. Jamais d'erreur brute côté visiteur.
    const fallback = slug ? `/article/${slug}` : "/";
    return Response.redirect(new URL(fallback, "https://bonsplansmania.fr").toString(), 302);
  }

  const destination = isEntryActive(entry, new Date())
    ? entry.url
    : "https://bonsplansmania.fr/";

  // Cache court côté CDN : la destination peut changer sans purge lourde
  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      "Cache-Control": "public, max-age=300",
      "Referrer-Policy": "no-referrer-when-downgrade",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
};
