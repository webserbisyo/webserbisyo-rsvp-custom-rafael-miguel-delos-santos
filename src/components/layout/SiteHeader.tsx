import { Container } from "@/components/ui/Container";
import { shouldRenderSection } from "@/lib/section-visibility";
import type { EventWebsiteRenderModel } from "@/types/public-event";

type SiteHeaderProps = {
  event: EventWebsiteRenderModel;
};

const navItems = [
  { label: "Ceremony", href: "#ceremony", key: "main_event" },
  { label: "Venue", href: "#venue", key: "venue" },
  { label: "Timeline", href: "#timeline", key: "timeline_program" },
  { label: "Gifts", href: "#gifts", key: "gift_details" },
  { label: "Messages", href: "#messages", key: "guestbook" }
] as const;

export function SiteHeader({ event }: SiteHeaderProps) {
  const visibleKeys = new Set(event.sections.filter((section) => shouldRenderSection(section, event.source)).map((section) => section.key));
  const visibleNavItems = navItems.filter((item) => visibleKeys.has(item.key));

  return (
    <header className="sticky top-0 z-20 border-b border-cocoa/10 bg-ivory/90 backdrop-blur">
      <Container className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <a className="min-w-0 truncate font-serif text-lg text-charcoal sm:text-xl" href="#couple">{event.coupleDisplayName}</a>
        {visibleNavItems.length ? (
          <nav className="hidden items-center justify-center gap-1 md:flex" aria-label="Wedding sections">
            {visibleNavItems.map((item) => (
              <a className="rounded-full px-3 py-2 text-sm font-semibold text-cocoa/75 transition hover:bg-linen hover:text-charcoal" href={item.href} key={item.key}>
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
        <a className="justify-self-end rounded-full border border-terracotta/35 px-4 py-2 text-sm font-semibold text-cocoa transition hover:border-terracotta hover:bg-linen" href="#rsvp">
          RSVP
        </a>
      </Container>
    </header>
  );
}
