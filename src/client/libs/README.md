# Client Library Protocol

UI libraries for client customizations belong under `src/client/libs/`.

Guidelines:

- Client components should import through `src/client/libs/*` wrapper or index files when practical.
- Do not scatter third-party UI-library imports throughout random client files if a wrapper exists.
- Keep platform code free from client-library imports.
- Client clones may install optional UI libraries after cloning.
- The neutral starter documents patterns but does not install optional libraries by default.

Safe examples:

- icons through `@/client/libs/icons`
- shadcn components under `src/client/libs/shadcn/` or `src/client/components/ui/` in a clone
- motion helpers under `src/client/libs/motion/`
- ReactBits-style wrappers under `src/client/libs/reactbits/`

Prohibited:

- Supabase or backend libraries for client presentation
- service-role keys
- local RSVP submission or fake success
- platform fallback RSVP routes inside custom frontends
- iframe RSVP
