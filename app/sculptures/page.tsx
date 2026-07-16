import Image from 'next/image'
import PageHero from '@/components/layout/PageHero'
import { SCULPTURES_INTRO, SCULPTURE_IMAGES } from '@/lib/config/sculptures'
import { assetUrl } from '@/lib/assets'

export default function SculpturesPage() {
  return (
    <main>
      <PageHero eyebrow="A personal interest" title="Beaver Sculptures" subtitle={SCULPTURES_INTRO} />
      <section className="container-content" style={{ padding: '3rem 1.25rem 4.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '1rem',
          }}
        >
          {SCULPTURE_IMAGES.map((file) => {
            const src = assetUrl(file)
            if (!src) return null
            return (
              <div key={file} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                <Image
                  src={src}
                  alt=""
                  width={240}
                  height={240}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
