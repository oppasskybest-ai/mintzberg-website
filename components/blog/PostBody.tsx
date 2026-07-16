import { assetUrl, rewriteInternalLinks } from '@/lib/assets'

// Resolves {{ASSET}}filename{{/ASSET}} tokens (written by the parser) into
// live GitHub Release URLs at render time. Keeping this as a render-time
// step rather than baking URLs into the stored HTML means re-hosting or
// renaming the asset repo never requires re-parsing 231+ post bodies.
function resolveAssetTokens(html: string): string {
  return html.replace(/\{\{ASSET\}\}(.*?)\{\{\/ASSET\}\}/g, (_, filename) => {
    return assetUrl(filename) || '#'
  })
}

// Adds target="_blank" rel="noopener noreferrer" to genuinely external
// links inside the body (LinkedIn, Twitter, publisher sites, etc.) so
// readers don't lose the site. Internal links (already rewritten to
// "/blog/..." "/books/..." etc. by rewriteInternalLinks) are left as
// same-tab navigation.
function addTargetBlankToExternalLinks(html: string): string {
  return html.replace(/<a\s+href="(https?:\/\/[^"]+)"([^>]*)>/gi, (full, href, rest) => {
    if (/target\s*=/.test(rest)) return full
    return `<a href="${href}"${rest} target="_blank" rel="noopener noreferrer">`
  })
}

export default function PostBody({ html }: { html: string }) {
  const processed = addTargetBlankToExternalLinks(
    rewriteInternalLinks(resolveAssetTokens(html))
  )
  return (
    <div
      className="post-body"
      // Content is Henry's own scraped HTML (Rule 1: verbatim, nothing
      // rewritten) with <script> tags already stripped during parsing.
      // Links and image sources are resolved/rewritten at render time
      // (see lib/assets.ts) — see PROGRESS.md for the link-bug fix log.
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  )
}
