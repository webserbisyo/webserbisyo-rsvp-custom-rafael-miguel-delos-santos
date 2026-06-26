"use client";

import type { ClientConfig } from "@/client/client.config";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ClientNavProps = {
  config: ClientConfig;
};

export function ClientNav({ config }: ClientNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isRsvpPage = pathname === "/rsvp";
  const links = config.nav.links;

  if (!links.length) return null;

  const getResolvedHref = (href: string) => {
    const isRsvp = href === "#rsvp" || href === "#rsvp-form";
    if (isRsvp) {
      return "/rsvp";
    }
    if (href.startsWith("#")) {
      return isRsvpPage ? `/${href}` : href;
    }
    return href;
  };

  return (
    <nav
      aria-label="Client navigation"
      className="fixed top-0 z-50 w-full border-b border-cocoa/5 bg-[#FDFBF7]/85 backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 shadow-sm"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        {/* Left: Monogram */}
        <div className="flex items-center min-w-[120px]">
          <Link href={isRsvpPage ? "/" : "#top"} className="font-serif text-2xl tracking-[0.12em] text-charcoal hover:opacity-80 transition-opacity flex items-center gap-1.5 font-normal">
            <span>R</span>
            <span className="text-coral font-serif italic text-3xl font-light leading-none -mt-1 select-none">&</span>
            <span>I</span>
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <ul className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-[10px] xl:text-[11px] font-semibold uppercase tracking-[0.2em] xl:tracking-[0.25em] text-cocoa/70">
          {links.map((link) => {
            const resolvedHref = getResolvedHref(link.href);
            const isRsvp = link.href === "#rsvp" || link.href === "#rsvp-form";
            return (
              <li key={`${link.label}-${link.href}`}>
                {isRsvp ? (
                  <Link
                    className="hover:text-coral transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-coral after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
                    href={resolvedHref}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link 
                    href={resolvedHref} 
                    className="hover:text-coral transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-coral after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Right: RSVP Button */}
        <div className="hidden lg:flex items-center justify-end min-w-[120px]">
          <Link
            className="rounded-full border border-coral text-coral bg-transparent px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-[color,background-color,border-color,box-shadow,transform] duration-300 hover:bg-coral/[0.04] hover:shadow-[0_0_16px_rgba(201,94,53,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            href="/rsvp"
          >
            RSVP
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-cocoa hover:text-coral transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b border-cocoa/10 absolute w-full left-0 shadow-lg transition-[border-color,box-shadow] duration-300">
          <ul className="flex flex-col px-6 py-8 gap-6 items-center text-center text-xs font-semibold uppercase tracking-[0.2em] text-cocoa/80">
            {links.map((link) => {
              const resolvedHref = getResolvedHref(link.href);
              const isRsvp = link.href === "#rsvp" || link.href === "#rsvp-form";
              return (
                <li key={`mobile-${link.label}-${link.href}`} className="w-full">
                  {isRsvp ? (
                    <Link
                      className="inline-block rounded-full border border-coral text-coral bg-transparent px-8 py-3 w-full max-w-[240px] text-center text-xs font-bold uppercase tracking-[0.2em] transition-[color,background-color,border-color,box-shadow] duration-300 hover:bg-coral/[0.04] hover:shadow-[0_0_16px_rgba(201,94,53,0.35)]"
                      href={resolvedHref}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link 
                      href={resolvedHref} 
                      onClick={() => setIsOpen(false)} 
                      className="hover:text-coral transition-colors block py-2 animate-none"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
