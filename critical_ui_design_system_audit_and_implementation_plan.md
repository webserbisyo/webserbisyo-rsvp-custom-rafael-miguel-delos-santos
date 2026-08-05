# Dianne Novio Wedding Website
## Critical UI, Design-System, Accessibility, and Implementation Audit

> **Audit Date:** 2026-08-06  
> **Repository:** `/Users/miguel/.gemini/antigravity/scratch/webserbisyo-rsvp-custom-rafael-miguel-delos-santos`  
> **Active Branch:** `client/dianne-novio-wedding`  
> **Current Head:** `8fa2f77c2375c5f26471eeae6db81cd269d02b6c`  
> **Status:** READ-ONLY INVESTIGATION & PLANNING PASS — Zero production source files were modified.

---

### 1. Executive Summary

- **Overall Health of UI Architecture:** The codebase utilizes a structured 3-tier architecture: Next.js 16 (App Router) + Tailwind CSS + Vanilla CSS custom properties (`client-theme.css`). Section rendering and surface roles are centralized through `client-section-registry.ts` and `ClientEventRenderer.tsx`. However, localized inline overrides, hardcoded Tailwind utilities/shadows, contrast gaps, and missing data-contract properties create visible UI/UX defects across six key sections.
- **Summary of Findings Count (17 Total):**
  - **P0 Critical:** 3 findings (RSVP Placeholder Contrast, RSVP Label Contrast, RSVP Floating Nav Obscuration)
  - **P1 High:** 4 findings (Countdown Box Height Clipping, Countdown Digit Transition Overlap, Music Center Icon Invisibility, RSVP Card/Shell Contrast Gap)
  - **P2 Medium:** 9 findings (Countdown 3-Digit Day Squeezing, Music Fallback Artist Title, Music Ignored `playButtonLabel` Prop, Venue Map Pin Orange Shadow, Attire Hardcoded Palette Array, Attire Inline Text Replacement, Sitemap Drawer Overlay Tint, Sitemap Drawer Hardcoded Background, Sitemap Drawer Missing Scroll Affordance)
  - **P3 Low:** 1 finding (Venue Card Arbitrary RGBA Shadows)
  - **Total:** 17 confirmed findings.
- **Most Serious Usability Problems:**
  1. **RSVP Form Contrast & Obscuration (P0):** On the RSVP page, dark inputs (`#2A2621`) and placeholder text (`#5B5247`) yield an unreadable contrast ratio of **1.96:1** (fails WCAG AA 4.5:1 requirement). Dark golden-brown labels (`#72501B`) on a dark card (`#1E1C18`) yield **2.33:1 contrast** (fails WCAG AA). Furthermore, the fixed bottom navigation dock (`fixed bottom-6 z-50`) obscures the "Submit RSVP" button on mobile viewports.
  2. **Countdown Number Clipping & Digit Overlap (P1):** The 4-column countdown card grid enforces an `h-10` (40px) height on mobile, while `--wedding-type-numeric-display-size` has a `clamp(2.4rem, 7.5vw, 5.5rem)` minimum of 38.4px. With `p-2` (16px vertical padding), the 38.4px Bodoni Moda numbers are forced into a 24px inner height box, causing vertical/horizontal clipping. Additionally, `AnimatePresence mode="popLayout"` with `y: -30` to `y: 30` transforms creates digit overlap during 1-second interval changes.
  3. **Music Center Icon Invisible (P1):** In `MusicSection.tsx`, the `Music4` center icon has class `text-cocoa` on a `#f9efe3` (light cream) disk. In `client-theme.css`, `[data-tone="olive"] :is(.text-cocoa)` is overridden with `!important` to `--wedding-text-on-dark` (`#FFF7E9`). As a result, the light cream icon renders over a light cream disk, rendering the music icon invisible (**1.07:1 contrast ratio**; fails WCAG 2.1 SC 1.4.11 3:1 non-text contrast requirement).
  4. **Music `playButtonLabel` Ignored (P2):** `build-client-view-model.ts` parses `musicEffects.playButtonLabel` from content props, but `MusicSection.tsx` ignores this prop and hardcodes `"Play Song"` in the JSX.
  5. **Attire Data Contract Gap (P2):** `AttireSection.tsx` hardcodes swatches as a local static JSX array (`Sand`, `Taupe`, `Sage Green`, `Dusty Blue`, `Shell Pink`). The current `ClientAttireData` interface has no `palette` property, making this a data-contract expansion rather than a simple JSX tweak.
- **Approved Primary RSVP Direction (Option B):**
  - Dark Espresso Page Shell (`#171512` / `var(--wedding-surface-dark)`)
  - Warm Ivory Form Card (`#FBF8F2` / `var(--wedding-surface-secondary)`)
  - Crisp White Field Surfaces (`#FFFFFF`) with Sand Border (`#D8C8A9`)
  - Soft-Black Form Text (`#1F1C18` $\rightarrow$ **16.01:1 contrast ratio**)
  - Deep Gold Labels (`#72501B` $\rightarrow$ **6.88:1 contrast ratio**)
  - Light Field Placeholder (`#5B5247` $\rightarrow$ **7.66:1 contrast ratio**)
  - Gold Primary Action Button (`#D8B76F` / `#9A7B45`) with dark text
  - Dark Selected Attendance State (`#171512`) with ivory text
