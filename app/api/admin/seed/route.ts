import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { isAuthenticated } from '@/lib/auth/session'
import { BLOG_POSTS_SEED } from '@/lib/config/blog-posts'
import { BOOKS_SEED } from '@/lib/config/books'
import { VIDEOS_SEED } from '@/lib/config/videos'

// Matches duff-site's app/api/admin/seed/route.ts pattern exactly: checks
// existing slugs first, only inserts what's missing, NEVER overwrites
// anything already in the database (including your own admin edits).
// Safe to run any time, as many times as you want — this is the button
// on Settings, not a one-off CLI script.
function parseSortDate(d: string | null): string | null {
  if (!d) return null
  const t = Date.parse(d)
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10)
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    blog_posts: { inserted: 0, skipped: 0, errors: 0 },
    books: { inserted: 0, skipped: 0, errors: 0 },
    videos: { inserted: 0, skipped: 0, errors: 0 },
  }

  // ── BLOG POSTS ──
  const { data: existingPosts } = await supabaseAdmin.from('blog_posts').select('slug')
  const existingPostSlugs = new Set((existingPosts || []).map((p: { slug: string }) => p.slug))

  for (const post of BLOG_POSTS_SEED) {
    if (existingPostSlugs.has(post.slug)) {
      results.blog_posts.skipped++
      continue
    }
    const { error } = await supabaseAdmin.from('blog_posts').insert({
      slug: post.slug,
      title: post.title,
      date: post.date,
      sort_date: parseSortDate(post.date),
      category_label: post.categoryLabel,
      category_id: post.categoryId,
      image_refs: post.imageRefs,
      body_html: post.bodyHtml,
    })
    if (error) {
      console.error('[seed blog_posts]', post.slug, error.message)
      results.blog_posts.errors++
    } else {
      results.blog_posts.inserted++
    }
  }

  // ── BOOKS ──
  const { data: existingBooks } = await supabaseAdmin.from('books').select('slug')
  const existingBookSlugs = new Set((existingBooks || []).map((b: { slug: string }) => b.slug))

  for (const book of BOOKS_SEED) {
    if (existingBookSlugs.has(book.slug)) {
      results.books.skipped++
      continue
    }
    const { error } = await supabaseAdmin.from('books').insert({
      slug: book.slug,
      title: book.title,
      cover_image: book.coverImage,
      links: book.links,
      body_html: book.bodyHtml,
    })
    if (error) {
      console.error('[seed books]', book.slug, error.message)
      results.books.errors++
    } else {
      results.books.inserted++
    }
  }

  // ── VIDEOS ──
  const { data: existingVideos } = await supabaseAdmin.from('videos').select('slug')
  const existingVideoSlugs = new Set((existingVideos || []).map((v: { slug: string }) => v.slug))

  for (const video of VIDEOS_SEED) {
    if (existingVideoSlugs.has(video.slug)) {
      results.videos.skipped++
      continue
    }
    const { error } = await supabaseAdmin.from('videos').insert({
      slug: video.slug,
      title: video.title,
      youtube_id: video.youtubeId,
    })
    if (error) {
      console.error('[seed videos]', video.slug, error.message)
      results.videos.errors++
    } else {
      results.videos.inserted++
    }
  }

  return NextResponse.json({
    success: true,
    message:
      `Seeded ${results.blog_posts.inserted} blog posts (${results.blog_posts.skipped} already existed), ` +
      `${results.books.inserted} books (${results.books.skipped} already existed), ` +
      `${results.videos.inserted} videos (${results.videos.skipped} already existed).`,
    results,
  })
}
