"use client";

import type { SectionBackgroundToken } from "@/client/client-section-registry";
import { sectionBackgroundCssVariables } from "@/client/section-transitions";

export function CenterBouquetDivider({
  background,
}: {
  background: SectionBackgroundToken;
}) {
  return (
    <div
      className="relative z-20 -mb-px -mt-px h-12 overflow-visible sm:h-14 md:h-16"
      style={{ backgroundColor: sectionBackgroundCssVariables[background] }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 z-10 overflow-visible pointer-events-none select-none">
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 w-28 -translate-x-1/2 -translate-y-1/2 select-none object-contain sm:w-32 md:w-40 lg:w-48"
        />
      </div>
    </div>
  );
}
