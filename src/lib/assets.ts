import type { PublicAssetSlot, PublicMediaAsset } from "@/types/public-event";

export const assetSlots: PublicAssetSlot[] = [
  "hero_background",
  "couple_photo",
  "venue_photo",
  "gallery_image",
  "gift_qr",
  "monogram",
  "section_decoration"
];

export function assetUrl(asset?: PublicMediaAsset | null): string {
  if (!asset) return "";
  const value = asset.url ?? asset.src;
  return typeof value === "string" ? value.trim() : "";
}

export function assetAlt(asset: PublicMediaAsset | undefined | null, fallback: string): string {
  if (!asset) return fallback;
  return typeof asset.alt === "string" && asset.alt.trim() ? asset.alt.trim() : fallback;
}

export function isKnownAssetSlot(slot: string): slot is PublicAssetSlot {
  return (assetSlots as string[]).includes(slot);
}

export function assetFromUnknown(value: unknown, slot?: PublicAssetSlot | string): PublicMediaAsset | null {
  if (typeof value === "string" && value.trim()) return { slot, url: value.trim() };
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const asset = value as PublicMediaAsset;
  const url = assetUrl(asset);
  if (!url) return null;
  return { ...asset, slot: asset.slot ?? slot, url };
}
