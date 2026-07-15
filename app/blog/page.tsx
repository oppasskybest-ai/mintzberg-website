import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/data/blog-posts'

// Step 4 (test batch): blog index. Currently lists the 10-post test batch
// via the seed fallback. Pagination is deferred until the full 231-post set
// is wired in — listing 10 items doesn't need it yet, and building
// pagination against a 10-item test set risks getting the UX wrong for the
// real 231-item scale. Flagged in PROGRESS.md.
export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts()

  return (
    <main className="container-content" style={{ padding: '3rem 1.25rem' }}>
      <h1>Blog</h1>
      <p style={{ color: 'var(--ink-light)', marginBottom: '2rem' }}>
        Showing a {posts.length}-post test batch while the full archive is
        being parsed.
      </p>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {posts.map((post) => (
          <li key={post.slug} style={{ borderBottom: '1px solid var(--rule)', paddingBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginBottom: 0 }}>
              {post.date}
              {post.categoryLabel ? ` · ${post.categoryLabel}` : ''}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
