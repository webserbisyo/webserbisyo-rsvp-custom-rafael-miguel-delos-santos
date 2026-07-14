import {
  clientSectionRegistry,
  type ClientSectionKey,
  type SectionBackgroundToken,
  type SectionTransitionVariant,
} from "@/client/client-section-registry";

export const sectionBackgroundCssVariables: Record<SectionBackgroundToken, string> = {
  coral: "var(--section-bg-coral)",
  "coral-deep": "var(--section-bg-coral-deep)",
  cocoa: "var(--section-bg-cocoa)",
  cream: "var(--section-bg-cream)",
  "gallery-peach": "var(--section-bg-gallery-peach)",
  "gallery-sand": "var(--section-bg-gallery-sand)",
  ivory: "var(--section-bg-ivory)",
  seafoam: "var(--section-bg-seafoam)",
  "seafoam-light": "var(--section-bg-seafoam-light)",
};

export type ResolvedSectionTransition = {
  from: ClientSectionKey;
  fromBackground: SectionBackgroundToken;
  to: ClientSectionKey;
  toBackground: SectionBackgroundToken;
  variant: SectionTransitionVariant;
};

export function resolveSectionTransition(
  from: ClientSectionKey,
  to: ClientSectionKey,
): ResolvedSectionTransition {
  const fromTheme = clientSectionRegistry[from].visual;
  const toTheme = clientSectionRegistry[to].visual;
  const fromBackground = fromTheme.exitBackground ?? fromTheme.background;
  const toBackground = toTheme.entryBackground ?? toTheme.background;

  if (from === "countdown" && to === "music_effects") {
    return { from, fromBackground, to, toBackground, variant: "gradient" };
  }

  if (from === "venue" && to === "secondary_event") {
    return { from, fromBackground, to, toBackground, variant: "bouquet" };
  }

  return {
    from,
    fromBackground,
    to,
    toBackground,
    variant: fromBackground === toBackground ? "none" : "wave",
  };
}

export function getVisibleSectionTransitions(
  visibleSectionKeys: ClientSectionKey[],
): ResolvedSectionTransition[] {
  return visibleSectionKeys.slice(0, -1).map((from, index) =>
    resolveSectionTransition(from, visibleSectionKeys[index + 1]!),
  );
}
