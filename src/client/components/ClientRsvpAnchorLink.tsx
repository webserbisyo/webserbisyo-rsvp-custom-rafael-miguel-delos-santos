import type { ReactNode } from "react";
import { isSafeClientAnchorHref } from "@/client/components/client-nav-utils";

type ClientRsvpAnchorHref = "#rsvp" | "#rsvp-form" | "/rsvp" | "/rsvp-form";

type ClientRsvpAnchorLinkProps = {
  children: ReactNode;
  className?: string;
  href: ClientRsvpAnchorHref;
  onClick?: () => void;
};

export function ClientRsvpAnchorLink({
  children,
  className,
  href,
  onClick
}: ClientRsvpAnchorLinkProps) {
  if (!isSafeClientAnchorHref(href)) {
    return null;
  }

  return (
    <a
      className={className}
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
