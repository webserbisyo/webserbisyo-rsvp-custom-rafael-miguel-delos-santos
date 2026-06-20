export function field(content: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = content[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function records(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object" && !Array.isArray(item)))
    : [];
}

export function names(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}
