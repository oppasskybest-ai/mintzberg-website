import { notFound } from 'next/navigation'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/data/blog-posts'
import PostBody from '@/components/blog/PostBody'

// Individual blog post template (Step 4 test batch). Renders the full body
// verbatim (Rule 1) via PostBody, which resolves image tokens to live
// GitHub Release URLs.
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
    <main className="container-content" style={{ padding: '3rem 1.25rem' }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--ink-light)' }}>
        {post.categoryLabel ?? 'Blog'}
      </p>
      <h1>{post.title}</h1>
      <p style={{ color: 'var(--ink-light)', marginBottom: '2rem' }}>{post.date}</p>
      <PostBody html={post.bodyHtml} />
    </main>
  )
}
