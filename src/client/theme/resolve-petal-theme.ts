export type PetalColorTuple = {
  highlight: string;
  base: string;
  shadow: string;
  vein: string;
};

export type PetalTheme = {
  primary: PetalColorTuple;
  secondary: PetalColorTuple;
  light: PetalColorTuple;
  metallic: PetalColorTuple;
  botanical: PetalColorTuple;
  canvasShadow: string;
};

export const DEFAULT_PETAL_THEME: PetalTheme = {
  primary: {
    highlight: "#c48e8e",
    base: "#b98282",
    shadow: "#9e6c6c",
    vein: "#825454",
  },
  secondary: {
    highlight: "#dfb3ad",
    base: "#d6a6a0",
    shadow: "#bc8d87",
    vein: "#9f726d",
  },
  light: {
    highlight: "#e4d7bc",
    base: "#d8c8a9",
    shadow: "#bdac8d",
    vein: "#9e8e70",
  },
  metallic: {
    highlight: "#aa8b54",
    base: "#9a7b45",
    shadow: "#7e6231",
    vein: "#634b21",
  },
  botanical: {
    highlight: "#89927a",
    base: "#7a836b",
    shadow: "#616953",
    vein: "#4a513f",
  },
  canvasShadow: "rgb(23 21 18 / 12%)",
};

function readTuple(
  styles: CSSStyleDeclaration,
  prefix: string,
  fallback: PetalColorTuple,
): PetalColorTuple {
  const highlight = styles.getPropertyValue(`${prefix}-highlight`).trim();
  const base = styles.getPropertyValue(`${prefix}-base`).trim();
  const shadow = styles.getPropertyValue(`${prefix}-shadow`).trim();
  const vein = styles.getPropertyValue(`${prefix}-vein`).trim();

  return {
    highlight: highlight || fallback.highlight,
    base: base || fallback.base,
    shadow: shadow || fallback.shadow,
    vein: vein || fallback.vein,
  };
}

/**
 * Resolves the active petal theme from CSS custom properties inherited by the
 * canvas element. Reads computed styles ONCE on animation initialization and
 * falls back gracefully to typed defaults.
 */
export function resolvePetalTheme(element: HTMLElement | null): PetalTheme {
  if (!element || typeof window === "undefined" || !window.getComputedStyle) {
    return DEFAULT_PETAL_THEME;
  }

  const target = element.closest("[data-wedding-theme]") ?? element;
  const styles = window.getComputedStyle(target);

  const canvasShadow = styles.getPropertyValue("--wedding-petal-canvas-shadow").trim();

  return {
    primary: readTuple(styles, "--wedding-petal-primary", DEFAULT_PETAL_THEME.primary),
    secondary: readTuple(styles, "--wedding-petal-secondary", DEFAULT_PETAL_THEME.secondary),
    light: readTuple(styles, "--wedding-petal-light", DEFAULT_PETAL_THEME.light),
    metallic: readTuple(styles, "--wedding-petal-metallic", DEFAULT_PETAL_THEME.metallic),
    botanical: readTuple(styles, "--wedding-petal-botanical", DEFAULT_PETAL_THEME.botanical),
    canvasShadow: canvasShadow || DEFAULT_PETAL_THEME.canvasShadow,
  };
}
