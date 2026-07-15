import Image from 'next/image'
import { assetUrl } from '@/lib/assets'

// Original wraps these in a horizontal-scroll cycle-slideshow with
// prev/next arrows. Rendered as a static responsive grid instead — master
// prompt forbids sliders/carousels. All 18 preview images preserved.
const SCULPTURE_IMAGES = [
  'beaverc11.jpg',
  'd11_new.jpg',
  'b11_new_0.jpg',
  'b21_new_0.jpg',
  'beavera21.jpg',
  'beavere11.jpg',
  'beavere21.jpg',
  'beaverg11.jpg',
  'beaver_2014_04.jpg',
  'r11_new.jpg',
  'beaverj11.jpg',
  'beaverj21.jpg',
  'beaverj31.jpg',
  'beaverk11.jpg',
  'beaverl11.jpg',
  'q11_new.jpg',
  'beaverm11.jpg',
  'beavero1o21.jpg',
]

export default function SculpturesPreview() {
  return (
    <section className="container-content" style={{ padding: '2rem 1.25rem 3rem' }}>
      <h2>Beaver Sculptures</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        {SCULPTURE_IMAGES.map((file) => {
          const src = assetUrl(file)
          if (!src) return null
          return (
            <a href="/sculptures" key={file}>
              <Image
                src={src}
                alt=""
                width={150}
                height={150}
                style={{
                  width: '100%',
                  height: '110px',
                  objectFit: 'cover',
                  border: '1px solid var(--rule)',
                }}
              />
            </a>
          )
        })}
      </div>
    </section>
  )
}
