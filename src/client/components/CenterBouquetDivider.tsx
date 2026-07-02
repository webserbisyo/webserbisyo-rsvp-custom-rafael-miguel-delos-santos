"use client";

import { WaveDivider } from "@/client/components/WaveDivider";

export function CenterBouquetDivider() {
  return (
    <div
      className="relative z-20 -mt-px -mb-px h-10 md:h-14 overflow-visible"
      aria-hidden="true"
    >
      {/* Self-contained wave background transition from cream to ivory */}
      <WaveDivider flip className="text-cream bg-ivory" />

      {/* Floating Bouquet Art */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-visible flex items-center justify-center">
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-1/2 top-1/2 z-30 w-32 -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none select-none sm:w-40 md:w-48 lg:w-56 xl:w-64"
        />
      </div>
    </div>
  );
}
