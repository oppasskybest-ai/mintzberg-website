'use client'

// Replaces the static "(Website updated in April 2024)" text — that was
// scraped verbatim from the original site and would go stale the moment
// this site launches. Renders the actual current date client-side
// instead, so it's always accurate regardless of when/where it's viewed.
export default function LiveUpdatedNote() {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'long' })
  return (
    <p style={{ color: 'var(--ink-light)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
      (Website updated {month} {now.getFullYear()})
    </p>
  )
}
