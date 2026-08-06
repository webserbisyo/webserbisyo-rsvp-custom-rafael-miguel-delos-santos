import type { MetadataRoute } from "next";
import { WEDDING_BROWSER_THEME_COLOR } from "@/config/browser-theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WebSerbisyo RSVP Event",
    short_name: "WebSerbisyo RSVP",
    description: "A custom invitation powered by WebSerbisyo RSVP.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: WEDDING_BROWSER_THEME_COLOR,
    theme_color: WEDDING_BROWSER_THEME_COLOR,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
