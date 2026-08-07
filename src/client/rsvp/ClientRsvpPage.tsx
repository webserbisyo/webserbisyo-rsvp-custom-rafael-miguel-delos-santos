import type { ClientConfig } from "@/client/client.config";
import { WeddingDecoration } from "@/client/components/decorations/WeddingDecoration";
import { ClientRsvpForm } from "@/client/rsvp/ClientRsvpForm";
import type { EventWebsiteRenderModel } from "@/types/public-event";

type ClientRsvpPageProps = {
  config: ClientConfig;
  event: EventWebsiteRenderModel;
};

export function ClientRsvpPage({ config, event }: ClientRsvpPageProps) {
  const coupleNames = event.coupleDisplayName || event.title || "";

  return (
    <div className="wedding-rsvp-shell min-h-[100dvh] pt-28 pb-36 pb-[calc(9rem+env(safe-area-inset-bottom))] px-4 md:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="wedding-rsvp-pattern" aria-hidden="true" />

      {/* 1. Terracotta/Coral Sunset Glow in Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[image:var(--wedding-gradient-rsvp-glow)] pointer-events-none -z-10 select-none"
        aria-hidden="true"
      />

      {/* 2. RSVP Card Wrapper */}
      <div className="relative z-10 w-full max-w-[580px] my-8 sm:my-12 flex flex-col items-center">
        {/* 3. Single Focused Glass RSVP Card Container (Z-10, overlays flowers) */}
        <div className="wedding-rsvp-card relative z-10 w-full border p-6 sm:p-8 md:p-12 flex flex-col items-center animate-fadeIn shadow-2xl">
          <WeddingDecoration
            family="frame-corner"
            orientation="left"
            position="top-left"
            size="small"
            tone="light"
            placementMode="edge-overlap"
            className="wedding-decoration--target-rsvp"
          />
          <WeddingDecoration
            family="frame-corner"
            orientation="right"
            position="top-right"
            size="small"
            tone="light"
            placementMode="edge-overlap"
            className="wedding-decoration--target-rsvp"
          />
          <WeddingDecoration
            family="card-edge"
            orientation="left"
            position="bottom-left"
            size="small"
            tone="light"
            placementMode="edge-overlap"
            className="wedding-decoration--target-rsvp"
          />
          <WeddingDecoration
            family="card-edge"
            orientation="right"
            position="bottom-right"
            size="small"
            tone="light"
            placementMode="edge-overlap"
            className="wedding-decoration--target-rsvp"
          />

          <div className="wedding-rsvp-content relative z-20 w-full flex flex-col items-center">
            {/* Minimal Top Identity */}
            <div className="text-center mb-8 w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--wedding-rsvp-muted,var(--wedding-text-secondary))] mb-2">
                Wedding RSVP
              </p>
              <h1 className="wedding-display wedding-page-title wedding-rsvp-couple-name text-[color:var(--wedding-rsvp-text,var(--wedding-text-primary))]">
                {coupleNames}
              </h1>
              <div
                className="mt-4 flex w-full items-center justify-center select-none"
                aria-hidden="true"
              >
                <span className="h-px w-10 bg-[color:var(--wedding-accent-line)] opacity-60" />
                <span className="mx-2.5 text-[10px] text-[color:var(--wedding-rsvp-muted,var(--wedding-text-secondary))]">
                  ✦
                </span>
                <span className="h-px w-10 bg-[color:var(--wedding-accent-line)] opacity-60" />
              </div>
            </div>

            {/* RSVP Form */}
            <div className="w-full">
              <ClientRsvpForm
                dedicatedPageEnabled={false}
                dedicatedPagePath={config.rsvp.dedicatedPagePath}
                event={event}
                mode="inline-form"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
