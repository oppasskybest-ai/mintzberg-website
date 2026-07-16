import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/data/blog-posts'
import PostBody from '@/components/blog/PostBody'
import { assetUrl } from '@/lib/assets'

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

  // Redesigned 2026-07-15: when the post has its own images, one becomes
  // the hero's fixed-parallax backdrop instead of the generic site
  // texture — each post gets its own reading atmosphere, per the
  // cushnir-site reference ("reference images... used as background as
  // [people] read over them").
  const heroImage = post.imageRefs[0] ? assetUrl(post.imageRefs[0]) : null

  return (
    <main>
      <section
        className="hero-parallax"
        style={{
          minHeight: '42vh',
          backgroundImage: heroImage ? `url(${heroImage})` : undefined,
        }}
      >
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
