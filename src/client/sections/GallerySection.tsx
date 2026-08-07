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
import type { SectionSurface } from "@/client/client-section-registry";
import { WeddingDecoration } from "@/client/components/decorations/WeddingDecoration";

const GALLERY_PHOTOS = [
  {
    src: "/wedding-assets/dianne/dianne-gallery-01-ceremony.webp",
    caption: "The Ceremony Arch",
    location: "Garden Ceremony Setup",
    orientation: "landscape",
    alt: "Dianne and Novio wedding ceremony arch in a refined garden setting",
  },
  {
    src: "/wedding-assets/dianne/dianne-gallery-02-bride.webp",
    caption: "The Bride",
    location: "Dianne Solo Portrait",
    orientation: "portrait",
    alt: "Portrait of Dianne in her wedding gown",
  },
  {
    src: "/wedding-assets/dianne/dianne-gallery-03-groom.webp",
    caption: "The Groom",
    location: "Novio Solo Portrait",
    orientation: "portrait",
    alt: "Portrait of Novio on the wedding day",
  },
  {
    src: "/wedding-assets/dianne/dianne-gallery-04-silhouette.webp",
    caption: "Midnight Silhouette",
    location: "Dramatic Evening Scene",
    orientation: "landscape",
    alt: "Dramatic evening silhouette of Dianne and Novio",
  },
  {
    src: "/wedding-assets/dianne/dianne-gallery-05-toast.webp",
    caption: "Reception Toast",
    location: "Garden Reception",
    orientation: "landscape",
    alt: "Dianne and Novio at a candlelit garden reception toast",
  },
  {
    src: "/wedding-assets/dianne/dianne-gallery-06-table.webp",
    caption: "Intimate Table Setting",
    location: "Dinner Ambience",
    orientation: "landscape",
    alt: "Intimate reception table moment with elegant floral styling",
  },
];

const GALLERY_ROTATIONS = [
  "-1.5deg",
  "1.2deg",
  "-0.8deg",
  "1.5deg",
  "-1.2deg",
  "0.8deg",
  "-1.8deg",
  "1deg",
  "-0.5deg",
];

export function GallerySection({ surface }: { surface: SectionSurface }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <section
      id="gallery"
      data-tone={surface}
      className="wedding-section relative overflow-x-clip pt-20 pb-20 px-4"
    >
      <div className="max-w-2xl mx-auto relative z-30">
        <div className="text-center mb-14">
          <p className="wedding-section-label text-xs font-bold tracking-[0.25em] uppercase mb-3 text-[color:var(--wedding-label-on-light)]">
            Our Memories
          </p>
          <h2 className="wedding-display wedding-section-title wedding-section-title--compact mb-3">
            A Story in Frames
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5 text-[color:var(--wedding-accent-line)] opacity-60">
            <div className="h-px w-12 bg-[color:var(--wedding-accent-line)] opacity-40" />
            <span className="text-[color:var(--wedding-label-on-light)]">
              ✦
            </span>
            <div className="h-px w-12 bg-[color:var(--wedding-accent-line)] opacity-40" />
          </div>
        </div>

        <ScrollStack>
          {GALLERY_PHOTOS.map((photo, i) => {
            const isPortrait = photo.orientation === "portrait";

            return (
              <ScrollStackItem key={i}>
                <div className="relative overflow-visible mx-auto" style={{ maxWidth: isPortrait ? "390px" : "520px" }}>
                  <div
                    className="bg-white border-2 border-white rounded p-3 pb-14 shadow-card relative transition-[border-color,box-shadow] duration-300 overflow-visible z-10"
                    style={{
                      transform: `rotate(${GALLERY_ROTATIONS[i % GALLERY_ROTATIONS.length]})`,
                    }}
                  >
                    <div
                      className={`w-full ${isPortrait ? "aspect-[3/4]" : "aspect-[4/3]"} rounded-sm bg-gradient-to-br from-[color:var(--wedding-surface-champagne)] via-[color:var(--wedding-surface-olive)] to-[color:var(--wedding-panel-border)] overflow-hidden`}
                    >
                      {mounted && (
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          decoding="async"
                          className="w-full h-full object-cover rounded-sm hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 text-center px-3 z-20">
                      <p className="font-serif italic text-cocoa text-base mb-0.5">
                        {photo.caption}
                      </p>
                      <p className="text-[0.65rem] tracking-widest uppercase text-driftwood">
                        {photo.location}
                      </p>
                    </div>

                    {/* Diagonal pair: top-left sprig + bottom-right flourish - anchored to rotated white frame */}
                    <WeddingDecoration
                      family="frame-corner"
                      orientation="left"
                      position="top-left"
                      size="small"
                      tone="light"
                      placementMode="edge-overlap"
                      className="wedding-decoration--target-gallery"
                    />
                    <WeddingDecoration
                      family="card-edge"
                      orientation="right"
                      position="bottom-right"
                      size="small"
                      tone="light"
                      placementMode="edge-overlap"
                      className="wedding-decoration--target-gallery"
                    />
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