- **Recommended Implementation Order:** Phase 0 (Baseline & Tokens) $\rightarrow$ Phase 1 (RSVP Surface Hierarchy [Option B], Readability & Obscuration) $\rightarrow$ Phase 2 (Countdown Responsive Grid & Animation Containment) $\rightarrow$ Phase 3 (Music Data Binding & Contrast) $\rightarrow$ Phase 4 (Sitemap Theme Alignment & Stateful Scroll Affordance) $\rightarrow$ Phase 5A (Venue Token Cleanup) $\rightarrow$ Phase 5B (Attire Palette Contract Expansion) $\rightarrow$ Phase 6 (Cross-Component Validation).
- **Confirmation:** Zero production source files, components, CSS stylesheets, configuration files, or tests were edited or modified.

---

### 2. Repository and Baseline Status

- **Current Branch:** `client/dianne-novio-wedding`
- **Git Status:** Only `critical_ui_design_system_audit_and_implementation_plan.md` is modified/untracked. All production code files remain 100% clean and untouched.
- **Current HEAD Commit:** `8fa2f77c2375c5f26471eeae6db81cd269d02b6c` (`fix(dianne): preserve love story portrait focal points`).
- **Music Section Baseline Confirmation:** `MusicSection.tsx` is confirmed in its reverted clean baseline state: rendering the centered `SpotlightCard` vinyl player with spinning disk, metadata text, and Play/Pause/Stop controls. All WEBP collage overlay assets are absent.
- **Styling Technologies Used:**
  - Next.js 16 App Router (`src/app/`)
  - Vanilla CSS custom properties (`src/client/styles/client-theme.css`, `src/styles/globals.css`)
  - Tailwind CSS (`tailwindcss` + `postcss`) with arbitrary utilities (e.g. `bg-[#2D1B12]/40`, `drop-shadow-[...]`)
  - Framer Motion (`framer-motion` `motion.div`, `AnimatePresence`)
  - Vaul Drawer (`vaul` primitive in `src/client/components/ui/drawer.tsx`)
- **Main Data / Configuration Sources:**
  - `EventWebsiteRenderModel` (`src/types/public-event.ts`)
  - `buildClientViewModel` (`src/client/types/build-client-view-model.ts`)
  - `clientSectionRegistry` (`src/client/client-section-registry.ts`)
  - Component props forwarded by `ClientEventRenderer.tsx`

---

### 3. Confirmed Findings by Section

#### A. Countdown Section

| ID | Severity | Visible Symptom | Exact File / Component | Exact Source | Root Cause | Responsive Impact | Accessibility Impact | Recommended Direction | Risk |
|---|---|---|---|---|---|---|---|---|---|
| CD-01 | **P1 High** | Numbers clipped vertically and horizontally on mobile screens | `src/client/sections/CountdownSection.tsx` | Line 138: `h-10 sm:h-14 md:h-20 lg:h-24` combined with `client-theme.css` Line 263: `--wedding-type-numeric-display-size: clamp(2.4rem, 7.5vw, 5.5rem)` | Font clamp minimum is `2.4rem` (38.4px). Card inner height at mobile is `h-10` (40px) minus `p-2` (16px padding) = 24px available height. 38.4px font in 24px box with `overflow-hidden` clips digits. | Severe clipping on screens $<640px$ | Low | Coordinated card & viewport strategy: 2-column grid on narrow mobile ($<640px$), 4-column at $\ge 640px$ (`sm`), explicit height scale (`h-12 sm:h-16 md:h-20 lg:h-24`), line-height 1, and mobile font clamp minimum `1.8rem`. | Low |
| CD-02 | **P1 High** | Exiting and entering digits overlap during 1s interval change | `src/client/sections/CountdownSection.tsx` | Lines 144–150: `<AnimatePresence mode="popLayout">` with `initial={{ y: -30, opacity: 0 }}` and `exit={{ y: 30, opacity: 0 }}` | `mode="popLayout"` takes the exiting digit out of flow, while `y: 30` moves it vertically across the entering digit inside a tight 24px box. | Visible jitter/overlap on seconds card every 1s | Low | Change animation mode to `mode="wait"` and reduce vertical translation offset to `y: -14` / `y: 14` with opacity fade. | Low |
| CD-03 | **P2 Medium** | 3-digit day counts (e.g. "256") squeeze against card edges | `src/client/sections/CountdownSection.tsx` | Line 130: `grid grid-cols-4 gap-2` and Line 139: `gap-0.5` | In 4-column layout at 320px screen width, individual card width is $\approx 65px$. 3 digits at 38.4px font width exceed 65px minus padding. | Squeezed text at 320px–375px viewports | Low | Allow 2-column grid on mobile ($<640px$), 4-column at $\ge 640px$, with `font-variant-numeric: tabular-nums`. | Low |

#### B. Music Section

