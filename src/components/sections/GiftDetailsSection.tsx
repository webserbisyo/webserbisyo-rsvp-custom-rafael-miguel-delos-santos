import { AssetFrame } from "@/components/media/AssetFrame";
import { Section } from "@/components/ui/Section";
import { field, records } from "@/components/sections/field-utils";
import { assetFromUnknown } from "@/lib/assets";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function GiftDetailsSection({ section, event }: WeddingSectionProps) {
  const note = field(section.content, ["note", "body", "description"]);
  const options = records(section.content.options).filter((option) => field(option, ["label", "title"]) || field(option, ["description", "body"]));
  const sectionQr = assetFromUnknown(section.content.gift_qr ?? section.content.giftQr ?? section.content.qrImage, "gift_qr");

  return (
    <Section eyebrow="Gifts" title={field(section.content, ["title"]) || "Gift details"} className="bg-linen">
      {note ? <p className="mb-6 max-w-2xl text-sm leading-7 text-cocoa/80">{note}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option, index) => (
          <div className="rounded-lg border border-cocoa/10 bg-white/70 p-5" key={`${field(option, ["label", "title"])}-${index}`}>
            <h3 className="font-semibold text-charcoal">{field(option, ["label", "title"])}</h3>
            <p className="mt-2 text-sm leading-7 text-cocoa/75">{field(option, ["description", "body"])}</p>
            <div className="mt-4">
              <AssetFrame
                alt={`${field(option, ["label", "title"]) || "Gift"} QR code`}
                asset={assetFromUnknown(option.gift_qr ?? option.giftQr ?? option.qrImage, "gift_qr") ?? sectionQr ?? event.assets.gift_qr}
                label="gift QR"
                sensitive
                source={event.source}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
