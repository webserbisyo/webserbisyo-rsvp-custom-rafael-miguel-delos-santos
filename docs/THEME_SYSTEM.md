# Theme System

Use CSS variables and Tailwind token aliases. Do not spread one-off color edits across section components.

Core files:

- `src/styles/tokens.css`
- `src/styles/theme.css`
- `src/styles/typography.css`
- `src/styles/components.css`
- `src/styles/globals.css`
- `tailwind.config.ts`

Token families:

- background
- surface
- text
- muted
- primary / terracotta
- sage
- gold
- border
- focus
- radius
- shadow
- success / warning / error

Default starter tone:

- main platform public preview baseline
- ivory public page wrapper
- centered white event preview frame
- section label pills
- clean card rhythm
- restrained platform dividers

The starter runtime must not ship a client-specific default theme. Client-specific visual direction belongs only in cloned client repos, and should be token-driven before changing component color classes.

Optional preset examples may be documented for future client repos, but must not become starter defaults:

- `tagaytay-garden-classic`
- `filipiniana-ivory`
- `editorial-cocoa`
- `cinematic-champagne`

Client repos may override tokens for approved design direction. Platform section keys and data parsing must not be changed for theme work.

`lucide-react` is allowed in the starter only because it matches the platform visual baseline and is isolated behind `src/components/platform/platform-icons.tsx`.

Do not install or import shadcn, ReactBits, Motion, GSAP, or Framer Motion in the starter default. Client repos may add those libraries after the platform baseline works and the customization notes document the contract risks.
