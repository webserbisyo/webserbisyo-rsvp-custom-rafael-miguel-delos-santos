export const clientBreakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
  wide: 1440
} as const;

export const clientResponsiveChecklist = [
  "375px mobile",
  "768px tablet",
  "1280px desktop",
  "no horizontal overflow",
  "inline RSVP anchors"
] as const;
