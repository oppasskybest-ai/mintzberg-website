import Image from 'next/image'
import { HOME_FEATURED_BOOKS } from '@/lib/config/home-books'
import { assetUrl } from '@/lib/assets'

export default function FeaturedBooks() {
  return (
    <section className="container-wide" style={{ padding: '4rem 1.5rem' }}>
      <p className="eyebrow-label" style={{ textAlign: 'center' }}>Latest work</p>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Books</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
        }}
      >
        {HOME_FEATURED_BOOKS.map((book) => {
          const cover = assetUrl(book.coverImage)
          return (
            <div key={book.slug} className="premium-card" style={{ padding: '1.25rem' }}>
              {cover && (
                <a href={`/books/${book.slug}`}>
                  <Image
                    src={cover}
                    alt={book.title}
                    width={220}
                    height={330}
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </a>
              )}
              <h3 style={{ fontSize: '1.05rem', margin: '1rem 0 0.5rem' }}>{book.title}</h3>
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                {book.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} style={{ fontSize: '0.85rem' }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
