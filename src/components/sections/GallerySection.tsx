import { AssetFrame } from "@/components/media/AssetFrame";
import { field, records } from "@/components/sections/field-utils";
import { Section } from "@/components/ui/Section";
import { assetFromUnknown } from "@/lib/assets";
import type { WeddingSectionProps } from "@/components/sections/section-props";
import type { PublicMediaAsset } from "@/types/public-event";

function isAsset(value: PublicMediaAsset | null): value is PublicMediaAsset {
  return Boolean(value);
}

export function GallerySection({ section, event }: WeddingSectionProps) {
  const images = records(section.content.images ?? section.content.items ?? section.content.gallery)
    .map((image) => assetFromUnknown(image.image ?? image.asset ?? image.url ?? image.src ?? image, "gallery_image"))
    .filter(isAsset);

  if (event.source === "live" && images.length === 0) return null;

  return (
    <Section eyebrow="Gallery" title={field(section.content, ["title"]) || "Gallery"} className="bg-cream">
      {images.length ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {images.map((asset, index) => (
            <AssetFrame
              alt={asset.alt || `Gallery image ${index + 1}`}
              asset={asset}
              className="aspect-[4/5]"
              key={`${asset.url}-${index}`}
              label="gallery image"
              source={event.source}
            />
          ))}
        </div>
      ) : (
        <p className="max-w-2xl text-sm leading-7 text-cocoa/75">
          Gallery rendering is available for design review and will display live images after the platform editor and public API provide gallery content.
        </p>
      )}
    </Section>
  );
}
