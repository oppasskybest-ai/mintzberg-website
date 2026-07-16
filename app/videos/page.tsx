import Link from 'next/link'
import { getAllVideos } from '@/lib/data/videos'
import PageHero from '@/components/layout/PageHero'
import YouTubeFacade from '@/components/media/YouTubeFacade'

export default async function VideosIndexPage() {
  const videos = await getAllVideos()

  return (
    <main>
      <PageHero
        eyebrow="Minutes with Mintzberg"
        title="Videos"
        subtitle="Talks, interviews, and short excerpts on reframing management, society, and health care."
        compact
      />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-wide">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {videos.map((video) => (
              <div key={video.slug} className="premium-card" style={{ padding: '1rem' }}>
                <Link href={`/videos/${video.slug}`}>
                  <h2 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>{video.title}</h2>
                </Link>
                <YouTubeFacade videoId={video.youtubeId} title={video.title ?? ''} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
