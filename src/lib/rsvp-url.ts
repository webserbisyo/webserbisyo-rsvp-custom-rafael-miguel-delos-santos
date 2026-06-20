export const RSVP_SECTION_ID = "rsvp";
export const RSVP_FORM_ID = "rsvp-form";

export function buildRsvpSectionHref(sectionId = RSVP_SECTION_ID): string {
  return `#${sectionId}`;
}
