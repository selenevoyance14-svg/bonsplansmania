export interface ParsedPrice {
  now?: string;
  was?: string;
  nowAmount?: number;
  wasAmount?: number;
  discountPct?: number;
  savings?: string;
  savingsEur?: string;
}

const LEADING_EURO_AMOUNT =
  /^[(]?\s*(\d{1,3}(?:[\s\u00a0]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*€/;
const EXPLICIT_DISCOUNT = /[-−]\s*(\d{1,3})\s*%/;

function parseLeadingEuroAmount(text: string): {
  amount?: number;
  label?: string;
} {
  const match = text.trim().match(LEADING_EURO_AMOUNT);
  if (!match) return {};

  const amount = Number.parseFloat(
    match[1].replace(/[\s\u00a0]/g, "").replace(",", "."),
  );

  return {
    amount: Number.isFinite(amount) ? amount : undefined,
    label: match[0].replace(/^\(/, "").trim(),
  };
}

/**
 * Parse les formats éditoriaux du type :
 * "79,90 € au lieu de 149 € (-46 %)".
 *
 * Le prix barré est lu uniquement au début de la seconde partie afin que le
 * pourcentage ou le montant d'économie ne soit jamais concaténé au prix.
 */
export function parsePrice(raw?: string): ParsedPrice {
  if (!raw) return {};

  const value = raw.trim();
  const explicitMatch = value.match(EXPLICIT_DISCOUNT);
  const explicitDiscount = explicitMatch
    ? Number.parseInt(explicitMatch[1], 10)
    : undefined;
  const validExplicitDiscount =
    explicitDiscount !== undefined &&
    explicitDiscount > 0 &&
    explicitDiscount <= 100
      ? explicitDiscount
      : undefined;

  const parts = value.match(/^(.+?)\s*au lieu de\s*(.+?)$/i);
  if (!parts) {
    const current = parseLeadingEuroAmount(value);
    return {
      now: value,
      nowAmount: current.amount,
      discountPct: validExplicitDiscount,
      savings:
        validExplicitDiscount !== undefined
          ? `−${validExplicitDiscount}%`
          : undefined,
    };
  }

  const now = parts[1].trim();
  const rawWas = parts[2].trim();
  const current = parseLeadingEuroAmount(now);
  const previous = parseLeadingEuroAmount(rawWas);

  let discountPct = validExplicitDiscount;
  if (
    discountPct === undefined &&
    current.amount !== undefined &&
    previous.amount !== undefined &&
    previous.amount > current.amount
  ) {
    discountPct = Math.round(
      ((previous.amount - current.amount) / previous.amount) * 100,
    );
  }

  const savingsAmount =
    current.amount !== undefined &&
    previous.amount !== undefined &&
    previous.amount > current.amount
      ? previous.amount - current.amount
      : undefined;

  return {
    now,
    was: previous.label ?? rawWas,
    nowAmount: current.amount,
    wasAmount: previous.amount,
    discountPct,
    savings: discountPct !== undefined ? `−${discountPct}%` : undefined,
    savingsEur:
      savingsAmount !== undefined
        ? `−${savingsAmount.toFixed(2).replace(".", ",")}€`
        : undefined,
  };
}
