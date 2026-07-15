import { HOME_VIDEOS } from '@/lib/config/home-videos'
import YouTubeFacade from '@/components/media/YouTubeFacade'

export default function VideosPreview() {
  return (
    <section className="container-content" style={{ padding: '2rem 1.25rem' }}>
      <h2>Videos</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {HOME_VIDEOS.map((video) => (
          <div key={video.youtubeId}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
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
