import Link from 'next/link'
import { getAllVideos } from '@/lib/data/videos'
import PageHero from '@/components/layout/PageHero'
import YouTubeFacade from '@/components/media/YouTubeFacade'

// ISR safety net: on-demand revalidation (see lib/admin/revalidate.ts) already
// refreshes this page the moment an admin saves/deletes content, so this is
// just a ceiling on how stale the page could ever get if a revalidate call
// were ever missed — not the primary freshness mechanism.
export const revalidate = 300


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
