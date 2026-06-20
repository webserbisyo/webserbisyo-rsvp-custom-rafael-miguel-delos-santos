# Shadcn In Client Clones

Do not install or add shadcn components in the neutral starter unless explicitly approved.

In a cloned client repo:

- install and configure shadcn only after cloning
- keep shadcn usage inside `src/client`
- use `src/client/libs/shadcn/` or `src/client/components/ui/` intentionally
- do not use shadcn to modify protected platform renderer files directly
- do not use shadcn to add RSVP submission or backend behavior

Do not run shadcn setup commands in the neutral starter.
