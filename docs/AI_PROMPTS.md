# AI Prompts

## Styling-only edits

Read `AGENTS.md`, `docs/DO_NOT_BREAK.md`, `docs/DATA_CONTRACT.md`, `docs/SECTIONS.md`, `docs/ARCHITECTURE.md`, `docs/MODES.md`, and `docs/THEME_SYSTEM.md`. Update only styling, CSS variables, and frontend components. Do not change API paths, env names, section keys, RSVP behavior, live placeholder rules, or the platform renderer baseline.

## Restoring the platform baseline

Read the main platform `EventWebsiteRenderer`, public page wrapper, render model, public event DTO builder, and public `event-preview-*` CSS before changing runtime structure. The starter default must track that platform renderer. Do not invent a starter-only shell, marketing navbar, hero layout, direct RSVP form, or client theme.

Icon polish must go through `src/components/platform/platform-icons.tsx`. Do not import icon libraries directly in the renderer.

## Adding a section

Read `AGENTS.md`, `docs/DO_NOT_BREAK.md`, `docs/DATA_CONTRACT.md`, `docs/SECTIONS.md`, and `docs/ARCHITECTURE.md`. Add the section only if the platform key exists. Update registry, types, docs, visibility handling, and tests/checks. Unknown keys must remain safe.

## Debugging fetch/data issues

Read `AGENTS.md`, `docs/DO_NOT_BREAK.md`, `docs/DATA_CONTRACT.md`, `docs/SECTIONS.md`, and `docs/ARCHITECTURE.md`. Inspect `src/lib/env.ts`, `src/lib/urls.ts`, `src/lib/public-event-api.ts`, and `src/lib/normalize-public-event.ts`. Do not add admin APIs, Supabase, or draft content fetching.

## Media or gift QR edits

Read `docs/ASSET_SYSTEM.md` and `docs/MEDIA_GUIDE.md`. Demo media is allowed only in design mode. Live mode must render real public media from the platform or text-only/neutral missing-media UI.

## RSVP edits

Starter RSVP is platform-owned and inline. Do not depend on removed platform RSVP routes, embedded RSVP modes, `PublicRsvpResponseForm`, platform server actions, Supabase logic, or direct submission handlers. True submission wiring requires a future official public submission API contract.

## Preparing a per-client custom repo

Read `AGENTS.md`, `docs/DO_NOT_BREAK.md`, `docs/DATA_CONTRACT.md`, `docs/SECTIONS.md`, `docs/ARCHITECTURE.md`, and `docs/CUSTOMIZATION_LAYER.md`. Keep the repo frontend-only. First verify the baseline against the main platform preview, then replace styles/assets with client-approved public content, set the event slug, deploy to Vercel, and paste the hidden origin in Super Admin.
