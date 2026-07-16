# Supabase Setup

You've said you're comfortable with Supabase, so this is terse — full
detail is in the code comments if you need it. Once this is done, the
site automatically switches from local seed data to live Supabase data —
no code changes required, `lib/data/*.ts` already checks for Supabase
first and falls back to the seed files only if Supabase isn't configured
or a table is empty.

## 1. Create the project
Create a new Supabase project (any region). Note the project URL and the
two API keys (anon/public, and service_role) from **Settings → API**.

## 2. Run the schema
Open the **SQL Editor** in the Supabase dashboard, paste the contents of
[`supabase/schema.sql`](./supabase/schema.sql), and run it.

This creates three tables — `blog_posts`, `books`, `videos` — with columns
matching exactly what `lib/data/*.ts` already queries, plus public
read-only RLS policies (this is a public website; writes will go through
the admin dashboard's service-role backend later, not the anon key).

## 3. Set environment variables
Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...               # service_role key — keep secret, never expose client-side
```

## 4. Seed the data
Everything already parsed (231 blog posts, 21 books, 18 videos) is sitting
in `supabase/seed-data/*.json`, pre-formatted to match the schema exactly
(same `{{ASSET}}filename{{/ASSET}}` image tokens the site already knows
how to resolve at render time — nothing about rendering changes).

```bash
npm install     # if you haven't already — @supabase/supabase-js is already a dependency
node scripts/seed-supabase.mjs
```

This upserts by `slug`, so it's safe to re-run any time you regenerate the
seed data (e.g. after parsing more blog posts or Articles/Commentaries
later) — it won't duplicate rows.

## 5. Verify
```bash
npm run dev
```
Visit `/blog`, `/books`, `/videos` — if Supabase is wired correctly, these
now come from the database. To confirm it's actually reading Supabase and
not the fallback: temporarily rename a post's title in the Supabase table
editor and refresh the page.

## What's NOT included here
- **Articles, Commentaries, Résumé, Stories, Sculptures** currently have
  no Supabase table or data-layer file — they still run from
  `lib/config/*.ts` directly. This was a deliberate scope decision (see
  `PROGRESS.md`) since that content changes far less often than the blog.
  If you want these editable via Supabase too, say so and I'll add the
  tables + wire them the same way.
- **The admin dashboard itself** (the actual UI Henry would use to edit
  content) — the architecture is decided (Supabase + session-auth CRUD,
  matching duff-site's pattern) but nothing is built yet. That's the next
  major piece of work once this is confirmed working.
- **Auth for the admin dashboard** — needs `ADMIN_PASSWORD` and
  `ADMIN_SESSION_SECRET` in `.env.local` (see `.env.local.example`), but
  there's no login page yet to use them.
