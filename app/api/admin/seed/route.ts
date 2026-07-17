import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { isAuthenticated } from '@/lib/auth/session'
import { BLOG_POSTS_SEED } from '@/lib/config/blog-posts'
import { BOOKS_SEED } from '@/lib/config/books'
import { VIDEOS_SEED } from '@/lib/config/videos'
import { ARTICLES_SEED } from '@/lib/config/articles'
import { COMMENTARIES_SEED } from '@/lib/config/commentaries'
import { STORIES_SEED } from '@/lib/config/stories'
import { SCULPTURE_IMAGES_SEED } from '@/lib/config/sculpture-images'
import { RESUME_BODY_HTML } from '@/lib/config/resume'

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
    articles: { inserted: 0, skipped: 0, errors: 0 },
    commentaries: { inserted: 0, skipped: 0, errors: 0 },
    stories: { inserted: 0, skipped: 0, errors: 0 },
    sculpture_images: { inserted: 0, skipped: 0, errors: 0 },
    site_pages: { inserted: 0, skipped: 0, errors: 0 },
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

  // ── ARTICLES ──
  const { data: existingArticles } = await supabaseAdmin.from('articles').select('slug')
  const existingArticleSlugs = new Set((existingArticles || []).map((a: { slug: string }) => a.slug))
  for (const item of ARTICLES_SEED) {
    if (existingArticleSlugs.has(item.slug)) { results.articles.skipped++; continue }
    const { error } = await supabaseAdmin.from('articles').insert({
      slug: item.slug, year: item.year, body_html: item.bodyHtml, links: item.links,
    })
    if (error) { console.error('[seed articles]', item.slug, error.message); results.articles.errors++ }
    else results.articles.inserted++
  }

  // ── COMMENTARIES ──
  const { data: existingCommentaries } = await supabaseAdmin.from('commentaries').select('slug')
  const existingCommentarySlugs = new Set((existingCommentaries || []).map((c: { slug: string }) => c.slug))
  for (const item of COMMENTARIES_SEED) {
    if (existingCommentarySlugs.has(item.slug)) { results.commentaries.skipped++; continue }
    const { error } = await supabaseAdmin.from('commentaries').insert({
      slug: item.slug, year: item.year, body_html: item.bodyHtml, links: item.links,
    })
    if (error) { console.error('[seed commentaries]', item.slug, error.message); results.commentaries.errors++ }
    else results.commentaries.inserted++
  }

  // ── STORIES ──
  const { data: existingStories } = await supabaseAdmin.from('stories').select('slug')
  const existingStorySlugs = new Set((existingStories || []).map((s: { slug: string }) => s.slug))
  for (const item of STORIES_SEED) {
    if (existingStorySlugs.has(item.slug)) { results.stories.skipped++; continue }
    const { error } = await supabaseAdmin.from('stories').insert({
      slug: item.slug, title: item.title, description: item.description,
      pdf_file: item.pdfFile, body_html: item.bodyHtml,
    })
    if (error) { console.error('[seed stories]', item.slug, error.message); results.stories.errors++ }
    else results.stories.inserted++
  }

  // ── SCULPTURE IMAGES ── (id-based, not slug — match on image_url instead
  // since that's the natural unique key for the original 21 seeded images)
  const { data: existingSculptures } = await supabaseAdmin.from('sculpture_images').select('image_url')
  const existingSculptureUrls = new Set((existingSculptures || []).map((s: { image_url: string }) => s.image_url))
  for (const item of SCULPTURE_IMAGES_SEED) {
    if (existingSculptureUrls.has(item.imageFile)) { results.sculpture_images.skipped++; continue }
    const { error } = await supabaseAdmin.from('sculpture_images').insert({
      image_url: item.imageFile, caption: item.caption, sort_order: item.sortOrder,
    })
    if (error) { console.error('[seed sculpture_images]', item.imageFile, error.message); results.sculpture_images.errors++ }
    else results.sculpture_images.inserted++
  }

  // ── SITE PAGES (Résumé) ──
  const { data: existingPages } = await supabaseAdmin.from('site_pages').select('slug')
  const existingPageSlugs = new Set((existingPages || []).map((p: { slug: string }) => p.slug))
  if (!existingPageSlugs.has('resume')) {
    const { error } = await supabaseAdmin.from('site_pages').insert({
      slug: 'resume', title: 'Résumé', body_html: RESUME_BODY_HTML,
    })
    if (error) { console.error('[seed site_pages]', error.message); results.site_pages.errors++ }
    else results.site_pages.inserted++
  } else {
    results.site_pages.skipped++
  }

  return NextResponse.json({
    success: true,
    message:
      `Seeded ${results.blog_posts.inserted} blog posts (${results.blog_posts.skipped} already existed), ` +
      `${results.books.inserted} books (${results.books.skipped} already existed), ` +
      `${results.videos.inserted} videos (${results.videos.skipped} already existed), ` +
      `${results.articles.inserted} articles (${results.articles.skipped} already existed), ` +
      `${results.commentaries.inserted} commentaries (${results.commentaries.skipped} already existed), ` +
      `${results.stories.inserted} stories (${results.stories.skipped} already existed), ` +
      `${results.sculpture_images.inserted} sculpture images (${results.sculpture_images.skipped} already existed), ` +
      `${results.site_pages.inserted} site pages (${results.site_pages.skipped} already existed).`,
    results,
  })
}
