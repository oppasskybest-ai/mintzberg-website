import Link from 'next/link'
import { getBlogPostsPage } from '@/lib/data/blog-posts'
import PageHero from '@/components/layout/PageHero'

// Blog index — paginated 10 posts per page (not the old site's "load
// everything at once" pattern, which took 10+ minutes for 234 posts).
export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const pageNum = Number(page) > 0 ? Number(page) : 1
  const { posts, currentPage, totalPages, totalPosts } = await getBlogPostsPage(pageNum)

  return (
    <main>
      <PageHero
        eyebrow="Reframing management"
        title="Blog"
        subtitle={`${totalPosts} posts, from pithy pronouncements in a line or few to playful provocations in a page or few.`}
        compact
      />

      <section className="section-parallax" style={{ padding: '3rem 0 4rem' }}>
        <div className="container-content">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {posts.map((post) => (
              <li key={post.slug} className="premium-card" style={{ padding: '1.5rem' }}>
                {post.categoryLabel && (
                  <p className="eyebrow-label" style={{ marginBottom: '0.5rem' }}>
                    {post.categoryLabel}
                  </p>
                )}
                <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginBottom: 0 }}>
                  {post.date}
                </p>
              </li>
            ))}
          </ul>

          {/* Pagination — page numbers + prev/next, no infinite scroll */}
          {totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '3rem',
              }}
            >
              {currentPage > 1 && (
                <Link href={`/blog?page=${currentPage - 1}`} className="pager-link">
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className="pager-link"
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link href={`/blog?page=${currentPage + 1}`} className="pager-link">
                  Next →
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </main>
  )
}
