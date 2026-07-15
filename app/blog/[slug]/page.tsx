import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/data/blog-posts'
import PostBody from '@/components/blog/PostBody'

// Individual blog post template. Renders the full body verbatim (Rule 1)
// via PostBody, which resolves image tokens to live GitHub Release URLs.
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <main>
      <section className="hero-parallax" style={{ minHeight: '42vh' }}>
        <div className="container-content" style={{ textAlign: 'center' }}>
          {post.categoryLabel && <p className="hero-eyebrow">{post.categoryLabel}</p>}
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            {post.title}
          </h1>
          <div className="divider-accent divider-accent-center" />
          <p className="hero-subtitle" style={{ margin: '0 auto' }}>{post.date}</p>
        </div>
      </section>

      <article className="container-content" style={{ padding: '3rem 1.25rem 4rem' }}>
        <PostBody html={post.bodyHtml} />
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--rule)' }}>
          <Link href="/blog">← Back to Blog</Link>
        </div>
      </article>
    </main>
  )
}
