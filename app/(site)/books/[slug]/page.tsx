import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllBooks, getBookBySlug } from '@/lib/data/books'
import PostBody from '@/components/blog/PostBody'
import { assetUrl } from '@/lib/assets'
import WaveDivider from '@/components/layout/WaveDivider'
import FeatureBand from '@/components/layout/FeatureBand'
import SmartLink from '@/components/ui/SmartLink'

export async function generateStaticParams() {
  const books = await getAllBooks()
  return books.map((b) => ({ slug: b.slug }))
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) notFound()

  const cover = book.coverImage ? assetUrl(book.coverImage) : null

  return (
    <main>
      <FeatureBand imageUrl={cover} overlay="navy" style={{ padding: '4rem 0' }}>
        <div
          className="container-content"
          style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {cover && (
            <Image
              src={cover}
              alt={book.title ?? ''}
              width={200}
              height={300}
              style={{ width: '200px', height: 'auto', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}
            />
          )}
          <div>
            <p className="hero-eyebrow">Henry Mintzberg</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', textAlign: 'left' }}>
              {book.title}
            </h1>
            <div className="divider-accent" />
            <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
              {book.links.map((link) => (
                <li key={link.href}>
                  <SmartLink
                    href={link.href}
                    className="pager-link"
                    style={{ padding: '0 1rem', color: 'var(--paper)', borderColor: 'rgba(250,250,248,0.3)' }}
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FeatureBand>
      <WaveDivider fill="var(--paper)" flip />

      <article className="container-content" style={{ padding: '3rem 1.25rem 4rem' }}>
        <PostBody html={book.bodyHtml} />
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--rule)' }}>
          <Link href="/books">← Back to Books</Link>
        </div>
      </article>
    </main>
  )
}
