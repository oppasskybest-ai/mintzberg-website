import type { BlogPost } from '@/types/content'
import { supabase } from '@/lib/supabase/client'
import { BLOG_POSTS_SEED } from '@/lib/config/blog-posts'

const POSTS_PER_PAGE = 10

// Parses "19 May 2016" style dates for sorting. Returns 0 (sorts last) for
// anything unparseable rather than throwing — a handful of posts may have
// missing/odd date text and that shouldn't break the whole listing.
function parseDate(d: string | null): number {
  if (!d) return 0
  const t = Date.parse(d)
  return Number.isNaN(t) ? 0 : t
}

// Mirrors duff-site's lib/data/*.ts pattern: try Supabase first, fall back
// to the static seed array if the table is empty or unreachable (e.g. no
// Supabase project configured yet locally). Once the `blog_posts` table is
// populated (via the admin dashboard), this becomes the live source.
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (supabase) {
    // order_index is the manual "place this anywhere" control (lower =
    // shows first). Posts without one (older/legacy rows) fall back to
    // sort_date, newest first. New posts created via the admin panel are
    // auto-assigned an order_index that puts them above everything else —
    // see the POST handler in app/api/admin/blog-posts/route.ts.
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, date, category_label, category_id, image_refs, body_html, order_index')
      .order('order_index', { ascending: true, nullsFirst: false })
      .order('sort_date', { ascending: false, nullsFirst: false })

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        slug: row.slug,
        title: row.title,
        date: row.date,
        categoryLabel: row.category_label,
        categoryId: row.category_id,
        imageRefs: row.image_refs ?? [],
        bodyHtml: row.body_html,
      }))
    }
  }
  return [...BLOG_POSTS_SEED].sort((a, b) => parseDate(b.date) - parseDate(a.date))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

/**
 * Paginated blog listing — 10 posts per page (not the old site's "load
 * everything at once" pattern, which took 10+ minutes to render 234 posts).
 */
export async function getBlogPostsPage(page: number): Promise<{
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  totalPosts: number
}> {
  const all = await getAllBlogPosts()
  const totalPosts = all.length
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const posts = all.slice(start, start + POSTS_PER_PAGE)
  return { posts, currentPage, totalPages, totalPosts }
}
