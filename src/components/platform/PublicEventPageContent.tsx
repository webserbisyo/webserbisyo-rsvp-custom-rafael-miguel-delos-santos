import { EventWebsiteRenderer } from "@/components/platform/EventWebsiteRenderer";
import { buildPlatformRendererContext } from "@/lib/platform-render-model";
import type { EventWebsiteRenderModel } from "@/types/public-event";

export function PublicEventPageContent({ event }: { event: EventWebsiteRenderModel }) {
  const context = buildPlatformRendererContext(event);

  return (
    <main
      className="event-website-public-page min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_55%,#fff6ec_100%)] text-slate-900"
      data-preview-mode={context.previewMode}
    >
      <div className="event-preview-public-shell">
        <div className="event-preview-frame event-preview-frame--public">
          <EventWebsiteRenderer
            draft={context.draft}
            guestbookMessages={context.guestbookMessages}
            hideEmptyGuestbook={event.source === "live"}
            sections={context.sections}
          />
        </div>
      </div>
    </main>
  );
}
