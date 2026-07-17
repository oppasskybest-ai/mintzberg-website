import PageHero from '@/components/layout/PageHero'
import PostBody from '@/components/blog/PostBody'
import { getAllStories } from '@/lib/data/stories'
import { assetUrl, resolveHref } from '@/lib/assets'

export default async function StoriesPage() {
  const stories = await getAllStories()
  return (
    <main>
      <PageHero
        eyebrow="Personal writing"
        title="Short Stories"
        subtitle="I like to write short stories—not fiction, but based on personal experiences. I have done about thirty in all. I would like to publish them one day, under the title Reflections from the Window."
        compact
      />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-content">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {stories.map((s) => {
              const fileHref = s.pdfFile
                ? resolveHref(s.pdfFile).href
                : null
              return (
                <li key={s.slug} className="premium-card" style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                    {fileHref ? (
                      <a href={fileHref} target="_blank" rel="noopener noreferrer">{s.title}</a>
                    ) : (
                      s.title
                    )}
                  </h2>
                  {s.description && (
                    <p style={{ marginBottom: s.bodyHtml ? '1rem' : 0, color: 'var(--ink-light)' }}>{s.description}</p>
                  )}
                  {s.bodyHtml && <PostBody html={s.bodyHtml} />}
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </main>
  )
}
