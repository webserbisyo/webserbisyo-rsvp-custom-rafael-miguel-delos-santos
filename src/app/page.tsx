import type { Metadata } from "next";
import { ClientPageFrame } from "@/client/components";
import { clientConfig } from "@/client/client.config";
import { ClientEventRenderer } from "@/client/renderer";
import { loadPublicEvent } from "@/app/public-event-loader";
import { PublicEventPageContent } from "@/components/platform/PublicEventPageContent";
import { EmptyState } from "@/components/ui/EmptyState";
import { templateBranding } from "@/config/template-branding";
import { buildPageDescription, buildPageTitle, safePublicCanonicalUrl } from "@/lib/metadata";
import { type PreviewQuery } from "@/lib/preview-context";

type PageProps = {
  searchParams?: Promise<PreviewQuery>;
};

export async function generateMetadata({ searchParams }: PageProps = {}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const result = await loadPublicEvent(resolvedSearchParams);

  if (result.status !== "available") {
    return {
      title: "Event Unavailable | WebSerbisyo RSVP",
      description: "This event website is not currently available.",
    };
  }

  const publicEventUrl =
    process.env.PUBLIC_EVENT_URL?.replace(/\/+$/, "") ??
    "https://rafael-and-isabella.rsvp.webserbisyo.com";

  const canonical =
    result.event.previewMode === "dashboard"
      ? undefined
      : (safePublicCanonicalUrl(result.event.publicUrl) ?? publicEventUrl);
  const shouldNoIndex =
    result.event.previewMode === "dashboard" || result.event.raw.visibility === "private";

  const title = buildPageTitle(result.event);
  const description = buildPageDescription(result.event);

  return {
    metadataBase: new URL(publicEventUrl),
    title,
    description,
    alternates: shouldNoIndex || !canonical ? undefined : { canonical },
    robots: shouldNoIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: publicEventUrl,
      type: "website",
      siteName: templateBranding.social.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const result = await loadPublicEvent(await searchParams);

  if (result.status === "setup_error") {
    return <EmptyState title="Website setup required" message={result.message} />;
  }

  if (result.status !== "available") {
    return <EmptyState title="Event unavailable" message={result.message} />;
  }

  const { renderer } = clientConfig;
  const useClientRenderer = renderer.mode === "client" && renderer.allowClientRenderer;

  return (
    <ClientPageFrame config={clientConfig} event={result.event} floatingControlsManaged={useClientRenderer}>
      {useClientRenderer ? (
        <ClientEventRenderer config={clientConfig} event={result.event} />
      ) : (
        <PublicEventPageContent event={result.event} />
      )}
    </ClientPageFrame>
  );
}
