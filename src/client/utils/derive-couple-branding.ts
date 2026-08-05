/**
 * Derive Couple Branding Utility
 *
 * Pure, deterministic, SSR-safe helper that derives couple monogram initials,
 * couple display label, and copyright year from connected event data.
 */

export type DeriveCoupleBrandingInput = {
  partnerOneName?: string | null;
  partnerTwoName?: string | null;
  displayAs?: string | null;
  weddingDate?: string | null;
};

export type DerivedCoupleBranding = {
  monogram: readonly [string, string] | null;
  coupleLabel: string;
  copyrightYear: string;
};

const COMMON_TITLES = new Set(["dr", "mr", "mrs", "ms", "prof", "rev", "atty", "engr", "hon"]);

/** Helper to strip common honorifics/titles from a name string */
function stripTitle(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1 && COMMON_TITLES.has(parts[0].toLowerCase().replace(/\./g, ""))) {
    return parts.slice(1).join(" ");
  }
  return name.trim();
}

/** Extracts the first uppercase letter or Unicode character from a string */
function extractFirstLetter(str: string): string | null {
  const clean = stripTitle(str);
  // Match first letter character (Unicode aware)
  const match = clean.match(/[\p{L}]/u);
  return match ? match[0].toUpperCase() : null;
}

/** Attempts to parse two partner initials from a combined string like "John & Dianne" */
function parseDisplayAsInitials(displayAs: string): readonly [string, string] | null {
  const clean = displayAs.trim();
  if (!clean) return null;

  // Split on common couple name delimiters: &, and, +, /
  const segments = clean.split(/\s+(?:&|and|\+|\/)\s+/i);
  if (segments.length === 2) {
    const first = extractFirstLetter(segments[0]);
    const second = extractFirstLetter(segments[1]);
    if (first && second) {
      return [first, second];
    }
  }
  return null;
}

/** Extracts a 4-digit year from a date string (e.g. ISO string or formatted date) */
function extractCopyrightYear(weddingDate?: string | null): string {
  if (weddingDate) {
    const match = weddingDate.match(/\b(20\d{2})\b/);
    if (match) {
      return match[1];
    }
  }
  // Default to current year if event date is missing or malformed
  return new Date().getFullYear().toString();
}

export function deriveCoupleBranding(input?: DeriveCoupleBrandingInput | null): DerivedCoupleBranding {
  const partnerOne = input?.partnerOneName?.trim() || "";
  const partnerTwo = input?.partnerTwoName?.trim() || "";
  const displayAs = input?.displayAs?.trim() || "";
  const weddingDate = input?.weddingDate?.trim() || "";

  // 1. Derive couple label
  let coupleLabel = "";
  if (displayAs) {
    coupleLabel = displayAs;
  } else if (partnerOne && partnerTwo) {
    coupleLabel = `${partnerOne} & ${partnerTwo}`;
  } else if (partnerOne || partnerTwo) {
    coupleLabel = partnerOne || partnerTwo;
  }

  // 2. Derive initials monogram
  let monogram: readonly [string, string] | null = null;

  if (partnerOne && partnerTwo) {
    const init1 = extractFirstLetter(partnerOne);
    const init2 = extractFirstLetter(partnerTwo);
    if (init1 && init2) {
      monogram = [init1, init2];
    }
  }

  if (!monogram && displayAs) {
    monogram = parseDisplayAsInitials(displayAs);
  }

  // 3. Derive copyright year
  const copyrightYear = extractCopyrightYear(weddingDate);

  return {
    monogram,
    coupleLabel,
    copyrightYear,
  };
}
