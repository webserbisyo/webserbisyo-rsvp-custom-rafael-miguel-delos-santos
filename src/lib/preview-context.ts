import type { PublicEnv } from "@/lib/env";
import { normalizePrivateAccessToken } from "@/lib/private-access";

export type PreviewQuery = Record<string, string | string[] | undefined>;

export type PreviewContext = {
  accessToken?: string;
  eventSlug: string;
  previewMode?: "dashboard";
  querySource?: string;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "").trim() : (value ?? "").trim();
}

function safeSlug(value: string): string {
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(value) ? value : "";
}

function safeSource(value: string): string | undefined {
  const clean = value.toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(clean) ? clean : undefined;
}

export function getPreviewContext(env: PublicEnv, query?: PreviewQuery): PreviewContext {
  const preview = firstValue(query?.preview).toLowerCase();
  const accessToken = normalizePrivateAccessToken(firstValue(query?.access));
  const querySource = safeSource(firstValue(query?.source));
  const dashboardPreview = preview === "dashboard" || querySource === "dashboard";
  const querySlug = safeSlug(firstValue(query?.eventSlug));
  const canUseQuerySlug = Boolean(querySlug && (dashboardPreview || env.designMode || process.env.NODE_ENV === "development"));

  return {
    accessToken: accessToken ?? undefined,
    eventSlug: canUseQuerySlug ? querySlug : env.eventSlug,
    previewMode: dashboardPreview ? "dashboard" : undefined,
    querySource
  };
}
