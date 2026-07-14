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
    <div {...dataAttributes}>
      {transition.variant === "gradient" ? <CountdownToMusicDivider /> : null}
      {transition.variant === "bouquet" ? (
        <CenterBouquetDivider background={transition.fromBackground} />
      ) : null}
      {transition.variant === "wave" || transition.variant === "bouquet" ? (
        <WaveDivider from={transition.fromBackground} to={transition.toBackground} />
      ) : null}
    </div>
  );
}
