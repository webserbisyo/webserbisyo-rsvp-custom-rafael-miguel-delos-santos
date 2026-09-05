import type { MetadataRoute } from "next";
import { loadPublicEvent } from "@/app/public-event-loader";
import { clientConfig } from "@/client/client.config";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const result = await loadPublicEvent();
  let coupleDisplayName = clientConfig.identity.displayName || "Wedding Celebration";
  let description = "A wedding celebration invitation powered by WebSerbisyo RSVP.";

  if (result.status === "available" && result.event) {
    if (result.event.coupleDisplayName) {
      coupleDisplayName = result.event.coupleDisplayName;
    } else if (result.event.title) {
      coupleDisplayName = result.event.title;
    }
    description = `Join ${coupleDisplayName} as they celebrate their wedding. View event details and RSVP online.`;
  }

  const name = `${coupleDisplayName} — Wedding Celebration`;
  const shortName = coupleDisplayName;

  return {
    name,
    short_name: shortName,
    description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffaf4",
    theme_color: "#c96b48",
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
