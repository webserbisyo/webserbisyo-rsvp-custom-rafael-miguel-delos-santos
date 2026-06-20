// Runtime override wiring is intentionally deferred.
// This file exists only to establish a future-safe client boundary.
// Phase 5 supports only a page-level client renderer switch.
// Do not import this registry into EventWebsiteRenderer yet.
// Section-level override wiring remains deferred.

export type ClientSectionKey = string;
export type ClientSectionRegistry = Record<ClientSectionKey, unknown>;

export const clientRegistry = {} satisfies ClientSectionRegistry;
