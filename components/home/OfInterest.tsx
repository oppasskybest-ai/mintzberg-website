import { OF_INTEREST_ITEMS } from '@/lib/config/of-interest'
import { assetUrl } from '@/lib/assets'

// Original wraps this in a Drupal cycle-slideshow carousel — rendered here
// as a plain static list instead (master prompt: "No carousels, no
// sliders, no autoplay anything").
export default function OfInterest() {
  return (
    <section className="container-content" style={{ padding: '2rem 1.25rem' }}>
      <h2>Of Interest</h2>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {OF_INTEREST_ITEMS.map((item, i) => {
          const isExternal = /^https?:\/\//.test(item.href)
          const href = isExternal
            ? item.href
            : item.href.startsWith('/')
              ? item.href
              : assetUrl(item.href) || item.href
          return (
            <li key={i}>
              <a
                href={href}
                style={item.emphasis ? { fontWeight: 600 } : undefined}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