| ID | Severity | Visible Symptom | Exact File / Component | Exact Source | Root Cause | Responsive Impact | Accessibility Impact | Recommended Direction | Risk |
|---|---|---|---|---|---|---|---|---|---|
| MS-01 | **P1 High** | Music note icon in center disk is completely invisible | `src/client/sections/MusicSection.tsx` & `src/client/styles/client-theme.css` | `MusicSection.tsx` Line 82: `<div className="... bg-[#f9efe3] text-cocoa">` & `client-theme.css` Line 300: `[data-tone="olive"] :is(.text-cocoa) { color: var(--wedding-text-on-dark) !important; }` | CSS rule for `[data-tone="olive"]` forces `text-cocoa` to `#FFF7E9` (light cream) via `!important`. Center disk background is `#f9efe3` (light cream). Cream icon on cream background = **1.07:1 contrast ratio** (fails 3:1 non-text WCAG requirement). | All viewports | High (icon invisible to all users) | Use semantic theme token `var(--wedding-text-primary)` (`#171512` $\rightarrow$ **16.04:1 contrast**) mapped without `!important` specificity conflicts. | Low |
| MS-02 | **P2 Medium** | Hardcoded fallback title "Wedding Ambience" adds unnecessary hierarchy | `src/client/utils/music-meta.ts` | Line 18: `fallbackArtist = "Wedding Ambience"` & Line 40: `return { displayTitle: title, displayArtist: fallbackArtist }` | `parseMusicMeta` appends "Wedding Ambience" whenever the title string lacks a `" - "` or `" by "` delimiter, creating redundant secondary copy. | Visual clutter | Low | Return empty `displayArtist` when no artist delimiter exists, rendering only the clean song title. | Low |
| MS-03 | **P2 Medium** | Client `playButtonLabel` prop is ignored in favor of hardcoded JSX string | `src/client/sections/MusicSection.tsx` & `src/client/types/build-client-view-model.ts` | `build-client-view-model.ts` parses `musicEffects.playButtonLabel`, but `MusicSection.tsx` Line 137 hardcodes `<span>Play Song</span>` | Component ignores client-configured idle button label prop. | All viewports | Medium | Use `musicEffects.playButtonLabel || "Play Song"` for idle state, while maintaining dynamic system-controlled labels (`"Pause"`, `"Resume"`, `"Stop"`) during active playback. | Low |

#### C. Location / Venue Section

| ID | Severity | Visible Symptom | Exact File / Component | Exact Source | Root Cause | Responsive Impact | Accessibility Impact | Recommended Direction | Risk |
|---|---|---|---|---|---|---|---|---|---|
| VN-01 | **P2 Medium** | Map pin has an intense warm-orange drop shadow glow | `src/client/sections/VenueSection.tsx` | Line 219: `<Pin className="... drop-shadow-[0_3px_6px_rgba(201,94,53,0.45)]" />` | Hardcoded terracotta/orange RGBA value `rgba(201, 94, 53, 0.45)` in Tailwind arbitrary class `drop-shadow-[...]`. | All viewports | Low (aesthetic mismatch) | Replace hardcoded RGBA drop-shadow with semantic theme token `var(--wedding-shadow-pin)` (`rgba(23, 21, 18, 0.35)` or `rgba(154, 123, 69, 0.35)`). | Low |
| VN-02 | **P3 Low** | Hardcoded RGBA shadows on left venue card and right map frame | `src/client/sections/VenueSection.tsx` | Line 175: `shadow-[0_12px_40px_rgba(139,104,58,0.06)]` & Line 216: `shadow-[0_16px_40px_rgba(139,104,58,0.12)]` | Direct hardcoded warm-brown RGBA values `rgba(139,104,58,...)` in Tailwind arbitrary shadow classes. | All viewports | Low | Replace arbitrary RGBA shadow classes with semantic theme token `var(--wedding-shadow-panel)`. | Low |

#### D. Attire Section

| ID | Severity | Visible Symptom | Exact File / Component | Exact Source | Root Cause | Responsive Impact | Accessibility Impact | Recommended Direction | Risk |
|---|---|---|---|---|---|---|---|---|---|
| AT-01 | **P2 Medium** | Color swatches and names are hardcoded in JSX file; data contract missing | `src/client/sections/AttireSection.tsx` & `src/client/types/client-view-model.ts` | `AttireSection.tsx` Lines 29–35: `const COLOR_PALETTE = [...]` & `ClientAttireData` interface | Static array inside section file overrides any dynamic client attire data; `ClientAttireData` contract lacks a `palette` property. | All viewports | Low | Expand data contract across render model, view-model builder, and section props (`Array<{ name: string; hex: string }>`), keeping `AttireSection` as a pure presentation component. | Medium |
| AT-02 | **P2 Medium** | Hardcoded string replacement logic for color notes | `src/client/sections/AttireSection.tsx` | Lines 47–61: `rawMotif.replace(/Ivory/gi, "Taupe")` | Custom string replacement logic hardcoded directly inside component rendering cycle. | All viewports | Low | Correct originating client data, remove replacement from rendering, and retain transitional view-model normalization only if legacy persisted records genuinely require it. | Low |

#### E. “More” / Sitemap Right-Side Drawer

