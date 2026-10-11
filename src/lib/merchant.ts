const REDIRECT_PARAMS = ["ued", "url", "redir", "lp", "destination", "dest"];

const MERCHANTS: Array<[RegExp, string]> = [
  [/(^|\.)amazon\.fr$/i, "Amazon"],
  [/(^|\.)adopt\.com$/i, "Adopt"],
  [/(^|\.)lookfantastic\.fr$/i, "LOOKFANTASTIC"],
  [/(^|\.)beautysuccess\.fr$/i, "Beauty Success"],
  [/(^|\.)cdiscount\.com$/i, "Cdiscount"],
  [/(^|\.)carrefour\.fr$/i, "Carrefour"],
  [/(^|\.)yesstyle\.com$/i, "YesStyle"],
  [/(^|\.)prozis\.com$/i, "Prozis"],
  [/(^|\.)beaba\.com$/i, "Béaba"],
  [/(^|\.)greenweez\.com$/i, "Greenweez"],
  [/(^|\.)leanature\.com$/i, "Léa Nature"],
  [/(^|\.)laboratoires-biarritz\.com$/i, "Laboratoires de Biarritz"],
  [/(^|\.)mybeautyfactory\.fr$/i, "My Beauty Factory"],
  [/(^|\.)news-parfums\.com$/i, "News Parfums"],
  [/(^|\.)magnifaik\.com$/i, "Magnifaïk"],
  [/(^|\.)darty\.com$/i, "Darty"],
  [/(^|\.)zooplus\.fr$/i, "Zooplus"],
  [/(^|\.)electrodepot\.fr$/i, "Electro Dépôt"],
];

const TRACKING_HOSTS = /(?:awin1\.com|affilae\.com|effiliation\.com|metaffiliation\.com|publicidees\.com|time1\.me|tradedoubler\.com|tidd\.ly|c3po\.link)$/i;

function decodeRedirect(value: string): string {
  let current = value;

  for (let index = 0; index < 4; index += 1) {
    try {
      const parsed = new URL(current);
      const redirect = REDIRECT_PARAMS
        .map((param) => parsed.searchParams.get(param))
        .find((candidate): candidate is string => Boolean(candidate?.trim()));

      if (!redirect || !/^https?:\/\//i.test(redirect)) return current;
      current = redirect;
    } catch {
      return current;
    }
  }

  return current;
}

/** Retourne l'enseigne réelle, même lorsque le lien passe par un réseau d'affiliation. */
export function getMerchantName(affiliateUrl: unknown, explicitName?: unknown): string | undefined {
  if (typeof explicitName === "string" && explicitName.trim()) return explicitName.trim();
  if (typeof affiliateUrl !== "string" || !affiliateUrl.trim()) return undefined;

  try {
    const hostname = new URL(decodeRedirect(affiliateUrl.trim())).hostname
      .toLowerCase()
      .replace(/^www\./, "");
    const knownMerchant = MERCHANTS.find(([pattern]) => pattern.test(hostname));
    if (knownMerchant) return knownMerchant[1];
    if (hostname === "amzn.to" || hostname === "amzn.eu" || hostname === "link.amazon") return "Amazon";
    if (hostname === "ystyle.co") return "YesStyle";
    if (TRACKING_HOSTS.test(hostname)) return undefined;
    return hostname;
  } catch {
    return undefined;
  }
}
