import PageHero from '@/components/layout/PageHero'
import { STORIES_INTRO, STORIES } from '@/lib/config/stories'
import { assetUrl } from '@/lib/assets'

export default function StoriesPage() {
  return (
    <main>
      <PageHero eyebrow="Personal writing" title="Short Stories" subtitle={STORIES_INTRO} compact />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-content">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {STORIES.map((s) => {
              const href = assetUrl(s.file) || '#'
              return (
                <li key={s.file} className="premium-card" style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                    <a href={href} target="_blank" rel="noopener noreferrer">{s.title}</a>
                  </h2>
                  <p style={{ marginBottom: 0, color: 'var(--ink-light)' }}>{s.description}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </main>
  )
}
