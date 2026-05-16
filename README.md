# Birthday RSVP Website

A production-ready birthday microsite built with Next.js App Router, TypeScript, Tailwind CSS, Zod validation, server actions, a private admin log, and a storage adapter that uses Postgres in production.

## Features

- Public event landing page with editable birthday, trip, venue, itinerary, dress code, and FAQ copy.
- RSVP form with guest name, attendance status, party size, contact, note, and dietary preference fields.
- Server-side validation with Zod, honeypot spam protection, and a rate-limit-friendly server action boundary.
- `/admin` password gate using `ADMIN_PASSWORD`.
- Admin RSVP dashboard with attending total, yes/no/maybe summary, timestamps, and empty state.
- Storage adapter in `lib/rsvp-store.ts`:
  - Uses `DATABASE_URL` for production Postgres persistence.
  - Uses `.data/rsvps.json` only during local development when no database is configured.
  - Refuses to fake production persistence if `DATABASE_URL` is missing.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For local admin testing, create `.env.local`:

```bash
ADMIN_PASSWORD=change-me-locally
```

The local development RSVP log is written to `.data/rsvps.json`. That folder is ignored by git.

## Environment Variables

Copy `.env.example` to `.env.local` for local work or set these in Vercel for production.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Production admin | Password for `/admin`. |
| `DATABASE_URL` | Production RSVP persistence | Postgres-compatible database URL for RSVP storage. |
| `TELEGRAM_BOT_TOKEN` | Deployment notification | Bot token for Telegram deployment notification. |
| `TELEGRAM_CHAT_ID` | Deployment notification | Chat ID for Telegram deployment notification. |
| `VERCEL_TOKEN` | Optional CLI deploy | Token used by Vercel CLI automation. |
| `GITHUB_TOKEN` | Optional repo automation | Token used to create/push the GitHub repository. |

## Editing Event Details

Update `lib/event-config.ts`. It contains the celebrant name, event title, date, time, venue, address, intro copy, itinerary, dress code, contact person, map link, and FAQ content.

## Production Storage Notes

Set `DATABASE_URL` before accepting live RSVPs. The adapter creates the `rsvp_entries` table automatically on first read or write:

```sql
create table if not exists rsvp_entries (
  id text primary key,
  guest_name text not null,
  attendance text not null check (attendance in ('yes', 'no', 'maybe')),
  guest_count integer not null check (guest_count >= 0),
  contact text,
  note text,
  dietary text,
  created_at timestamptz not null
);
```

Neon, Vercel Postgres, and Supabase Postgres are good serverless-friendly options.

## Quality Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment Notes

The intended deployment target is Vercel from the GitHub repository `birthday-rsvp-website`.

For a production deployment:

1. Set `ADMIN_PASSWORD` and `DATABASE_URL` in Vercel.
2. Connect the GitHub repository to Vercel, or deploy from the project root with `npx vercel --prod`.
3. Verify the production URL loads and `/admin` shows the password gate.
4. Send the Telegram deployment notification after the production URL is verified.
