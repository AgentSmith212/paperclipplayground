# DJ Academy — Local Dev Setup

A gamified web platform for learning DJ skills: beat matching, mixing techniques, music theory, and interactive audio exercises.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind v4
- **Database:** PostgreSQL + Prisma 7
- **Auth:** NextAuth v5 (credentials + Google OAuth)
- **Audio:** Web Audio API (browser-native, no server needed)

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL running locally

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment — edit `.env`:
   ```bash
   DATABASE_URL="postgresql://USER:PASS@localhost:5432/djacademy"
   AUTH_SECRET="<run: openssl rand -base64 32>"
   NEXTAUTH_URL="http://localhost:3000"
   # Google OAuth optional — leave empty to use credentials-only auth
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

3. Run migrations + seed:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Start dev server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/signup` | Create account |
| `/login` | Sign in |
| `/onboarding` | Set skill level + goal (first login) |
| `/dashboard` | XP progress, level, streak |
| `/learn` | Module browser |
| `/learn/[module]/[lesson]` | Interactive lesson (concept, quiz, exercise) |
| `/practice` | Free-play beat matching (no XP) |
| `/achievements` | Badge collection |
| `/leaderboard` | Top users by XP |

## Database Scripts

```bash
npm run db:migrate   # create + apply new migration
npm run db:push      # push schema without migration (dev only)
npm run db:seed      # seed modules, lessons, achievements
```
