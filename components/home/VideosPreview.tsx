import { HOME_VIDEOS } from '@/lib/config/home-videos'
import YouTubeFacade from '@/components/media/YouTubeFacade'
import FeatureBand from '@/components/layout/FeatureBand'
import WaveDivider from '@/components/layout/WaveDivider'
import { youtubeThumbnail } from '@/lib/assets'

// Redesigned 2026-07-15: full-bleed band using the featured video's own
// thumbnail as the backdrop image, so the reference imagery for this
// section IS the content, per the cushnir-site reference pattern.
export default function VideosPreview() {
  const bg = youtubeThumbnail(HOME_VIDEOS[0]?.youtubeId ?? '')
  return (
    <>
      <WaveDivider fill="var(--navy)" />
      <FeatureBand imageUrl={bg} overlay="navy" style={{ padding: '4.5rem 0' }}>
        <div className="container-content">
          <p className="hero-eyebrow">Watch</p>
          <h2 style={{ color: 'var(--paper)', margin: '0.4rem 0 1.75rem' }}>Videos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {HOME_VIDEOS.map((video) => (
              <div
                key={video.youtubeId}
                style={{ background: 'var(--paper)', borderRadius: '3px', padding: '1rem' }}
              >
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                  <a href={video.href}>{video.title}</a>
                </h3>
                <YouTubeFacade videoId={video.youtubeId} title={video.title} />
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1.75rem' }}>
            <a href="/videos" style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}>
              Other videos →
            </a>
          </p>
        </div>
      </FeatureBand>
      <WaveDivider fill="var(--paper-alt)" flip />
    </>
  )
}
