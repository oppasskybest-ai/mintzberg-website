import Link from 'next/link'
import Image from 'next/image'
import { getAllBooks } from '@/lib/data/books'
import PageHero from '@/components/layout/PageHero'
import { assetUrl } from '@/lib/assets'

// ISR safety net: on-demand revalidation (see lib/admin/revalidate.ts) already
// refreshes this page the moment an admin saves/deletes content, so this is
// just a ceiling on how stale the page could ever get if a revalidate call
// were ever missed — not the primary freshness mechanism.
export const revalidate = 300


export default async function BooksIndexPage() {
  const books = await getAllBooks()

  return (
    <main>
      <PageHero
        eyebrow="23+ books"
        title="Books"
        subtitle="A lifetime of rethinking management, organizations, and strategy — from Structure in Fives to Rebalancing Society."
        compact
      />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-wide">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '2rem',
            }}
          >
            {books.map((book) => {
              const cover = book.coverImage ? assetUrl(book.coverImage) : null
              return (
                <Link
                  key={book.slug}
                  href={`/books/${book.slug}`}
                  className="premium-card"
                  style={{ padding: '1rem', display: 'block' }}
                >
                  {cover && (
                    <Image
                      src={cover}
                      alt={book.title ?? ''}
                      width={180}
                      height={270}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  )}
                  <h2 style={{ fontSize: '0.95rem', marginTop: '0.75rem', color: 'var(--navy)' }}>
                    {book.title}
                  </h2>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
