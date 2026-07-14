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
        viewBox="0 0 1440 56"
        className="block h-10 w-full rotate-180 md:h-14"
        preserveAspectRatio="none"
        style={{ backgroundColor: toColor, color: fromColor }}
      >
        <path
          d="M0,28 C180,56 360,0 540,28 C720,56 900,0 1080,28 C1260,56 1380,14 1440,28 L1440,56 L0,56 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
