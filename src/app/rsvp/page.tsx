import type { Metadata } from "next";
import { ClientPageFrame } from "@/client/components";
import { clientConfig } from "@/client/client.config";
import { ClientRsvpPage } from "@/client/rsvp";
import { loadPublicEvent } from "@/app/public-event-loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { buildPageDescription, buildPageTitle } from "@/lib/metadata";
import { type PreviewQuery } from "@/lib/preview-context";

type PageProps = {
  searchParams?: Promise<PreviewQuery>;
};

export async function generateMetadata({ searchParams }: PageProps = {}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const result = await loadPublicEvent(resolvedSearchParams);

  if (result.status !== "available") {
    return {
      title: "RSVP | Event Unavailable",
      description: "This event RSVP page is not currently available.",
    };
  }

  const publicEventUrl =
    process.env.PUBLIC_EVENT_URL?.replace(/\/+$/, "") ??
    "https://rafael-and-isabella.rsvp.webserbisyo.com";

  const title = `RSVP | ${buildPageTitle(result.event)}`;
  const description = buildPageDescription(result.event);
  const ogImageUrl = `${publicEventUrl}/opengraph-image`;

  return {
    title,
    description,
    robots:
      result.event.previewMode === "dashboard" || result.event.raw.visibility === "private"
        ? { index: false, follow: false }
        : undefined,
    openGraph: {
      title,
      description,
      url: `${publicEventUrl}/rsvp`,
      type: "website",
      siteName: "WebSerbisyo RSVP",
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function RsvpPage({ searchParams }: PageProps) {
  const result = await loadPublicEvent(await searchParams);

  if (result.status === "setup_error") {
    return <EmptyState title="Website setup required" message={result.message} />;
  }

  if (result.status !== "available") {
    return <EmptyState title="Event unavailable" message={result.message} />;
  }

  return (
    <ClientPageFrame config={clientConfig} event={result.event}>
      <ClientRsvpPage config={clientConfig} event={result.event} />
    </ClientPageFrame>
  );
}
