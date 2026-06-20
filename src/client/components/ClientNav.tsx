import { ClientNavLink } from "@/client/components/ClientNavLink";
import { ClientRsvpAnchorLink } from "@/client/components/ClientRsvpAnchorLink";
import type { ClientConfig } from "@/client/client.config";
import { isRsvpClientAnchorHref, isSafeClientAnchorHref } from "@/client/components/client-nav-utils";

type ClientNavProps = {
  config: ClientConfig;
};

export function ClientNav({ config }: ClientNavProps) {
  const links = config.nav.links.filter((link) => isSafeClientAnchorHref(link.href));

  if (!links.length) return null;

  return (
    <nav
      aria-label="Client navigation"
      className="border-b border-cocoa/10 bg-ivory/90 backdrop-blur"
    >
      <ul className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-3 sm:px-6">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            {isRsvpClientAnchorHref(link.href) ? (
              <ClientRsvpAnchorLink
                className="rounded-full border border-terracotta/30 px-3 py-2 text-sm font-semibold text-cocoa transition hover:border-terracotta hover:bg-linen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                href={link.href}
              >
                {link.label}
              </ClientRsvpAnchorLink>
            ) : (
              <ClientNavLink href={link.href}>{link.label}</ClientNavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
