// Resolves any local Drupal asset path (as scraped, e.g.
// "../sites/default/files/page/mintzberg_portrait.jpg" or just a bare
// filename) to its live GitHub Release URL.
//
// Per mintzberg-addendum-final.md "FINAL ASSET HOSTING ARCHITECTURE":
// every asset lives in one of four Releases on this same repo, one release
// per file type. The mapping from extension -> release tag is fixed, so
// this is a pure/deterministic function — no manual wiring or placeholders
// needed (this supersedes the master prompt's original "Step 13/14: wire
// placeholders after CDN upload" plan; the CDN URLs are knowable up front).
//
// NOTE: this assumes the filename is unique across sorted-assets/ (the
// addendum's upload log was built on that assumption, since all four
// releases are flat, not folder-namespaced). If two different source
// folders ever contain a same-named file, that's a collision to flag, not
// something this function can detect on its own.

const ASSETS_REPO =
  process.env.NEXT_PUBLIC_ASSETS_REPO || 'oppasskybest-ai/mintzberg-website'

const EXTENSION_TO_RELEASE_TAG: Record<string, string> = {
  jpg: 'images-jpg',
  jpeg: 'images-jpg',
  png: 'images-png',
  gif: 'images-gif',
  pdf: 'documents-pdf',
}

/** Extracts just the filename from any local/relative scraped path. */
export function basename(path: string): string {
  return path.split('/').pop() || path
}

/**
 * Builds the live GitHub Release URL for a given filename or scraped path.
 * Returns null if the extension isn't one of the four known asset types
 * (e.g. .css/.js from the old theme, which are reference-only and never
 * get hosted) — callers should treat null as "not a hostable asset."
 *
 * Bug fixed 2026-07-18: this always ran `basename()` first, which strips
 * everything up to the last "/" — fine for a scraped relative path like
 * "../sites/default/files/book/cover.jpg", but it also silently mangled a
 * full Supabase Storage URL (e.g.
 * "https://xxx.supabase.co/storage/v1/object/public/media/123-cover.png")
 * down to just "123-cover.png", then rebuilt it as a GitHub Release URL
 * that file was never uploaded to — a 404/broken image every time. New
 * images uploaded via the admin panel's image picker go to Supabase
 * Storage and come back as a full URL, so this needed to pass those
 * through untouched instead of treating them as a bare historical
 * filename.
 */
export function assetUrl(pathOrFilename: string): string | null {
  if (/^https?:\/\//i.test(pathOrFilename)) return pathOrFilename
  const filename = basename(pathOrFilename)
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return null
  const tag = EXTENSION_TO_RELEASE_TAG[ext]
  if (!tag) return null
  return `https://github.com/${ASSETS_REPO}/releases/download/${tag}/${encodeURIComponent(
    filename
  )}`
}

/**
 * Rewrites the ~450 relative-path cross-links found inside scraped blog
 * post / book bodies ("../some-post.html", "../books/x.html",
 * "../sculptures.html", etc.) into real site routes. Bug found 2026-07-15:
 * these were being left completely untouched and 404ing, since a relative
 * ".html" path resolves against the live page's own URL on the new site,
 * not against the old Drupal site structure.
 */
const OLD_BOOK_SLUG_TO_NEW: Record<string, string> = {
  'mintzberg-management-inside-our-strange-world-organizations':
    'mintzberg-on-management-inside-our-strange-world-of-organizations',
  'power-and-around-organizations': 'power-in-and-around-organizations',
  'rise-and-fall-strategic-planning': 'the-rise-and-fall-of-strategic-planning',
}

const SPECIAL_PAGE_MAP: Record<string, string> = {
  sculptures: '/sculptures',
  beaver: '/sculptures',
  stories: '/stories',
  blog: '/blog',
  index: '/',
  articles: '/articles',
  commentaries: '/commentaries',
  resume: '/resume',
  contact: '/contact',
  welcome: '/',
  // Rebalancing Society is explicitly out of scope (see master prompt
  // Content Structure section 11 amendment) — no page exists for it here,
  // so these send readers to the live separate site instead of 404ing.
  rs: 'https://rebalancingsociety.org/',
  'a-map-for-balance': 'https://rebalancingsociety.org/',
}

export function rewriteInternalLinks(html: string): string {
  return html.replace(/href="((?:\.\.\/)+)([^"]+?)\.html"/gi, (full, _dots, path) => {
    // "books/some-slug" or "books/some-slug/index"
    const bookMatch = path.match(/^books\/([^/]+?)(?:\/index)?$/i)
    if (bookMatch) {
      const oldSlug = bookMatch[1]
      const newSlug = OLD_BOOK_SLUG_TO_NEW[oldSlug] || oldSlug
      return `href="/books/${newSlug}"`
    }
    // Known special pages (sculptures, stories, blog index, etc.)
    if (SPECIAL_PAGE_MAP[path]) {
      return `href="${SPECIAL_PAGE_MAP[path]}"`
    }
    // Known dead links in the original site itself — leave pointing
    // nowhere useful rather than guessing; they 404'd on the old site too.
    if (path === 'enterprise' || path === 'pp') {
      return full
    }
    // Otherwise assume it's a blog post cross-reference — this covers the
    // large majority of cases, since blog slugs here are the original
    // filenames unchanged.
    return `href="/blog/${path}"`
  })
}
/** YouTube thumbnail for the click-to-load facade pattern (addendum). */
export function youtubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

/** youtube-nocookie embed URL, only used after a facade click. */
export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`
}

/**
 * Resolves any scraped href into something that actually works, and tells
 * the caller whether it's external (so the link can open in a new tab).
 *
 * Bug fixed 2026-07-15: raw scraped hrefs came in three shapes that were
 * being rendered as-is without this resolution, causing real 404s:
 *   1. Relative local paths ("../sites/default/files/book/x.pdf") — these
 *      need the same GitHub Release URL treatment as images, or they
 *      resolve against the live site's own domain and 404.
 *   2. Genuine external URLs (Amazon, publishers, etc.) — left as-is, but
 *      need target="_blank" so users don't lose the site.
 *   3. Site-internal routes we built ("/books/slug") — left as-is, no
 *      new tab.
 */
export function resolveHref(href: string): { href: string; external: boolean } {
  if (/^https?:\/\//.test(href)) {
    return { href, external: true }
  }
  if (href.startsWith('/')) {
    return { href, external: false } // our own internal route
  }
  if (href.startsWith('#') || href.startsWith('mailto:')) {
    return { href, external: false }
  }
  // Relative local path (old Drupal file path) — resolve via the asset
  // repo, same as images. If it's not a known asset type, fall back to
  // the original string rather than silently breaking the link further.
  const resolved = assetUrl(href)
  return { href: resolved || href, external: true }
}
