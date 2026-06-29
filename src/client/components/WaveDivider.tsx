"use client";

/**
 * WaveDivider
 *
 * Decorative SVG wave separator used between sections.
 * Extracted from ClientEventRenderer.tsx lines 34–45.
 * Used 8+ times in the composition shell.
 */
export function WaveDivider({
  flip = false,
  className = "text-cream",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none -mt-px -mb-px ${flip ? "rotate-180" : ""}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 56"
        className={`w-full h-10 md:h-14 ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,28 C180,56 360,0 540,28 C720,56 900,0 1080,28 C1260,56 1380,14 1440,28 L1440,56 L0,56 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
