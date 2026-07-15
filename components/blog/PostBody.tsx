import { assetUrl } from '@/lib/assets'

// Resolves {{ASSET}}filename{{/ASSET}} tokens (written by the parser) into
// live GitHub Release URLs at render time. Keeping this as a render-time
// step rather than baking URLs into the stored HTML means re-hosting or
// renaming the asset repo never requires re-parsing 231+ post bodies.
function resolveAssetTokens(html: string): string {
  return html.replace(/\{\{ASSET\}\}(.*?)\{\{\/ASSET\}\}/g, (_, filename) => {
    return assetUrl(filename) || '#'
  })
}

export default function PostBody({ html }: { html: string }) {
  return (
    <div
      className="post-body"
      // Content is Henry's own scraped HTML (Rule 1: verbatim, nothing
      // rewritten) with <script> tags already stripped during parsing.
      dangerouslySetInnerHTML={{ __html: resolveAssetTokens(html) }}
    />
  )
}
