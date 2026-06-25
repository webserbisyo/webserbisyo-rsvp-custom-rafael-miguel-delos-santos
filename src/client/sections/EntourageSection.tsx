"use client";

/**
 * EntourageSection
 *
 * Displays the wedding party (entourage) in a responsive, glassmorphism layout.
 * Implements a highly scalable row-aware desktop shell system and gap-based
 * mobile shell system that dynamically scales to any number of cards while
 * keeping headers clean and preventing layout/overflow issues.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientEntourageGroup } from "@/client/types/client-view-model";

type EntourageSectionProps = {
  entourage: { groups: ClientEntourageGroup[]; introLine?: string };
};

// Rotation and transform variations for mobile gap-based shells
const MOBILE_SHELL_TRANSFORMS = [
  "rotate-[-10deg]",
  "rotate-[12deg] scale-x-[-1]",
  "rotate-[6deg] scale-y-[-1]",
  "rotate-[-14deg] scale-x-[-1]"
];

export function EntourageSection({ entourage }: EntourageSectionProps) {
  if (!entourage?.groups?.length) return null;

  // Helper to parse comma or newline separated names reliably
  const parseNames = (namesField: string | string[]): string[] => {
    if (typeof namesField === "string") {
      return namesField.split(/[\n,]/).map((n) => n.trim()).filter(Boolean);
    }
    return Array.isArray(namesField) ? namesField.filter(Boolean) : [];
  };

  // Filter out entourage groups that are completely empty (no title/role AND no names)
  const validGroups = entourage.groups.filter((g) => {
    const title = (g.groupTitle || g.role || "").trim();
    const names = parseNames(g.names);
    return title.length > 0 || names.length > 0;
  });

  // If no valid groups remain, hide the entire section
  if (validGroups.length === 0) return null;

  // Group valid groups into rows of 2 for desktop
  const entourageRows: ClientEntourageGroup[][] = [];
  for (let i = 0; i < validGroups.length; i += 2) {
    entourageRows.push(validGroups.slice(i, i + 2));
  }

  return (
    <section 
      id="entourage" 
      className="relative isolate overflow-x-clip bg-ivory px-4 pt-24 pb-28 sm:py-28 lg:py-32"
    >
      {/* Gallery-style Global Desktop Shell Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden md:block select-none"
      >
        {/* top-left */}
        <img
          src="/beach assets finalized/14.png"
          alt=""
          className="absolute left-[max(1rem,calc((100vw-64rem)/2-12rem))] top-24 w-72 rotate-[-10deg] opacity-90 lg:w-80 xl:w-96"
        />

        {/* top-right */}
        <img
          src="/beach assets finalized/15.png"
          alt=""
          className="absolute right-[max(1rem,calc((100vw-64rem)/2-12rem))] top-24 w-72 rotate-[10deg] opacity-90 lg:w-80 xl:w-96"
        />

        {/* bottom-left */}
        <img
          src="/beach assets finalized/15.png"
          alt=""
          className="absolute bottom-24 left-[max(1rem,calc((100vw-64rem)/2-12rem))] w-72 rotate-[12deg] opacity-90 lg:w-80 xl:w-96"
        />

        {/* bottom-right */}
        <img
          src="/beach assets finalized/14.png"
          alt=""
          className="absolute bottom-24 right-[max(1rem,calc((100vw-64rem)/2-12rem))] w-72 rotate-[-12deg] opacity-90 lg:w-80 xl:w-96"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading — kept completely clean of background assets on mobile */}
        <SectionHeading label="Wedding Party" title="Entourage" subtitle={entourage.introLine} />
        
        <AnimatedContent>
          <div className="flex flex-col space-y-8 mt-12">
            {entourageRows.map((rowGroups, rowIndex) => {
              return (
                <div 
                  key={rowIndex} 
                  className="relative mx-auto w-full max-w-5xl py-4 md:py-6 group/row"
                >
                  {/* Desktop 2-Column Grid / Mobile 1-Column Stack */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {rowGroups.map((g, cardIndex) => {
                      const absoluteIndex = rowIndex * 2 + cardIndex;
                      const isLastCard = absoluteIndex === validGroups.length - 1;

                      // Fallback logic for titles and names
                      const displayTitle = (g.groupTitle || g.role || "").trim() || "Wedding Party";
                      const namesList = parseNames(g.names);
                      const displayNames = namesList.length > 0 ? namesList : ["To be announced"];

                      return (
                        <div key={cardIndex} className="relative group/card-wrapper">
                          {/* Mobile-only background shell accent, extending into the vertical gaps */}
                          {!isLastCard && (
                            <img
                              src={absoluteIndex % 2 === 0 ? "/beach assets finalized/14.png" : "/beach assets finalized/15.png"}
                              alt=""
                              aria-hidden="true"
                              className={`pointer-events-none absolute -bottom-14 z-10 block w-48 h-auto object-contain select-none opacity-85 md:hidden ${
                                absoluteIndex % 2 === 0 
                                  ? `-left-8 ${MOBILE_SHELL_TRANSFORMS[absoluteIndex % MOBILE_SHELL_TRANSFORMS.length]}` 
                                  : `-right-8 ${MOBILE_SHELL_TRANSFORMS[absoluteIndex % MOBILE_SHELL_TRANSFORMS.length]}`
                              }`}
                              loading="lazy"
                            />
                          )}

                          {/* Mobile-only bottom closing shell accent under the very last card */}
                          {isLastCard && (
                            <img
                              src="/beach assets finalized/14.png"
                              alt=""
                              aria-hidden="true"
                              className="pointer-events-none absolute left-1/2 -bottom-20 z-10 w-44 h-auto object-contain -translate-x-1/2 rotate-[6deg] select-none opacity-85 md:hidden"
                              loading="lazy"
                            />
                          )}

                          {/* Glassmorphism Card */}
                          <div className="bg-white/65 backdrop-blur-md border border-sand/40 rounded-2xl p-6 sm:p-8 shadow-soft text-center transition-all duration-500 hover:border-sand/60 hover:-translate-y-1 hover:shadow-md relative z-20 h-full flex flex-col justify-center">
                            <h4 className="text-coral font-medium tracking-widest uppercase mb-2 text-sm">
                              {displayTitle}
                            </h4>
                            
                            {/* Elegant Typographic Divider: ──── ✦ ──── */}
                            <div className="my-3 flex items-center justify-center gap-3 select-none pointer-events-none whitespace-nowrap" aria-hidden="true">
                              <span className="h-px w-10 bg-sand opacity-70" />
                              <span className="text-sm leading-none text-sand">✦</span>
                              <span className="h-px w-10 bg-sand opacity-70" />
                            </div>

                            <ul className="space-y-2">
                              {displayNames.map((name, j) => (
                                <li key={j} className="text-cocoa font-serif text-lg">
                                  {name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
