import { SmartImage } from "@/components/media/SmartImage";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import type { PublicMediaAsset } from "@/types/public-event";

type AssetFrameProps = {
  asset?: PublicMediaAsset | null;
  alt: string;
  label: string;
  source: "design" | "snapshot" | "live";
  sensitive?: boolean;
  className?: string;
};

export function AssetFrame({ asset, alt, label, source, sensitive = false, className = "" }: AssetFrameProps) {
  if (!asset) return <MediaPlaceholder label={label} sensitive={sensitive} source={source} />;

  return (
    <div className={`overflow-hidden rounded-md border border-border bg-surface shadow-soft ${className}`}>
      <SmartImage alt={alt} asset={asset} />
    </div>
  );
}
