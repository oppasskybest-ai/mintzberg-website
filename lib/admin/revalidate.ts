import { revalidatePath } from "next/cache"

/**
 * Every public page in this site is server-rendered/statically-generated,
 * which is great for speed but means a Supabase write from the admin
 * panel never shows up on the live site until something tells Next.js to
 * regenerate the affected page. This is that "something" — call it from
 * every admin POST/PUT/DELETE route right after a successful write, and
 * the public page(s) for that content type regenerate on the very next
 * request instead of staying stale until the next deploy.
 */
const INDEX_PATHS: Record<string, string[]> = {
  blog_posts: ["/blog", "/", "/api/search-index"],
  books: ["/books", "/", "/api/search-index"],
  videos: ["/videos", "/", "/api/search-index"],
  articles: ["/articles", "/api/search-index"],
  commentaries: ["/commentaries", "/api/search-index"],
  stories: ["/stories", "/", "/api/search-index"],
  sculpture_images: ["/sculptures", "/"],
  site_pages: ["/resume"],
}

const DETAIL_PREFIX: Record<string, string | null> = {
  blog_posts: "/blog",
  books: "/books",
  videos: "/videos",
  articles: null,
  commentaries: null,
  stories: null,
  sculpture_images: null,
  site_pages: null,
}

export function revalidatePublic(table: string, slugs: Array<string | undefined | null> = []) {
  for (const p of INDEX_PATHS[table] ?? []) {
    try {
      revalidatePath(p)
    } catch {
      // revalidatePath throws if called outside a request context (e.g.
      // during certain build steps) — never let a cache-refresh failure
      // block the actual save/delete the admin is waiting on.
    }
  }
  const prefix = DETAIL_PREFIX[table]
  if (prefix) {
    for (const slug of slugs) {
      if (!slug) continue
      try {
        revalidatePath(`${prefix}/${slug}`)
      } catch {
        // see note above
      }
    }
  }
}
