"use client";

import type { SectionBackgroundToken } from "@/client/client-section-registry";
import { sectionBackgroundCssVariables } from "@/client/section-transitions";

export function WaveDivider({
  from,
  to,
  variant = "subtle",
}: {
  from: SectionBackgroundToken;
  to: SectionBackgroundToken;
  variant?: "accent" | "imageToSolid" | "subtle";
}) {
  const fromColor = sectionBackgroundCssVariables[from];
  const toColor = sectionBackgroundCssVariables[to];

  if (variant === "imageToSolid") {
    return (
      <div
        className="relative z-20 -mb-px -mt-14 h-14 w-full overflow-hidden leading-none sm:-mt-16 sm:h-16 md:-mt-20 md:h-20"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 96"
          className="block h-full w-full"
          preserveAspectRatio="none"
          style={{ color: toColor }}
        >
          <path
            d="M0,52 C180,78 360,24 540,50 C720,76 900,22 1080,48 C1260,73 1380,38 1440,48 L1440,96 L0,96 Z"
            fill="currentColor"
          />
          <path
            d="M0,52 C180,78 360,24 540,50 C720,76 900,22 1080,48 C1260,73 1380,38 1440,48"
            fill="none"
            stroke="rgba(255, 255, 255, 0.32)"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  }

  const isAccent = variant === "accent";

  return (
    <div
      className={`-mb-px -mt-px w-full overflow-hidden leading-none ${
        isAccent ? "h-11 sm:h-13 md:h-15" : "h-8 sm:h-9 md:h-10"
      }`}
      style={{ backgroundColor: toColor }}
      aria-hidden="true"
    >
      <svg
        viewBox={isAccent ? "0 0 1440 64" : "0 0 1440 48"}
        className="block h-full w-full"
        preserveAspectRatio="none"
        style={{ backgroundColor: toColor, color: fromColor }}
      >
        <path
          d={
            isAccent
              ? "M0,0 H1440 V28 C1260,54 1080,4 900,30 C720,56 540,6 360,30 C180,54 60,18 0,28 Z"
              : "M0,0 H1440 V17 C1260,31 1080,7 900,20 C720,33 540,8 360,20 C180,32 60,13 0,18 Z"
          }
          fill="currentColor"
        />
        <path
          d={
            isAccent
              ? "M0,28 C180,54 360,4 540,30 C720,56 900,6 1080,30 C1260,54 1380,18 1440,28"
              : "M0,18 C180,32 360,8 540,20 C720,33 900,7 1080,20 C1260,31 1380,13 1440,17"
          }
          fill="none"
          stroke="rgba(132, 92, 68, 0.14)"
          strokeWidth={isAccent ? "1.5" : "1"}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
