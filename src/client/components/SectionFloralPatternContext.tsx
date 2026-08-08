import type { ReactNode, CSSProperties } from "react";

export type SectionFloralPatternVariant = "dense-allover" | "open-framed";

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
    variant === "dense-allover"
      ? "url('/images/decoration/section-pattern-dense-allover.webp')"
      : "url('/images/decoration/section-pattern-open-framed.webp')";

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
