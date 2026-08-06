import type { ReactNode, CSSProperties } from "react";

export type SectionFloralPatternVariant = "garden-blooms" | "botanical-vines";

type SectionFloralPatternContextProps = {
  variant: SectionFloralPatternVariant;
  children: ReactNode;
};

/**
  * SectionFloralPatternContext
  *
  * Wraps eligible content sections with display: contents so no extra layout
  * element is created. Exposes the CSS custom property `--wedding-section-pattern-image`
  * to child .wedding-section elements for layered floral background rendering.
  */
export function SectionFloralPatternContext({
  variant,
  children,
}: SectionFloralPatternContextProps) {
  const image =
    variant === "garden-blooms"
      ? "url('/images/decoration/section-pattern-garden-blooms.webp')"
      : "url('/images/decoration/section-pattern-botanical-vines.webp')";

  return (
    <div
      className="contents wedding-section-pattern-context"
      data-floral-pattern={variant}
      style={
        {
          "--wedding-section-pattern-image": image,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
