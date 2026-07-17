import { getAllBlogPosts } from '@/lib/data/blog-posts'
import { getAllBooks } from '@/lib/data/books'
import { getAllVideos } from '@/lib/data/videos'
import { getAllArticles, getAllCommentaries } from '@/lib/data/publications'
import { getAllStories } from '@/lib/data/stories'

export interface SearchRecord {
  type: 'Blog' | 'Book' | 'Video' | 'Article' | 'Commentary' | 'Story'
  title: string
  excerpt: string
  url: string
}

function stripHtml(html: string, maxLen = 200): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}

/**
 * Builds the full search index server-side. Deliberately lightweight —
 * only title/excerpt/url per record, not full body_html — so the index
 * shipped to the browser for client-side Fuse.js search stays small even
 * across 241 blog posts + 171 articles + 89 commentaries + everything
 * else, rather than shipping the entire site's text to every visitor.
 */
export async function buildSearchIndex(): Promise<SearchRecord[]> {
  const [posts, books, videos, articles, commentaries, stories] = await Promise.all([
    getAllBlogPosts(),
    getAllBooks(),
    getAllVideos(),
    getAllArticles(),
    getAllCommentaries(),
    getAllStories(),
  ])

  const records: SearchRecord[] = []

  for (const p of posts) {
    records.push({ type: 'Blog', title: p.title || p.slug, excerpt: stripHtml(p.bodyHtml), url: `/blog/${p.slug}` })
  }
  for (const b of books) {
    records.push({ type: 'Book', title: b.title || b.slug, excerpt: stripHtml(b.bodyHtml), url: `/books/${b.slug}` })
  }
  for (const v of videos) {
    records.push({ type: 'Video', title: v.title || v.slug, excerpt: '', url: `/videos/${v.slug}` })
  }
  for (const a of articles) {
    records.push({ type: 'Article', title: stripHtml(a.bodyHtml, 90), excerpt: stripHtml(a.bodyHtml), url: '/articles' })
  }
  for (const c of commentaries) {
    records.push({ type: 'Commentary', title: stripHtml(c.bodyHtml, 90), excerpt: stripHtml(c.bodyHtml), url: '/commentaries' })
  }
  for (const s of stories) {
    records.push({ type: 'Story', title: s.title || s.slug, excerpt: s.description || '', url: '/stories' })
  }

  return records
}
