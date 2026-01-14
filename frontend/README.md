# HMS Frontend Monorepo

This `frontend` folder is a pnpm workspace containing multiple Next.js apps.

## Apps

- `apps/patient` — patient portal (your existing app)
- `apps/doctor` — doctor portal (placeholder)
- `apps/admin` — admin portal (placeholder)

## Commands (from `frontend/`)

- `pnpm install` (if PowerShell blocks `pnpm.ps1`, use `pnpm.cmd install`)
- `pnpm dev:patient` (or `pnpm.cmd dev:patient`)
- `pnpm dev:doctor` (or `pnpm.cmd dev:doctor`)
- `pnpm dev:admin` (or `pnpm.cmd dev:admin`)
- `pnpm build`
- `pnpm lint`
