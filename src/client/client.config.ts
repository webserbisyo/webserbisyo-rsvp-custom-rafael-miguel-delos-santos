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
  assets: Record<string, unknown>;
  libs: ClientLibsConfig;
  responsive: ClientResponsiveConfig;
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

export const DIANNE_ATTIRE_ILLUSTRATION: ClientAttireIllustrationConfig = {
  src: "/images/attire/dianne-attire-illustration.webp",
  alt: "Tropical formal guest outfit examples in cocoa black, sage olive, warm taupe, and muted gold.",
  width: 2752,
  height: 1536,
};

export const DIANNE_ATTIRE_PALETTE: ClientAttireConfigItem[] = [
  { label: "Champagne", color: "#D8C8A9" },
  { label: "Muted Gold", color: "#9A7B45" },
  { label: "Sage Olive", color: "#7A836B" },
  { label: "Warm Taupe", color: "#A99583" },
  { label: "Cocoa Black", color: "#3A302A" },
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
    id: "refined-midnight-garden",
    preset: "refined-midnight-garden",
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
      illustration: DIANNE_ATTIRE_ILLUSTRATION,
      palette: DIANNE_ATTIRE_PALETTE,
    },
  },
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
