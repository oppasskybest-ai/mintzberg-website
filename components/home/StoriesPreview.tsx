import { getAllStories } from '@/lib/data/stories'
import { resolveHref } from '@/lib/assets'

// Now pulls from the same Supabase-backed data as the full /stories page
// (admin edits show up here too), showing the first 5.
export default async function StoriesPreview() {
  const stories = (await getAllStories()).slice(0, 5)
  return (
    <section className="section-parallax" style={{ padding: '3.5rem 0' }}>
      <div className="container-content">
        <p className="eyebrow-label">Personal writing</p>
        <h2 style={{ margin: '0.4rem 0 1rem' }}>Stories</h2>
        <p>
          I like to write short stories—not fiction, but based on personal
          experiences. I have done about thirty in all. Five are included{' '}
          <a href="/stories">here</a>.
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {stories.map((s) => {
            const href = s.pdfFile ? resolveHref(s.pdfFile).href : '#'
            return (
              <li key={s.slug}>
                <a href={href} target="_blank" rel="noopener noreferrer">{s.title}</a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
