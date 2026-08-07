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
  /** Primary Blue Slate accent */
  accent: "var(--wedding-label-on-light, #3F6475)",
  /** Darker hover state for buttons */
  accentDark: "var(--wedding-button-primary-hover-bg, #2E4E5D)",
  /** Hero gradient overlay */
  overlayDark: "var(--wedding-hero-overlay-top, rgba(23, 49, 61, 0.45))",
  /** Soft blue gradient start */
  sectionGreen: "var(--wedding-surface-champagne, #DCE8ED)",
  /** Soft blue gradient mid */
  sectionGreenMid: "var(--wedding-surface-olive, #7498AB)",
  /** Soft blue gradient end */
  sectionGreenDeep: "var(--wedding-surface-dark, #17313D)",
  /** Gallery gradient start */
  galleryWarmStart: "var(--wedding-surface-ivory, #F8F4EC)",
  /** Gallery gradient mid */
  galleryWarmMid: "var(--wedding-surface-champagne, #DCE8ED)",
  /** Gallery gradient end */
  galleryWarmEnd: "var(--wedding-panel-border, #D6C3A7)",
  /** Extra info icon background */
  iconBg: "var(--wedding-surface-champagne, #DCE8ED)",
  /** Extra info icon color */
  iconColor: "var(--wedding-label-on-light, #3F6475)",
} as const;
