import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Henry Mintzberg',
  description:
    "Henry Mintzberg's personal website — books, blog, articles, commentaries, and the Rebalancing Society project.",
}

// Step 2 adds navigation. Footer/other chrome is intentionally still absent
// per mintzberg-master-prompt.md Build Order — added when a step calls for it.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
