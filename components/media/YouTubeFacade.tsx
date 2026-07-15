'use client'

import { useState } from 'react'
import { youtubeThumbnail, youtubeEmbedUrl } from '@/lib/assets'

// Per mintzberg-addendum-final.md "YOUTUBE VIDEO HANDLING": show a
// thumbnail, only mount the iframe (youtube-nocookie.com) after a click.
// Nothing autoplays on page load — satisfies the master prompt's
// "no autoplay anything" rule.
export default function YouTubeFacade({
  videoId,
  title,
}: {
  videoId: string
  title: string
}) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <iframe
          src={youtubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0,
          }}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Play video: ${title}`}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        paddingTop: '56.25%',
        border: 'none',
        cursor: 'pointer',
        background: `url(${youtubeThumbnail(videoId)}) center/cover no-repeat`,
        borderRadius: '2px',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="28" fill="rgba(26,46,74,0.85)" />
          <path d="M22 17l18 11-18 11V17z" fill="var(--paper)" />
        </svg>
      </span>
    </button>
  )
}
