import PageHero from '@/components/layout/PageHero'
import YearList from '@/components/publications/YearList'
import { getCommentaryYears } from '@/lib/data/publications'

export default async function CommentariesPage() {
  const years = await getCommentaryYears()
  return (
    <main>
      <PageHero eyebrow="Shorter pieces" title="Commentaries" compact />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-content">
          <YearList years={years} />
        </div>
      </section>
    </main>
  )
}
