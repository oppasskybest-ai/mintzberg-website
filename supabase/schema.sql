-- ═══════════════════════════════════════════════════════════════════
-- Mintzberg website — Supabase schema
-- Run this in the Supabase SQL Editor (see SUPABASE_SETUP.md for the
-- full walkthrough). Tables match the columns lib/data/*.ts already
-- queries — once these exist and have rows, the site automatically
-- switches from the local seed data to Supabase, no code changes needed.
-- ═══════════════════════════════════════════════════════════════════

-- ── BLOG POSTS ──
create table if not exists blog_posts (
  slug text primary key,
  title text,
  date text,                    -- kept as free text ("19 May 2016") to
                                 -- match the source exactly; sort_date
                                 -- below is what's actually used for
                                 -- ordering.
  sort_date date,                -- parsed, sortable version of `date`
  category_label text,
  category_id text,
  image_refs text[] default '{}',
  body_html text not null,
  created_at timestamptz default now()
);

create index if not exists blog_posts_sort_date_idx on blog_posts (sort_date desc nulls last);

-- ── BOOKS ──
create table if not exists books (
  slug text primary key,
  title text,
  cover_image text,
  links jsonb default '[]',      -- [{ "label": "...", "href": "..." }]
  body_html text not null,
  created_at timestamptz default now()
);

-- ── VIDEOS ──
create table if not exists videos (
  slug text primary key,
  title text,
  youtube_id text not null,
  created_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY ──
-- Public (anon key) can READ everything — this is a public website.
-- Nothing can be written with the anon key; writes go through the admin
-- dashboard's server-side code using the service role key instead, which
-- bypasses RLS entirely. No "admin write policy" is defined here on
-- purpose — the admin dashboard isn't built yet (see PROGRESS.md), and
-- service-role access doesn't need a policy to begin with.
alter table blog_posts enable row level security;
alter table books enable row level security;
alter table videos enable row level security;

create policy "public read blog_posts" on blog_posts for select using (true);
create policy "public read books" on books for select using (true);
create policy "public read videos" on videos for select using (true);
