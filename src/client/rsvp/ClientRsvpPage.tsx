import type { ClientConfig } from "@/client/client.config";
import { ClientRsvpForm } from "@/client/rsvp/ClientRsvpForm";
import type { EventWebsiteRenderModel } from "@/types/public-event";

type ClientRsvpPageProps = {
  config: ClientConfig;
  event: EventWebsiteRenderModel;
};

export function ClientRsvpPage({ config, event }: ClientRsvpPageProps) {
  const title = event.coupleDisplayName || event.title || "WebSerbisyo RSVP Event";
  const ceremonyLabel = event.eventDateTimeLabel || event.eventDateLabel || "Event date will appear from the platform data.";
  const venueSection = event.sections.find((section) => section.key === "venue");
  const venueName =
    typeof venueSection?.content.venueName === "string" && venueSection.content.venueName.trim()
      ? venueSection.content.venueName
      : "Venue information will appear from the platform data.";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-5 py-10 text-cocoa sm:px-8">
      <section className="rounded-3xl border border-cocoa/10 bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
          Dedicated RSVP Page
        </p>
        <h1 className="mt-4 font-serif text-4xl text-charcoal">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-cocoa/80">
          This starter route is the approved custom-frontend RSVP destination. It stays frontend-only
          until the official browser submission contract is confirmed for custom origins.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-cocoa/10 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/50">Event</p>
          <p className="mt-3 text-sm leading-7 text-cocoa/80">{ceremonyLabel}</p>
        </article>
        <article className="rounded-2xl border border-cocoa/10 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/50">Venue</p>
          <p className="mt-3 text-sm leading-7 text-cocoa/80">{venueName}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-cocoa/10 bg-white p-6 shadow-soft" id="rsvp">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/50">RSVP</p>
        <h2 className="mt-3 font-serif text-2xl text-charcoal">Dedicated RSVP Form</h2>
        <p className="mt-3 text-sm leading-7 text-cocoa/80">
          Keep `#rsvp` and `#rsvp-form` stable so QR links and future clone pages can target this
          route safely.
        </p>
        <div className="mt-5">
          <ClientRsvpForm
            dedicatedPageEnabled={false}
            dedicatedPagePath={config.rsvp.dedicatedPagePath}
            event={event}
            mode="inline-form"
          />
        </div>
      </section>
    </main>
  );
}