| ID | Severity | Visible Symptom | Exact File / Component | Exact Source | Root Cause | Responsive Impact | Accessibility Impact | Recommended Direction | Risk |
|---|---|---|---|---|---|---|---|---|---|
| DR-01 | **P2 Medium** | Drawer backdrop creates a muddy warm-orange/sepia cast | `src/client/components/ui/drawer.tsx` | Line 30: `className={cn("fixed inset-0 z-[70] bg-[#2D1B12]/40 backdrop-blur-sm", className)}` | Hardcoded terracotta-brown `#2D1B12/40` overlay over warm ivory page creates an orange tint. | All viewports | Low | Replace hardcoded `bg-[#2D1B12]/40` with semantic overlay token `var(--wedding-overlay-dark)` (`#171512/60`). | Low |
| DR-02 | **P2 Medium** | Hardcoded off-white background on drawer content panel | `src/client/components/ui/drawer.tsx` | Line 45: `bg-[#FDFBF7]` | Direct hardcoded hex color `#FDFBF7` instead of theme variable `--wedding-surface-secondary`. | All viewports | Low | Replace hardcoded `bg-[#FDFBF7]` with semantic surface token `bg-[color:var(--wedding-surface-secondary)]`. | Low |
| DR-03 | **P2 Medium** | Mobile users unaware of additional links below viewport fold | `src/client/components/SitemapDrawer.tsx` | Line 134: `className="flex-1 min-h-0 overflow-y-auto ..."` | No visual scroll indicator or bottom gradient fade signals overflow on short screens ($<667px$ height). | Short mobile screens | Medium | Implement stateful scroll affordance attached directly to nested `overflow-y-auto` scroll container (`motion.div`), recalculating on open/scroll/resize. | Low |

#### F. RSVP Page

| ID | Severity | Visible Symptom | Exact File / Component | Exact Source | Root Cause | Responsive Impact | Accessibility Impact | Recommended Direction | Risk |
|---|---|---|---|---|---|---|---|---|---|
| RS-01 | **P0 Critical** | Form input placeholders have unreadable 1.96:1 contrast ratio | `src/client/rsvp/ClientRsvpForm.tsx` & `src/client/styles/client-theme.css` | `ClientRsvpForm.tsx` Lines 174, 196: `placeholder-[color:var(--wedding-text-tertiary)]` & `client-theme.css` Line 552: `--wedding-rsvp-field: #2A2621` & Line 61: `--wedding-text-tertiary: #5B5247` | `#5B5247` text on `#2A2621` field background yields **1.96:1 contrast** (fails WCAG AA 4.5:1 requirement). | All viewports | **Critical (fails WCAG AA)** | Under Option B, map RSVP input placeholders to `--wedding-text-tertiary` (`#5B5247` on `#FFFFFF` field), giving **7.66:1 contrast** (PASS). | Low |
| RS-02 | **P0 Critical** | Form field labels have weak 2.33:1 contrast ratio against dark card | `src/client/rsvp/ClientRsvpForm.tsx` & `src/client/styles/client-theme.css` | `ClientRsvpForm.tsx` Line 165: `wedding-rsvp-label` & `client-theme.css` Line 569: `.wedding-rsvp-label { color: var(--wedding-label-on-light); }` (`#72501B`) | `#72501B` text on `#1E1C18` card background yields **2.33:1 contrast** (fails WCAG AA 4.5:1 requirement). | All viewports | **Critical (fails WCAG AA)** | Under Option B, map `.wedding-rsvp-label` to `var(--wedding-label-on-light)` (`#72501B` on `#FBF8F2` card), giving **6.88:1 contrast** (PASS). | Low |
| RS-03 | **P0 Critical** | Floating bottom navigation dock obscures Submit RSVP button on mobile | `src/client/components/FloatingControlsLayer.tsx` & `src/client/rsvp/ClientRsvpPage.tsx` | `FloatingControlsLayer.tsx`: `fixed bottom-6 z-50` floating dock | On mobile devices, scrolling to the bottom of the RSVP form positions the floating nav dock directly over the "Submit RSVP" button. | Mobile viewports ($<640px$) | **Critical (blocks form submission)** | Implement Option B responsive clearance rule: `--wedding-floating-clearance` ($\approx 104px$ to $128px$) or hide floating dock on `/rsvp`. | Low |
| RS-04 | **P1 High** | Virtually zero visual separation between page shell and form card | `src/client/styles/client-theme.css` | Line 106: `--wedding-rsvp-page-background: #171512` & Line 107: `--wedding-rsvp-surface: #1E1C18` | Both page background (`#171512`) and card background (`#1E1C18`) are dark black/brown with **1.07:1 contrast ratio** (visual hierarchy concern). | All viewports | Medium | Implement Option B Warm Ivory Form Card architecture (`#FBF8F2`) for clear section continuity and 16.01:1 text contrast. | Low |

---

### 4. Data-Flow Findings

```
[Server Event Data] (EventWebsiteRenderModel)
       │
       ▼
[buildClientViewModel] (Normalizes couple, ceremony, venue, music, attire)
       │
       ├──────► Music Data Flow:
       │        musicEffects: { musicLink, musicTitle, shortNote, playButtonLabel }
       │        └──► forwarded to MusicSection props
       │        └──► registered via useAudio() hook into AudioContext
       │        └──► parseMusicMeta() parses "Title - Artist"
       │        └──► (Issue MS-02: fallback returns "Wedding Ambience" when no artist delimiter exists)
       │        └──► (Issue MS-03: playButtonLabel prop is forwarded but ignored by MusicSection.tsx JSX)
       │
       ├──────► Attire Data Flow:
       │        attireDressCode: { title, shortNote, dressCodeNote, colorMotifNote, sectionIntro }
       │        └──► forwarded to AttireSection props
       │        └──► (Issue AT-01: ClientAttireData interface lacks `palette` property; AttireSection renders hardcoded COLOR_PALETTE)
       │
       ├──────► Venue Data Flow:
       │        venue: { venueName, address, arrivalNote, mapsLink }
       │        └──► forwarded to VenueSection props
       │        └──► parseMapsLink() parses GPS coordinates or place queries for Google Maps embed iframe
       │
       └──────► RSVP Data Flow:
                rsvp_form section config
                └──► forwarded to ClientRsvpForm
                └──► submitPublicRsvp() posts to /api/public/rsvp
```

