import type { ComponentPropsWithoutRef } from "react";

export type ClientMonogramVariant = "nav" | "footer";

export type ClientMonogramProps = ComponentPropsWithoutRef<"span"> & {
  monogram?: readonly [string, string] | null;
  coupleLabel?: string;
  variant?: ClientMonogramVariant;
};

export function ClientMonogram({
  monogram,
  coupleLabel,
  variant = "nav",
  className = "",
  ...props
}: ClientMonogramProps) {
  // If no valid monogram initials exist
  if (!monogram) {
    if (variant === "footer" && coupleLabel) {
      return (
        <span
          className={`client-monogram client-monogram--footer ${className}`.trim()}
          {...props}
        >
          <span className="wedding-monogram-subtitle">{coupleLabel}</span>
        </span>
      );
    }
    return null;
  }

  const [initial1, initial2] = monogram;

  return (
    <span
      className={`client-monogram client-monogram--${variant} ${className}`.trim()}
      {...props}
    >
      <span className="wedding-monogram-glyphs" aria-hidden="true">
        <span className="wedding-monogram-initial">{initial1}</span>
        <span className="wedding-monogram-ampersand">&amp;</span>
        <span className="wedding-monogram-initial">{initial2}</span>
      </span>

      {variant === "footer" && coupleLabel ? (
        <span className="wedding-monogram-subtitle">{coupleLabel}</span>
      ) : null}
    </span>
  );
}
