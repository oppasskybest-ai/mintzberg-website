import Image from 'next/image'
import { assetUrl } from '@/lib/assets'
import FeatureBand from '@/components/layout/FeatureBand'
import WaveDivider from '@/components/layout/WaveDivider'

// Original wraps these in a horizontal-scroll cycle-slideshow with
// prev/next arrows. Rendered as a full-bleed feature band (one large
// sculpture photo, light overlay so the wood grain still reads) plus a
// static grid below — master prompt forbids sliders/carousels. All 18
// preview images preserved.
const SCULPTURE_IMAGES = [
  'beaverc11.jpg', 'd11_new.jpg', 'b11_new_0.jpg', 'b21_new_0.jpg',
  'beavera21.jpg', 'beavere11.jpg', 'beavere21.jpg', 'beaverg11.jpg',
  'beaver_2014_04.jpg', 'r11_new.jpg', 'beaverj11.jpg', 'beaverj21.jpg',
  'beaverj31.jpg', 'beaverk11.jpg', 'beaverl11.jpg', 'q11_new.jpg',
  'beaverm11.jpg', 'beavero1o21.jpg',
]

export default function SculpturesPreview() {
  const heroImg = assetUrl('beaverj31.jpg')
  return (
    <>
      <WaveDivider fill="var(--navy)" />
      <FeatureBand imageUrl={heroImg} overlay="navy" style={{ padding: '4.5rem 0 3rem', textAlign: 'center' }}>
        <div className="container-content">
          <p className="hero-eyebrow">A personal interest</p>
          <h2 style={{ color: 'var(--paper)', margin: '0.4rem 0 0' }}>Beaver Sculptures</h2>
        </div>
      </FeatureBand>
      <WaveDivider fill="var(--paper)" flip />
      <div className="container-content" style={{ padding: '2rem 1.25rem 4.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: '0.6rem',
          }}
        >
          {SCULPTURE_IMAGES.map((file) => {
            const src = assetUrl(file)
            if (!src) return null
            return (
              <a href="/sculptures" key={file} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                <Image
                  src={src}
                  alt=""
                  width={150}
                  height={150}
                  style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                />
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}
