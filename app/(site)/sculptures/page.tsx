import Image from 'next/image'
import PageHero from '@/components/layout/PageHero'
import { getAllSculptureImages } from '@/lib/data/sculptures'
import { assetUrl } from '@/lib/assets'

const SCULPTURES_INTRO =
  "I collect beaver sculptures. I take what these busy, wet Canadian artists (or is it craftworkers) leave behind, in the water or on land, not from their dams and lodges. These pieces range in size from a few centimeters to a meter and a half. I hope they can be displayed one day, presumably in a rather broad-minded museum."

function resolveImageSrc(imageFile: string): string | null {
  return /^https?:\/\//.test(imageFile) ? imageFile : assetUrl(imageFile)
}

export default async function SculpturesPage() {
  const images = await getAllSculptureImages()
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
          {images.map((img, i) => {
            const src = resolveImageSrc(img.imageFile)
            if (!src) return null
            return (
              <div key={img.id || i} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                <Image
                  src={src}
                  alt={img.caption || ''}
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
