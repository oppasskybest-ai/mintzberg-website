'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: '◈' },
  { label: 'Blog Posts', href: '/admin/blog', icon: '✎' },
  { label: 'Books', href: '/admin/books', icon: '▣' },
  { label: 'Videos', href: '/admin/videos', icon: '▶' },
  { label: 'Articles', href: '/admin/articles', icon: '▤' },
  { label: 'Commentaries', href: '/admin/commentaries', icon: '▥' },
  { label: 'Stories', href: '/admin/stories', icon: '❦' },
  { label: 'Sculptures', href: '/admin/sculptures', icon: '◆' },
  { label: 'Résumé', href: '/admin/resume', icon: '☰' },
  { label: 'Messages', href: '/admin/messages', icon: '✉' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙' },
]

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '220px',
        background: '#0f1520',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '0.95rem', color: 'white', marginBottom: '2px' }}>
          Henry Mintzberg
        </p>
        <p style={{ fontSize: '0.58rem', color: 'rgba(224,92,26,0.75)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Admin Panel
        </p>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflow: 'auto' }} aria-label="Admin navigation">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.75rem',
                marginBottom: '0.15rem',
                borderRadius: '3px',
                fontSize: '0.82rem',
                textDecoration: 'none',
                color: active ? '#e07c47' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(224,92,26,0.1)' : 'transparent',
              }}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '0.6rem',
            background: 'transparent',
            border: '1px solid rgba(255,80,80,0.25)',
            color: 'rgba(255,100,100,0.7)',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: '2px',
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
