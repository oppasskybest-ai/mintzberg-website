'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/config/nav'

// Step 2 scope: navigation only. Sticky top nav (master prompt: "Sticky top
// navigation"), hamburger menu below 768px (master prompt Mobile section:
// "Hamburger menu on mobile. All content fully readable on a 375px screen.
// No horizontal scrolling anywhere.")
export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(250, 250, 248, 0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--rule)',
        boxShadow: '0 1px 0 rgba(26,46,74,0.03)',
      }}
    >
      <div
        className="container-wide"
        style={{
          height: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-family-serif)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--navy)',
          }}
          onClick={() => setOpen(false)}
        >
          Henry Mintzberg
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          style={{ display: 'flex', gap: '1.5rem' }}
          className="desktop-nav"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontSize: '0.95rem',
                color: 'var(--ink)',
                fontWeight: 500,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="hamburger-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d={open ? 'M6 6l12 12M6 18L18 6' : 'M3 6h18M3 12h18M3 18h18'}
              stroke="var(--navy)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav
          aria-label="Primary mobile"
          className="mobile-nav"
          style={{
            borderTop: '1px solid var(--rule)',
            background: 'var(--paper)',
            padding: '0.5rem 0',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '0.75rem 1.25rem',
                fontSize: '1rem',
                color: 'var(--ink)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  )
}
