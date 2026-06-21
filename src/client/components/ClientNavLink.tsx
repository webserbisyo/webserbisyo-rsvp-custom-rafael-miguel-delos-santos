import type { ReactNode } from "react";
import { isSafeClientAnchorHref } from "@/client/components/client-nav-utils";

type ClientNavLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
};

export function ClientNavLink({ children, href, className }: ClientNavLinkProps) {
  if (!isSafeClientAnchorHref(href)) {
    return null;
  }

  return (
    <a
      className={className || "rounded-full px-3 py-2 text-sm font-semibold text-cocoa/80 transition hover:bg-linen hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"}
      href={href}
    >
      {children}
    </a>
  );
}
