import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { EventWebsiteRenderModel } from "@/types/public-event";

type SiteShellProps = {
  event: EventWebsiteRenderModel;
  children: ReactNode;
};

export function SiteShell({ event, children }: SiteShellProps) {
  return (
    <div id="top" className="min-h-screen bg-ivory text-cocoa">
      {event.source === "design" ? (
        <div className="sticky top-0 z-30 bg-warning px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-warning-foreground">
          Design Mode · Sample Data
        </div>
      ) : null}
      {event.source === "snapshot" ? (
        <div className="sticky top-0 z-30 bg-sage px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-sage-foreground">
          Design Mode · Snapshot Data
        </div>
      ) : null}
      {event.previewMode === "dashboard" ? (
        <div className="sticky top-0 z-30 bg-white/90 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/70 backdrop-blur">
          Custom Preview
        </div>
      ) : null}
      <SiteHeader event={event} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
