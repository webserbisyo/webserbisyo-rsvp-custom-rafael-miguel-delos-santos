import type { ClientConfig } from "@/client/client.config";
import { ClientRsvpForm } from "@/client/rsvp/ClientRsvpForm";
import type { EventWebsiteRenderModel } from "@/types/public-event";
import { formatDate } from "@/client/utils/formatters";

type ClientRsvpPageProps = {
  config: ClientConfig;
  event: EventWebsiteRenderModel;
};



export function ClientRsvpPage({ config, event }: ClientRsvpPageProps) {
  // Extract clean data from renderModel sections
  const coupleNames = event.coupleDisplayName || event.title || "Rafael & Isabella";
  
  const ceremonySection = event.sections.find((s) => s.key === "ceremony");
  const ceremonyDate = ceremonySection?.content?.date;
  const dateStr = typeof ceremonyDate === "string" ? formatDate(ceremonyDate) : "";
  
  const venueSection = event.sections.find((s) => s.key === "venue");
  const venueName = typeof venueSection?.content?.venueName === "string" ? venueSection.content.venueName : "TBD";
  const venueAddress = typeof venueSection?.content?.address === "string" ? venueSection.content.address : "";

  return (
    <div className="min-h-screen bg-[#FDF6ED] pt-28 pb-16 px-4 md:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-card border border-cocoa/5 overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-[#A34E26] to-coral p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Subtle decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 mb-3">
            Wedding RSVP
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-wide mb-6">
            {coupleNames}
          </h1>
          
          <div className="h-[1px] w-16 bg-white/30 mx-auto mb-6" />
          
          <div className="flex flex-col gap-2 text-xs md:text-sm font-light text-white/90">
            {dateStr && <p className="tracking-wide">{dateStr}</p>}
            <p className="font-serif italic text-white/80">{venueName} {venueAddress && `• ${venueAddress}`}</p>
          </div>
        </div>

        {/* RSVP Form Section */}
        <div className="p-8 md:p-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-charcoal mb-3">Response Card</h2>
            <p className="text-xs text-cocoa/60 max-w-sm mx-auto leading-relaxed">
              Please complete the details below to RSVP to our wedding celebration. We look forward to celebrating with you!
            </p>
          </div>

          <div className="mt-4">
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
  );
}
