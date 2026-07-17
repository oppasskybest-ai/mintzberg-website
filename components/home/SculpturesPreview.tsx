import Image from 'next/image'
import { getAllSculptureImages } from '@/lib/data/sculptures'
import { assetUrl } from '@/lib/assets'
import FeatureBand from '@/components/layout/FeatureBand'
import WaveDivider from '@/components/layout/WaveDivider'

function resolveImageSrc(imageFile: string): string | null {
  return /^https?:\/\//.test(imageFile) ? imageFile : assetUrl(imageFile)
}

// Now pulls from the same Supabase-backed data as the full /sculptures
// page (admin-added images show up here too).
export default async function SculpturesPreview() {
  const images = await getAllSculptureImages()
  const heroImg = resolveImageSrc(images[12]?.imageFile || images[0]?.imageFile || '')

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
          {images.map((img, i) => {
            const src = resolveImageSrc(img.imageFile)
            if (!src) return null
            return (
              <a href="/sculptures" key={img.id || i} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
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
