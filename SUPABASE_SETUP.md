# Supabase Setup

You've said you're comfortable with Supabase, so this is terse — full
detail is in the code comments if you need it. Once this is done, the
site automatically switches from local seed data to live Supabase data —
no code changes required, `lib/data/*.ts` already checks for Supabase
first and falls back to the seed files only if Supabase isn't configured
or a table is empty. **This also unlocks the admin dashboard** at `/admin`
— the CRUD backend for it, admin auth, and login all need Supabase +
these env vars to work; without them `/admin` will redirect you back to
login in a loop since there's nothing to authenticate against.

## 1. Create the project
Create a new Supabase project (any region). Note the project URL and the
two API keys (anon/public, and service_role) from **Settings → API**.

## 2. Run the schema
Open the **SQL Editor** in the Supabase dashboard, paste the contents of
[`supabase/schema.sql`](./supabase/schema.sql), and run it.

This creates four tables — `blog_posts`, `books`, `videos`,
`contact_messages` — with columns matching exactly what `lib/data/*.ts`
and the admin API routes already query, plus RLS policies (public
read-only on the three content tables; `contact_messages` is fully
private, admin-only via the service-role key).

## 3. Create a Storage bucket for new admin uploads
**Storage → New bucket** → name it `media` → **Public bucket: ON**.
This is where any NEW images Henry uploads through the admin panel go
(separate from the 391 historical assets on GitHub Releases — both work
side by side, see the comment in `app/api/admin/upload/route.ts`).

## 4. Set environment variables
Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...               # service_role key — keep secret, never expose client-side

ADMIN_USERNAME=henry                            # or whatever you want to log in with
ADMIN_PASSWORD=choose-a-real-password-here
ADMIN_SESSION_SECRET=choose-any-long-random-string
```

`ADMIN_SESSION_SECRET` just needs to be long and unpredictable — e.g. run
`openssl rand -hex 32` and paste the output.

## 5. Seed the data
Everything already parsed (231 blog posts, 21 books, 18 videos) is sitting
in `supabase/seed-data/*.json`, pre-formatted to match the schema exactly
(same `{{ASSET}}filename{{/ASSET}}` image tokens the site already knows
how to resolve at render time — nothing about rendering changes).

**Two ways to seed — use whichever's easier:**

**A) From the terminal** (works before you've even logged into `/admin`):
```bash
npm install     # if you haven't already — @supabase/supabase-js is already a dependency
node scripts/seed-supabase.mjs
```

**B) From the admin dashboard itself**, once you can log in (step 6):
**Settings → Run Seed**. Same underlying logic — checks existing slugs
first, only inserts what's missing, never overwrites anything you've
already edited from the admin panel. Safe to click any time, as many
times as you want. This is the same mechanism duff-site uses.

Both are safe to run repeatedly and can be mixed — seed once from the
terminal now, then use the Settings button later after you've made admin
edits, without fear of losing anything.

## 6. Log in to the admin dashboard
```bash
npm run dev
```
Visit `/admin` → you'll be redirected to `/admin/login` → sign in with the
`ADMIN_USERNAME`/`ADMIN_PASSWORD` you set in step 4. From there:
- **Blog Posts / Books / Videos** — full list + create + edit (rich text
  editor with image upload) + delete for each.
- **Messages** — every contact form submission, saved automatically
  regardless of whether email sending (Resend) is configured.
- **Settings** — the seed button, plus a checklist of required env vars.

## 7. Verify
Visit `/blog`, `/books`, `/videos` on the public site — if Supabase is
wired correctly, these now come from the database. To confirm it's
actually reading Supabase and not the fallback: edit a post's title from
`/admin/blog` and refresh the public page.

## What's NOT included here
- **Articles, Commentaries, Résumé, Stories, Sculptures** currently have
  no Supabase table, admin page, or data-layer file — they still run from
  `lib/config/*.ts` directly, not editable from `/admin`. This was a
  deliberate scope decision (see `PROGRESS.md`) since that content changes
  far less often than the blog. If you want these editable too, say so and
  I'll add the tables + admin pages the same way.
- **Broadcast/email-on-publish** — duff-site's admin auto-emails
  subscribers when a new article/book is published. Deliberately NOT
  ported — Henry's site has no subscriber/broadcast system in the master
  prompt's spec, so this would be new scope, not carried-over logic. Flag
  if you want it.

