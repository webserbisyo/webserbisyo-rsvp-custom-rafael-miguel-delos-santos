import { weddingSectionRegistry } from "@/config/wedding-section-registry";
import { isWeddingSectionKey, shouldRenderSection } from "@/lib/section-visibility";
import type { EventWebsiteRenderModel, NormalizedSection } from "@/types/public-event";

type SectionRendererProps = {
  event: EventWebsiteRenderModel;
};

function renderSection(event: EventWebsiteRenderModel, section: NormalizedSection) {
  if (!isWeddingSectionKey(section.key)) return null;
  const Component = weddingSectionRegistry[section.key];
  return <Component event={event} section={section} />;
}

const sectionAnchors: Record<string, string> = {
  host_info: "couple",
  countdown: "countdown",
  music_effects: "music-effects",
  main_event: "ceremony",
  venue: "venue",
  secondary_event: "reception",
  timeline_program: "timeline",
  entourage: "entourage",
  principal_sponsors: "principal-sponsors",
  attire_motif: "attire",
  extra_info: "extra-info",
  gallery: "gallery",
  gift_details: "gifts",
  guestbook: "messages",
  story_message: "love-story",
  rsvp_form: "rsvp",
  contact_socials: "contact"
};

export function SectionRenderer({ event }: SectionRendererProps) {
  const visibleSections = event.sections.filter((section) => shouldRenderSection(section, event.source));
  const footerSections = visibleSections.filter((section) => section.key === "contact_socials");
  const mainSections = visibleSections.filter((section) => section.key !== "contact_socials");

  return (
    <>
      {mainSections.map((section, index) => (
        <div className="scroll-mt-24" id={sectionAnchors[section.key]} key={`${section.key}-${index}`}>{renderSection(event, section)}</div>
      ))}
      {footerSections.map((section, index) => (
        <div className="scroll-mt-24" id={sectionAnchors[section.key]} key={`${section.key}-${index}`}>{renderSection(event, section)}</div>
      ))}
    </>
  );
}
