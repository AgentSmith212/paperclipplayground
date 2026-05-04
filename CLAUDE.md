@AGENTS.md

# DJ Academy — Codebase Guide

Gamified DJ skills learning platform. Web-first, browser-based.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Database**: PostgreSQL via Prisma 7 + `@prisma/adapter-pg`
- **Auth**: NextAuth v5 (credentials + Google OAuth)
- **CSS**: Tailwind v4 (`@import "tailwindcss"` in globals.css)

## Key conventions

- Prisma client lives at `src/lib/prisma.ts` — singleton pattern, imports from `@/generated/prisma/client`
- Auth helpers at `src/lib/auth.ts` — `auth()`, `signIn()`, `signOut()`
- Server pages that query DB must export `export const dynamic = "force-dynamic"` to avoid build-time prerender failures
- Design tokens defined as CSS custom properties in `src/app/globals.css` — use `var(--brand-primary)` etc.

## Prisma (v7 breaking changes)

- `DATABASE_URL` must NOT be in `schema.prisma` — configure in `prisma.config.ts`
- Generator uses `provider = "prisma-client"` and `output = "../src/generated/prisma"`
- Client requires a driver adapter: `new PrismaPg({ connectionString: ... })`

## Environment

Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console

## Dev setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Data model

- `User` — auth + gamification (xpTotal, level, streakDays)
- `Module` / `Lesson` — DJ curriculum
- `UserProgress` — completion tracking per lesson
- `XpEvent` — XP audit log
- `Achievement` / `UserAchievement` — badge system

## Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static | Marketing homepage |
| `/login` | Static | Login form (credentials + Google) |
| `/signup` | Static | Registration form |
| `/dashboard` | Dynamic | Authenticated user dashboard |
| `/learn` | Dynamic | Lesson module browser |
| `/practice` | Static | Practice placeholder (Phase 1) |
| `/leaderboard` | Dynamic | Top users by XP |
| `/api/auth/[...nextauth]` | Dynamic | NextAuth handler |
| `/api/auth/signup` | Dynamic | Registration endpoint |
