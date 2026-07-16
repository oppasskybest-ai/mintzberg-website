import { OF_INTEREST_ITEMS } from '@/lib/config/of-interest'
import SmartLink from '@/components/ui/SmartLink'

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
          {OF_INTEREST_ITEMS.map((item, i) => (
            <li key={i}>
              <SmartLink href={item.href} style={item.emphasis ? { fontWeight: 600 } : undefined}>
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
