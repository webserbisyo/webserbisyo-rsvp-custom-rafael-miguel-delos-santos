"use client";

/**
 * VenueSection
 *
 * Displays venue name, address, and landmark note in a polished beach-themed layout.
 * The right pane features a framed map card inspired by the Gallery's polaroid design,
 * rendering the Google Maps iframe directly with a decorative pin overlay and a centered CTA below.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { FadeContent } from "@/client/libs/reactbits";
import { SpotlightCard } from "@/client/components/SpotlightCard";
import { MapPin, ExternalLink, Bus, Pin, Compass } from "@/client/libs/icons";
import type { ClientVenueData } from "@/client/types/client-view-model";

type VenueSectionProps = {
  venue: ClientVenueData;
};

type CoordResult = { type: "coords"; lat: string; lng: string; zoom: number };
type TextResult  = { type: "text"; query: string };
type MapExtract  = CoordResult | TextResult | null;

/**
 * Parses a Google Maps URL and extracts the most precise locator available.
 *
 * Priority:
 *  1. GPS coordinates from the @ fragment (e.g. @13.6397,121.3916,17z)
 *     → renders an exact red pin in the iframe
 *  2. Place name from /maps/place/Name
 *  3. Search query from /maps/search/Name or ?q= param
 *
 * Returns null when the URL is unrecognisable (e.g. Google Travel, short links).
 */
