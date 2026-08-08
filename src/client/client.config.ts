export type ClientRsvpHomepageMode =
  "inline-form" | "compact-form" | "cta-only";

export type ClientRendererConfig = {
  mode: "platform" | "client";
  allowClientRenderer: boolean;
};

export type ClientLibsConfig = {
  icons: {
    provider: string;
    importFrom: string;
  };
  ui: readonly string[];
  motion: readonly string[];
  effects: readonly string[];
};

export type ClientResponsiveConfig = {
  strategy: "mobile-first";
  testWidths: readonly [375, 768, 1280];
  requireNoHorizontalOverflow: boolean;
  respectReducedMotion: boolean;
};

export type ClientConfig = {
  mode: "starter";
  renderer: ClientRendererConfig;
  rsvp: {
    dedicatedPageEnabled: boolean;
    dedicatedPagePath: string;
    homepageMode: ClientRsvpHomepageMode;
  };
  identity: {
    displayName: string;
    subtitle: string;
  };
  theme: {
    id: string;
    preset: string;
    monogram?: readonly [string, string];
    fonts: {
      heading: string;
      body: string;
    };
    tokens: Record<string, string>;
  };
  layout: {
    navEnabled: boolean;
    footerEnabled: boolean;
  };
  footer: {
    text: string;
  };
  sections: Record<string, unknown>;
  componentFlorals?: ComponentFloralDecorationsConfig;
  assets: Record<string, unknown>;
  libs: ClientLibsConfig;
  responsive: ClientResponsiveConfig;
};

export type ComponentFloralAssetSpec = {
  src: string;
  width: number;
  height: number;
};

export type ComponentFloralDecorationsConfig = {
  frameCorner: {
    left: ComponentFloralAssetSpec;
    right: ComponentFloralAssetSpec;
  };
  cardEdge: {
    left: ComponentFloralAssetSpec;
    right: ComponentFloralAssetSpec;
  };
};

export const PRINCESS_ANNE_COMPONENT_FLORAL_DECORATIONS: ComponentFloralDecorationsConfig = {
  frameCorner: {
    left: {
      src: "/images/decoration/princess-anne/princess-anne-corner-top-left.webp",
      width: 2048,
      height: 2048,
    },
    right: {
      src: "/images/decoration/princess-anne/princess-anne-corner-top-right.webp",
      width: 2048,
      height: 2048,
    },
  },
  cardEdge: {
    left: {
      src: "/images/decoration/princess-anne/princess-anne-corner-bottom-left.webp",
      width: 2048,
      height: 2048,
    },
    right: {
      src: "/images/decoration/princess-anne/princess-anne-corner-bottom-right.webp",
      width: 2048,
      height: 2048,
    },
  },
};

export type ClientAttireConfigItem = {
  label: string;
  color: string;
};

export type ClientAttireIllustrationConfig = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const PRINCESS_ANNE_ATTIRE_ILLUSTRATION: ClientAttireIllustrationConfig = {
  src: "/images/attire/princess-anne-attire-illustration-blue-hour-romance.webp",
  alt: "Princess Anne wedding attire dress code fashion illustration",
  width: 2752,
  height: 1536,
};

/**
 * Configurable Princess Anne custom-site starter palette.
 * Note: These are client-configurable Attire palette values, not global website-theme CSS ownership.
 */
export const PRINCESS_ANNE_ATTIRE_PALETTE: ClientAttireConfigItem[] = [
  { label: "Dusty Blue", color: "#7498AB" },
  { label: "Blue Slate", color: "#3F6475" },
  { label: "Mist Blue", color: "#DCE8ED" },
  { label: "Champagne Sand", color: "#D6C3A7" },
  { label: "Evening Navy", color: "#17313D" },
];

export const clientConfig = {
  mode: "starter",
  renderer: {
    mode: "client",
    allowClientRenderer: true,
  } satisfies ClientRendererConfig,
  rsvp: {
    dedicatedPageEnabled: true,
    dedicatedPagePath: "/rsvp",
    homepageMode: "inline-form",
  },
  identity: {
    displayName: "",
    subtitle: "",
  },
  theme: {
    id: "blue-hour-romance",
    preset: "blue-hour-romance",
    fonts: {
      heading: "",
      body: "",
    },
    tokens: {},
  },
  layout: {
    navEnabled: true,
    footerEnabled: false,
  },
  footer: {
    text: "",
  },
  sections: {
    attire: {
      illustration: PRINCESS_ANNE_ATTIRE_ILLUSTRATION,
      palette: PRINCESS_ANNE_ATTIRE_PALETTE,
    },
  },
  componentFlorals: PRINCESS_ANNE_COMPONENT_FLORAL_DECORATIONS,
  assets: {},
  libs: {
    icons: {
      provider: "lucide-react",
      importFrom: "@/client/libs/icons",
    },
    ui: [],
    motion: [],
    effects: [],
  },
  responsive: {
    strategy: "mobile-first",
    testWidths: [375, 768, 1280],
    requireNoHorizontalOverflow: true,
    respectReducedMotion: true,
  } satisfies ClientResponsiveConfig,
} satisfies ClientConfig;