---

### 5. Hardcoded and Inline Style Inventory

| Value / Pattern | File | Current Purpose | Classification | Should Centralize? | Recommended Destination Token |
|---|---|---|---|---|---|
| `rgba(201,94,53,0.45)` | `VenueSection.tsx:219` | Map pin drop-shadow glow | Component decoration | Yes | `var(--wedding-shadow-pin)` |
| `rgba(139,104,58,0.06)` | `VenueSection.tsx:175` | Venue details card shadow | Component decoration | Yes | `var(--wedding-shadow-panel)` |
| `rgba(139,104,58,0.12)` | `VenueSection.tsx:216` | Map frame card shadow | Component decoration | Yes | `var(--wedding-shadow-panel)` |
| `COLOR_PALETTE` array | `AttireSection.tsx:29-35` | Swatch names & hex values | Dynamic Client Content | Partial (fallback only) | Contract expansion: `attireDressCode.palette` |
| `bg-[#2D1B12]/40` | `drawer.tsx:30` | Sitemap drawer backdrop overlay | Theme token candidate | Yes | `var(--wedding-overlay-dark)` (`#171512/60`) |
| `bg-[#FDFBF7]` | `drawer.tsx:45` | Sitemap drawer content background | Theme token candidate | Yes | `var(--wedding-surface-secondary)` |
| `bg-[#f9efe3]` | `MusicSection.tsx:82` | Spinning vinyl center disk fill | Component decoration | Yes | `var(--wedding-music-disc-center)` |
| `text-cocoa` (on disk) | `MusicSection.tsx:82` | Center disk icon color | Theme contrast conflict | Yes | `var(--wedding-text-primary)` (remove `!important` override) |
| `rgba(232, 201, 122, 0.20)` | `MusicSection.tsx:56` | SpotlightCard spotlight glow | Component parameter | No | Component-local parameter |
| `h-10 sm:h-14 md:h-20 lg:h-24` | `CountdownSection.tsx:138` | Countdown digit viewport height | Component layout | Yes | Coordinated `h-12 sm:h-16 md:h-20` scale |

---

### 6. RSVP Target Design Evaluation & Comparison

#### Option A: Dark Page Shell + Corrected Dark Form Card
- **Structure:** Dark page background (`#171512`), elevated dark card (`#24201B`), light inputs (`#1A1815`), warm ivory text (`#FFF7E9`), gold placeholders (`#CFC0AA` $\rightarrow$ 8.42:1 contrast), gold labels (`#D8B76F` $\rightarrow$ 8.85:1 contrast).
- **Pros:** Preserves overall dark context.
- **Cons:** Weaker visual separation from surrounding dark section block; validation and error messaging are harder to style cleanly on dark cards; higher risk of autofill color contrast breaks across mobile browsers.

#### Option B: Dark Page Shell + Warm Ivory Form Card (APPROVED PRIMARY DIRECTION)
- **Structure:**
  - **Page Shell:** Dark espresso background (`#171512` / `var(--wedding-surface-dark)`).
  - **Form Card:** Warm Ivory surface (`#FBF8F2` / `var(--wedding-surface-secondary)`), border `var(--wedding-panel-border)` (`#D8C8A9`).
  - **Primary Text:** Soft-Black (`#1F1C18` / `var(--wedding-text-primary)` $\rightarrow$ **16.01:1 contrast ratio**).
  - **Supporting Text:** Muted Dark-Brown (`#443D35` / `var(--wedding-text-secondary)`).
  - **Input Surfaces:** Crisp White (`#FFFFFF`) with subtle sand border (`#D8C8A9`), text `#1F1C18`, placeholder `#5B5247` ($\rightarrow$ **7.66:1 contrast ratio**).
  - **Form Labels:** Deep Gold / Terracotta (`#72501B` / `var(--wedding-label-on-light)` $\rightarrow$ **6.88:1 contrast ratio**).
  - **Primary Action (Submit):** Gold Fill (`#D8B76F` / `#9A7B45`) with dark text (`#171512`).
  - **Attendance Choices (Selected):** Dark Espresso Fill (`#171512`) with Ivory Text (`#FFF7E9`).
  - **Attendance Choices (Unselected):** Crisp White surface with dark text (`#1F1C18`) and sand border (`#D8C8A9`).
- **Why Option B is Preferred:**
  1. **Strong Visual Hierarchy:** Creates a striking focal card that draws immediate guest focus upon landing on `/rsvp`.
  2. **Superior Form Readability:** Light card with dark text provides an outstanding **16.01:1 contrast ratio** for body copy.
  3. **Theme Continuity:** Perfectly echoes the alternating light/dark section rhythm established throughout the website.
  4. **Unbeatable Usability & Validation Clarity:** Field errors (`#A84F45`), checkmarks (`#4F7D5A`), and focus rings (`#72501B`) are instantly legible.
  5. **Maintainability:** Standard HTML input defaults and browser autofill perform reliably on light form fields.