function parseMapsLink(mapsLink: string): MapExtract {
  if (!mapsLink) return null;

  try {
    // 1. Coordinates + optional zoom: @lat,lng,Xz
    const coordMatch = mapsLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)(?:,([\d.]+)z)?/);
    if (coordMatch && coordMatch[1] && coordMatch[2]) {
      return {
        type: "coords",
        lat: coordMatch[1],
        lng: coordMatch[2],
        zoom: coordMatch[3] ? Math.round(parseFloat(coordMatch[3])) : 15,
      };
    }

    // 2. /maps/place/Place+Name
    const placeMatch = mapsLink.match(/\/maps\/place\/([^/@?#]+)/);
    if (placeMatch && placeMatch[1]) {
      return { type: "text", query: decodeURIComponent(placeMatch[1].replace(/\+/g, " ")) };
    }

    // 3. /maps/search/Query
    const searchMatch = mapsLink.match(/\/maps\/search\/([^/@?#]+)/);
    if (searchMatch && searchMatch[1]) {
      return { type: "text", query: decodeURIComponent(searchMatch[1].replace(/\+/g, " ")) };
    }

    // 4. ?q= or ?query= param
    if (mapsLink.startsWith("http")) {
      const urlObj = new URL(mapsLink);
      const q = urlObj.searchParams.get("q") ?? urlObj.searchParams.get("query");
      if (q) return { type: "text", query: q };
    }
  } catch {
    // URL parsing failed — fall through to null
  }

  return null;
}

/**
 * Returns a Google Maps embed URL for the iframe.
 *
 * Priority:
 *  1. mapsLink already IS an embed URL  → use as-is
 *  2. mapsLink has GPS coords           → embed pinned to exact coordinates
 *  3. mapsLink has place/search text    → embed using text search
 *  4. venueName + address available     → embed using text search
 *  5. Nothing available                 → null (map hidden)
 */
function getVenueEmbedUrl(venue: ClientVenueData): string | null {
  // Already an embed URL
  if (
    venue.mapsLink &&
    (venue.mapsLink.includes("embed") || venue.mapsLink.includes("output=embed"))
  ) {
    return venue.mapsLink;
  }

  // Parse the mapsLink for the best locator
  if (venue.mapsLink) {
    const parsed = parseMapsLink(venue.mapsLink);
    if (parsed?.type === "coords") {
      // Exact red pin at GPS coordinates
      const { lat, lng, zoom } = parsed;
      return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;
    }
    if (parsed?.type === "text") {
      return `https://maps.google.com/maps?q=${encodeURIComponent(parsed.query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  }

  // Fallback: build a text search from venue name + address
  const parts: string[] = [];
  if (venue.venueName) parts.push(venue.venueName);
  if (venue.address)   parts.push(venue.address);
  if (parts.length === 0) return null;

  return `https://maps.google.com/maps?q=${encodeURIComponent(parts.join(" "))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Returns the external, user-facing URL to open Google Maps in a new tab.
 * Falls back to a search query URL if mapsLink is not present.
 */
function getVenueExternalMapUrl(venue: ClientVenueData): string | undefined {
  if (venue.mapsLink) {
    return venue.mapsLink;
  }

  const queryParts = [];
  if (venue.venueName) queryParts.push(venue.venueName);
  if (venue.address) queryParts.push(venue.address);

  if (queryParts.length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryParts.join(" "))}`;
  }

  return undefined;
}

export function VenueSection({ venue }: VenueSectionProps) {
  if (!venue) return null;

  const embedUrl = getVenueEmbedUrl(venue);
  const externalMapsLink = getVenueExternalMapUrl(venue);

  // Dynamically determine the icon for the arrival/landmark note
  const isShuttle = venue.arrivalNote?.toLowerCase().includes("shuttle") || 
                    venue.arrivalNote?.toLowerCase().includes("bus");
  const ArrivalIcon = isShuttle ? Bus : Compass;

  return (
    <section id="venue" className="pt-24 pb-28 px-4 bg-cream relative">
      {/* Decorative Leaves Wrapper - clips horizontal and vertical overflow of large leaves to prevent inner scroll or page-level horizontal scrolling */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Decorative Tropical Leaf Asset - Upper Left (Layer 2) - Enlarged significantly and responsive */}
        <img
          src="/beach%20assets%20finalized/4.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -top-12 -left-16 sm:-top-16 sm:-left-24 lg:-top-20 lg:-left-32 w-56 sm:w-76 md:w-96 lg:w-[460px] xl:w-[540px] h-auto object-contain select-none opacity-75 sm:opacity-85 md:opacity-95 transition-[opacity,transform] duration-300"
        />

        {/* Decorative Tropical Leaf Asset - Upper Right (Layer 2) - Enlarged significantly and responsive */}
        <img
          src="/beach%20assets%20finalized/5.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -top-12 -right-16 sm:-top-16 sm:-right-24 lg:-top-20 lg:-right-32 w-56 sm:w-76 md:w-96 lg:w-[460px] xl:w-[540px] h-auto object-contain select-none opacity-75 sm:opacity-85 md:opacity-95 transition-[opacity,transform] duration-300"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-20">
        <SectionHeading 
          label="Location" 
          title={venue.venueName || "Venue"} 
        />
        
        <FadeContent>
          <div className="mt-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Details & Logistics */}
            <SpotlightCard 
              className="bg-white/65 backdrop-blur-md border border-sand/40 p-8 sm:p-10 rounded-3xl shadow-[0_12px_40px_rgba(139,104,58,0.06)] hover:border-sand/60 transition-[border-color,box-shadow] duration-500"
              spotlightColor="rgba(232, 201, 122, 0.08)"
            >
              <div className="space-y-8">
                {/* Row 1: Full Address */}
                <div className="flex gap-4 sm:gap-6 items-start p-3 -mx-3 rounded-2xl transition-colors hover:bg-cream/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-cream flex items-center justify-center border border-sand/20 text-coral shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-base font-semibold text-cocoa">Full Address</h4>
                    <p className="text-driftwood text-sm md:text-base mt-1.5 leading-relaxed">
                      {venue.address}
                    </p>
                  </div>
                </div>

                {/* Row 2: Arrival / Landmark Note */}
                {venue.arrivalNote && (
                  <div className="flex gap-4 sm:gap-6 items-start p-3 -mx-3 rounded-2xl transition-colors hover:bg-cream/30">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-cream flex items-center justify-center border border-sand/20 text-coral shadow-sm">
                      <ArrivalIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-base font-semibold text-cocoa">Arrival / Landmark Note</h4>
                      <p className="text-driftwood text-sm md:text-base mt-1.5 leading-relaxed">
                        {venue.arrivalNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SpotlightCard>

            {/* Right Column: Framed Map Picture Card + CTA */}
            <div className="flex flex-col items-center">
              {embedUrl ? (
                <div className="w-full bg-white border border-sand/20 rounded-[32px] p-3 sm:p-4 pb-5 sm:pb-7 shadow-[0_16px_40px_rgba(139,104,58,0.12)] relative transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(139,104,58,0.18)]">
                  
                  {/* Decorative Pin Overlay attached to the border */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
                    <Pin className="w-11 h-11 text-coral fill-current drop-shadow-[0_3px_6px_rgba(201,94,53,0.45)]" />
                  </div>

                  {/* Map Container */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#e5e3df] border border-sand/10">
                    <iframe
                      key={embedUrl}
                      src={embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 z-0"
                    ></iframe>
                  </div>
                </div>
              ) : null}

              {/* Map CTA Button below the card */}
              {externalMapsLink && (
                <div className="mt-8 flex justify-center w-full">
                  <a 
                    href={externalMapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-coral hover:bg-[#8C4520] text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-[0_0_20px_rgba(201,94,53,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out cursor-pointer"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                </div>
              )}
            </div>

          </div>
        </FadeContent>
      </div>

      {/* Center Flower Bouquet Motif on Divider below Venue section */}
      <img
        src="/beach%20assets%20finalized/16.webp"
        alt=""
        aria-hidden="true"
        width={2048}
        height={2048}
        decoding="async"
        className="absolute left-1/2 bottom-0 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 h-auto object-contain pointer-events-none z-25 select-none transform -translate-x-1/2 translate-y-[55%]"
      />
    </section>
  );
}

