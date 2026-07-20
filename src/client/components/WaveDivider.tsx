"use client";

import type { SectionBackgroundToken } from "@/client/client-section-registry";
import { sectionBackgroundCssVariables } from "@/client/section-transitions";

export function WaveDivider({
  from,
  to,
}: {
  from: SectionBackgroundToken;
  to: SectionBackgroundToken;
}) {
  const fromColor = sectionBackgroundCssVariables[from];
  const toColor = sectionBackgroundCssVariables[to];

  return (
    <div
      className="-mt-px -mb-px w-full overflow-hidden leading-none"
      style={{ backgroundColor: toColor }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 64"
        className="block h-12 w-full rotate-180 sm:h-14 md:h-16"
        preserveAspectRatio="none"
        style={{ backgroundColor: toColor, color: fromColor }}
      >
        <path
          d="M0,24 C180,50 360,-2 540,24 C720,50 900,-2 1080,24 C1260,50 1380,11 1440,24 L1440,64 L0,64 Z"
          fill="currentColor"
          opacity="0.18"
        />
        <path
          d="M0,34 C180,62 360,6 540,34 C720,62 900,6 1080,34 C1260,62 1380,20 1440,34 L1440,64 L0,64 Z"
          fill="currentColor"
        />
        <path
          d="M0,34 C180,62 360,6 540,34 C720,62 900,6 1080,34 C1260,62 1380,20 1440,34"
          fill="none"
          stroke="rgba(132, 92, 68, 0.14)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
