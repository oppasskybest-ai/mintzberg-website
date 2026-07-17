import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Henry Mintzberg',
  description:
    "Henry Mintzberg's personal website — books, blog, articles, commentaries, and the Rebalancing Society project.",
}

// Bare root layout — just html/body + global metadata. The public
// Navbar lives in app/(site)/layout.tsx now, NOT here.
//
// BUG FIXED 2026-07-17: Navbar used to render here, meaning it applied to
// EVERY route including /admin/*, which has its own Sidebar shell — the
// two navs collided and broke the admin UI. Moved every public route into
// a (site) route group with its own layout so /admin stays completely
// separate.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
