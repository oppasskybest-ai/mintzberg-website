import { OF_INTEREST_ITEMS } from '@/lib/config/of-interest'
import { assetUrl } from '@/lib/assets'

// Original wraps this in a Drupal cycle-slideshow carousel — rendered here
// as a plain static list instead (master prompt: "No carousels, no
// sliders, no autoplay anything").
export default function OfInterest() {
  return (
    <section className="section-parallax" style={{ padding: '3.5rem 0' }}>
      <div className="container-content">
        <p className="eyebrow-label">Selected reading</p>
        <h2 style={{ margin: '0.4rem 0 1.25rem' }}>Of Interest</h2>
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
      </div>
    </section>
  )
}
