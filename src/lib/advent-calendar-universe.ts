export type AdventCalendarUniverse =
  | "beaute"
  | "enfant"
  | "jouets-loisirs"
  | "gourmand"
  | "homme"
  | "maison-bien-etre"
  | "animaux";

interface AdventCalendarMetadata {
  title: string;
  slug: string;
  tags?: string[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]/g, " ");
}

/**
 * Attribue un seul univers à chaque calendrier.
 *
 * Les anciens filtres cherchaient des fragments dans tout le titre et la
 * description. Un LEGO Friends devenait ainsi un calendrier « animaux » à
 * cause de ses six figurines, tandis que « The Mandalorian » déclenchait le
 * mot-clé « thé ». Ici, les univers sont exclusifs et reposent d'abord sur le
 * sujet principal du calendrier.
 */
export function getAdventCalendarUniverse({
  title,
  slug,
  tags = [],
}: AdventCalendarMetadata): AdventCalendarUniverse {
  const primaryText = normalize(`${title} ${slug}`);
  const tagText = normalize(tags.join(" "));
  const allText = `${primaryText} ${tagText}`;
  const originalText = `${title} ${slug} ${tags.join(" ")}`.toLowerCase();

  // Les licences et marques de construction restent dans Jouets & loisirs,
  // même si leur contenu comporte des animaux, des soins ou des bonbons.
  if (/\b(lego|playmobil|schleich|cinereplicas|kpop|one piece|pokemon|barbie|hot wheels|figurine|puzzle)\b/.test(allText)
    || /\bjouet(s)?\b/.test(tagText)) {
    return "jouets-loisirs";
  }

  // Les calendriers de bières, vins et produits alimentaires sont prioritaires
  // sur « Homme », souvent présent uniquement comme idée cadeau secondaire.
  if (/\b(biere|bieres|vin|vins|chocolat|chocolats|confiserie|confiseries|bonbon|bonbons|biscuit|biscuits|gourmandise|gourmandises|cafe|cafes|alimentaire)\b/.test(allText)
    || /\b(thé|thés|tea)\b/.test(originalText)) {
    return "gourmand";
  }

  // On réserve Homme aux calendriers dont le positionnement principal le dit
  // dans le titre ou le slug, et non aux comparatifs mixtes qui citent un homme.
  if (/\b(homme|men|grooming|barbe|rasage)\b/.test(primaryText)) {
    return "homme";
  }

  // Maison correspond aux calendriers centrés sur la maison ou les bougies.
  // Une simple bougie parmi 24 soins (Rituals, par exemple) reste en Beauté.
  if (/\bmaison de noel\b/.test(primaryText) || /\bcalendrier(s)? (de l avent )?(de )?bougie(s)?\b/.test(primaryText) || /\b24 bougie(s)?\b/.test(primaryText)) {
    return "maison-bien-etre";
  }

  if (/\b(mademoiselle confettis|princesse|princesses|reine des neiges|frozen|pat patrouille|gabby|licorne|enfant|enfants|kids|junior|bebe)\b/.test(allText)) {
    return "enfant";
  }

  // Un calendrier pour animaux doit annoncer explicitement le chien, le chat ou
  // les animaux comme sujet principal. Les mentions accessoires sont ignorées.
  if (/\b(chien|chiens|chat|chats|animal|animaux)\b/.test(primaryText)) {
    return "animaux";
  }

  return "beaute";
}

/**
 * La plupart des calendriers appartiennent à un seul univers. Quelques produits
 * réellement transversaux peuvent toutefois être rangés dans deux sélections
 * lorsqu'il s'agit d'un choix éditorial explicite.
 */
export function getAdventCalendarUniverses(metadata: AdventCalendarMetadata): AdventCalendarUniverse[] {
  const primaryUniverse = getAdventCalendarUniverse(metadata);

  if (metadata.slug === "calendrier-avent-vin-la-boite-du-fromager-2026") {
    return ["gourmand", "homme"];
  }

  return [primaryUniverse];
}
