"use client";

/**
 * GiftsSection
 *
 * Gift registry section with elegant glassmorphism cards,
 * solid white QR plates to guarantee phone scan contrast, and
 * romantic beach floral corner framing (16.png and 17.png) at z-0.
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

  const hasOptions = giftDetails.options && giftDetails.options.length > 0;
  const hasIntro = !!giftDetails.sectionIntro;
  const hasNote = !!giftDetails.giftNote;

  // If there is no content at all, hide the section entirely
  if (!hasOptions && !hasIntro && !hasNote) return null;

  return (
    <section
      id="gifts"
      className="relative isolate overflow-x-clip bg-ivory py-24 px-4"
    >
      {/* Decorative Floral Layer — Airy corner framing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        {/* Top-Left Flowers (16.png) */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -left-16 sm:-left-20 md:-left-24 lg:-left-28 top-2 sm:top-0 md:-top-4 w-40 sm:w-52 md:w-72 lg:w-80 xl:w-96 h-auto object-contain pointer-events-none select-none z-0 rotate-[5deg] opacity-100"
        />

        {/* Top-Right Flowers (17.png) */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -right-16 sm:-right-20 md:-right-24 lg:-right-28 top-2 sm:top-0 md:-top-4 w-40 sm:w-52 md:w-72 lg:w-80 xl:w-96 h-auto object-contain pointer-events-none select-none z-0 rotate-[-5deg] opacity-100"
        />

        {/* Bottom-Left Flowers (17.png) — Raised to ensure visibility above bottom wave divider */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -left-16 sm:-left-20 md:-left-24 lg:-left-28 bottom-6 sm:bottom-8 md:bottom-10 w-40 sm:w-52 md:w-72 lg:w-80 xl:w-96 h-auto object-contain pointer-events-none select-none z-0 rotate-[5deg] opacity-100"
        />

        {/* Bottom-Right Flowers (16.png) — Raised to ensure visibility above bottom wave divider */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -right-16 sm:-right-20 md:-right-24 lg:-right-28 bottom-6 sm:bottom-8 md:bottom-10 w-40 sm:w-52 md:w-72 lg:w-80 xl:w-96 h-auto object-contain pointer-events-none select-none z-0 rotate-[-10deg] opacity-100"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeading
          label="Gifts"
          title="Gift Registry"
        />

        <AnimatedContent>
          {giftDetails.sectionIntro && (
            <p className="mt-5 mx-auto max-w-xl text-center font-serif text-xl md:text-2xl font-medium leading-relaxed text-cocoa text-balance">
              {giftDetails.sectionIntro}
            </p>
          )}

          {giftDetails.giftNote && (
            <p className="mt-8 md:mt-10 mx-auto max-w-2xl text-center text-base md:text-lg leading-relaxed text-cocoa/75 font-medium text-balance">
              {giftDetails.giftNote}
            </p>
          )}

          {hasOptions && (
            <div
              className={
                giftDetails.options.length === 1
                  ? "flex justify-center mt-12 w-full"
                  : "grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 w-full"
              }
            >
              {giftDetails.options.map((opt, i) => (
                <div
                  key={i}
                  className={
                    giftDetails.options.length === 1
                      ? "max-w-md w-full"
                      : "w-full"
                  }
                >
                  <div className="bg-white/65 backdrop-blur-md border border-sand/40 rounded-3xl p-7 sm:p-8 text-center shadow-soft hover:border-sand/60 transition-[border-color,box-shadow] duration-300 relative z-20 flex flex-col justify-between h-full">
                    {/* Top Section — Text details */}
                    <div className="mb-6">
                      <h4 className="font-serif text-xl md:text-2xl text-cocoa font-medium mb-2">
                        {opt.title}
                      </h4>
                      {opt.description && (
                        <p className="text-driftwood text-sm max-w-xs mx-auto text-balance">
                          {opt.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Section — Functional QR plate and actions */}
                    <div className="flex flex-col items-center justify-end mt-auto">
                      {opt.image?.url && (
                        <div className="w-full">
                          {/* Solid White QR Plate for phone scan contrast */}
                          <div className="bg-white border border-sand/20 rounded-2xl p-4 shadow-sm flex items-center justify-center mx-auto w-full max-w-[260px]">
                            <img
                              src={opt.image.url}
                              alt={opt.image.alt || opt.title}
                              decoding="async"
                              className="w-full max-w-[220px] h-auto object-contain pointer-events-none select-none opacity-100"
                            />
                          </div>
                          <p className="mt-4 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-cocoa/55 font-semibold select-none">
                            SCAN TO SEND YOUR GIFT
                          </p>
                        </div>
                      )}

                      {opt.linkUrl && (
                        <a
                          href={opt.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 text-coral hover:text-[#8C4520] text-sm font-semibold tracking-wide hover:underline transition-colors"
                        >
                          {opt.linkLabel || "View Details"} ✦
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedContent>
      </div>
    </section>
  );
}
