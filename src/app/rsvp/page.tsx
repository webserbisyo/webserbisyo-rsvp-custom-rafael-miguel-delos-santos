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

  return {
    title: `RSVP | ${buildPageTitle(result.event)}`,
    description: buildPageDescription(result.event),
    robots:
      result.event.previewMode === "dashboard" || result.event.raw.visibility === "private"
        ? { index: false, follow: false }
        : undefined,
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
