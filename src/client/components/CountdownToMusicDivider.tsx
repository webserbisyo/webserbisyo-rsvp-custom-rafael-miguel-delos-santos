"use client";

import type { SectionBackgroundToken } from "@/client/client-section-registry";
import { sectionBackgroundCssVariables } from "@/client/section-transitions";

export function CountdownToMusicDivider({
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
      className="relative z-20 -mt-px h-20 overflow-x-clip sm:h-24 md:h-28 lg:h-32"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${fromColor}, ${fromColor}, ${toColor})`,
      }}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[560px] overflow-x-clip select-none">
        <img
          src="/beach%20assets%20finalized/9.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="pointer-events-none absolute bottom-0 left-0 z-10 w-44 -translate-x-[10%] translate-y-[12%] select-none object-contain sm:w-52 sm:-translate-x-[14%] md:w-64 lg:w-80 xl:w-96"
        />
        <img
          src="/beach%20assets%20finalized/6.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="pointer-events-none absolute bottom-0 right-0 z-10 w-44 translate-x-[10%] translate-y-[12%] select-none object-contain sm:w-52 sm:translate-x-[14%] md:w-64 lg:w-80 xl:w-96"
        />
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="pointer-events-none absolute bottom-0 left-1/2 z-20 w-28 -translate-x-1/2 translate-y-[14%] select-none object-contain sm:w-32 md:w-40 lg:w-48"
        />
      </div>
    </div>
  );
}
