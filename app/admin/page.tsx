'use client'
import { useEffect, useState } from 'react'
import { useAuthFetch } from '@/lib/hooks/useAuthFetch'

const CARDS = [
  { key: 'blog-posts', label: 'Blog Posts', href: '/admin/blog' },
  { key: 'books', label: 'Books', href: '/admin/books' },
  { key: 'videos', label: 'Videos', href: '/admin/videos' },
]

export default function AdminDashboard() {
  const authFetch = useAuthFetch()
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      const results: Record<string, number> = {}
      for (const c of CARDS) {
        try {
          const res = await authFetch(`/api/admin/${c.key}`)
          const data = await res.json()
          results[c.key] = Array.isArray(data) ? data.length : 0
        } catch {
          results[c.key] = 0
        }
      }
      if (!cancelled) setCounts(results)
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '2.5rem' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: 'white', fontWeight: 400, marginBottom: '0.5rem' }}>
        Dashboard
      </h1>
      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2.5rem' }}>
        Content overview for henrymintzberg.com
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        {CARDS.map((c) => (
          <a
            key={c.key}
            href={c.href}
            style={{ display: 'block', padding: '1.75rem', background: '#141b26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', textDecoration: 'none' }}
          >
            <p style={{ fontSize: '2.2rem', color: '#e07c47', fontFamily: '"Playfair Display", serif', marginBottom: '0.4rem' }}>
              {counts[c.key] ?? '—'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{c.label}</p>
          </a>
        ))}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '2.5rem', lineHeight: 1.7, maxWidth: '520px' }}>
        Counts show 0 until content is seeded into Supabase — go to{' '}
        <a href="/admin/settings" style={{ color: '#e07c47' }}>Settings</a> and run the seed.
      </p>
    </div>
  )
}
