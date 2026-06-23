"use client";

/**
 * GiftsSection
 *
 * Gift registry grid with optional images and links.
 * Extracted from ClientEventRenderer.tsx lines 934–965.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientGiftOption } from "@/client/types/client-view-model";

type GiftsSectionProps = {
  giftDetails: {
    sectionIntro?: string;
    giftNote?: string;
    options: ClientGiftOption[];
  };
};

export function GiftsSection({ giftDetails }: GiftsSectionProps) {
  if (!giftDetails) return null;
  return (
    <section id="gifts" className="py-20 px-4 bg-ivory">
      <div className="max-w-3xl mx-auto">
        <SectionHeading label="Gifts" title="Gift Registry" subtitle={giftDetails.sectionIntro} />
        <AnimatedContent>
          {giftDetails.giftNote && <p className="text-center text-driftwood mb-8">{giftDetails.giftNote}</p>}
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {giftDetails.options?.map((opt, i) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-2xl p-6 text-center shadow-soft">
                <h4 className="font-serif text-xl text-cocoa mb-2">{opt.title}</h4>
                {opt.description && <p className="text-driftwood text-sm mb-4">{opt.description}</p>}
                {opt.image?.url && (
                  <div className="flex justify-center mb-4">
                    <img src={opt.image.url} alt={opt.image.alt || opt.title} className="w-48 h-auto rounded-lg object-contain shadow-sm border border-cocoa/5" />
                  </div>
                )}
                {opt.linkUrl && (
                  <a href={opt.linkUrl} target="_blank" rel="noopener noreferrer" className="text-coral text-sm font-medium tracking-wide hover:underline">
                    {opt.linkLabel || "View Details"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
