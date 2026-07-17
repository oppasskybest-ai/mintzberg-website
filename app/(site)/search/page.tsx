'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import PageHero from '@/components/layout/PageHero'
import type { SearchRecord } from '@/lib/search/build-index'

const TYPE_COLORS: Record<string, string> = {
  Blog: 'var(--orange)',
  Book: 'var(--navy)',
  Video: '#8a4fbf',
  Article: '#2b7a5c',
  Commentary: '#b8873a',
  Story: '#c0553f',
}

export default function SearchPage() {
  const [records, setRecords] = useState<SearchRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/search-index')
      .then((r) => r.json())
      .then((data) => setRecords(data))
      .finally(() => setLoading(false))
  }, [])

  const fuse = useMemo(
    () =>
      new Fuse(records, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'excerpt', weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [records]
  )

  const results = query.trim() ? fuse.search(query).slice(0, 50).map((r) => r.item) : []

  return (
    <main>
      <PageHero eyebrow="Site-wide search" title="Search" compact />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-content">
          <input
            type="search"
            autoFocus
            placeholder={loading ? 'Loading search index…' : 'Search blog posts, books, articles, videos…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              fontSize: '1.05rem',
              border: '1px solid var(--rule)',
              borderRadius: '3px',
              background: 'var(--paper)',
              color: 'var(--ink)',
              outline: 'none',
              marginBottom: '2rem',
              boxSizing: 'border-box',
            }}
          />

          {query.trim() && (
            <p style={{ color: 'var(--ink-light)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
            </p>
          )}

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map((r, i) => (
              <li key={i} className="premium-card" style={{ padding: '1.25rem' }}>
                <p
                  className="eyebrow-label"
                  style={{ color: TYPE_COLORS[r.type] || 'var(--orange)', marginBottom: '0.4rem' }}
                >
                  {r.type}
                </p>
                <h2 style={{ fontSize: '1.1rem', marginBottom: r.excerpt ? '0.4rem' : 0 }}>
                  <Link href={r.url}>{r.title}</Link>
                </h2>
                {r.excerpt && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-light)', marginBottom: 0 }}>{r.excerpt}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