---

### 7. RSVP Floating-Navigation Clearance Strategy

#### Option A: Universal Fixed `pb-36` Padding
- Adds static `pb-36` (144px) padding to the bottom of the RSVP page wrapper. Simple, but can create excessive whitespace on tall desktop viewports while remaining brittle if dock height changes.

#### Option B: Coordinated Responsive Clearance Rule (RECOMMENDED)
- **Calculation:**
  $$\text{Clearance} = \text{Dock Height } (56\text{px}) + \text{Bottom Offset } (24\text{px}) + \text{Safe Area Inset } (\text{env}) + \text{Buffer } (24\text{px}) \approx 104\text{px} \text{ to } 128\text{px}$$
- **CSS Implementation:** Define `--wedding-floating-clearance: calc(56px + 24px + env(safe-area-inset-bottom, 0px) + 24px)` in `client-theme.css`.
- **Page Layout Rule:** Apply `pb-[var(--wedding-floating-clearance)]` on `ClientRsvpPage.tsx`. On mobile viewports ($<640px$), the form container maintains guaranteed clearance above the dock. Alternatively, hide the floating dock when `pathname === '/rsvp'`.

---

### 8. Countdown Section Coordinated Sizing & Containment Strategy

1. **Responsive Grid Layout:**
   - Default / narrow mobile ($<640px$): 2-column grid (`grid-cols-2 gap-3 sm:gap-4`) so 3-digit day counts ("256") never squeeze.
   - `sm` and above ($\ge 640px$): 4-column grid (`sm:grid-cols-4`). (Selected large-mobile 4-column layouts may be reconsidered only after manual browser verification).
2. **Coordinated Viewport Height & Font Clamp:**
   - Card height scale: `h-12 sm:h-16 md:h-20 lg:h-24`.
   - Font clamp scale: `--wedding-type-numeric-display-size: clamp(1.8rem, 6.5vw, 5.5rem)`.
   - Line-height: strictly `1.0`.
3. **Digit Transition Containment:**
   - Change `AnimatePresence` mode from `popLayout` to `mode="wait"`.
   - Reduce vertical translation offset from `y: 30` to `y: 14` (initial `y: -14`, exit `y: 14`) with opacity fade.
   - Ensures exiting digits fade out completely before entering digits animate, eliminating overlap jitter and preserving zero layout shift.

---

### 9. Music Data-Binding & Button-Label Resolution

- **Finding MS-03 Details:** `build-client-view-model.ts` parses `musicEffects.playButtonLabel` from section content props. However, `MusicSection.tsx` line 137 hardcodes `<span>Play Song</span>` in JSX.
- **Target Resolution:**
  1. Use `musicEffects.playButtonLabel || "Play Song"` for the initial idle state label.
  2. Use system-controlled state labels during active playback (`"Pause"`, `"Resume"`, `"Stop"`).
  3. Include ARIA live region announcements for loading, playing, paused, and error states.
  4. Keep song title strictly bound to `musicEffects.musicTitle`.
  5. Remove "Wedding Ambience" fallback from `parseMusicMeta()`.

---

### 10. Attire Data-Model & Presentation Architecture

- **Target Presentation Architecture:** `AttireSection` remains a pure presentation component and must **not** own client-specific palette values.
- **Contract Gap Analysis:** `ClientAttireData` currently contains only text fields (`title`, `shortNote`, `dressCodeNote`, `colorMotifNote`, `sectionIntro`). It has **no** `palette` property.
- **Backward Compatibility Evaluation:**
  - **Approach A (Recommended):** Populate structured palette in Dianne's client/default event data.
  - **Approach B:** Normalize legacy structured defaults in the view-model layer (`build-client-view-model.ts`).
  - **Approach C:** Temporarily retain a compatibility fallback outside the section component, clearly marked for later removal.
- **AT-02 Text Normalization Resolution:**
  - Correct the originating client data.
  - Remove hardcoded `Ivory -> Taupe` replacement from component rendering.
  - Add transitional view-model normalization only if persisted legacy records genuinely require it, with an explicit deprecation condition.

---

### 11. Stateful Drawer Scroll Affordance Design

- **Target Element:** Scroll listeners and measurements attach directly to the nested element using `overflow-y-auto` (`motion.div` content wrapper in `SitemapDrawer.tsx`), NOT to the outer `DrawerContent` frame.
- **Stateful Detection & Recalculation:**
  - Recalculate state when: drawer opens, user scrolls, viewport resizes, device orientation changes, or content size changes.
  - Calculate: $\text{hasOverflow} = \text{scrollHeight} > \text{clientHeight}$.
  - Calculate: $\text{isAtBottom} = \text{scrollTop} + \text{clientHeight} \ge \text{scrollHeight} - 8\text{px}$.
  - Show bottom gradient mask (`pointer-events-none`) when $\text{hasOverflow} \land \neg\text{isAtBottom}$.
  - Clean up scroll listeners and `ResizeObserver` on component unmount.
  - Respect `@media (prefers-reduced-motion: reduce)` with instant fade transitions.

---

### 12. Recalculated Contrast Ratios (Empirical Audit)

