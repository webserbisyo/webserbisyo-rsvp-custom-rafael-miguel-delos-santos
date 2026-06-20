# Design System

Default styling follows the main platform public/account preview renderer: warm ivory public page, centered `event-preview-frame--public`, compact section cards, label pills, platform dividers, and neutral wedding typography.

Do not commit client-specific visual themes as starter defaults. Client-specific styling belongs in cloned client repos. Optional theme presets may be documented as examples only, not applied by runtime starter code.

Use local UI primitives in `src/components/ui`. Do not install shadcn or large animation/icon libraries for the starter foundation.

Platform baseline icons are isolated in `src/components/platform/platform-icons.tsx`. Keep renderer files importing semantic icons from that adapter so client repos can swap icon implementations without touching data flow or section structure.

Theme work in the starter should preserve the platform baseline first. CSS variables in `src/styles/tokens.css` and `src/styles/theme.css` support later client repo customization; they must not transform the starter default into a separate theme. See `docs/THEME_SYSTEM.md`.

User-entered content such as sponsor names, entourage groups, timeline items, gift notes, guestbook messages, and contact details must use safe wrapping so long text cannot overflow cards or pills.
