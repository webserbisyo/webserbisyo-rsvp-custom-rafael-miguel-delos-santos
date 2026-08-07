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
import type { SectionSurface } from "@/client/client-section-registry";
import { WeddingDecoration } from "@/client/components/decorations/WeddingDecoration";

type EntourageSectionProps = {
  entourage: { groups: ClientEntourageGroup[]; introLine?: string };
  surface: SectionSurface;
};

export function EntourageSection({
  entourage,
  surface,
}: EntourageSectionProps) {
  if (!entourage?.groups?.length) return null;

  // Helper to parse comma or newline separated names reliably
  const parseNames = (namesField: string | string[]): string[] => {
    if (typeof namesField === "string") {
      return namesField
        .split(/[\n,]/)
        .map((n) => n.trim())
        .filter(Boolean);
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
      data-tone={surface}
      className="wedding-section relative overflow-x-clip px-4 pt-24 pb-28 sm:py-28 lg:py-32"
    >
      <div className="max-w-4xl mx-auto relative z-30">
        {/* Section Heading — kept completely clean of background assets on mobile */}
        <SectionHeading
          label="Wedding Party"
          title="Entourage"
          subtitle={entourage.introLine}
        />

        <AnimatedContent>
          <div className="flex flex-col space-y-8 mt-12">
            {entourageRows.map((rowGroups, rowIndex) => {
              return (
                <div
                  key={rowIndex}
                  className="relative mx-auto w-full max-w-5xl py-4 md:py-6 group/row"
                >
                  {/* Desktop 2-Column Grid / Mobile 1-Column Stack */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                    {rowGroups.map((g, cardIndex) => {
                      // Fallback logic for titles and names
                      const displayTitle =
                        (g.groupTitle || g.role || "").trim() ||
                        "Wedding Party";
                      const namesList = parseNames(g.names);
                      const displayNames =
                        namesList.length > 0 ? namesList : ["To be announced"];

                      return (
                        <div
                          key={cardIndex}
                          className="relative group/card-wrapper overflow-visible"
                        >
                          {/* Glassmorphism Card (z-10 base surface) */}
                          <div className="bg-white/65 backdrop-blur-md border border-sand/40 rounded-2xl p-6 sm:p-8 shadow-soft text-center transition-[border-color,box-shadow,transform] duration-500 hover:border-sand/60 hover:-translate-y-1 hover:shadow-md relative z-10 h-full flex flex-col justify-center">
                            <div className="relative z-20">
                              <h4 className="text-coral font-medium tracking-widest uppercase mb-2 text-sm">
                                {displayTitle}
                              </h4>

                              {/* Elegant Typographic Divider: ──── ✦ ──── */}
                              <div
                                className="my-3 flex items-center justify-center gap-3 select-none pointer-events-none whitespace-nowrap"
                                aria-hidden="true"
                              >
                                <span className="h-px w-10 bg-sand opacity-70" />
                                <span className="text-sm leading-none text-sand">
                                  ✦
                                </span>
                                <span className="h-px w-10 bg-sand opacity-70" />
                              </div>

                              <ul className="space-y-2">
                                {displayNames.map((name, j) => (
                                  <li
                                    key={j}
                                    className="text-cocoa font-serif text-lg"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Alternating top-corner sprig (z-15) */}
                          <WeddingDecoration
                            family="frame-corner"
                            orientation={cardIndex % 2 === 0 ? "left" : "right"}
                            position={cardIndex % 2 === 0 ? "top-left" : "top-right"}
                            size="small"
                            tone="light"
                            placementMode="edge-overlap"
                            className="wedding-decoration--target-entourage"
                          />
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
