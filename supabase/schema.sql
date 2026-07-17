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

-- ── CONTACT MESSAGES ──
-- Every contact form submission is saved here regardless of whether email
-- sending (Resend) is configured, so nothing is ever lost — viewable from
-- the admin Messages page.
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ── ARTICLES ── (each row is one item; year-grouping for display happens
-- in code, not in the schema, so admin editing stays a flat, familiar
-- list/edit/delete pattern like everything else)
create table if not exists articles (
  slug text primary key,
  year text,
  body_html text not null,        -- the description text — richtext so
                                    -- future entries can carry real body
                                    -- copy, not just a one-line blurb
  links jsonb default '[]',        -- [{ "label": "...", "href": "..." }]
  created_at timestamptz default now()
);
create index if not exists articles_year_idx on articles (year desc);

-- ── COMMENTARIES ── (same shape as articles)
create table if not exists commentaries (
  slug text primary key,
  year text,
  body_html text not null,
  links jsonb default '[]',
  created_at timestamptz default now()
);
create index if not exists commentaries_year_idx on commentaries (year desc);

-- ── STORIES ──
create table if not exists stories (
  slug text primary key,
  title text,
  description text,               -- short one-line blurb (matches the
                                    -- original site's list format)
  pdf_file text,                   -- filename (resolved via assetUrl) or
                                    -- a full URL for a newly-added story
  body_html text default '',       -- optional full story text — empty
                                    -- for the 5 original PDF-only stories,
                                    -- usable for any new story added
                                    -- directly through the admin panel
  created_at timestamptz default now()
);

-- ── SCULPTURE IMAGES ──
create table if not exists sculpture_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null unique,
  caption text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);
create index if not exists sculpture_images_sort_idx on sculpture_images (sort_order);

-- ── SITE PAGES ── (singleton text pages — Résumé today, anything else
-- text-only and one-of-a-kind later, e.g. an About page)
create table if not exists site_pages (
  slug text primary key,
  title text,
  body_html text not null,
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
create policy "public read articles" on articles for select using (true);
create policy "public read commentaries" on commentaries for select using (true);
create policy "public read stories" on stories for select using (true);
create policy "public read sculpture_images" on sculpture_images for select using (true);
create policy "public read site_pages" on site_pages for select using (true);

alter table articles enable row level security;
alter table commentaries enable row level security;
alter table stories enable row level security;
alter table sculpture_images enable row level security;
alter table site_pages enable row level security;

-- contact_messages: RLS enabled with NO policies at all — this means the
-- anon key can neither read nor write it (private submissions). Only the
-- service-role client (lib/supabase/server.ts, used by /api/contact and
-- the admin Messages page) can access it, since service-role bypasses RLS.
alter table contact_messages enable row level security;
