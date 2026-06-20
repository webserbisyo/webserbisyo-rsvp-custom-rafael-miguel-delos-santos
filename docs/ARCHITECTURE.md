# Architecture

This repo is the reusable frontend-only WebSerbisyo RSVP custom starter.

Current audited runtime:

- app entry: `src/app/page.tsx`
- page wrapper: `src/components/platform/PublicEventPageContent.tsx`
- active body renderer: `src/components/platform/EventWebsiteRenderer.tsx`

Current runtime behavior:

- data is loaded in `src/app/page.tsx`
- public API fetch and normalization stay in `src/lib/*`
- `EventWebsiteRenderer.tsx` is the active centralized renderer
- RSVP is inline-only within the one-page flow

Current non-runtime code:

- `src/components/sections/*` is not active in the current runtime path
- `src/components/layout/*` is not active in the current runtime path

Protected baseline:

- the active renderer is parity-sensitive and should be treated as protected
- the data adapter layer is protected
- the public API remains platform-owned

Recommended next architecture direction:

- Option 2 is the safest next step
- add a future `src/client/` boundary
- add client config/docs/guard support
- add only limited safe override mechanisms later

Deferred/riskier direction:

- a full section-slot system across all base renderer sections is deferred
- it is riskier because `EventWebsiteRenderer.tsx` is monolithic and tightly coupled to the current baseline

Layer model:

- Layer 0: platform core outside this repo
- Layer 1: protected starter baseline inside this repo
- Layer 2: planned future client layer under `src/client/`
