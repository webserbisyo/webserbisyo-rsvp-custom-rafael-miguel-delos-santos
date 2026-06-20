import type { ReactNode } from "react";
import { isSafeClientAnchorHref } from "@/client/components/client-nav-utils";

type ClientRsvpAnchorHref = "#rsvp" | "#rsvp-form";

type ClientRsvpAnchorLinkProps = {
  children: ReactNode;
  className?: string;
  href?: ClientRsvpAnchorHref;
};

export function ClientRsvpAnchorLink({
  children,
  className,
  href = "#rsvp"
}: ClientRsvpAnchorLinkProps) {
  if (!isSafeClientAnchorHref(href)) {
    return null;
  }

  return (
    <a
      className={className}
      href={href}
    >
      {children}
    </a>
  );
}
