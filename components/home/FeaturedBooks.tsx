import Image from 'next/image'
import { getAllBooks } from '@/lib/data/books'
import { assetUrl } from '@/lib/assets'
import FeatureBand from '@/components/layout/FeatureBand'
import WaveDivider from '@/components/layout/WaveDivider'
import SmartLink from '@/components/ui/SmartLink'

// Redesigned 2026-07-15: dark full-bleed panel (Henry's own sculpture
// photography as texture) with book covers as bright cards on top —
// matching cushnir-site's "Five Books, One Mission" reference panel.
//
// 2026-07-18: now pulls the first 3 books live from Supabase (ordered by
// order_index / newest-first, same ordering as the full /books page)
// instead of a hardcoded list — a new book added via the admin panel and
// placed first shows up here automatically, no code change needed.
export default async function FeaturedBooks() {
  const HOME_FEATURED_BOOKS = (await getAllBooks()).slice(0, 3)
  const bg = assetUrl('q11_new.jpg')
  if (HOME_FEATURED_BOOKS.length === 0) return null
  return (
    <>
      <WaveDivider fill="var(--navy)" />
      <FeatureBand imageUrl={bg} overlay="navy" style={{ padding: '4.5rem 0' }}>
        <div className="container-wide">
          <p className="hero-eyebrow" style={{ textAlign: 'center' }}>Latest work</p>
          <h2 style={{ color: 'var(--paper)', textAlign: 'center', marginBottom: '0.5rem' }}>
            Books
          </h2>
          <div className="divider-accent divider-accent-center" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              marginTop: '2.5rem',
            }}
          >
            {HOME_FEATURED_BOOKS.map((book) => {
              const cover = book.coverImage ? assetUrl(book.coverImage) : null
              return (
                <div
                  key={book.slug}
                  style={{
                    background: 'var(--paper)',
                    borderRadius: '3px',
                    padding: '1.25rem',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
                  }}
                >
                  {cover && (
                    <a href={`/books/${book.slug}`}>
                      <Image
                        src={cover}
                        alt={book.title ?? ''}
                        width={220}
                        height={330}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </a>
                  )}
                  <h3 style={{ fontSize: '1.05rem', margin: '1rem 0 0.5rem', color: 'var(--navy)' }}>
                    {book.title}
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {book.links.map((link) => (
                      <li key={link.href}>
                        <SmartLink href={link.href} style={{ fontSize: '0.85rem' }}>
                          {link.label}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </FeatureBand>
      <WaveDivider fill="var(--paper-alt)" flip />
    </>
  )
}
