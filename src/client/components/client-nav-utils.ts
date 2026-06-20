const allowedAnchorHrefs = new Set([
  "#top",
  "#ceremony",
  "#venue",
  "#timeline",
  "#attire",
  "#details",
  "#gifts",
  "#messages",
  "#rsvp",
  "#rsvp-form"
]);

export type ClientAnchorHref =
  | "#top"
  | "#ceremony"
  | "#venue"
  | "#timeline"
  | "#attire"
  | "#details"
  | "#gifts"
  | "#messages"
  | "#rsvp"
  | "#rsvp-form";

export function isSafeClientAnchorHref(href: string): href is ClientAnchorHref {
  return allowedAnchorHrefs.has(href);
}

export function isRsvpClientAnchorHref(href: string): href is "#rsvp" | "#rsvp-form" {
  return href === "#rsvp" || href === "#rsvp-form";
}
