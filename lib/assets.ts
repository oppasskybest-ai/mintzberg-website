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
 */
export function assetUrl(pathOrFilename: string): string | null {
  const filename = basename(pathOrFilename)
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return null
  const tag = EXTENSION_TO_RELEASE_TAG[ext]
  if (!tag) return null
  return `https://github.com/${ASSETS_REPO}/releases/download/${tag}/${encodeURIComponent(
    filename
  )}`
}

/** YouTube thumbnail for the click-to-load facade pattern (addendum). */
export function youtubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

/** youtube-nocookie embed URL, only used after a facade click. */
export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`
}
