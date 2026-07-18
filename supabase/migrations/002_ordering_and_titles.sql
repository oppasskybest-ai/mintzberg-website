-- ═══════════════════════════════════════════════════════════════════
-- Migration 002 — manual ordering + article/commentary titles
-- Run this once in the Supabase SQL Editor. Safe to re-run (every
-- statement uses IF NOT EXISTS / IF EXISTS), so it will not error or
-- duplicate anything if run twice.
--
-- What this adds:
--   1. `order_index` (int, nullable) on blog_posts, books, videos,
--      articles, commentaries — lets an admin manually place any item
--      anywhere. Lower number = shows first. Leave blank and the admin
--      panel auto-assigns a value that puts new items at the very top.
--   2. `title` (text) on articles and commentaries — previously missing,
--      which is why new articles/commentaries had no way to generate a
--      URL slug.
-- ═══════════════════════════════════════════════════════════════════

alter table blog_posts   add column if not exists order_index int;
alter table books        add column if not exists order_index int;
alter table videos       add column if not exists order_index int;
alter table articles     add column if not exists order_index int;
alter table commentaries add column if not exists order_index int;
alter table stories      add column if not exists order_index int;

alter table articles     add column if not exists title text;
alter table commentaries add column if not exists title text;

create index if not exists blog_posts_order_idx   on blog_posts   (order_index);
create index if not exists books_order_idx        on books        (order_index);
create index if not exists videos_order_idx       on videos       (order_index);
create index if not exists articles_order_idx     on articles     (order_index);
create index if not exists commentaries_order_idx on commentaries (order_index);
create index if not exists stories_order_idx      on stories      (order_index);
