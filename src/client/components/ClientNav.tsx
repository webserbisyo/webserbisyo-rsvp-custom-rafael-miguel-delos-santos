"use client";

import { useState } from "react";
import { Menu } from "@/client/libs/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  clientSectionRegistry,
  type ClientSectionKey,
} from "@/client/config/navigation";
import { SitemapDrawer } from "@/client/components/SitemapDrawer";
import { scrollToHash } from "@/client/utils/navigation";

export function ClientNav({
  coupleDisplayName,
  visibleSectionKeys = [],
}: {
  config?: unknown;
  coupleDisplayName?: string;
  visibleSectionKeys?: ClientSectionKey[];
} = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isRsvpPage = pathname === "/rsvp";
  const visibleSections = visibleSectionKeys.map(
    (key) => clientSectionRegistry[key],
  );
  const topNavItems = visibleSections.filter((section) => section.topNav);
  const initials = getCoupleInitials(coupleDisplayName);

  const getResolvedHref = (href: string) => {
    if (href.startsWith("#")) {
      return isRsvpPage ? `/${href}` : href;
    }
    return href;
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      if (isRsvpPage) {
        return;
      }
      e.preventDefault();
      scrollToHash(href);
    }
  };

  return (
    <>
      <nav
        aria-label="Client navigation"
        className="fixed top-0 z-50 w-full border-b border-cocoa/5 bg-[#FDFBF7]/85 backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 shadow-sm"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          {/* Left: Monogram */}
          <div className="flex items-center min-w-[120px]">
            <Link
              href={isRsvpPage ? "/" : "#hero"}
              onClick={(e) => {
                if (!isRsvpPage) {
                  e.preventDefault();
                  scrollToHash("#hero");
                }
              }}
              className="font-serif text-2xl tracking-[0.12em] text-charcoal hover:opacity-80 transition-opacity flex items-center gap-1.5 font-normal"
            >
              <span>{initials[0]}</span>
              <span className="text-coral font-serif italic text-3xl font-light leading-none -mt-1 select-none">
                &
              </span>
              <span>{initials[1]}</span>
            </Link>
          </div>

          {/* Center: Desktop Links (Secondary Browsing Only) */}
          <ul className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-[10px] xl:text-[11px] font-semibold uppercase tracking-[0.2em] xl:tracking-[0.25em] text-cocoa/70">
            {topNavItems.map((link) => {
              const resolvedHref = getResolvedHref(link.anchor);
              return (
                <li key={link.key}>
                  <Link
                    href={resolvedHref}
                    onClick={(e) => handleLinkClick(e, link.anchor)}
                    className="hover:text-coral transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-coral after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: Burger Menu Trigger (Visible on Desktop & Mobile) */}
          <div className="flex items-center justify-end min-w-[120px]">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="group inline-flex items-center gap-2.5 text-cocoa hover:text-coral transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 rounded px-2.5 py-1.5 -mr-2.5"
              aria-label="Open navigation menu"
            >
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.22em] text-cocoa/70 group-hover:text-coral transition-colors mt-0.5">
                More
              </span>
              <Menu className="h-[26px] w-[26px] stroke-[2.4] transition-transform group-hover:scale-105" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sitemap Drawer */}
      <SitemapDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        visibleSectionKeys={visibleSectionKeys}
      />
    </>
  );
}
export default ClientNav;

function getCoupleInitials(value?: string) {
  const names = (value ?? "").split(/\s*&\s*/).filter(Boolean);
  return [
    names[0]?.trim().charAt(0).toUpperCase() || "W",
    names[1]?.trim().charAt(0).toUpperCase() || "S",
  ] as const;
}
