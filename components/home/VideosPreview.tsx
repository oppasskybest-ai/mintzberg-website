import { HOME_VIDEOS } from '@/lib/config/home-videos'
import YouTubeFacade from '@/components/media/YouTubeFacade'

export default function VideosPreview() {
  return (
    <section className="container-content" style={{ padding: '3.5rem 1.25rem' }}>
      <p className="eyebrow-label">Watch</p>
      <h2 style={{ margin: '0.4rem 0 1.5rem' }}>Videos</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {HOME_VIDEOS.map((video) => (
          <div key={video.youtubeId} className="premium-card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>
              <a href={video.href}>{video.title}</a>
            </h3>
            <YouTubeFacade videoId={video.youtubeId} title={video.title} />
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.5rem' }}>
        <a href="/videos" className="small-button">
          Other videos
        </a>
      </p>
    </section>
  )
}
