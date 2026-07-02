import type { ClientConfig } from "@/client/client.config";
import { ClientRsvpForm } from "@/client/rsvp/ClientRsvpForm";
import type { EventWebsiteRenderModel } from "@/types/public-event";

type ClientRsvpPageProps = {
  config: ClientConfig;
  event: EventWebsiteRenderModel;
};

export function ClientRsvpPage({ config, event }: ClientRsvpPageProps) {
  const coupleNames = event.coupleDisplayName || event.title || "Rafael & Isabella";

  return (
    <div className="min-h-[100dvh] bg-[#fffaf1] bg-gradient-to-br from-[#fffaf1] via-[#f8efe3] to-[#fffaf1] pt-28 pb-32 px-4 md:px-8 flex items-center justify-center relative overflow-hidden">
      {/* 1. Terracotta/Coral Sunset Glow in Background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(201,114,88,0.22)_0%,rgba(248,239,227,0.1)_50%,transparent_75%)] pointer-events-none -z-10 select-none" 
        aria-hidden="true" 
      />

      {/* 2. RSVP Card Wrapper with 4 Corner Flowers */}
      <div className="relative w-full max-w-[580px] my-12 flex flex-col items-center">
        {/* Decorative Corner Flowers (Z-0, pointer-events-none, positioned relative to card wrapper) */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 z-0 select-none"
        >
          {/* Top-Left Flower (17.webp) */}
          <img
            src="/beach%20assets%20finalized/17.webp"
            alt=""
            aria-hidden="true"
            width={2048}
            height={2048}
            decoding="async"
            className="absolute -left-8 -top-8 sm:-left-12 sm:-top-12 md:-left-16 md:-top-16 w-[130px] sm:w-[180px] md:w-[240px] h-auto object-contain rotate-[15deg] opacity-70 md:opacity-85 pointer-events-none select-none"
          />

          {/* Top-Right Flower (16.webp - Mirrored) */}
          <img
            src="/beach%20assets%20finalized/16.webp"
            alt=""
            aria-hidden="true"
            width={2048}
            height={2048}
            decoding="async"
            className="absolute -right-8 -top-8 sm:-right-12 sm:-top-12 md:-right-16 md:-top-16 w-[130px] sm:w-[180px] md:w-[240px] h-auto object-contain -rotate-[15deg] scale-x-[-1] opacity-70 md:opacity-85 pointer-events-none select-none"
          />

          {/* Bottom-Left Flower (16.webp - Mirrored) */}
          <img
            src="/beach%20assets%20finalized/16.webp"
            alt=""
            aria-hidden="true"
            width={2048}
            height={2048}
            decoding="async"
            className="absolute -left-10 -bottom-10 sm:-left-16 sm:-bottom-16 md:-left-20 md:-bottom-20 w-[160px] sm:w-[220px] md:w-[320px] h-auto object-contain rotate-[40deg] scale-x-[-1] opacity-80 md:opacity-95 pointer-events-none select-none"
          />

          {/* Bottom-Right Flower (17.webp) */}
          <img
            src="/beach%20assets%20finalized/17.webp"
            alt=""
            aria-hidden="true"
            width={2048}
            height={2048}
            decoding="async"
            className="absolute -right-10 -bottom-10 sm:-right-16 sm:-bottom-16 md:-right-20 md:-bottom-20 w-[160px] sm:w-[220px] md:w-[320px] h-auto object-contain -rotate-[40deg] opacity-80 md:opacity-95 pointer-events-none select-none"
          />
        </div>

        {/* 3. Single Focused Glass RSVP Card Container (Z-10, overlays flowers) */}
        <div 
          className="relative z-10 w-full rounded-[2rem] border border-sand/40 bg-white/65 p-8 md:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_28px_80px_rgba(63,45,35,0.16)] backdrop-blur-md flex flex-col items-center animate-fadeIn"
        >
          {/* Minimal Top Identity */}
          <div className="text-center mb-8 w-full">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c97258] mb-2">
              Wedding RSVP
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-wide text-[#302722]">
              {coupleNames}
            </h1>
            <div className="mt-4 flex w-full items-center justify-center select-none" aria-hidden="true">
              <span className="h-px w-10 bg-sand/35" />
              <span className="mx-2.5 text-[10px] text-[#c97258]/70">✦</span>
              <span className="h-px w-10 bg-sand/35" />
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
  );
}
