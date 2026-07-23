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
  const preferred = fromTheme.preferredTransition;

  if (fromTheme.backgroundKind === "image") {
    return {
      from,
      fromBackground,
      to,
      toBackground,
      variant: "imageToSolidWave",
    };
  }

  if (preferred && toTheme.acceptedEntryTransitions?.includes(preferred)) {
    return {
      from,
      fromBackground,
      to,
      toBackground,
      variant: preferred,
    };
  }

  if (fromBackground === toBackground) {
    return {
      from,
      fromBackground,
      to,
      toBackground,
      variant: "none",
    };
  }

  if (
    fromTheme.backgroundKind === "accent" ||
    toTheme.backgroundKind === "accent"
  ) {
    return {
      from,
      fromBackground,
      to,
      toBackground,
      variant: "accentBandWave",
    };
  }

  return {
    from,
    fromBackground,
    to,
    toBackground,
    variant: "subtleWave",
  };
}

export function getVisibleSectionTransitions(
  visibleSectionKeys: ClientSectionKey[],
): ResolvedSectionTransition[] {
  return visibleSectionKeys.slice(0, -1).map((from, index) =>
    resolveSectionTransition(from, visibleSectionKeys[index + 1]!),
  );
}
