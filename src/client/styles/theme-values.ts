/**
 * Theme Values
 *
 * Named constants for frequently-used hardcoded hex values across sections.
 * These correspond to CSS custom properties but are needed in JSX for
 * gradient stops, inline style objects, and Tailwind arbitrary values.
 *
 * Not all values can use CSS variables (gradient stops in Tailwind,
 * inline style objects) so a JS constants file is the pragmatic middle ground.
 */

export const THEME = {
  /** Primary coral accent — replaces #C95E35 / #D47A5A */
  accent: "var(--color-coral)",
  /** Darker hover state for buttons */
  accentDark: "#8C4520",
  /** Hero gradient overlay */
  overlayDark: "rgba(45, 27, 18, 0.30)",
  /** Music section green gradient start */
  sectionGreen: "#E8F4F0",
  /** Music section green gradient mid */
  sectionGreenMid: "#C5E5DC",
  /** Music section green gradient end */
  sectionGreenDeep: "#8EC9BB",
  /** Gallery warm gradient start */
  galleryWarmStart: "#FDECD0",
  /** Gallery warm gradient mid */
  galleryWarmMid: "#F5D5A8",
  /** Gallery warm gradient end */
  galleryWarmEnd: "#EBC485",
  /** Extra info icon background */
  iconBg: "#EBF7F5",
  /** Extra info icon color */
  iconColor: "#2D7A70",
} as const;
