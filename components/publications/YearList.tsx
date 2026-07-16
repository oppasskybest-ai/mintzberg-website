import type { PublicationYear } from '@/types/content'
import SmartLink from '@/components/ui/SmartLink'

// Shared renderer for Articles and Commentaries — both are year-grouped
// lists of {text, links[]} items, verbatim from the source (Rule 1).
export default function YearList({ years }: { years: PublicationYear[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {years.map((y) => (
        <div key={y.year}>
          <h2 style={{ color: 'var(--orange)', fontSize: '1.4rem', marginBottom: '1rem' }}>{y.year}</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {y.items.map((item, i) => (
              <li key={i} className="premium-card" style={{ padding: '1.25rem' }}>
                <p style={{ marginBottom: item.links.length ? '0.6rem' : 0 }}>{item.text}</p>
                {item.links.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {item.links.map((link) => (
                      <SmartLink key={link.href} href={link.href} className="pager-link" style={{ padding: '0 1rem' }}>
                        {link.label}
                      </SmartLink>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
