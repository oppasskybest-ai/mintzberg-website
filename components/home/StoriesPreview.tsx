import { assetUrl } from '@/lib/assets'

const STORIES = [
  { label: 'Reflecting on Doors', file: 'reflecting_on_doors_dec_2015.pdf' },
  { label: "Gopi's Farm", file: 'stories_gopis_farm_march_2014.pdf' },
  { label: 'Why I Climb Mountains Anyway', file: 'mountains_17_july_2015.pdf' },
  { label: 'For the Love of the Lake', file: 'love_of_the_lake_january_2016.pdf' },
  { label: 'Depressing is Hardly the Word', file: 'depressing_march_25_2014.pdf' },
]

// Verbatim from html/pages/1.html block-nodeblock-177.
export default function StoriesPreview() {
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
          {STORIES.map((s) => {
            const href = assetUrl(s.file) || '#'
            return (
              <li key={s.file}>
                <a href={href}>{s.label}</a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
