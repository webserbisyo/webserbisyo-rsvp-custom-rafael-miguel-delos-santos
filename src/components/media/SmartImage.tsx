/* eslint-disable @next/next/no-img-element -- Provider-specific next/image remotePatterns are added only after the platform CDN contract is known. */
import { assetAlt, assetUrl } from "@/lib/assets";
import type { PublicMediaAsset } from "@/types/public-event";

type SmartImageProps = {
  asset: PublicMediaAsset;
  alt?: string;
  className?: string;
};

export function SmartImage({ asset, alt, className = "" }: SmartImageProps) {
  const src = assetUrl(asset);
  if (!src) return null;

  return (
    <img
      alt={alt ?? assetAlt(asset, "Event image")}
      className={`h-full w-full object-cover ${className}`}
      loading="lazy"
      src={src}
    />
  );
}
