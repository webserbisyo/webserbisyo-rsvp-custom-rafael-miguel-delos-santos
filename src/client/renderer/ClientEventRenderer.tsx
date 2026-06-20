import { ClientRsvpForm } from "@/client/rsvp";
import type { ClientEventRendererProps } from "@/client/renderer/client-renderer-types";

export function ClientEventRenderer({ config, event }: ClientEventRendererProps) {
  const title = event.coupleDisplayName || event.title || "WebSerbisyo RSVP Event";
  const ceremonySection = event.sections.find((section) => section.key === "main_event");
  const venueSection = event.sections.find((section) => section.key === "venue");
  const ceremonyLabel = typeof ceremonySection?.content.eventLabel === "string" ? ceremonySection.content.eventLabel : "";
  const venueName = typeof venueSection?.content.venueName === "string" ? venueSection.content.venueName : "";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 py-10 text-cocoa sm:px-8">
      <section className="rounded-3xl border border-cocoa/10 bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">Client Renderer Scaffold</p>
        <h1 className="mt-4 font-serif text-4xl text-charcoal">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-cocoa/80">
          This is the neutral starter client-renderer scaffold. Future cloned client repos may replace this
          with a custom renderer using real event data only.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-cocoa/10 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/50">Ceremony</p>
          <h2 className="mt-3 font-serif text-2xl text-charcoal">{ceremonyLabel || "Main Event"}</h2>
          <p className="mt-3 text-sm leading-7 text-cocoa/80">
            {event.eventDateLabel || event.eventDateTimeLabel || "Event date will appear from the platform data."}
          </p>
        </article>

        <article className="rounded-2xl border border-cocoa/10 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/50">Venue</p>
          <h2 className="mt-3 font-serif text-2xl text-charcoal">{venueName || "Venue information"}</h2>
          <p className="mt-3 text-sm leading-7 text-cocoa/80">
            This scaffold intentionally stays generic and uses only the event data already provided by the
            public renderer model.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-cocoa/10 bg-white p-6 shadow-soft" id="rsvp">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/50">RSVP</p>
        <h2 className="mt-3 font-serif text-2xl text-charcoal">Inline RSVP Section</h2>
        <p className="mt-3 text-sm leading-7 text-cocoa/80">
          The homepage RSVP section can stay inline, become compact, or become CTA-only while the
          dedicated `/rsvp` page remains available for direct guest access.
        </p>
        <div className="mt-5">
          <ClientRsvpForm
            dedicatedPageEnabled={config.rsvp.dedicatedPageEnabled}
            dedicatedPagePath={config.rsvp.dedicatedPagePath}
            event={event}
            mode={config.rsvp.homepageMode}
          />
        </div>
      </section>
    </main>
  );
}
