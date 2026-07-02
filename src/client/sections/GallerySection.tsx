"use client";

/**
 * GallerySection
 *
 * Polaroid-style photo gallery with ScrollStack, decorative sea elements,
 * and sticky side groups.
 * Extracted from ClientEventRenderer.tsx lines 470–626.
 *
 * GALLERY_PHOTOS and GALLERY_ROTATIONS are kept in this file
 * (Phase 6 will centralize them into client.config.ts).
 *
 * All classNames, styles, and layout are identical.
 */

import { useState, useEffect } from "react";
import { ScrollStack, ScrollStackItem } from "@/client/libs/reactbits";

const GALLERY_PHOTOS = [
  {
    src: "/wedding-assets/The-ceremony-arch.webp",
    caption: "The Ceremony Arch",
    location: "Beachfront Setup",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/female-solor-portrait.webp",
    caption: "The Beautiful Bride",
    location: "Isabella Solo",
    orientation: "portrait",
  },
  {
    src: "/wedding-assets/male-solo-porttrait.webp",
    caption: "The Dashing Groom",
    location: "Rafael Solo",
    orientation: "portrait",
  },
  {
    src: "/wedding-assets/Sunset-silhouette.webp",
    caption: "Sunset Silhouette",
    location: "Golden Hour Beach",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/The-table-venue-detail.webp",
    caption: "Reception Details",
    location: "Table Settings",
    orientation: "landscape",
  },
  {
    src: "/wedding-assets/The-table-venue-detail2.webp",
    caption: "Floral & Decor",
    location: "Dinner Setup",
    orientation: "landscape",
  },
];

const GALLERY_ROTATIONS = ["-1.5deg", "1.2deg", "-0.8deg", "1.5deg", "-1.2deg", "0.8deg", "-1.8deg", "1deg", "-0.5deg"];

export function GallerySection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <section
       id="gallery"
       className="relative overflow-x-clip pt-20 pb-20 px-4 bg-gradient-to-b from-[#FDECD0] via-[#F5D5A8] to-[#EBC485]"
     >
       {/* Decorative Sea Elements on Sides - Sticky Track System */}
       <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-10 overflow-x-clip">

        {/* Left Side Sticky Group */}
        <div className="absolute top-0 bottom-0 left-0 w-0 pointer-events-none">
          <div className="sticky top-[15vh] left-0 flex flex-col gap-[20vh] transform translate-x-2 md:translate-x-4 lg:translate-x-8">
            <img
              src="/beach%20assets%20finalized/14.webp"
              alt=""
              aria-hidden="true"
              width={2048}
              height={2048}
              decoding="async"
              className="w-20 sm:w-28 md:w-36 lg:w-52 xl:w-60 h-auto object-contain max-w-none transform -rotate-[15deg] opacity-70 lg:opacity-90 select-none transition-transform duration-500"
            />
            <img
              src="/beach%20assets%20finalized/15.webp"
              alt=""
              aria-hidden="true"
              width={2048}
              height={2048}
              decoding="async"
              className="w-20 sm:w-28 md:w-36 lg:w-52 xl:w-60 h-auto object-contain max-w-none transform rotate-[20deg] opacity-70 lg:opacity-90 select-none transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Side Sticky Group */}
        <div className="absolute top-0 bottom-0 right-0 w-0 pointer-events-none">
          <div className="sticky top-[20vh] right-0 flex flex-col items-end gap-[20vh] transform -translate-x-2 md:-translate-x-4 lg:-translate-x-8">
            <img
              src="/beach%20assets%20finalized/15.webp"
              alt=""
              aria-hidden="true"
              width={2048}
              height={2048}
              decoding="async"
              className="w-20 sm:w-28 md:w-36 lg:w-52 xl:w-60 h-auto object-contain max-w-none transform rotate-[45deg] opacity-70 lg:opacity-90 select-none transition-transform duration-500"
            />
            <img
              src="/beach%20assets%20finalized/14.webp"
              alt=""
              aria-hidden="true"
              width={2048}
              height={2048}
              decoding="async"
              className="w-20 sm:w-28 md:w-36 lg:w-52 xl:w-60 h-auto object-contain max-w-none transform -rotate-[30deg] opacity-70 lg:opacity-90 select-none transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto relative z-30">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3 text-[#3B2A1A]/85">
            Our Memories
          </p>
          <h2 className="font-serif text-[#3B2A1A] text-3xl md:text-4xl font-medium mb-3">
            A Story in Frames
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5 text-[#3B2A1A]/40">
            <div className="h-px w-12 bg-[#3B2A1A]/20" />
            <span className="text-[#C95E35]">✦</span>
            <div className="h-px w-12 bg-[#3B2A1A]/20" />
          </div>
        </div>

        <ScrollStack>
          {GALLERY_PHOTOS.map((photo, i) => {
            const isPortrait = photo.orientation === "portrait";
            return (
              <ScrollStackItem key={i}>
                <div
                  className="bg-white border-2 border-white rounded p-3 pb-14 mx-auto shadow-card relative transition-[border-color,box-shadow] duration-300"
                  style={{
                    transform: `rotate(${GALLERY_ROTATIONS[i % GALLERY_ROTATIONS.length]})`,
                    maxWidth: isPortrait ? "390px" : "520px"
                  }}
                >
                  <div className={`w-full ${isPortrait ? "aspect-[3/4]" : "aspect-[4/3]"} rounded-sm bg-gradient-to-br from-[var(--border)] via-[#D4B896] to-[#C4A882] overflow-hidden`}>
                    {mounted && (
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        decoding="async"
                        className="w-full h-full object-cover rounded-sm hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 text-center px-3">
                    <p className="font-serif italic text-cocoa text-base mb-0.5">{photo.caption}</p>
                    <p className="text-[0.65rem] tracking-widest uppercase text-driftwood">{photo.location}</p>
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}
