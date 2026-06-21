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
  "#rsvp-form",
  "#gallery",
  "#reception",
  "#entourage",
  "#sponsors",
  "#extra-info",
  "#our-story",
  "#contact",
  "#countdown"
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
  | "#rsvp-form"
  | "#gallery"
  | "#reception"
  | "#entourage"
  | "#sponsors"
  | "#extra-info"
  | "#our-story"
  | "#contact"
  | "#countdown";

export function isSafeClientAnchorHref(href: string): boolean {
  if (href === "/rsvp" || href === "/rsvp-form") return true;
  const target = href.startsWith("/") ? href.slice(1) : href;
  return allowedAnchorHrefs.has(target);
}

export function isRsvpClientAnchorHref(href: string): boolean {
  return href === "#rsvp" || href === "#rsvp-form" || href === "/rsvp" || href === "/rsvp-form";
}
