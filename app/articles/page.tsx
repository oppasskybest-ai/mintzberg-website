import PageHero from '@/components/layout/PageHero'
import YearList from '@/components/publications/YearList'
import { ARTICLES_SEED } from '@/lib/config/articles'

export default function ArticlesPage() {
  return (
    <main>
      <PageHero eyebrow="184 articles" title="Articles" compact />
      <section className="section-parallax" style={{ padding: '3rem 0 4.5rem' }}>
        <div className="container-content">
          <YearList years={ARTICLES_SEED} />
        </div>
      </section>
    </main>
  )
}
