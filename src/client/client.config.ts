import type { ClientAnchorHref } from "@/client/components/client-nav-utils";

export type ClientNavLinkConfig = {
  label: string;
  href: ClientAnchorHref;
};

export type ClientRsvpHomepageMode = "inline-form" | "compact-form" | "cta-only";

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
    preset: string;
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
  nav: {
    links: readonly ClientNavLinkConfig[];
  };
  footer: {
    text: string;
  };
  sections: Record<string, unknown>;
  assets: Record<string, unknown>;
  libs: ClientLibsConfig;
  responsive: ClientResponsiveConfig;
};

export const clientConfig = {
  mode: "starter",
  renderer: {
    mode: "client",
    allowClientRenderer: true
  } satisfies ClientRendererConfig,
  rsvp: {
    dedicatedPageEnabled: true,
    dedicatedPagePath: "/rsvp",
    homepageMode: "inline-form"
  },
  identity: {
    displayName: "",
    subtitle: ""
  },
  theme: {
    preset: "starter-neutral",
    fonts: {
      heading: "",
      body: ""
    },
    tokens: {}
  },
  layout: {
    navEnabled: true,
    footerEnabled: false
  },
  nav: {
    links: [
      { label: "Gallery", href: "#gallery" },
      { label: "Countdown", href: "#countdown" },
      { label: "Ceremony", href: "#ceremony" },
      { label: "Venue", href: "#venue" },
      { label: "Reception", href: "#reception" },
      { label: "Timeline", href: "#timeline" },
      { label: "Entourage", href: "#entourage" },
      { label: "Attire", href: "#attire" },
      { label: "Details", href: "#extra-info" }
    ] satisfies readonly ClientNavLinkConfig[]
  },
  footer: {
    text: ""
  },
  sections: {},
  assets: {},
  libs: {
    icons: {
      provider: "lucide-react",
      importFrom: "@/client/libs/icons"
    },
    ui: [],
    motion: [],
    effects: []
  },
  responsive: {
    strategy: "mobile-first",
    testWidths: [375, 768, 1280],
    requireNoHorizontalOverflow: true,
    respectReducedMotion: true
  } satisfies ClientResponsiveConfig
} satisfies ClientConfig;
