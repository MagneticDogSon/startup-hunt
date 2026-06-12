# Memory — Startup Hunt MVP

Last updated: 2026-06-12

## What was built

- Full Next.js 16 app in workspace root (`app/`, `components/`, `lib/`, `prisma/`)
- Auth: register/login, JWT session with role, middleware redirects
- Roles: PENDING → admin assigns FOUNDER / EVALUATOR / ADMIN via `/admin/users`
- Startups: CRUD, table with search/sort, detail page
- Files: upload to `uploads/`, download via `/api/uploads/[id]`
- Voting: evaluator up/down on table and detail page
- All 9 repertoire docs filled (`project-overview.md`, `architecture.md`, etc.)

## Decisions made

- Prisma 5 + SQLite (Prisma 7 dropped — enum/url config breaking changes)
- SQLite stores `role` as String (no native enum support)
- `lib/roles.ts` — edge/client-safe role constants (not `@prisma/client` in browser)
- `lib/auth.config.ts` — edge-safe middleware auth (no Prisma in middleware)
- Local file storage in `uploads/` for MVP

## Problems solved

- `create-next-app` fails on folder name "top 5" — manual scaffold with `package.json` name `startup-hunt`
- Prisma 7 custom output + edge middleware incompatibility — downgraded to Prisma 5
- Server action return types vs form `action` prop — redirect on errors instead of returning objects

## Current state

- `npm run build` passes
- `npm run dev` runs on http://localhost:3000
- Admin seeded: `admin@local.dev` / `admin12345`

## Next session starts with

1. Register test users (founder, evaluator)
2. Admin assigns roles at `/admin/users`
3. Founder creates startup + uploads files
4. Evaluator votes on `/startups`

## Open questions

- None for MVP scope