| Text / Element | Background | Exact Colors | Contrast Ratio | WCAG AA Requirement | Compliance Verdict |
|---|---|---|:---:|:---:|:---:|
| RSVP Placeholder (Current) | RSVP Dark Field | `#5B5247` on `#2A2621` | **1.96:1** | $\ge 4.5:1$ | **FAIL (P0 Text)** |
| RSVP Label (Current) | RSVP Dark Card | `#72501B` on `#1E1C18` | **2.33:1** | $\ge 4.5:1$ | **FAIL (P0 Text)** |
| Music Center Icon (Current) | Vinyl Disk Label | `#FFF7E9` on `#F9EFE3` | **1.07:1** | $\ge 3.0:1$ | **FAIL (P1 Non-Text Graphical Control)** |
| Page Shell vs Card (Current) | Page Shell | `#1E1C18` on `#171512` | **1.07:1** | Visual hierarchy concern | **POOR (P1 Surface Separation)** |
| RSVP Placeholder (Option B) | Light Input Field | `#5B5247` on `#FFFFFF` | **7.66:1** | $\ge 4.5:1$ | **PASS** |
| RSVP Label (Option B) | Warm Ivory Card | `#72501B` on `#FBF8F2` | **6.88:1** | $\ge 4.5:1$ | **PASS** |
| RSVP Body Text (Option B) | Warm Ivory Card | `#1F1C18` on `#FBF8F2` | **16.01:1** | $\ge 4.5:1$ | **PASS** |
| RSVP Placeholder (Option A) | Corrected Dark Field | `#CFC0AA` on `#2A2621` | **8.42:1** | $\ge 4.5:1$ | **PASS** |
| RSVP Label (Option A) | Corrected Dark Card | `#D8B76F` on `#1E1C18` | **8.85:1** | $\ge 4.5:1$ | **PASS** |
| Music Center Icon (Fixed) | Vinyl Disk Label | `#171512` on `#F9EFE3` | **16.04:1** | $\ge 3.0:1$ | **PASS** |

---

### 13. Evidence-Based Certainty Classification

- **Code-Confirmed Defects:**
  - RSVP label class `.wedding-rsvp-label` maps to `#72501B` (`--wedding-label-on-light`), giving 2.33:1 contrast on dark card (Code line confirmed).
  - RSVP placeholder maps to `#5B5247`, giving 1.96:1 contrast on `#2A2621` field (Code line confirmed).
  - Music icon `text-cocoa` is overridden by `!important` rule in `client-theme.css` line 300 to `#FFF7E9` on `#F9EFE3` disk (1.07:1 contrast) (Code line confirmed).
  - `MusicSection.tsx` ignores `musicEffects.playButtonLabel` prop (Code line confirmed).
  - `ClientAttireData` interface lacks `palette` property (Code file confirmed).
  - `VenueSection.tsx` line 219 contains hardcoded terracotta RGBA `drop-shadow-[0_3px_6px_rgba(201,94,53,0.45)]` (Code line confirmed).
  - `drawer.tsx` line 30 contains hardcoded `#2D1B12/40` overlay (Code line confirmed).
- **Strong Code-Based Inferences:**
  - Fixed `h-10` container height in `CountdownSection.tsx` causes 38.4px font clipping on mobile.
  - Floating bottom dock (`fixed bottom-6 z-50`) overlaps Submit RSVP button on mobile viewports.
- **Manual Browser Verification Required (Post-Implementation):**
  - Visual feel of countdown digit transition animation.
  - Touch scrolling and stateful fade mask behavior on short-height mobile drawer.
  - Mobile browser autofill background appearance on RSVP inputs.
  - Large-mobile 4-column countdown grid viability.
- **Design Decisions Approved:**
  - Adoption of Option B (Warm Ivory Form Card) for RSVP page.

---

### 14. Revised Implementation Plan & Phase Order

#### Phase 0 — Baseline and Token Decisions
- **Objective:** Establish semantic theme tokens for drawer overlay, map pin shadow, and form surfaces in `client-theme.css`.
- **Affected Files:** `src/client/styles/client-theme.css`.
- **Validation:** `npm test`, `npx tsc --noEmit`.

#### Phase 1 — RSVP Surface Hierarchy, Readability, Field States & Clearance (P0 Critical)
- **Objective:** Implement Option B Warm Ivory Form Card architecture, resolve contrast failures (16.01:1 text contrast), and establish floating navigation bottom clearance rule.
- **Affected Files:** `src/client/rsvp/ClientRsvpPage.tsx`, `src/client/rsvp/ClientRsvpForm.tsx`, `src/client/styles/client-theme.css`.
- **Validation:** Typecheck, lint, unit tests.

#### Phase 2 — Countdown Responsive Card and Animation Containment (P1 High)
- **Objective:** Fix numerical clipping via 2-column/4-column responsive grid (`<640px` $\rightarrow$ 2 cols), coordinated `h-12 sm:h-16 md:h-20` height scale, minimum font clamp `1.8rem`, and `mode="wait"` transition containment.
- **Affected Files:** `src/client/sections/CountdownSection.tsx`, `src/client/styles/client-theme.css`.
- **Validation:** Typecheck, build.

