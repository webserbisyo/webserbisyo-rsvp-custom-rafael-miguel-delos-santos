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
        <span className={`client-monogram client-monogram--footer flex flex-col items-center md:items-start select-none ${className}`.trim()} {...props}>
          <span className="text-xs tracking-[0.2em] uppercase text-cream/70 font-semibold mt-2">
            {coupleLabel}
          </span>
        </span>
      );
    }
    return null;
  }

  const [initial1, initial2] = monogram;

  if (variant === "footer") {
    return (
      <span className={`client-monogram client-monogram--footer flex flex-col items-center md:items-start select-none ${className}`.trim()} {...props}>
        <span className="font-serif text-4xl md:text-5xl tracking-wide text-cream" aria-hidden="true">
          <span className="wedding-monogram-initial">{initial1}</span>{" "}
          <span className="text-coral font-sans wedding-monogram-ampersand">&amp;</span>{" "}
          <span className="wedding-monogram-initial">{initial2}</span>
        </span>
        {coupleLabel ? (
          <span className="text-xs tracking-[0.2em] uppercase text-cream/70 font-semibold mt-2">
            {coupleLabel}
          </span>
        ) : null}
      </span>
    );
  }

  // Nav variant (compact header)
  return (
    <span
      className={`client-monogram client-monogram--nav wedding-nav-monogram ${className}`.trim()}
      aria-hidden="true"
      {...props}
    >
      <span className="wedding-monogram-initial">{initial1}</span>
      <span className="wedding-monogram-ampersand">&amp;</span>
      <span className="wedding-monogram-initial">{initial2}</span>
    </span>
  );
}
