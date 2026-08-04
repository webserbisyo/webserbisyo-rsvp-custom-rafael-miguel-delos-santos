import type { ComponentPropsWithoutRef } from "react";

type ClientMonogramProps = ComponentPropsWithoutRef<"span"> & {
  initials: readonly [string, string];
  withRules?: boolean;
};

/** Presentational only: client-configured initials with an event-derived fallback supplied by callers. */
export function ClientMonogram({
  initials,
  withRules = false,
  className = "",
  ...props
}: ClientMonogramProps) {
  return (
    <span className={`client-monogram ${withRules ? "client-monogram--hero" : ""} ${className}`.trim()} {...props}>
      {withRules ? <span className="client-monogram__rule" aria-hidden="true" /> : null}
      <span className="wedding-monogram-initial">{initials[0]}</span>
      <span className="wedding-monogram-ampersand" aria-hidden="true">&amp;</span>
      <span className="wedding-monogram-initial">{initials[1]}</span>
      {withRules ? <span className="client-monogram__rule" aria-hidden="true" /> : null}
    </span>
  );
}