#### Phase 3 — Music Data Binding, Fallback Removal, Icon Contrast & State Labels (P1 High / P2 Medium)
- **Objective:** Fix center icon contrast (`16.04:1`), wire `musicEffects.playButtonLabel` for idle state, support playback state labels, and remove "Wedding Ambience" fallback.
- **Affected Files:** `src/client/sections/MusicSection.tsx`, `src/client/utils/music-meta.ts`, `src/client/styles/client-theme.css`.
- **Validation:** Unit tests (`npm test`).

#### Phase 4 — Sitemap Theme Alignment & Stateful Scroll Affordance (P2 Medium)
- **Objective:** Replace hardcoded `#2D1B12/40` overlay with `var(--wedding-overlay-dark)` and implement stateful scroll affordance indicator attached to `overflow-y-auto` container for short viewports.
- **Affected Files:** `src/client/components/ui/drawer.tsx`, `src/client/components/SitemapDrawer.tsx`.
- **Validation:** Typecheck, lint.

#### Phase 5A — Venue Decorative-Token Cleanup (P2 Medium)
- **Objective:** Replace hardcoded terracotta RGBA drop shadow with semantic token `var(--wedding-shadow-pin)` and normalize panel shadows.
- **Affected Files:** `src/client/sections/VenueSection.tsx`.
- **Validation:** Typecheck, build.

#### Phase 5B — Attire Structured-Palette Data-Model Design & Implementation (P2 Medium)
- **Objective:** Expand data contract across render model, view-model builder, and component props (`Array<{ name: string; hex: string }>`) to support dynamic attire palettes cleanly.
- **Affected Files:** `src/types/public-event.ts`, `src/lib/event-website-section-contract.ts`, `src/client/types/build-client-view-model.ts`, `src/client/types/client-view-model.ts`, `src/client/sections/AttireSection.tsx`.
- **Validation:** Typecheck, lint, unit tests, build.

#### Phase 6 — Cross-Component Cleanup & Validation
- **Objective:** Final static code validation suite.
- **Affected Files:** None (validation only).
- **Validation:** `npm run validate` (`guard:neutral-starter` + `typecheck` + `lint` + `build`).

---

### 15. Recommended Validation Plan

All automated verification must use the project's existing script commands:

```bash
# Static validation commands:
npx tsc --noEmit
npm run lint
npm run test
npm run guard:neutral-starter
npm run build
```

*(Note: Playwright browser automation is explicitly prohibited per audit constraints).*

---

### 16. Final Prioritized Action Register

| Priority | Action | Why | Dependency | Estimated Risk |
|---|---|---|---|---|
| **P0** | Implement RSVP Option B Warm Ivory Form Card & fix label/placeholder contrast | Contrast ratio 1.96:1 & 2.33:1 violates WCAG AA requirement | Phase 0 | Low |
| **P0** | Add responsive bottom clearance rule for floating nav on RSVP Page | Floating dock obscures Submit RSVP button on mobile | Phase 0 | Low |
| **P1** | Implement Countdown coordinated card height, font clamp & `mode="wait"` | 38.4px font in 24px box causes digit clipping & transition overlap | Phase 0 | Low |
| **P1** | Fix Music center icon contrast via semantic token | CSS `!important` rule forces cream icon on cream disk (1.07:1 contrast) | Phase 0 | Low |
| **P1** | Elevate RSVP card/shell separation | 1.07:1 contrast ratio between page shell and card surface | Phase 0 | Low |
| **P2** | Wire `musicEffects.playButtonLabel` prop in `MusicSection.tsx` | Prop is currently forwarded but ignored in favor of hardcoded JSX string | None | Low |
| **P2** | Remove "Wedding Ambience" fallback from `parseMusicMeta` | Eliminates redundant secondary text when no artist delimiter exists | None | Low |
| **P2** | Replace Venue map pin terracotta RGBA drop shadow with semantic token | `rgba(201,94,53,0.45)` violates muted gold/champagne theme | Phase 0 | Low |
| **P2** | Replace Sitemap drawer `#2D1B12/40` overlay with semantic token | Hardcoded brown overlay causes muddy orange backdrop tint | Phase 0 | Low |
| **P2** | Add stateful scroll affordance mask to Sitemap drawer | Mobile users unaware of menu links below the fold on short viewports | None | Low |
| **P2** | Remove hardcoded `Ivory -> Taupe` replacement from rendering | Correct originating client data instead of inline rendering hacks | None | Low |
| **P2** | Expand Attire data contract to support dynamic `palette` array | Component currently hardcodes static array, ignoring client data | Contract update | Medium |
| **P3** | Replace Venue arbitrary RGBA shadows with `var(--wedding-shadow-panel)` | Normalizes shadow architecture | Phase 0 | Low |

---

### 17. Final Audit Verdict

- **Approved RSVP Direction:** Option B (Warm Ivory Form Card) is approved as the primary implementation direction.
- **Implementation Planning Readiness:** Phase 0 and Phase 1 are READY for implementation planning.
- **Confirmed Findings Count:** 17 confirmed findings (3 P0 Critical, 4 P1 High, 9 P2 Medium, 1 P3 Low).
- **Manual Browser Validation:** Remains required post-implementation for visual motion feel, autofill appearance, and safe-area clearance.
- **Source Code Integrity Confirmation:** Confirmed that **zero** production source files, stylesheets, components, or test files were edited during this report pass.
- **Browser Automation:** Playwright was **NOT** used.
