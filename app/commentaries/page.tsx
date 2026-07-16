import PageHero from '@/components/layout/PageHero'
import YearList from '@/components/publications/YearList'
import { COMMENTARIES_SEED } from '@/lib/config/commentaries'

export default function CommentariesPage() {
  return (
    <main>
      <PageHero eyebrow="Shorter pieces" title="Commentaries" compact />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-content">
          <YearList years={COMMENTARIES_SEED} />
        </div>
      </section>
    </main>
  )
}
