"use client";

import type { ClientSectionKey } from "@/client/client-section-registry";
import { resolveSectionTransition } from "@/client/section-transitions";
import { CenterBouquetDivider } from "@/client/components/CenterBouquetDivider";
import { CountdownToMusicDivider } from "@/client/components/CountdownToMusicDivider";
import { WaveDivider } from "@/client/components/WaveDivider";

export function SectionTransition({
  from,
  to,
}: {
  from: ClientSectionKey;
  to: ClientSectionKey;
}) {
  const transition = resolveSectionTransition(from, to);
  const dataAttributes = {
    "data-from-background": transition.fromBackground,
    "data-section-transition": "",
    "data-transition-from": from,
    "data-transition-to": to,
    "data-transition-variant": transition.variant,
    "data-to-background": transition.toBackground,
  };

  if (transition.variant === "none") {
    return <div {...dataAttributes} className="hidden" aria-hidden="true" />;
  }

  return (
    <div {...dataAttributes} className="pointer-events-none" aria-hidden="true">
      {transition.variant === "decorativeGradient" ? (
        <CountdownToMusicDivider
          from={transition.fromBackground}
          to={transition.toBackground}
        />
      ) : null}
      {transition.variant === "bouquet" ? (
        <CenterBouquetDivider background={transition.fromBackground} />
      ) : null}
      {transition.variant === "imageToSolidWave" ? (
        <WaveDivider
          from={transition.fromBackground}
          to={transition.toBackground}
          variant="imageToSolid"
        />
      ) : null}
      {transition.variant === "subtleWave" || transition.variant === "bouquet" ? (
        <WaveDivider
          from={transition.fromBackground}
          to={transition.toBackground}
          variant="subtle"
        />
      ) : null}
      {transition.variant === "accentBandWave" ? (
        <WaveDivider
          from={transition.fromBackground}
          to={transition.toBackground}
          variant="accent"
        />
      ) : null}
    </div>
  );
}
